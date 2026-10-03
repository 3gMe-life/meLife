import crypto from "crypto";
import { pool } from "../../config/database";
import { env } from "../../config/env";
import { AppError } from "../../common/errors/app-error";
import { hashPassword } from "../../common/utils/crypto";
import { logger } from "../../common/utils/logger";
import { userRepository } from "../users/user.repository";
import { authRepository } from "../auth/auth.repository";
import { authTokenService } from "../auth/auth.token.service";
import { sessionRepository } from "../sessions/session.repository";
import { toPublicUser } from "../users/user.mapper";
import { institutionRepository } from "./institution.repository";
import { institutionInvitationQueueWorker } from "./institution-invitation.worker";
import {
  InstitutionEntity,
  InstitutionOverviewDTO,
  UpdateInstitutionProfileDTO,
  CreateInstitutionClassDTO,
  InstitutionClassEntity,
  InstitutionStudentEntity,
  InstitutionAssessmentEntity,
  AssignAssessmentDTO,
  InstitutionStudentInvitationEntity,
  InstitutionStudentCampaignEntity,
  CreateStudentInvitationDTO,
  BulkImportStudentInvitationsRequestDTO,
  BulkImportStudentInvitationsResultDTO,
  BulkImportRowResult,
  StudentInvitationValidationDTO,
  AcceptStudentInvitationDTO,
  ResendWebhookEventDTO,
} from "./institution.types";

const INVITATION_EXPIRY_DAYS = 7;

export class InstitutionService {
  /**
   * Resolves or provisions the institution entity associated with the authenticated admin user.
   */
  async resolveInstitution(adminUserId: string): Promise<InstitutionEntity> {
    return institutionRepository.findOrCreateInstitutionForAdmin(adminUserId);
  }

  /**
   * Retrieves high-level dashboard overview data, aggregated statistics, and recent activity.
   */
  async getOverview(adminUserId: string): Promise<InstitutionOverviewDTO> {
    const institution = await this.resolveInstitution(adminUserId);
    const stats = await institutionRepository.getOverviewStats(institution.id);
    const classes = await institutionRepository.findClassesByInstitutionId(institution.id);
    const recentActivities = await institutionRepository.getRecentActivities(institution.id);

    return {
      institution,
      stats,
      recentActivities,
      recentClasses: classes.slice(0, 5),
    };
  }

  /**
   * Retrieves full institutional profile and settings.
   */
  async getProfile(adminUserId: string): Promise<InstitutionEntity> {
    return this.resolveInstitution(adminUserId);
  }

  /**
   * Updates institutional details and configuration.
   */
  async updateProfile(
    adminUserId: string,
    data: UpdateInstitutionProfileDTO
  ): Promise<InstitutionEntity> {
    const institution = await this.resolveInstitution(adminUserId);
    const updated = await institutionRepository.updateInstitutionProfile(institution.id, data);
    if (!updated) {
      throw AppError.badRequest("Failed to update institution profile", "INST_UPDATE_FAILED");
    }
    logger.info({ institutionId: institution.id }, "Institution profile updated successfully");
    return updated;
  }

  /**
   * Retrieves all classes/cohorts for the institution.
   */
  async getClasses(adminUserId: string): Promise<InstitutionClassEntity[]> {
    const institution = await this.resolveInstitution(adminUserId);
    return institutionRepository.findClassesByInstitutionId(institution.id);
  }

  /**
   * Creates a new class/cohort in the institution.
   */
  async createClass(
    adminUserId: string,
    data: CreateInstitutionClassDTO
  ): Promise<InstitutionClassEntity> {
    const institution = await this.resolveInstitution(adminUserId);
    if (!data.academicYear || !data.gradeLevel || !data.division) {
      throw AppError.badRequest("Academic Year, Grade Level, and Division are required", "INVALID_CLASS_DATA");
    }
    return institutionRepository.createClass(institution.id, data);
  }

  /**
   * Retrieves all students belonging to this institution.
   */
  async getStudents(
    adminUserId: string,
    classId?: string
  ): Promise<InstitutionStudentEntity[]> {
    const institution = await this.resolveInstitution(adminUserId);
    return institutionRepository.findStudentsByInstitutionId(institution.id, classId);
  }

  /**
   * Retrieves all allocated assessments for this institution.
   */
  async getAssessments(
    adminUserId: string
  ): Promise<InstitutionAssessmentEntity[]> {
    const institution = await this.resolveInstitution(adminUserId);
    return institutionRepository.findAssessmentsByInstitutionId(institution.id);
  }

  /**
   * Allocates an assessment to an institution or cohort.
   */
  async assignAssessment(
    adminUserId: string,
    data: AssignAssessmentDTO
  ): Promise<InstitutionAssessmentEntity> {
    const institution = await this.resolveInstitution(adminUserId);
    if (!data.assessmentCode) {
      throw AppError.badRequest("Assessment Code is required", "INVALID_ASSESSMENT_CODE");
    }
    return institutionRepository.assignAssessment(institution.id, data);
  }

  // =========================================================================
  // STUDENT INVITATION & ONBOARDING SYSTEM (DURABLE ASYNC OUTBOX QUEUE)
  // =========================================================================

  /**
   * Invites an individual student into an institution and cohort asynchronously.
   */
  async inviteStudent(
    adminUserId: string,
    data: CreateStudentInvitationDTO
  ): Promise<InstitutionStudentInvitationEntity> {
    const institution = await this.resolveInstitution(adminUserId);
    const normalizedEmail = data.email.toLowerCase().trim();

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw AppError.badRequest("A valid email address is required.", "INVALID_EMAIL");
    }
    if (!data.firstName?.trim() || !data.lastName?.trim()) {
      throw AppError.badRequest("Student first name and last name are required.", "INVALID_NAME");
    }

    // 1. Check if student already enrolled in this institution
    const existingEnrollment = await institutionRepository.findStudentByInstitutionAndEmail(
      institution.id,
      normalizedEmail
    );
    if (existingEnrollment) {
      throw AppError.conflict(
        "A student with this email is already enrolled in your institution.",
        "STUDENT_ALREADY_ENROLLED"
      );
    }

    // 2. Check if active pending invitation already exists
    const activeInvitation = await institutionRepository.findActiveInvitationByEmail(
      institution.id,
      normalizedEmail
    );
    if (activeInvitation) {
      throw AppError.conflict(
        "An active invitation has already been sent to this email. You can resend or revoke it from the invitations list.",
        "INVITATION_ALREADY_ACTIVE"
      );
    }

    // 3. Generate cryptographically secure token & SHA-256 hash
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + INVITATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    const studentFullName = `${data.firstName.trim()} ${data.lastName.trim()}`;

    // 4. Create invitation record
    const invitation = await institutionRepository.createInvitation({
      institutionId: institution.id,
      classId: data.classId || null,
      email: normalizedEmail,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      rollNumber: data.rollNumber?.trim() || null,
      academicYear: data.academicYear || "2026-2027",
      tokenHash,
      invitedByUserId: adminUserId,
      expiresAt,
    });

    // 5. Enqueue durable email job in PostgreSQL Outbox table
    await institutionRepository.createEmailJob({
      campaignId: null,
      invitationId: invitation.id,
      institutionId: institution.id,
      recipientEmail: normalizedEmail,
      recipientName: studentFullName,
      rawToken,
    });

    // 6. Proactively trigger background queue worker (non-blocking)
    institutionInvitationQueueWorker.trigger();

    logger.info(
      { invitationId: invitation.id, institutionId: institution.id, email: normalizedEmail },
      "Individual student invitation created and durable email job queued"
    );

    return invitation;
  }

  /**
   * Bulk imports student records, validates against errors & duplicates, creates campaign,
   * batch-inserts invitations and enqueues durable email jobs.
   */
  async bulkImportStudents(
    adminUserId: string,
    data: BulkImportStudentInvitationsRequestDTO
  ): Promise<BulkImportStudentInvitationsResultDTO> {
    const institution = await this.resolveInstitution(adminUserId);
    const existingClasses = await institutionRepository.findClassesByInstitutionId(institution.id);
    const classMap = new Map<string, InstitutionClassEntity>();
    for (const c of existingClasses) {
      classMap.set(c.id, c);
      classMap.set(`${c.gradeLevel}-${c.division}`.toLowerCase(), c);
      classMap.set(c.name.toLowerCase(), c);
    }

    const [enrolledEmailsSet, activeInvitationsSet] = await Promise.all([
      institutionRepository.findEnrolledEmailsByInstitutionId(institution.id),
      institutionRepository.findActiveInvitationEmailsByInstitutionId(institution.id),
    ]);

    const rows = data.invitations || [];
    const results: BulkImportRowResult[] = [];
    const seenEmailsInFile = new Set<string>();

    type ValidatedStudentRow = {
      rowNum: number;
      email: string;
      firstName: string;
      lastName: string;
      fullName: string;
      classId: string | null;
      rollNumber: string | null;
      academicYear: string;
    };

    const validRowsToImport: ValidatedStudentRow[] = [];
    let skippedCount = 0;
    let failedCount = 0;

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const rowNum = index + 1;
      const normalizedEmail = (row.email || "").toLowerCase().trim();
      const firstName = (row.firstName || "").trim();
      const lastName = (row.lastName || "").trim();
      const fullName = `${firstName} ${lastName}`.trim() || "Student";

      // Validation 1: Missing Required Fields
      if (!normalizedEmail || !firstName || !lastName) {
        failedCount++;
        results.push({
          row: rowNum,
          email: normalizedEmail,
          name: fullName,
          status: "FAILED",
          message: "Missing required fields (First Name, Last Name, or Email).",
        });
        continue;
      }

      // Validation 2: Invalid Email Format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        failedCount++;
        results.push({
          row: rowNum,
          email: normalizedEmail,
          name: fullName,
          status: "INVALID_EMAIL",
          message: "Invalid email address format.",
        });
        continue;
      }

      // Validation 3: Duplicate within Uploaded File
      if (seenEmailsInFile.has(normalizedEmail)) {
        skippedCount++;
        results.push({
          row: rowNum,
          email: normalizedEmail,
          name: fullName,
          status: "DUPLICATE_IN_FILE",
          message: "Duplicate email address found within the uploaded file.",
        });
        continue;
      }
      seenEmailsInFile.add(normalizedEmail);

      // Validation 4: Already Enrolled
      if (enrolledEmailsSet.has(normalizedEmail)) {
        skippedCount++;
        results.push({
          row: rowNum,
          email: normalizedEmail,
          name: fullName,
          status: "ALREADY_ENROLLED",
          message: "Student is already enrolled in this institution.",
        });
        continue;
      }

      // Validation 5: Active Invitation Already Pending
      if (activeInvitationsSet.has(normalizedEmail)) {
        skippedCount++;
        results.push({
          row: rowNum,
          email: normalizedEmail,
          name: fullName,
          status: "ALREADY_INVITED",
          message: "An active invitation is already pending for this email.",
        });
        continue;
      }

      // Resolve Class ID if provided
      let resolvedClassId: string | null = null;
      let matchedClass: InstitutionClassEntity | undefined;

      if (row.classId && classMap.has(row.classId)) {
        matchedClass = classMap.get(row.classId);
        resolvedClassId = matchedClass?.id || null;
      } else if (row.gradeLevel && row.division) {
        const key = `${row.gradeLevel}-${row.division}`.toLowerCase();
        if (classMap.has(key)) {
          matchedClass = classMap.get(key);
          resolvedClassId = matchedClass?.id || null;
        }
      } else if (row.className && classMap.has(row.className.toLowerCase())) {
        matchedClass = classMap.get(row.className.toLowerCase());
        resolvedClassId = matchedClass?.id || null;
      } else if (data.defaultClassId && classMap.has(data.defaultClassId)) {
        matchedClass = classMap.get(data.defaultClassId);
        resolvedClassId = matchedClass?.id || null;
      }

      const academicYear = row.academicYear || data.defaultAcademicYear || "2026-2027";

      validRowsToImport.push({
        rowNum,
        email: normalizedEmail,
        firstName,
        lastName,
        fullName,
        classId: resolvedClassId,
        rollNumber: row.rollNumber?.trim() || null,
        academicYear,
      });
    }

    // If this request is for validation preview only, return categorized summary without DB write
    if (data.previewOnly) {
      for (const valid of validRowsToImport) {
        results.push({
          row: valid.rowNum,
          email: valid.email,
          name: valid.fullName,
          status: "IMPORTED",
          message: "Valid record ready for invitation campaign dispatch.",
        });
      }
      return {
        totalProcessed: rows.length,
        importedCount: validRowsToImport.length,
        skippedCount,
        failedCount,
        results: results.sort((a, b) => a.row - b.row),
      };
    }

    // If no valid rows to import, return summary immediately
    if (validRowsToImport.length === 0) {
      return {
        totalProcessed: rows.length,
        importedCount: 0,
        skippedCount,
        failedCount,
        results: results.sort((a, b) => a.row - b.row),
      };
    }

    // Create Invitation Campaign
    const campaignName =
      data.campaignName?.trim() ||
      `Student Invitation Batch - ${new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;

    const campaign = await institutionRepository.createCampaign({
      institutionId: institution.id,
      classId: data.defaultClassId || null,
      createdByUserId: adminUserId,
      name: campaignName,
      totalCount: validRowsToImport.length,
      queuedCount: validRowsToImport.length,
    });

    let importedCount = 0;
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      for (const item of validRowsToImport) {
        const rawToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
        const expiresAt = new Date(Date.now() + INVITATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

        const invitation = await institutionRepository.createInvitation(
          {
            institutionId: institution.id,
            campaignId: campaign.id,
            classId: item.classId,
            email: item.email,
            firstName: item.firstName,
            lastName: item.lastName,
            rollNumber: item.rollNumber,
            academicYear: item.academicYear,
            tokenHash,
            invitedByUserId: adminUserId,
            expiresAt,
          },
          client
        );

        await institutionRepository.createEmailJob(
          {
            campaignId: campaign.id,
            invitationId: invitation.id,
            institutionId: institution.id,
            recipientEmail: item.email,
            recipientName: item.fullName,
            rawToken,
          },
          client
        );

        importedCount++;
        results.push({
          row: item.rowNum,
          email: item.email,
          name: item.fullName,
          status: "IMPORTED",
          invitationId: invitation.id,
          message: "Invitation created and queued in delivery pipeline.",
        });
      }

      await client.query("COMMIT");
    } catch (err: any) {
      await client.query("ROLLBACK");
      logger.error({ err }, "Error during bulk campaign insertion transaction");
      throw err;
    } finally {
      client.release();
    }

    // Refresh aggregated metrics for campaign
    await institutionRepository.updateCampaignCounts(campaign.id);

    // Wake up background worker for immediate dispatch
    institutionInvitationQueueWorker.trigger();

    logger.info(
      {
        campaignId: campaign.id,
        institutionId: institution.id,
        total: validRowsToImport.length,
        queued: importedCount,
      },
      "Bulk invitation campaign created and queued for asynchronous background execution"
    );

    return {
      campaignId: campaign.id,
      totalProcessed: rows.length,
      importedCount,
      skippedCount,
      failedCount,
      results: results.sort((a, b) => a.row - b.row),
    };
  }

  /**
   * Retrieves all campaigns for this institution.
   */
  async getCampaigns(
    adminUserId: string,
    status?: string
  ): Promise<InstitutionStudentCampaignEntity[]> {
    const institution = await this.resolveInstitution(adminUserId);
    return institutionRepository.findCampaignsByInstitutionId(institution.id, status);
  }

  /**
   * Retrieves detailed information and student invitations for a campaign.
   */
  async getCampaignDetails(
    adminUserId: string,
    campaignId: string
  ): Promise<{
    campaign: InstitutionStudentCampaignEntity;
    invitations: InstitutionStudentInvitationEntity[];
  }> {
    const institution = await this.resolveInstitution(adminUserId);
    const campaign = await institutionRepository.findCampaignById(campaignId, institution.id);
    if (!campaign) {
      throw AppError.notFound("Campaign not found or does not belong to your institution.", "CAMPAIGN_NOT_FOUND");
    }

    const invitations = await institutionRepository.findInvitationsByCampaignId(campaignId);
    return { campaign, invitations };
  }

  /**
   * Re-queues only failed email jobs for a campaign.
   */
  async retryFailedCampaign(
    adminUserId: string,
    campaignId: string
  ): Promise<{ retriedCount: number; message: string }> {
    const institution = await this.resolveInstitution(adminUserId);
    const campaign = await institutionRepository.findCampaignById(campaignId, institution.id);
    if (!campaign) {
      throw AppError.notFound("Campaign not found or does not belong to your institution.", "CAMPAIGN_NOT_FOUND");
    }

    const retriedCount = await institutionRepository.retryFailedCampaignJobs(campaignId, institution.id);
    if (retriedCount > 0) {
      institutionInvitationQueueWorker.trigger();
    }

    return {
      retriedCount,
      message: `${retriedCount} failed invitation jobs have been re-queued for asynchronous dispatch.`,
    };
  }

  /**
   * Handles Resend provider delivery webhook events.
   */
  async handleResendWebhook(
    event: ResendWebhookEventDTO
  ): Promise<{ received: boolean; message: string }> {
    const messageId = event.data?.email_id || event.data?.id;
    if (!messageId) {
      return { received: true, message: "No email ID in webhook payload" };
    }

    if (event.type === "email.delivered") {
      await institutionRepository.updateEmailJobDelivered(messageId);
      logger.info({ messageId, type: event.type }, "Resend webhook: email marked as DELIVERED");
    } else if (event.type === "email.bounced") {
      const bounceType = event.data?.bounce_type || "Hard Bounce";
      await institutionRepository.updateEmailJobBounced(messageId, bounceType);
      logger.warn({ messageId, bounceType, type: event.type }, "Resend webhook: email marked as BOUNCED");
    }

    return { received: true, message: `Handled ${event.type} event` };
  }

  /**
   * Retrieves all invitations for this institution with optional status filtering.
   */
  async getInvitations(
    adminUserId: string,
    status?: string
  ): Promise<InstitutionStudentInvitationEntity[]> {
    const institution = await this.resolveInstitution(adminUserId);
    return institutionRepository.findInvitationsByInstitutionId(institution.id, status);
  }

  /**
   * Resends an invitation with a newly generated secure token, refreshed expiry, and queued email job.
   */
  async resendInvitation(
    adminUserId: string,
    invitationId: string
  ): Promise<InstitutionStudentInvitationEntity> {
    const institution = await this.resolveInstitution(adminUserId);
    const invitation = await institutionRepository.findInvitationById(invitationId, institution.id);

    if (!invitation) {
      throw AppError.notFound("Invitation not found or not owned by your institution.", "INVITATION_NOT_FOUND");
    }
    if (invitation.status === "ACCEPTED") {
      throw AppError.conflict("This invitation has already been accepted and completed.", "INVITATION_ALREADY_ACCEPTED");
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + INVITATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    const studentFullName = `${invitation.firstName} ${invitation.lastName}`.trim();

    const updated = await institutionRepository.updateInvitationToken(
      invitation.id,
      tokenHash,
      expiresAt
    );

    if (!updated) {
      throw AppError.badRequest("Failed to update invitation token", "INVITATION_UPDATE_FAILED");
    }

    // Re-queue durable email job
    await institutionRepository.createEmailJob({
      campaignId: invitation.campaignId || null,
      invitationId: invitation.id,
      institutionId: institution.id,
      recipientEmail: invitation.email,
      recipientName: studentFullName,
      rawToken,
    });

    institutionInvitationQueueWorker.trigger();

    logger.info(
      { invitationId: invitation.id, email: invitation.email },
      "Student invitation resent with renewed token and queued email job"
    );

    return updated;
  }

  /**
   * Revokes a pending invitation and cancels any unsent email jobs.
   */
  async revokeInvitation(
    adminUserId: string,
    invitationId: string
  ): Promise<{ success: boolean; message: string }> {
    const institution = await this.resolveInstitution(adminUserId);
    const revoked = await institutionRepository.revokeInvitation(invitationId, institution.id);

    if (!revoked) {
      throw AppError.badRequest(
        "Could not revoke invitation. It may not exist, belong to another institution, or already be accepted/revoked.",
        "INVITATION_REVOKE_FAILED"
      );
    }

    logger.info({ invitationId, institutionId: institution.id }, "Student invitation revoked successfully");

    return {
      success: true,
      message: "Invitation revoked successfully.",
    };
  }

  /**
   * Validates raw invitation token from public invite link.
   */
  async validateInvitationToken(rawToken: string): Promise<StudentInvitationValidationDTO> {
    if (!rawToken || typeof rawToken !== "string" || rawToken.length < 16) {
      return {
        isValid: false,
        status: "EXPIRED",
        error: "Invalid invitation token provided.",
      };
    }

    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const invitation = await institutionRepository.findInvitationByTokenHash(tokenHash);

    if (!invitation) {
      return {
        isValid: false,
        status: "EXPIRED",
        error: "Invitation not found or invalid link.",
      };
    }

    if (invitation.status === "ACCEPTED") {
      return {
        isValid: false,
        status: "ACCEPTED",
        error: "This invitation has already been used and accepted.",
      };
    }

    if (invitation.status === "REVOKED") {
      return {
        isValid: false,
        status: "REVOKED",
        error: "This invitation has been revoked by the institution.",
      };
    }

    const now = new Date();
    const expiry = new Date(invitation.expiresAt);
    if (now > expiry) {
      return {
        isValid: false,
        status: "EXPIRED",
        error: "This invitation link has expired. Please contact your school administrator to resend the invite.",
      };
    }

    const existingUser = await userRepository.findByEmail(invitation.email);

    return {
      isValid: true,
      status: "PENDING",
      invitationId: invitation.id,
      email: invitation.email,
      firstName: invitation.firstName,
      lastName: invitation.lastName,
      rollNumber: invitation.rollNumber,
      academicYear: invitation.academicYear,
      institutionName: invitation.institutionName,
      className: invitation.className,
      gradeLevel: invitation.gradeLevel,
      division: invitation.division,
      hasExistingAccount: !!existingUser,
    };
  }

  /**
   * Accepts student invitation, provisions student user/profile if new, links to institution and cohort, and issues session tokens.
   */
  async acceptInvitation(
    dto: AcceptStudentInvitationDTO,
    ipAddress?: string,
    userAgent?: string,
    authenticatedUserId?: string
  ): Promise<{
    user: any;
    role: string;
    permissions: string[];
    dashboardFeatures: any[];
    accessToken: string;
    refreshToken: string;
    message: string;
  }> {
    const tokenHash = crypto.createHash("sha256").update(dto.token).digest("hex");
    const invitation = await institutionRepository.findInvitationByTokenHash(tokenHash);

    if (!invitation) {
      throw AppError.notFound("Invitation not found or invalid token.", "INVITATION_NOT_FOUND");
    }

    if (invitation.status === "ACCEPTED") {
      throw AppError.conflict("This invitation has already been accepted.", "INVITATION_ALREADY_ACCEPTED");
    }
    if (invitation.status === "REVOKED") {
      throw AppError.forbidden("This invitation has been revoked.", "INVITATION_REVOKED");
    }
    if (new Date() > new Date(invitation.expiresAt)) {
      throw AppError.badRequest("This invitation has expired. Please ask your institution to resend it.", "INVITATION_EXPIRED");
    }

    const normalizedEmail = invitation.email.toLowerCase().trim();
    let user = await userRepository.findByEmail(normalizedEmail);

    // If student is logged in with another email, prevent unauthorized cross-account linking
    if (authenticatedUserId && user && authenticatedUserId !== user.id) {
      throw AppError.forbidden(
        "You are currently logged in with a different account. Please sign out and accept using the invited email.",
        "INVITATION_EMAIL_MISMATCH"
      );
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      if (!user) {
        // New Student Account Creation
        if (!dto.password || dto.password.length < 8) {
          throw AppError.badRequest("Password must be at least 8 characters long.", "AUTH_WEAK_PASSWORD");
        }

        const passwordHash = await hashPassword(dto.password);
        const firstName = (dto.firstName || invitation.firstName).trim();
        const lastName = (dto.lastName || invitation.lastName).trim();

        user = await userRepository.createUser(
          {
            email: normalizedEmail,
            passwordHash,
            firstName,
            lastName,
            status: "ACTIVE",
            emailVerifiedAt: new Date(),
          },
          client
        );

        await userRepository.assignRole(user.id, "PARTICIPANT", true, client);
        await authRepository.createAuthIdentity(
          { userId: user.id, provider: "LOCAL", providerAccountId: user.id },
          client
        );
        await authRepository.createStudentProfile(
          {
            userId: user.id,
            educationStage: invitation.gradeLevel ? `Grade ${invitation.gradeLevel}` : "High School",
          },
          client
        );
      } else {
        // Existing Student Account: ensure PARTICIPANT role
        await userRepository.assignRole(user.id, "PARTICIPANT", false, client);
      }

      // Link Student to Institution and Cohort
      await institutionRepository.linkStudentToInstitutionAndCohort(
        invitation.institutionId,
        user.id,
        invitation.classId,
        invitation.rollNumber,
        invitation.academicYear,
        client
      );

      // Mark Invitation as Accepted
      await institutionRepository.markInvitationAccepted(invitation.id, user.id, client);

      // Fetch roles and permissions
      const { roles, permissions } = await userRepository.getUserRolesAndPermissions(user.id, client);
      const primaryRole = roles[0] || "PARTICIPANT";

      // Session & Token Generation
      const refreshToken = authTokenService.generateOpaqueRefreshToken();
      const refreshTokenHash = authTokenService.hashRefreshToken(refreshToken);
      const expiresAt = new Date(
        Date.now() + env.REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000
      );

      const session = await sessionRepository.createSession(
        {
          userId: user.id,
          refreshTokenHash,
          expiresAt,
          ipAddress,
          userAgent,
        },
        client
      );

      const accessToken = authTokenService.signAccessToken({
        userId: user.id,
        sessionId: session.id,
        role: primaryRole as any,
        permissions,
      });

      const dashboardFeatures = await userRepository.getUserDashboardFeatures(user.id, client);

      await client.query("COMMIT");

      logger.info(
        { userId: user.id, institutionId: invitation.institutionId, invitationId: invitation.id },
        "Student accepted institution onboarding invitation successfully"
      );

      return {
        user: toPublicUser(user),
        role: primaryRole,
        permissions,
        dashboardFeatures,
        accessToken,
        refreshToken,
        message: "Invitation accepted successfully! Welcome to your cohort.",
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

export const institutionService = new InstitutionService();

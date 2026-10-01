import crypto from "crypto";
import { parentRepository } from "./parent.repository";
import { userRepository } from "../users/user.repository";
import {
  InvitationSafeVerification,
  ConnectedChildInfo,
  LinkedParentInfo,
  ChildOverviewDTO,
  ParentInvitation,
  StudentParentLink,
  ParentReportItemDTO,
  ParentReportDetailDTO,
} from "./parent.types";
import { AppError } from "../../common/errors/app-error";
import { logger } from "../../common/utils/logger";
import { env } from "../../config/env";
import { emailService } from "../email";

// High-entropy unambiguous uppercase character alphabet (omits 0, O, 1, I to avoid reading errors)
const INVITATION_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export class ParentService {
  /**
   * Generates a cryptographically secure random invitation code string
   * Format: MLP-XXXX-XXXX (e.g., MLP-92KX-8W7P)
   */
  private generateSecureCode(): string {
    const getRandomChar = () => {
      const idx = crypto.randomInt(0, INVITATION_ALPHABET.length);
      return INVITATION_ALPHABET.charAt(idx);
    };

    let part1 = "";
    for (let i = 0; i < 4; i++) {
      part1 += getRandomChar();
    }

    let part2 = "";
    for (let i = 0; i < 4; i++) {
      part2 += getRandomChar();
    }

    return `MLP-${part1}-${part2}`;
  }

  /**
   * Generates a new parent invitation code for the student.
   * Default expiration is 7 days.
   */
  async generateInvitation(
    studentId: string,
    parentEmail?: string,
    parentName?: string
  ): Promise<{
    inviteCode: string;
    expiresAt: Date;
    status: string;
    formattedCode: string;
  }> {
    if (!studentId) {
      throw AppError.badRequest("Student ID is required", "INVALID_STUDENT_ID");
    }

    // Verify student user exists and is active
    const student = await userRepository.findById(studentId);
    if (!student || student.status === "DISABLED" || student.status === "SUSPENDED") {
      throw AppError.notFound("Student account not found or is inactive", "STUDENT_NOT_FOUND");
    }

    // Revoke any existing active invitations so only one active invitation code exists at a time
    await parentRepository.revokeActiveInvitationsForStudent(studentId);

    // Generate unique code with retry logic in the unlikely case of collision
    let inviteCode = "";
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      const candidateCode = this.generateSecureCode();
      const existing = await parentRepository.findInvitationByCode(candidateCode);
      if (!existing) {
        inviteCode = candidateCode;
        break;
      }
      attempts++;
    }

    if (!inviteCode) {
      inviteCode = `MLP-${crypto.randomBytes(3).toString("hex").toUpperCase()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
    }

    // 7 Days Expiry
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const invitation = await parentRepository.createInvitation({
      studentId,
      inviteCode,
      expiresAt,
    });

    const generatedCode = invitation.inviteCode || invitation.invite_code || inviteCode;
    const finalExpiresAt = invitation.expiresAt || invitation.expires_at || expiresAt;

    logger.info(
      { studentId, inviteCode: generatedCode, expiresAt: finalExpiresAt },
      "🎟️ New parent invitation code generated successfully"
    );

    // Non-blocking transactional email dispatch if parent email is supplied
    if (parentEmail && parentEmail.includes("@")) {
      const redemptionUrl = `${env.APP_URL || env.FRONTEND_URL}/parent/connect?code=${generatedCode}&email=${encodeURIComponent(student.email)}`;
      const formattedExpires = new Date(finalExpiresAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      emailService
        .sendParentInvitationEmail({
          to: parentEmail.trim().toLowerCase(),
          parentName: parentName?.trim() || "Parent / Guardian",
          studentName: `${student.first_name} ${student.last_name}`.trim(),
          inviteCode: generatedCode,
          redeemUrl: redemptionUrl,
          expiresAt: formattedExpires,
        })
        .catch((err) => {
          logger.warn({ err, studentId, parentEmail }, "Non-fatal: Failed to send parent invitation email");
        });
    }

    return {
      inviteCode: generatedCode,
      formattedCode: generatedCode,
      expiresAt: new Date(finalExpiresAt),
      status: invitation.status,
    };
  }

  /**
   * Verifies an invitation code publicly before redemption.
   * Returns strictly sanitized, safe student information.
   * NEVER exposes email, phone, or assessment reports.
   */
  async verifyInvitation(rawCode: string): Promise<InvitationSafeVerification> {
    if (!rawCode || typeof rawCode !== "string" || !rawCode.trim()) {
      throw AppError.badRequest("Invitation code is required", "INVALID_INVITE_CODE");
    }

    const normalizedCode = rawCode.trim().toUpperCase();
    const invitation = await parentRepository.findInvitationByCode(normalizedCode);

    if (!invitation) {
      throw AppError.notFound(
        "Invalid invitation code. Please check the code and try again.",
        "INVITATION_NOT_FOUND"
      );
    }

    if (invitation.status === "USED") {
      throw AppError.badRequest(
        "This invitation code has already been used.",
        "INVITATION_ALREADY_USED"
      );
    }

    if (invitation.status === "REVOKED") {
      throw AppError.badRequest(
        "This invitation code has been revoked by the student.",
        "INVITATION_REVOKED"
      );
    }

    if (invitation.status !== "ACTIVE") {
      throw AppError.badRequest(
        "This invitation is no longer active.",
        "INVITATION_INACTIVE"
      );
    }

    const invitationExpiresAt = invitation.expiresAt || invitation.expires_at;
    if (!invitationExpiresAt || new Date(invitationExpiresAt).getTime() <= Date.now()) {
      throw AppError.badRequest(
        "This invitation code has expired. Please ask the student for a new code.",
        "INVITATION_EXPIRED"
      );
    }

    const targetStudentId = invitation.studentId || invitation.student_id;
    const studentInfo = targetStudentId
      ? await parentRepository.findSafeStudentInfo(targetStudentId)
      : null;
    if (!studentInfo) {
      throw AppError.notFound(
        "Student profile associated with this code could not be found.",
        "STUDENT_NOT_FOUND"
      );
    }

    return {
      valid: true,
      inviteCode: invitation.inviteCode || invitation.invite_code || normalizedCode,
      student: {
        id: studentInfo.id,
        firstName: studentInfo.firstName,
        gradeLevel: studentInfo.gradeLevel,
        educationStage: studentInfo.educationStage,
        schoolName: studentInfo.schoolName,
      },
      expiresAt: new Date(invitationExpiresAt),
    };
  }

  /**
   * Redeems a parent invitation code to link the logged-in parent with the student.
   * Uses a strict transactional lock and updates status to USED.
   */
  async redeemInvitation(
    parentId: string,
    rawCode: string,
    studentEmail: string,
    relationshipType = "PARENT"
  ): Promise<{
    link: StudentParentLink;
    student: { id: string; firstName: string; lastName: string };
  }> {
    if (!parentId) {
      throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
    }

    if (!rawCode || typeof rawCode !== "string" || !rawCode.trim()) {
      throw AppError.badRequest("Invitation code is required", "INVALID_INVITE_CODE");
    }

    if (!studentEmail || typeof studentEmail !== "string" || !studentEmail.trim()) {
      throw AppError.badRequest("Student email is required", "INVALID_STUDENT_EMAIL");
    }

    const parentUser = await userRepository.findById(parentId);
    if (!parentUser || parentUser.status === "DISABLED" || parentUser.status === "SUSPENDED") {
      throw AppError.forbidden("Parent account is not active or verified", "PARENT_INACTIVE");
    }

    const result = await parentRepository.redeemInvitationTx(
      parentId,
      rawCode,
      studentEmail,
      relationshipType
    );

    logger.info(
      {
        parentId,
        studentId: result.student.id,
        linkId: result.link.id,
        inviteCode: rawCode,
      },
      "🤝 Parent-Student relationship successfully established"
    );

    const parentFullName = `${parentUser.first_name} ${parentUser.last_name}`.trim();
    const studentFullName = `${result.student.firstName} ${result.student.lastName}`.trim();

    // Non-blocking transactional email notification to Parent
    emailService
      .sendParentLinkedEmail({
        to: parentUser.email,
        recipientName: parentFullName,
        linkedPartyName: studentFullName,
        role: "PARENT",
        dashboardUrl: `${env.APP_URL || env.FRONTEND_URL}/parent/dashboard`,
      })
      .catch((err) => {
        logger.warn({ err, parentId }, "Non-fatal: Failed to send parent linked email to parent");
      });

    // Non-blocking transactional email notification to Student
    emailService
      .sendParentLinkedEmail({
        to: studentEmail.trim().toLowerCase(),
        recipientName: result.student.firstName,
        linkedPartyName: parentFullName,
        role: "STUDENT",
        dashboardUrl: `${env.APP_URL || env.FRONTEND_URL}/dashboard`,
      })
      .catch((err) => {
        logger.warn({ err, studentEmail }, "Non-fatal: Failed to send parent linked email to student");
      });

    return result;
  }

  /**
   * Retrieves all verified, connected children for the authenticated parent.
   */
  async getConnectedChildren(parentId: string): Promise<ConnectedChildInfo[]> {
    if (!parentId) {
      throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
    }

    return parentRepository.findConnectedChildren(parentId);
  }

  /**
   * Retrieves active unexpired invitation for a student.
   */
  async getActiveInvitation(studentId: string): Promise<ParentInvitation | null> {
    if (!studentId) {
      throw AppError.badRequest("Student ID is required", "INVALID_STUDENT_ID");
    }
    return parentRepository.findActiveInvitationByStudentId(studentId);
  }

  /**
   * Revokes an invitation by code.
   */
  async revokeInvitation(studentId: string, inviteCode: string): Promise<boolean> {
    if (!studentId || !inviteCode) {
      throw AppError.badRequest("Student ID and invite code are required", "INVALID_PARAMS");
    }
    return parentRepository.revokeInvitationByCode(studentId, inviteCode);
  }

  /**
   * Retrieves list of parents linked to a student.
   */
  async getLinkedParents(studentId: string): Promise<LinkedParentInfo[]> {
    if (!studentId) {
      throw AppError.badRequest("Student ID is required", "INVALID_STUDENT_ID");
    }
    return parentRepository.findLinkedParentsForStudent(studentId);
  }

  /**
   * Revokes a student-parent link.
   */
  async revokeLink(linkId: string, userId: string): Promise<boolean> {
    if (!linkId || !userId) {
      throw AppError.badRequest("Link ID and User ID are required", "INVALID_PARAMS");
    }
    const revoked = await parentRepository.revokeLink(linkId, userId);
    if (!revoked) {
      throw AppError.notFound("Active link not found or you are not authorized to revoke it.", "LINK_NOT_FOUND");
    }
    return true;
  }

  /**
   * Retrieves aggregated child overview for a parent.
   */
  async getChildOverview(parentId: string, studentId: string): Promise<ChildOverviewDTO> {
    if (!parentId || !studentId) {
      throw AppError.badRequest("Parent and Student IDs are required", "INVALID_PARAMS");
    }

    const overview = await parentRepository.getChildOverviewData(studentId, parentId);
    if (!overview) {
      throw AppError.forbidden("Active parent-student connection not found", "FORBIDDEN");
    }

    return overview;
  }

  /**
   * Retrieves all assessment reports for all connected children of a parent (or filtered by studentId).
   */
  async getReports(parentId: string, studentId?: string): Promise<ParentReportItemDTO[]> {
    if (!parentId) {
      throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
    }

    // If studentId provided, verify parent-student link exists
    if (studentId) {
      const isParent = await parentRepository.isParentOfStudent(parentId, studentId);
      if (!isParent) {
        throw AppError.forbidden("You do not have access to this student's reports.", "FORBIDDEN");
      }
    }

    return parentRepository.getParentReports(parentId, studentId);
  }

  /**
   * Retrieves detailed assessment report for a parent, verifying that the report belongs to a connected child.
   */
  async getReportDetail(parentId: string, reportId: string): Promise<ParentReportDetailDTO> {
    if (!parentId || !reportId) {
      throw AppError.badRequest("Parent and Report IDs are required", "INVALID_PARAMS");
    }

    const report = await parentRepository.getParentReportById(parentId, reportId);
    if (!report) {
      throw AppError.notFound("Assessment report not found or access is unauthorized.", "REPORT_NOT_FOUND");
    }

    return report;
  }
}

export const parentService = new ParentService();


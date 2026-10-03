import { Request, Response, NextFunction } from "express";
import { AppError } from "../../common/errors/app-error";
import { HttpStatus } from "../../common/constants/http-status";
import { institutionService } from "./institution.service";
import { setRefreshCookie } from "../auth/auth.cookie";

export class InstitutionController {
  /**
   * GET /api/v1/institution/overview
   * Returns institution profile summary, 8 aggregate KPI metrics, recent cohorts and activities.
   */
  async getOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user?.id;
      if (!adminUserId) {
        throw AppError.unauthorized("Authentication required");
      }

      const overview = await institutionService.getOverview(adminUserId);
      res.status(HttpStatus.OK).json({
        success: true,
        data: overview,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/institution/profile
   * Returns complete profile details of the authenticated institution.
   */
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user?.id;
      if (!adminUserId) {
        throw AppError.unauthorized("Authentication required");
      }

      const profile = await institutionService.getProfile(adminUserId);
      res.status(HttpStatus.OK).json({
        success: true,
        data: profile,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/v1/institution/profile
   * Updates institution profile fields.
   */
  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user?.id;
      if (!adminUserId) {
        throw AppError.unauthorized("Authentication required");
      }

      const updated = await institutionService.updateProfile(adminUserId, req.body);
      res.status(HttpStatus.OK).json({
        success: true,
        data: updated,
        message: "Institution profile updated successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/institution/classes
   * Retrieves all class cohorts belonging to this institution.
   */
  async getClasses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user?.id;
      if (!adminUserId) {
        throw AppError.unauthorized("Authentication required");
      }

      const classes = await institutionService.getClasses(adminUserId);
      res.status(HttpStatus.OK).json({
        success: true,
        data: classes,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/institution/classes
   * Creates a new class cohort for this institution.
   */
  async createClass(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user?.id;
      if (!adminUserId) {
        throw AppError.unauthorized("Authentication required");
      }

      const { academicYear, gradeLevel, division, name, coordinatorName } = req.body;
      if (!academicYear || !gradeLevel || !division) {
        throw AppError.badRequest(
          "Academic Year, Grade Level, and Division are required"
        );
      }

      const newClass = await institutionService.createClass(adminUserId, {
        academicYear,
        gradeLevel,
        division,
        name,
        coordinatorName,
      });

      res.status(HttpStatus.CREATED).json({
        success: true,
        data: newClass,
        message: "Class cohort created successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/institution/students
   * Retrieves student directory for this institution.
   */
  async getStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user?.id;
      if (!adminUserId) {
        throw AppError.unauthorized("Authentication required");
      }

      const classId = req.query.classId as string | undefined;
      const students = await institutionService.getStudents(adminUserId, classId);
      res.status(HttpStatus.OK).json({
        success: true,
        data: students,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/institution/assessments
   * Retrieves allocated assessments for this institution.
   */
  async getAssessments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user?.id;
      if (!adminUserId) {
        throw AppError.unauthorized("Authentication required");
      }

      const assessments = await institutionService.getAssessments(adminUserId);
      res.status(HttpStatus.OK).json({
        success: true,
        data: assessments,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/institution/assessments/assign
   * Allocates an assessment to a cohort or entire institution.
   */
  async assignAssessment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user?.id;
      if (!adminUserId) {
        throw AppError.unauthorized("Authentication required");
      }

      const { assessmentCode, classId, title, deadline } = req.body;
      if (!assessmentCode) {
        throw AppError.badRequest("Assessment code is required");
      }

      const allocation = await institutionService.assignAssessment(adminUserId, {
        assessmentCode,
        classId,
        title,
        deadline,
      });

      res.status(HttpStatus.CREATED).json({
        success: true,
        data: allocation,
        message: "Assessment allocated successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  // =========================================================================
  // STUDENT INVITATION CONTROLLERS
  // =========================================================================

  /**
   * POST /api/v1/institution/invitations
   * Creates an individual student invitation and dispatches the invitation email.
   */
  async inviteStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user?.id;
      if (!adminUserId) {
        throw AppError.unauthorized("Authentication required");
      }

      const invitation = await institutionService.inviteStudent(adminUserId, req.body);
      res.status(HttpStatus.CREATED).json({
        success: true,
        data: invitation,
        message: "Student invitation sent successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/institution/invitations/bulk
   * Bulk imports students, validates records, creates pending invitations, and dispatches emails.
   */
  async bulkImportStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user?.id;
      if (!adminUserId) {
        throw AppError.unauthorized("Authentication required");
      }

      const result = await institutionService.bulkImportStudents(adminUserId, req.body);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: `Bulk import processed: ${result.importedCount} imported, ${result.skippedCount} skipped, ${result.failedCount} failed.`,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/institution/invitations
   * Lists all invitations for this institution with optional status filter.
   */
  async getInvitations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user?.id;
      if (!adminUserId) {
        throw AppError.unauthorized("Authentication required");
      }

      const status = req.query.status as string | undefined;
      const invitations = await institutionService.getInvitations(adminUserId, status);
      res.status(HttpStatus.OK).json({
        success: true,
        data: invitations,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/institution/invitations/:id/resend
   * Regenerates a secure token, updates expiry, and resends the invitation email.
   */
  async resendInvitation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user?.id;
      if (!adminUserId) {
        throw AppError.unauthorized("Authentication required");
      }

      const invitationId = req.params.id as string;
      const updated = await institutionService.resendInvitation(adminUserId, invitationId);
      res.status(HttpStatus.OK).json({
        success: true,
        data: updated,
        message: "Invitation resent successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/institution/invitations/:id/revoke
   * Revokes a pending invitation immediately.
   */
  async revokeInvitation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user?.id;
      if (!adminUserId) {
        throw AppError.unauthorized("Authentication required");
      }

      const invitationId = req.params.id as string;
      const result = await institutionService.revokeInvitation(adminUserId, invitationId);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: "Invitation revoked successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/institution/campaigns
   * Lists all invitation campaigns for this institution.
   */
  async getCampaigns(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user?.id;
      if (!adminUserId) {
        throw AppError.unauthorized("Authentication required");
      }

      const status = req.query.status as string | undefined;
      const campaigns = await institutionService.getCampaigns(adminUserId, status);
      res.status(HttpStatus.OK).json({
        success: true,
        data: campaigns,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/institution/campaigns/:id
   * Retrieves campaign details and all invitations associated with it.
   */
  async getCampaignDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user?.id;
      if (!adminUserId) {
        throw AppError.unauthorized("Authentication required");
      }

      const campaignId = req.params.id as string;
      const details = await institutionService.getCampaignDetails(adminUserId, campaignId);
      res.status(HttpStatus.OK).json({
        success: true,
        data: details,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/institution/campaigns/:id/retry-failed
   * Retries only failed invitation jobs for a campaign.
   */
  async retryFailedCampaign(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = req.user?.id;
      if (!adminUserId) {
        throw AppError.unauthorized("Authentication required");
      }

      const campaignId = req.params.id as string;
      const result = await institutionService.retryFailedCampaign(adminUserId, campaignId);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: result.message,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/institution/webhooks/resend
   * Public webhook endpoint for Resend email delivery/bounce event callbacks.
   */
  async handleResendWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await institutionService.handleResendWebhook(req.body);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/institution/invitations/validate?token=...
   * Public endpoint to validate an invitation token before accepting.
   */
  async validateInvitationToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = (req.query.token || req.params.token) as string;
      const validation = await institutionService.validateInvitationToken(token);
      res.status(HttpStatus.OK).json({
        success: true,
        data: validation,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/institution/invitations/accept
   * Public endpoint for student to accept invitation, set credentials if new, and join cohort.
   */
  async acceptInvitation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authenticatedUserId = req.user?.id;
      const result = await institutionService.acceptInvitation(
        req.body,
        req.ip,
        req.headers["user-agent"],
        authenticatedUserId
      );

      if (result.refreshToken) {
        setRefreshCookie(res, result.refreshToken);
      }

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: result.message,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const institutionController = new InstitutionController();

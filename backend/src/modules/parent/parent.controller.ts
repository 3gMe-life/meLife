import { Request, Response, NextFunction } from "express";
import { parentService } from "./parent.service";
import { HttpStatus } from "../../common/constants/http-status";
import { AppError } from "../../common/errors/app-error";

export class ParentController {
  /**
   * POST /api/v1/parent/invitations/create
   * Student generates a new secure parent invitation code (MLP-XXXX-XXXX).
   * Authorized for: PARTICIPANT
   */
  async createInvitation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const { parentEmail, parentName } = req.body || {};
      const invitation = await parentService.generateInvitation(
        req.user.id,
        parentEmail,
        parentName
      );

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: parentEmail
          ? "Parent invitation generated and emailed successfully."
          : "Parent invitation code generated successfully.",
        data: invitation,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/parent/invitations/verify
   * Public invitation validation endpoint to preview student name/grade safely.
   */
  async verifyInvitation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { inviteCode } = req.body;
      if (!inviteCode) {
        throw AppError.badRequest("Invitation code is required in request body", "INVALID_BODY");
      }

      const verifiedData = await parentService.verifyInvitation(inviteCode);

      res.status(HttpStatus.OK).json({
        success: true,
        data: verifiedData,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/parent/invitations/redeem
   * Parent redeems invitation code and establishes permanent verified link.
   * Authorized for: PARENT_GUARDIAN
   */
  async redeemInvitation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const { inviteCode, studentEmail, relationshipType } = req.body;
      if (!inviteCode || !studentEmail) {
        throw AppError.badRequest("Invitation code and student email are required", "INVALID_BODY");
      }

      const redemptionResult = await parentService.redeemInvitation(
        req.user.id,
        inviteCode,
        studentEmail,
        relationshipType
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Successfully connected to student account.",
        data: redemptionResult,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/parent/children
   * Returns all connected student profiles for the authenticated parent.
   * Authorized for: PARENT_GUARDIAN
   */
  async getConnectedChildren(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const children = await parentService.getConnectedChildren(req.user.id);

      res.status(HttpStatus.OK).json({
        success: true,
        data: children,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/parent/children/:studentId/overview
   * Returns aggregated child overview, assessment summaries, reports, and guidance stats.
   * Authorized for: PARENT_GUARDIAN (verified parent of student)
   */
  async getChildOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const studentId = String(req.params.studentId);
      if (!studentId) {
        throw AppError.badRequest("Student ID is required", "INVALID_STUDENT_ID");
      }

      const overview = await parentService.getChildOverview(req.user.id, studentId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: overview,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/parent/linked-parents
   * Retrieves list of parents/guardians linked to the logged-in student.
   * Authorized for: PARTICIPANT
   */
  async getLinkedParents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const parents = await parentService.getLinkedParents(req.user.id);

      res.status(HttpStatus.OK).json({
        success: true,
        data: parents,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/parent/links/:linkId/revoke
   * Revokes a parent-student link.
   * Authorized for: PARTICIPANT or PARENT_GUARDIAN
   */
  async revokeLink(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const linkId = String(req.params.linkId);
      await parentService.revokeLink(linkId, req.user.id);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Parent-Student link revoked successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/parent/invitations/active
   * Retrieves active unexpired invitation for the logged-in student.
   * Authorized for: PARTICIPANT
   */
  async getActiveInvitation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const invitation = await parentService.getActiveInvitation(req.user.id);

      res.status(HttpStatus.OK).json({
        success: true,
        data: invitation,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/parent/invitations/revoke
   * Revokes an active invitation code.
   * Authorized for: PARTICIPANT
   */
  async revokeInvitation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const { inviteCode } = req.body;
      if (!inviteCode) {
        throw AppError.badRequest("Invitation code is required", "INVALID_BODY");
      }

      const revoked = await parentService.revokeInvitation(req.user.id, inviteCode);

      res.status(HttpStatus.OK).json({
        success: true,
        message: revoked ? "Invitation revoked successfully" : "No active invitation found to revoke",
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/parent/reports
   * Returns all assessment reports for all connected children of the logged-in parent.
   * Authorized for: PARENT_GUARDIAN
   */
  async getReports(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const studentId = req.query.studentId ? String(req.query.studentId) : undefined;
      const reports = await parentService.getReports(req.user.id, studentId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: reports,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/parent/reports/:reportId
   * Returns detailed assessment report for a connected child.
   * Authorized for: PARENT_GUARDIAN
   */
  async getReportDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const reportId = String(req.params.reportId);
      const report = await parentService.getReportDetail(req.user.id, reportId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: report,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const parentController = new ParentController();


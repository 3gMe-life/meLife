import { Request, Response, NextFunction } from "express";
import { AppError } from "../../common/errors/app-error";
import { HttpStatus } from "../../common/constants/http-status";
import { counsellingService } from "./counselling.service";

export class CounsellingController {
  /**
   * GET /api/v1/counsellors
   * Retrieves directory of approved certified counsellors with AI match percentages.
   */
  async getAllCounsellors(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const search = req.query.search as string;
      const specialisation = req.query.specialisation as string;
      const language = req.query.language as string;
      const userId = req.user?.id;

      const data = await counsellingService.getRecommendedCounsellors(userId, {
        search,
        specialisation,
        language,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        data: data.counsellors,
        isAssessed: data.isAssessed,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/counsellors/:id
   * Retrieves single counsellor profile with schedule and reviews.
   */
  async getCounsellorById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const counsellorId = String(req.params.id);
      const data = await counsellingService.getCounsellorDetail(counsellorId);

      res.status(HttpStatus.OK).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/counselling/request
   * Student requests an appointment with a certified counsellor.
   */
  async requestSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const { counsellorId, sessionType, sessionDate, sessionTime, studentNotes, grantConsent } = req.body;

      if (!counsellorId || !sessionType || !sessionDate || !sessionTime) {
        throw AppError.badRequest("Counsellor, session type, date, and time are required");
      }

      const session = await counsellingService.bookSession(req.user.id, {
        counsellorId,
        sessionType,
        sessionDate,
        sessionTime,
        studentNotes,
        grantConsent,
      });

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Counselling appointment requested successfully",
        data: session,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/counselling/sessions
   * Retrieves current student's booked counselling appointments.
   */
  async getStudentSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const sessions = await counsellingService.getStudentSessions(req.user.id);

      res.status(HttpStatus.OK).json({
        success: true,
        data: sessions,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/counselling/consent
   * Updates student consent permission for psychometric summary access.
   */
  async updateConsent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const { counsellorId, permission } = req.body;
      if (!counsellorId || !permission) {
        throw AppError.badRequest("counsellorId and permission are required");
      }

      const result = await counsellingService.updateConsent(req.user.id, counsellorId, permission);

      res.status(HttpStatus.OK).json({
        success: true,
        message: `Consent successfully ${permission === "REVOKED" ? "revoked" : "granted"}`,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/counselling/counsellor/overview
   * Overview dashboard stats and upcoming queue for certified counsellors.
   */
  async getCounsellorOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const data = await counsellingService.getCounsellorOverview(req.user.id);

      res.status(HttpStatus.OK).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/counselling/counsellor/sessions
   * Retrieves appointments assigned to the authenticated counsellor.
   */
  async getCounsellorSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const status = req.query.status as string;
      const sessions = await counsellingService.getCounsellorSessions(req.user.id, status);

      res.status(HttpStatus.OK).json({
        success: true,
        data: sessions,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/v1/counselling/sessions/:id/status
   * Counsellor updates session status (CONFIRMED, REJECTED, COMPLETED, CANCELLED).
   */
  async updateSessionStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const sessionId = String(req.params.id);
      const { status, meetingLink } = req.body;

      if (!status) {
        throw AppError.badRequest("Session status is required");
      }

      const session = await counsellingService.updateSessionStatus(
        req.user.id,
        sessionId,
        status,
        meetingLink
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: `Session status updated to ${status}`,
        data: session,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/counselling/counsellor/students
   * Retrieves list of students who have booked with this counsellor.
   */
  async getAssignedStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const students = await counsellingService.getAssignedStudents(req.user.id);

      res.status(HttpStatus.OK).json({
        success: true,
        data: students,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/counselling/counsellor/students/:studentId/summary
   * Counsellor retrieves safe high-level psychometric summary if student consent is active.
   */
  async getStudentSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const studentId = String(req.params.studentId);
      const summary = await counsellingService.getStudentSummaryForCounsellor(req.user.id, studentId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: summary,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/counselling/sessions/:id/notes
   * Counsellor saves guidance notes, observations, and student action plan.
   */
  async saveSessionNotes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const sessionId = String(req.params.id);
      const { summary, observations, recommendations, actionPlan, followUpDate } = req.body;

      const note = await counsellingService.saveSessionNotes(req.user.id, sessionId, {
        summary,
        observations,
        recommendations,
        actionPlan,
        followUpDate,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Counselling notes and action plan saved successfully",
        data: note,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/counselling/sessions/:id/notes
   * Retrieves notes for a session (accessible by student or assigned counsellor).
   */
  async getSessionNotes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const sessionId = String(req.params.id);
      const note = await counsellingService.getSessionNotes(req.user.id, sessionId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: note,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/notifications
   * Retrieves notifications for current user.
   */
  async getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const notifications = await counsellingService.getNotifications(req.user.id);

      res.status(HttpStatus.OK).json({
        success: true,
        data: notifications,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/v1/notifications/:id/read
   * Marks a notification as read.
   */
  async markNotificationAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const notificationId = String(req.params.id);
      await counsellingService.markNotificationAsRead(notificationId, req.user.id);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Notification marked as read",
      });
    } catch (err) {
      next(err);
    }
  }
}

export const counsellingController = new CounsellingController();

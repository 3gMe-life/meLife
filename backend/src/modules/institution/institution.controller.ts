import { Request, Response, NextFunction } from "express";
import { AppError } from "../../common/errors/app-error";
import { HttpStatus } from "../../common/constants/http-status";
import { institutionService } from "./institution.service";

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
}

export const institutionController = new InstitutionController();

import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../common/errors/app-error";
import { HttpStatus } from "../../../common/constants/http-status";
import { careerReportService } from "./career-report.service";

export class CareerReportController {
  /**
   * POST /api/v1/career-reports/generate
   * Generates or retrieves a comprehensive 10-section career exploration report.
   */
  async generateReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required.", "AUTH_UNAUTHORIZED");
      }

      const { resultId, languageCode, forceRegenerate } = req.body || {};
      const lang = languageCode || (req.query.language as string) || (req.query.lang as string) || "en";
      const userRole = req.user.role || (req.user as any).roles?.[0] || "STUDENT";

      const report = await careerReportService.generateOrGetReport(
        req.user.id,
        {
          resultId,
          languageCode: lang,
          forceRegenerate: Boolean(forceRegenerate),
        },
        userRole
      );

      res.status(HttpStatus.OK).json({
        success: true,
        data: report,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/career-reports/latest
   * Retrieves the authenticated student's latest career report.
   */
  async getLatestReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required.", "AUTH_UNAUTHORIZED");
      }

      const lang = (req.query.language as string) || (req.query.lang as string) || "en";
      const userRole = req.user.role || (req.user as any).roles?.[0] || "STUDENT";

      const report = await careerReportService.getLatestReportForStudent(
        req.user.id,
        lang,
        userRole
      );

      res.status(HttpStatus.OK).json({
        success: true,
        data: report,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/career-reports/:id
   * Retrieves a specific career report by ID with role-based visibility rules.
   */
  async getReportById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required.", "AUTH_UNAUTHORIZED");
      }

      const id = String(req.params.id);
      const userRole = req.user.role || (req.user as any).roles?.[0] || "STUDENT";

      const report = await careerReportService.getReportById(id, req.user.id, userRole);

      res.status(HttpStatus.OK).json({
        success: true,
        data: report,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/career-reports/:id/pdf
   * Streams a binary A4 PDF download of the career exploration report.
   */
  async downloadReportPdf(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required.", "AUTH_UNAUTHORIZED");
      }

      const id = String(req.params.id);
      const lang = (req.query.language as string) || (req.query.lang as string) || "en";
      const userRole = req.user.role || (req.user as any).roles?.[0] || "STUDENT";

      const { buffer, filename } = await careerReportService.generatePdfBuffer(
        id,
        req.user.id,
        userRole,
        lang
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Length", buffer.length);
      res.status(HttpStatus.OK).send(buffer);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/career-reports/student/:studentId
   * Counsellor endpoint: Retrieves student's career report with Section 10 Counsellor Insights.
   */
  async getStudentReportForCounsellor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required.", "AUTH_UNAUTHORIZED");
      }

      const studentId = String(req.params.studentId);
      const lang = (req.query.language as string) || (req.query.lang as string) || "en";

      const report = await careerReportService.getReportForCounsellor(
        req.user.id,
        studentId,
        lang
      );

      res.status(HttpStatus.OK).json({
        success: true,
        data: report,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const careerReportController = new CareerReportController();

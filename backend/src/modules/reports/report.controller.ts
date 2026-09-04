import { Request, Response, NextFunction } from "express";
import { AppError } from "../../common/errors/app-error";
import { HttpStatus } from "../../common/constants/http-status";
import { reportService } from "./report.service";

export class ReportController {
  /**
   * POST /api/v1/reports/generate/:resultId
   */
  async generateReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const resultId = String(req.params.resultId);
      const languageCode = (req.query.language as string) || req.body?.languageCode || "en";
      const forceRegenerate = Boolean(req.body?.forceRegenerate);

      const { report, reportData } = await reportService.generateOrGetReport(
        resultId,
        req.user.id,
        req.user.role,
        languageCode,
        forceRegenerate
      );

      res.status(HttpStatus.CREATED).json({
        success: true,
        data: {
          reportId: report.id,
          resultId: report.assessment_result_id,
          status: report.status,
          language: report.language_code,
          generatedAt: report.generated_at,
          report: reportData,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/reports/:reportId
   */
  async getReportById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const reportId = String(req.params.reportId);
      const languageCode = req.query.language as string;

      const { report, reportData } = await reportService.getReportById(
        reportId,
        req.user.id,
        req.user.role,
        languageCode
      );

      res.status(HttpStatus.OK).json({
        success: true,
        data: {
          reportId: report.id,
          resultId: report.assessment_result_id,
          status: report.status,
          language: report.language_code,
          generatedAt: report.generated_at,
          report: reportData,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/reports/:reportId/download
   * Streams PDF file securely.
   */
  async downloadReportPdf(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const reportId = String(req.params.reportId);
      const languageCode = req.query.language as string;

      const { buffer, filename } = await reportService.generateReportPdfBuffer(
        reportId,
        req.user.id,
        req.user.role,
        languageCode
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Length", buffer.length);
      res.status(HttpStatus.OK).end(buffer);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/reports/result/:resultId
   */
  async getReportByResultId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const resultId = String(req.params.resultId);
      const languageCode = (req.query.language as string) || "en";

      const { report, reportData } = await reportService.getReportByResultId(
        resultId,
        req.user.id,
        req.user.role,
        languageCode
      );

      res.status(HttpStatus.OK).json({
        success: true,
        data: {
          reportId: report.id,
          resultId: report.assessment_result_id,
          status: report.status,
          language: report.language_code,
          generatedAt: report.generated_at,
          report: reportData,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/reports/participant/latest
   */
  async getLatestReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const assessmentCode = (req.query.assessmentCode as string) || "SKILL_FINDER";
      const languageCode = (req.query.language as string) || "en";

      const result = await reportService.getLatestReportForParticipant(
        req.user.id,
        assessmentCode,
        languageCode
      );

      if (!result) {
        throw AppError.notFound(
          "No completed report available. Please complete your assessment first.",
          "REPORT_NOT_FOUND"
        );
      }

      res.status(HttpStatus.OK).json({
        success: true,
        data: {
          reportId: result.report.id,
          resultId: result.report.assessment_result_id,
          status: result.report.status,
          language: result.report.language_code,
          generatedAt: result.report.generated_at,
          report: result.reportData,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const reportController = new ReportController();

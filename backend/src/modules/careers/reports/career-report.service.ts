import { AppError } from "../../../common/errors/app-error";
import { logger } from "../../../common/utils/logger";
import { userRepository } from "../../users/user.repository";
import { participantRepository } from "../../participants/participant.repository";
import { assessmentContentRepository } from "../../assessments/assessment-content.repository";
import { careerRepository } from "../career.repository";
import { careerRecommendationService } from "../career-recommendation.service";
import { careerReportRepository } from "./career-report.repository";
import { careerReportGeneratorService } from "./career-report-generator.service";
import { careerReportPdfGenerator } from "./career-report-pdf.generator";
import {
  CareerReportDTO,
  GenerateCareerReportRequestDTO,
} from "./career-report.types";

export class CareerReportService {
  /**
   * Generates or retrieves the student's career guidance report.
   */
  async generateOrGetReport(
    userId: string,
    dto: GenerateCareerReportRequestDTO = {},
    userRole = "STUDENT"
  ): Promise<CareerReportDTO> {
    const lang = (dto.languageCode || "en").toLowerCase().trim();

    // 1. Verify user existence
    const user = await userRepository.findById(userId);
    if (!user) {
      throw AppError.notFound("Student user account not found.");
    }

    // 2. Fetch assessment result
    let latestResultRow: any = null;
    if (dto.resultId) {
      latestResultRow = await assessmentContentRepository.findResultById(dto.resultId);
    } else {
      latestResultRow = await assessmentContentRepository.findLatestResultByUserId(userId);
    }

    const resultId = latestResultRow?.id || null;

    // 3. Check for existing cached report if forceRegenerate is not requested
    if (!dto.forceRegenerate) {
      const existing = await careerReportRepository.findReportByStudentAndResult(userId, resultId, lang);
      if (existing && existing.report_data) {
        return this.filterReportByRole(existing.report_data, userRole);
      }
    }

    // 4. Load participant profile and career data
    const profile = await participantRepository.findByUserId(userId);
    const pathwaysResult = await careerRecommendationService.getRecommendedPathways(userId, lang);
    const allCareers = await careerRepository.findAllCareers(lang);

    const careersMap = new Map();
    for (const c of allCareers) {
      careersMap.set(c.id, c);
      careersMap.set(c.slug, c);
    }

    // 5. Generate 10-Section Report
    const generatedReport = careerReportGeneratorService.generateReport({
      user,
      participantProfile: profile,
      latestResultRow,
      recommendedPathways: pathwaysResult.recommendations,
      careersMap,
      languageCode: lang,
    });

    // 6. Save in database
    await careerReportRepository.saveReport(generatedReport);
    logger.info(`✨ Generated career report ${generatedReport.reportId} for student ${userId} (lang: ${lang}).`);

    return this.filterReportByRole(generatedReport, userRole);
  }

  /**
   * Retrieves an existing career report by its UUID.
   */
  async getReportById(reportId: string, requestingUserId: string, userRole = "STUDENT"): Promise<CareerReportDTO> {
    const entity = await careerReportRepository.findReportById(reportId);
    if (!entity) {
      throw AppError.notFound("Career report not found.");
    }

    const isOwner = entity.student_id === requestingUserId;
    const isPrivileged = ["CAREER_COUNSELLOR", "PLATFORM_ADMIN", "SUPER_ADMIN"].includes(userRole.toUpperCase());

    if (!isOwner && !isPrivileged) {
      throw AppError.forbidden("You do not have permission to view this career report.");
    }

    return this.filterReportByRole(entity.report_data, userRole);
  }

  /**
   * Retrieves the latest career report for a student, generating one if none exists.
   */
  async getLatestReportForStudent(
    studentId: string,
    languageCode = "en",
    userRole = "STUDENT"
  ): Promise<CareerReportDTO> {
    const lang = (languageCode || "en").toLowerCase().trim();
    const existing = await careerReportRepository.findLatestReportByStudentId(studentId, lang);

    if (existing && existing.report_data) {
      return this.filterReportByRole(existing.report_data, userRole);
    }

    return this.generateOrGetReport(studentId, { languageCode: lang }, userRole);
  }

  /**
   * Counsellor endpoint: Retrieves complete career report with protected Counsellor Insights.
   */
  async getReportForCounsellor(
    _counsellorUserId: string,
    studentId: string,
    languageCode = "en"
  ): Promise<CareerReportDTO> {
    const lang = (languageCode || "en").toLowerCase().trim();
    const report = await this.getLatestReportForStudent(studentId, lang, "CAREER_COUNSELLOR");
    return report;
  }

  /**
   * Generates and returns a binary PDF buffer for downloading.
   */
  async generatePdfBuffer(
    reportIdOrLatest: string,
    requestingUserId: string,
    userRole = "STUDENT",
    languageCode = "en"
  ): Promise<{ buffer: Buffer; filename: string }> {
    let report: CareerReportDTO;

    if (reportIdOrLatest === "latest") {
      report = await this.getLatestReportForStudent(requestingUserId, languageCode, userRole);
    } else {
      report = await this.getReportById(reportIdOrLatest, requestingUserId, userRole);
    }

    const isPrivileged = ["CAREER_COUNSELLOR", "PLATFORM_ADMIN", "SUPER_ADMIN"].includes(userRole.toUpperCase());
    const pdfBuffer = await careerReportPdfGenerator.generatePdf(report, isPrivileged);

    const safeName = report.cover.studentName.replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `3G_MeLife_Career_Report_${safeName}_${report.language}.pdf`;

    return {
      buffer: pdfBuffer,
      filename,
    };
  }

  /**
   * Privacy firewall: Strips Section 10 (Counsellor Insights) for students and parents.
   */
  private filterReportByRole(report: CareerReportDTO, userRole: string): CareerReportDTO {
    const roleUpper = (userRole || "").toUpperCase();
    const isPrivileged = ["CAREER_COUNSELLOR", "PLATFORM_ADMIN", "SUPER_ADMIN"].includes(roleUpper);

    if (!isPrivileged) {
      const sanitized = { ...report };
      delete sanitized.counsellorInsights;
      return sanitized;
    }

    return report;
  }
}

export const careerReportService = new CareerReportService();

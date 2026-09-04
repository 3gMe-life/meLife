import { AppError } from "../../common/errors/app-error";
import { logger } from "../../common/utils/logger";
import { UserRole } from "../users/user.types";
import { reportRepository } from "./report.repository";
import { assessmentContentRepository } from "../assessments/assessment-content.repository";
import { skillFinderReportTemplate } from "./templates/skill-finder.template";
import { reportPdfGenerator } from "./generators/report-pdf.generator";
import {
  SkillFinderReportDTO,
  AssessmentReportEntity,
} from "./report.types";

export class ReportService {
  /**
   * Generates or retrieves an existing localized psychometric report snapshot.
   */
  async generateOrGetReport(
    resultId: string,
    requestingUserId: string,
    requestingUserRole: UserRole,
    languageCode = "en",
    forceRegenerate = false
  ): Promise<{ report: AssessmentReportEntity; reportData: SkillFinderReportDTO }> {
    const lang = (languageCode || "en").toLowerCase().trim();

    // 1. Fetch assessment result entity
    const resultEntity = await assessmentContentRepository.findResultById(resultId);
    if (!resultEntity) {
      throw AppError.notFound("Assessment result not found.", "RESULT_NOT_FOUND");
    }

    // 2. Authorization guard: participant must own the result (or authorized staff/guardian)
    if (
      requestingUserRole === "PARTICIPANT" &&
      resultEntity.participant_id !== requestingUserId
    ) {
      throw AppError.forbidden(
        "You do not have permission to generate or view this report.",
        "REPORT_FORBIDDEN"
      );
    }

    // 3. Return cached report if available and not forcing regeneration
    if (!forceRegenerate) {
      const existingReport = await reportRepository.findReportByResultId(resultId, lang);
      if (existingReport && existingReport.status === "COMPLETED") {
        logger.info(
          { reportId: existingReport.id, resultId, language: lang },
          "Returning existing cached psychometric report"
        );
        return {
          report: existingReport,
          reportData: existingReport.report_data,
        };
      }
    }

    // 4. Fetch student profile details
    const studentProfile = await reportRepository.getParticipantProfileForReport(
      resultEntity.participant_id
    );

    const safeProfile = studentProfile || {
      name: "Student Participant",
      firstName: "Student",
      lastName: "Participant",
      email: "",
      dateOfBirth: null,
      age: null,
      educationStage: "SCHOOL",
      gradeLevel: null,
      schoolName: "3G MeLife Learning Academy",
      curriculumOrBoard: null,
    };

    // 5. Parse result snapshot DTO
    const resultData = resultEntity.result_data;

    // 6. Synthesize Report via Template Engine
    const reportId = crypto.randomUUID();
    const reportDto = await skillFinderReportTemplate.generateReport({
      reportId,
      result: resultData,
      studentProfile: safeProfile,
      languageCode: lang,
    });

    // 7. Persist Report in PostgreSQL
    const savedEntity = await reportRepository.saveReport({
      resultId: resultEntity.id,
      participantId: resultEntity.participant_id,
      assessmentCode: resultEntity.assessment_code,
      templateVersion: skillFinderReportTemplate.templateVersion,
      languageCode: lang,
      status: "COMPLETED",
      reportTitle: `${safeProfile.name} - Skill Finder Report`,
      profileArchetype: reportDto.executiveSummary?.archetypeTitle || null,
      reportData: reportDto,
    });

    logger.info(
      {
        reportId: savedEntity.id,
        resultId: resultEntity.id,
        participantId: resultEntity.participant_id,
        language: lang,
      },
      "Psychometric report successfully synthesized and persisted."
    );

    return {
      report: savedEntity,
      reportData: savedEntity.report_data,
    };
  }

  /**
   * Retrieves a report by report ID with authorization checks.
   */
  async getReportById(
    reportId: string,
    requestingUserId: string,
    requestingUserRole: UserRole,
    languageCode?: string
  ): Promise<{ report: AssessmentReportEntity; reportData: SkillFinderReportDTO }> {
    let reportEntity = await reportRepository.findReportById(reportId);
    if (!reportEntity) {
      throw AppError.notFound("Assessment report not found.", "REPORT_NOT_FOUND");
    }

    // Ownership check
    if (
      requestingUserRole === "PARTICIPANT" &&
      reportEntity.participant_id !== requestingUserId
    ) {
      throw AppError.forbidden(
        "You do not have permission to view this report.",
        "REPORT_FORBIDDEN"
      );
    }

    // If a different language was requested, regenerate or fetch that localized version
    if (languageCode && languageCode.toLowerCase().trim() !== reportEntity.language_code) {
      return this.generateOrGetReport(
        reportEntity.assessment_result_id,
        requestingUserId,
        requestingUserRole,
        languageCode
      );
    }

    return {
      report: reportEntity,
      reportData: reportEntity.report_data,
    };
  }

  /**
   * Retrieves or automatically generates report by assessment result ID.
   */
  async getReportByResultId(
    resultId: string,
    requestingUserId: string,
    requestingUserRole: UserRole,
    languageCode = "en"
  ): Promise<{ report: AssessmentReportEntity; reportData: SkillFinderReportDTO }> {
    return this.generateOrGetReport(
      resultId,
      requestingUserId,
      requestingUserRole,
      languageCode
    );
  }

  /**
   * Retrieves the participant's latest report.
   */
  async getLatestReportForParticipant(
    participantId: string,
    assessmentCode = "SKILL_FINDER",
    languageCode = "en"
  ): Promise<{ report: AssessmentReportEntity; reportData: SkillFinderReportDTO } | null> {
    const lang = (languageCode || "en").toLowerCase().trim();
    let reportEntity = await reportRepository.findLatestReportByParticipantId(
      participantId,
      assessmentCode,
      lang
    );

    if (!reportEntity) {
      // Find latest result and synthesize report
      const latestResult = await assessmentContentRepository.findLatestResultByUserId(
        participantId
      );
      if (!latestResult) return null;

      const generated = await this.generateOrGetReport(
        latestResult.id,
        participantId,
        "PARTICIPANT",
        lang
      );
      reportEntity = generated.report;
    }

    return {
      report: reportEntity,
      reportData: reportEntity.report_data,
    };
  }

  /**
   * Generates a vector PDF binary buffer for secure download.
   */
  async generateReportPdfBuffer(
    reportId: string,
    requestingUserId: string,
    requestingUserRole: UserRole,
    languageCode?: string
  ): Promise<{ buffer: Buffer; filename: string }> {
    const { reportData } = await this.getReportById(
      reportId,
      requestingUserId,
      requestingUserRole,
      languageCode
    );

    const pdfBuffer = await reportPdfGenerator.generatePdf(reportData);

    const sanitizedName = reportData.studentProfile.studentName
      .replace(/[^a-zA-Z0-9]/g, "_")
      .toLowerCase();
    const filename = `MeLife_Skill_Finder_Report_${sanitizedName}_${reportData.language}.pdf`;

    return {
      buffer: pdfBuffer,
      filename,
    };
  }
}

export const reportService = new ReportService();

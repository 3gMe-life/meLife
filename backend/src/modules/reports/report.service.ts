import { AppError } from "../../common/errors/app-error";
import { logger } from "../../common/utils/logger";
import { UserRole } from "../users/user.types";
import { reportRepository } from "./report.repository";
import { assessmentContentRepository } from "../assessments/assessment-content.repository";
import { skillFinderReportTemplate } from "./templates/skill-finder.template";
import { engineeringBranchFinderReportTemplate } from "./templates/engineering-branch-finder.template";
import { reportPdfGenerator } from "./generators/report-pdf.generator";
import { commerceCareerFinderReportTemplate } from "./templates/commerce-career-finder.template";
import { humanitiesCareerFinderReportTemplate } from "./templates/humanities-career-finder.template";
import { rightCareerFinderReportTemplate } from "./templates/right-career-finder.template";
import { entrepreneurDevelopmentReportTemplate } from "./templates/entrepreneur-development.template";
import {
  SkillFinderReportDTO,
  AssessmentReportEntity,
} from "./report.types";
import { parentRepository } from "../parent/parent.repository";

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
  ): Promise<{ report: AssessmentReportEntity; reportData: any }> {
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
    const rawResultData = resultEntity.result_data;
    const resultData =
      typeof rawResultData === "string"
        ? JSON.parse(rawResultData)
        : (rawResultData || {});

    // 6. Synthesize Report via Template Engine
    const reportId = crypto.randomUUID();
    let reportDto: any;
    let templateVer = skillFinderReportTemplate.templateVersion;
    let reportTitle = `${safeProfile.name} - Skill Finder Report`;
    let archetype: string | null = null;

    if (resultEntity.assessment_code === "ENTREPRENEUR_DEVELOPMENT_TEST") {
      reportDto = await entrepreneurDevelopmentReportTemplate.generateReport({
        reportId,
        result: resultData,
        studentProfile: safeProfile,
        languageCode: lang,
      });
      templateVer = entrepreneurDevelopmentReportTemplate.templateVersion;
      reportTitle = `${safeProfile.name} - Entrepreneur Development & Venture Readiness Report`;
      archetype = reportDto.primaryArchetype?.title || null;
    } else if (resultEntity.assessment_code === "RIGHT_CAREER_FINDER") {
      reportDto = await rightCareerFinderReportTemplate.generateReport({
        reportId,
        result: resultData,
        studentProfile: safeProfile,
        languageCode: lang,
      });
      templateVer = rightCareerFinderReportTemplate.templateVersion;
      reportTitle = `${safeProfile.name} - Career Finder Exploration Report`;
      archetype = reportDto.explorationFocus?.primaryFamilyName || null;
    } else if (resultEntity.assessment_code === "HUMANITIES_CAREER_FINDER") {
      reportDto = await humanitiesCareerFinderReportTemplate.generateReport({
        reportId,
        result: resultData,
        studentProfile: safeProfile,
        languageCode: lang,
      });
      templateVer = humanitiesCareerFinderReportTemplate.templateVersion;
      reportTitle = `${safeProfile.name} - Humanities Career Finder Report`;
      archetype = reportDto.explorationFocus?.primaryFamilyName || null;
    } else if (resultEntity.assessment_code === "COMMERCE_CAREER_FINDER") {
      reportDto = await commerceCareerFinderReportTemplate.generateReport({
        reportId,
        result: resultData,
        studentProfile: safeProfile,
        languageCode: lang,
      });
      templateVer = commerceCareerFinderReportTemplate.templateVersion;
      reportTitle = `${safeProfile.name} - Commerce Career Finder Report`;
      archetype = reportDto.explorationFocus?.primaryFamilyName || null;
    } else if (resultEntity.assessment_code === "ENGINEERING_BRANCH_FINDER") {
      reportDto = await engineeringBranchFinderReportTemplate.generateReport({
        reportId,
        result: resultData,
        studentProfile: safeProfile,
        languageCode: lang,
      });
      templateVer = engineeringBranchFinderReportTemplate.templateVersion;
      reportTitle = `${safeProfile.name} - Engineering Branch Finder Exploration Report`;
      archetype = reportDto.explorationFocus?.primaryBranchName || null;
    } else {
      reportDto = await skillFinderReportTemplate.generateReport({
        reportId,
        result: resultData,
        studentProfile: safeProfile,
        languageCode: lang,
      });
      archetype = reportDto.executiveSummary?.archetypeTitle || null;
    }

    // 7. Persist Report in PostgreSQL
    const savedEntity = await reportRepository.saveReport({
      resultId: resultEntity.id,
      participantId: resultEntity.participant_id,
      assessmentCode: resultEntity.assessment_code,
      templateVersion: templateVer,
      languageCode: lang,
      status: "COMPLETED",
      reportTitle,
      profileArchetype: archetype,
      reportData: reportDto,
    });

    const reportDataPayload = savedEntity.report_data || reportDto;
    if (reportDataPayload) {
      reportDataPayload.reportId = savedEntity.id;
    }

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
      reportData: reportDataPayload,
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
    const lang = (languageCode || "en").toLowerCase().trim();

    // 1. Support "latest"
    if (reportId === "latest") {
      const latest = await this.getLatestReportForParticipant(requestingUserId, "SKILL_FINDER", lang);
      if (!latest) {
        throw AppError.notFound("No completed assessment report available for this participant.", "REPORT_NOT_FOUND");
      }
      return latest;
    }

    // 2. Direct lookup in reports repository (resolves by DB id, JSON reportId, resultId, or attemptId)
    let reportEntity = await reportRepository.findReportById(reportId);

    // 3. Fallback auto-synthesis if reportId is an assessment result ID or attempt ID
    if (!reportEntity) {
      const resultEntity =
        (await assessmentContentRepository.findResultById(reportId)) ||
        (await assessmentContentRepository.findResultByAttemptId(reportId));

      if (resultEntity) {
        return this.generateOrGetReport(
          resultEntity.id,
          requestingUserId,
          requestingUserRole,
          lang
        );
      }

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

    if (requestingUserRole === "PARENT_GUARDIAN") {
      const isParent = await parentRepository.isParentOfStudent(
        requestingUserId,
        reportEntity.participant_id
      );
      if (!isParent) {
        throw AppError.forbidden(
          "You do not have permission to view this student's report.",
          "REPORT_FORBIDDEN"
        );
      }
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

    const reportDataPayload = reportEntity.report_data;
    if (reportDataPayload) {
      reportDataPayload.reportId = reportEntity.id;
    }

    return {
      report: reportEntity,
      reportData: reportDataPayload,
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
   * Retrieves the participant's latest report for a specific assessment.
   */
  async getLatestReportForParticipant(
    participantId: string,
    assessmentCode = "SKILL_FINDER",
    languageCode = "en"
  ): Promise<{ report: AssessmentReportEntity; reportData: any } | null> {
    const lang = (languageCode || "en").toLowerCase().trim();

    // 1. Find the latest completed assessment result for the specified assessmentCode
    const latestResult = await assessmentContentRepository.findLatestResultByUserId(
      participantId,
      assessmentCode
    );
    if (!latestResult) {
      return null;
    }

    // 2. Generate or retrieve the localized report for this latest result
    const generated = await this.generateOrGetReport(
      latestResult.id,
      participantId,
      "PARTICIPANT",
      lang
    );

    return {
      report: generated.report,
      reportData: generated.reportData,
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

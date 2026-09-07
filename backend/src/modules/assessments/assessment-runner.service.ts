import { pool } from "../../config/database";
import { assessmentContentRepository } from "./assessment-content.repository";
import { assessmentRepository } from "./assessment.repository";
import { userRepository } from "../users/user.repository";
import { scoringService } from "../scoring/scoring.service";
import { resultComparisonService } from "../scoring/services/result-comparison.service";
import { skillFinderQuestionSelectionService } from "./services/skill-finder-question-selection.service";
import { AppError } from "../../common/errors/app-error";
import { logger } from "../../common/utils/logger";
import {
  AssessmentAttemptQuestionsResponseDTO,
  SaveResponseDTO,
} from "./assessment-runner.types";

export class AssessmentRunnerService {
  /**
   * Starts a new assessment attempt or resumes an existing in-progress attempt.
   * Automatically resolves the appropriate version (e.g. Student Edition vs Advanced Edition).
   */
  async startOrCreateAttempt(
    userId: string,
    assessmentCode: string,
    versionCode?: string
  ): Promise<{
    attemptId: string;
    status: string;
    isNew: boolean;
    versionCode?: string | null;
    versionName?: string | null;
  }> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw AppError.notFound("Participant user not found.", "AUTH_USER_NOT_FOUND");
    }

    // 1. If assessmentCode is an existing attemptId belonging to this participant, resume it immediately
    const existingAttempt = await assessmentContentRepository.findAttemptById(assessmentCode);
    if (existingAttempt && existingAttempt.participant_id === userId) {
      logger.info(
        { userId, attemptId: existingAttempt.id, code: existingAttempt.assessment_code },
        "Resumed assessment attempt directly by attempt ID"
      );
      return {
        attemptId: existingAttempt.id,
        status: existingAttempt.status,
        isNew: false,
        versionCode: existingAttempt.version_code || null,
        versionName: existingAttempt.version_name || null,
      };
    }

    // 2. Resolve assessment catalog entity by code or ID
    let assessment = await assessmentRepository.findByIdOrCode(assessmentCode);

    // 3. Fallback recovery: if not found by code/id, check if user has an active attempt to resume
    if (!assessment) {
      const activeAttempt = await assessmentContentRepository.findLatestActiveAttemptForUser(userId);
      if (activeAttempt) {
        logger.info(
          { userId, attemptedCode: assessmentCode, resumedAttemptId: activeAttempt.id },
          "Recovered and resumed participant's active assessment attempt"
        );
        return {
          attemptId: activeAttempt.id,
          status: activeAttempt.status,
          isNew: false,
          versionCode: activeAttempt.version_code || null,
          versionName: activeAttempt.version_name || null,
        };
      }

      // Fallback to default SKILL_FINDER if requested assessmentCode is unknown or was generic
      assessment = await assessmentRepository.findByCode("SKILL_FINDER");
    }

    if (!assessment) {
      throw AppError.notFound(
        `Assessment '${assessmentCode}' not found.`,
        "ASSESSMENT_NOT_FOUND"
      );
    }

    // Resolve target version
    let targetVersion = versionCode
      ? await skillFinderQuestionSelectionService.getVersionByCode(assessment.id, versionCode)
      : await skillFinderQuestionSelectionService.getDefaultVersion(assessment.id);

    // Fallback to default student edition if no specific version requested
    if (!targetVersion && !versionCode) {
      targetVersion = await skillFinderQuestionSelectionService.getVersionByCode(
        assessment.id,
        "STUDENT_STANDARD"
      );
    }

    // Check for existing active attempt
    const activeAttempt = await assessmentContentRepository.findActiveAttempt(
      userId,
      assessment.id
    );

    if (activeAttempt) {
      logger.info(
        { userId, assessmentCode, attemptId: activeAttempt.id },
        "Resuming active assessment attempt"
      );
      return {
        attemptId: activeAttempt.id,
        status: activeAttempt.status,
        isNew: false,
        versionCode: targetVersion?.version_code || null,
        versionName: targetVersion?.name || null,
      };
    }

    // Create new attempt
    const totalQuestions =
      targetVersion?.question_count || assessment.questionCount || 68;
    const newAttempt = await assessmentContentRepository.createAttempt(
      userId,
      assessment.id,
      targetVersion?.id || null,
      totalQuestions
    );

    logger.info(
      {
        userId,
        assessmentCode,
        version: targetVersion?.version_code || "DEFAULT",
        attemptId: newAttempt.id,
      },
      "Created new assessment attempt"
    );

    return {
      attemptId: newAttempt.id,
      status: newAttempt.status,
      isNew: true,
      versionCode: targetVersion?.version_code || null,
      versionName: targetVersion?.name || null,
    };
  }

  /**
   * Retrieves sanitized questions with existing responses for the participant in requested language.
   */
  async getAttemptQuestions(
    userId: string,
    attemptId: string,
    languageCode = "en"
  ): Promise<AssessmentAttemptQuestionsResponseDTO> {
    const attempt = await assessmentContentRepository.findAttemptById(attemptId);
    if (!attempt) {
      throw AppError.notFound("Assessment attempt not found.", "ATTEMPT_NOT_FOUND");
    }

    if (attempt.participant_id !== userId) {
      throw AppError.forbidden("Access denied to this assessment attempt.", "AUTH_FORBIDDEN");
    }

    const data = await assessmentContentRepository.getAttemptQuestionsWithResponses(
      attemptId,
      languageCode
    );
    if (!data) {
      throw AppError.notFound("Assessment questions not found.", "QUESTIONS_NOT_FOUND");
    }

    return data;
  }

  /**
   * Saves a single response for the participant's active attempt.
   */
  async saveResponse(
    userId: string,
    attemptId: string,
    dto: SaveResponseDTO
  ): Promise<{ success: boolean; message: string }> {
    const attempt = await assessmentContentRepository.findAttemptById(attemptId);
    if (!attempt) {
      throw AppError.notFound("Assessment attempt not found.", "ATTEMPT_NOT_FOUND");
    }

    if (attempt.participant_id !== userId) {
      throw AppError.forbidden("Access denied to this assessment attempt.", "AUTH_FORBIDDEN");
    }

    if (attempt.status !== "IN_PROGRESS") {
      throw AppError.badRequest(
        "Cannot save responses to a completed or closed attempt.",
        "ATTEMPT_ALREADY_COMPLETED"
      );
    }

    await assessmentContentRepository.saveResponse(
      attemptId,
      dto.questionId,
      dto.selectedOptionId || null,
      dto.responseValue,
      0
    );

    return { success: true, message: "Response saved successfully." };
  }

  /**
   * Submits the assessment attempt, calculates scores dynamically, and stores the final result snapshot.
   */
  async submitAttempt(
    userId: string,
    attemptId: string,
    languageCode = "en"
  ): Promise<{ success: boolean; resultId: string; result: any }> {
    return scoringService.scoreAndFinalizeAttempt(userId, attemptId, languageCode);
  }

  /**
   * Retrieves result snapshot by attempt ID.
   */
  async getAttemptResult(
    userId: string,
    attemptId: string,
    languageCode = "en"
  ): Promise<any> {
    return scoringService.getResultByAttemptId(userId, attemptId, languageCode);
  }

  /**
   * Retrieves the participant's most recently completed assessment result.
   */
  async getLatestUserResult(userId: string, languageCode = "en"): Promise<any | null> {
    return scoringService.getLatestResultForUser(userId, languageCode);
  }

  /**
   * Starts a fresh retake attempt for an assessment.
   * Guarantees zero data loss for previous attempts/results and initiates a clean answer session.
   */
  async startRetakeAttempt(
    userId: string,
    assessmentCode = "SKILL_FINDER",
    versionCode?: string
  ): Promise<{
    attemptId: string;
    status: string;
    isNew: boolean;
    isRetake: boolean;
    attemptNumber?: number;
    versionCode?: string | null;
    versionName?: string | null;
  }> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw AppError.notFound("Participant user not found.", "AUTH_USER_NOT_FOUND");
    }

    const assessment =
      (await assessmentRepository.findByIdOrCode(assessmentCode)) ||
      (await assessmentRepository.findByCode("SKILL_FINDER"));

    if (!assessment) {
      throw AppError.notFound(`Assessment '${assessmentCode}' not found.`, "ASSESSMENT_NOT_FOUND");
    }

    // Resolve target version
    let targetVersion = versionCode
      ? await skillFinderQuestionSelectionService.getVersionByCode(assessment.id, versionCode)
      : await skillFinderQuestionSelectionService.getDefaultVersion(assessment.id);

    if (!targetVersion && !versionCode) {
      targetVersion = await skillFinderQuestionSelectionService.getVersionByCode(
        assessment.id,
        "STUDENT_STANDARD"
      );
    }

    const totalQuestions = targetVersion?.question_count || assessment.questionCount || 68;

    // Create brand new attempt
    const newAttempt = await assessmentContentRepository.createAttempt(
      userId,
      assessment.id,
      targetVersion?.id || null,
      totalQuestions
    );

    // Count all attempts for this participant to return accurate attemptNumber
    const countRes = await pool.query(
      `SELECT COUNT(*)::int as count FROM assessment_attempts WHERE participant_id = $1 AND assessment_id = $2`,
      [userId, assessment.id]
    );
    const attemptNumber = countRes.rows[0]?.count || 1;

    logger.info(
      {
        userId,
        assessmentCode: assessment.code,
        attemptId: newAttempt.id,
        attemptNumber,
        version: targetVersion?.version_code,
      },
      "Initiated fresh assessment retake attempt"
    );

    return {
      attemptId: newAttempt.id,
      status: newAttempt.status,
      isNew: true,
      isRetake: true,
      attemptNumber,
      versionCode: targetVersion?.version_code || null,
      versionName: targetVersion?.name || null,
    };
  }

  /**
   * Retrieves complete assessment attempt history timeline for a participant.
   */
  async getAssessmentHistory(userId: string, assessmentCode = "SKILL_FINDER"): Promise<{
    totalAttempts: number;
    history: any[];
  }> {
    const historyRows = await assessmentContentRepository.getAssessmentHistoryByStudent(
      userId,
      assessmentCode
    );

    const history = historyRows.map((row) => ({
      historyId: row.id,
      attemptId: row.attempt_id,
      resultId: row.result_id,
      attemptNumber: row.attempt_number,
      assessmentCode: row.assessment_code,
      assessmentName: row.assessment_name,
      profileType: row.profile_type,
      dimensionSummary: row.dimension_summary,
      completedDate: row.completed_date || row.created_at,
      startedAt: row.started_at,
      totalQuestions: row.total_questions,
      answeredCount: row.answered_count,
      summary: row.summary,
      profileConfidence: row.profile_confidence,
      confidenceMetrics: row.confidence_metrics,
    }));

    return {
      totalAttempts: history.length,
      history,
    };
  }

  /**
   * Compares two specific assessment results for growth analysis.
   */
  async compareResults(
    userId: string,
    oldResultId: string,
    newResultId: string,
    requestingRole = "PARTICIPANT"
  ): Promise<any> {
    const oldResult = await assessmentContentRepository.findResultById(oldResultId);
    const newResult = await assessmentContentRepository.findResultById(newResultId);

    if (!oldResult || !newResult) {
      throw AppError.notFound(
        "One or both assessment results specified for comparison were not found.",
        "RESULT_NOT_FOUND"
      );
    }

    // Security check: participant must own both results unless authorized staff
    if (
      requestingRole === "PARTICIPANT" &&
      (oldResult.participant_id !== userId || newResult.participant_id !== userId)
    ) {
      throw AppError.forbidden(
        "Access denied to compare these assessment results.",
        "AUTH_FORBIDDEN"
      );
    }

    return resultComparisonService.compareResults(oldResult.participant_id, oldResult, newResult);
  }

  /**
   * Compares the latest 2 completed attempts for a student for instant dashboard growth highlights.
   */
  async compareLatestResults(
    userId: string,
    assessmentCode = "SKILL_FINDER"
  ): Promise<{ hasComparison: boolean; comparison: any | null; message?: string }> {
    const latestTwo = await assessmentContentRepository.findLatestTwoResultsForUser(
      userId,
      assessmentCode
    );

    if (!latestTwo || latestTwo.length < 2) {
      return {
        hasComparison: false,
        comparison: null,
        message: "At least 2 completed assessment attempts are required to compute longitudinal growth tracking.",
      };
    }

    // latestTwo[0] is newest, latestTwo[1] is previous baseline
    const comparison = await resultComparisonService.compareResults(
      userId,
      latestTwo[1],
      latestTwo[0]
    );

    return {
      hasComparison: true,
      comparison,
    };
  }

  /**
   * Retrieves all completed assessment results for the participant.
   */
  async getAllUserResults(userId: string): Promise<any[]> {
    const results = await assessmentContentRepository.findAllResultsByUserId(userId);
    return results.map((r) => ({
      resultId: r.id,
      attemptId: r.attempt_id,
      assessmentCode: r.assessment_code,
      completedAt: r.completed_at || r.created_at,
      result: r.result_data,
    }));
  }
}

export const assessmentRunnerService = new AssessmentRunnerService();

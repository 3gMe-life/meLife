import { assessmentContentRepository } from "./assessment-content.repository";
import { assessmentRepository } from "./assessment.repository";
import { userRepository } from "../users/user.repository";
import { scoringService } from "../scoring/scoring.service";
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

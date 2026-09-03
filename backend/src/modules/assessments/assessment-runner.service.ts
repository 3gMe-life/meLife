import { assessmentContentRepository } from "./assessment-content.repository";
import { assessmentRepository } from "./assessment.repository";
import { userRepository } from "../users/user.repository";
import { skillFinderScoringService } from "./scoring/skill-finder-scoring.service";
import { AppError } from "../../common/errors/app-error";
import { logger } from "../../common/utils/logger";
import {
  AssessmentAttemptQuestionsResponseDTO,
  SaveResponseDTO,
  SkillFinderResultDTO,
} from "./assessment-runner.types";

export class AssessmentRunnerService {
  /**
   * Starts a new assessment attempt or resumes an existing in-progress attempt.
   */
  async startOrCreateAttempt(
    userId: string,
    assessmentCode: string
  ): Promise<{ attemptId: string; status: string; isNew: boolean }> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw AppError.notFound("Participant user not found.", "AUTH_USER_NOT_FOUND");
    }

    const assessment = await assessmentRepository.findByIdOrCode(assessmentCode);
    if (!assessment) {
      throw AppError.notFound(
        `Assessment '${assessmentCode}' not found.`,
        "ASSESSMENT_NOT_FOUND"
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
      };
    }

    // Create new attempt
    const newAttempt = await assessmentContentRepository.createAttempt(
      userId,
      assessment.id,
      assessment.questionCount || 104
    );

    logger.info(
      { userId, assessmentCode, attemptId: newAttempt.id },
      "Created new assessment attempt"
    );

    return {
      attemptId: newAttempt.id,
      status: newAttempt.status,
      isNew: true,
    };
  }

  /**
   * Retrieves sanitized questions with existing responses for the participant.
   */
  async getAttemptQuestions(
    userId: string,
    attemptId: string
  ): Promise<AssessmentAttemptQuestionsResponseDTO> {
    const attempt = await assessmentContentRepository.findAttemptById(attemptId);
    if (!attempt) {
      throw AppError.notFound("Assessment attempt not found.", "ATTEMPT_NOT_FOUND");
    }

    if (attempt.participant_id !== userId) {
      throw AppError.forbidden("Access denied to this assessment attempt.", "AUTH_FORBIDDEN");
    }

    const data = await assessmentContentRepository.getAttemptQuestionsWithResponses(attemptId);
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
   * Submits the assessment attempt, calculates scores, and stores the final result snapshot.
   */
  async submitAttempt(
    userId: string,
    attemptId: string
  ): Promise<{ success: boolean; resultId: string; result: SkillFinderResultDTO }> {
    const attempt = await assessmentContentRepository.findAttemptById(attemptId);
    if (!attempt) {
      throw AppError.notFound("Assessment attempt not found.", "ATTEMPT_NOT_FOUND");
    }

    if (attempt.participant_id !== userId) {
      throw AppError.forbidden("Access denied to this assessment attempt.", "AUTH_FORBIDDEN");
    }

    if (attempt.status === "COMPLETED") {
      // If already completed, return existing result snapshot
      const existing = await assessmentContentRepository.findResultByAttemptId(attemptId);
      if (existing) {
        return {
          success: true,
          resultId: existing.id,
          result: existing.result_data,
        };
      }
    }

    // Load all participant responses
    const rawResponses = await assessmentContentRepository.loadAttemptResponsesForScoring(attemptId);

    // Score Skill Finder
    const result = skillFinderScoringService.calculateResult(
      attemptId,
      userId,
      rawResponses
    );

    // Finalize attempt and persist snapshot
    const resultId = await assessmentContentRepository.finalizeAttemptAndSaveResult(
      attemptId,
      userId,
      attempt.assessment_code,
      result
    );

    logger.info(
      { userId, attemptId, resultId, code: attempt.assessment_code },
      "Assessment attempt finalized and result persisted successfully"
    );

    return {
      success: true,
      resultId,
      result,
    };
  }

  /**
   * Retrieves result snapshot by attempt ID.
   */
  async getAttemptResult(
    userId: string,
    attemptId: string
  ): Promise<SkillFinderResultDTO> {
    const attempt = await assessmentContentRepository.findAttemptById(attemptId);
    if (!attempt) {
      throw AppError.notFound("Assessment attempt not found.", "ATTEMPT_NOT_FOUND");
    }

    if (attempt.participant_id !== userId) {
      throw AppError.forbidden("Access denied to this assessment result.", "AUTH_FORBIDDEN");
    }

    const savedResult = await assessmentContentRepository.findResultByAttemptId(attemptId);
    if (!savedResult) {
      throw AppError.notFound("Assessment result not found.", "RESULT_NOT_FOUND");
    }

    return savedResult.result_data;
  }
}

export const assessmentRunnerService = new AssessmentRunnerService();

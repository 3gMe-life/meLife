import { assessmentContentRepository } from "../assessments/assessment-content.repository";
import { AppError } from "../../common/errors/app-error";
import { logger } from "../../common/utils/logger";
import {
  RawResponseItem,
  SkillFinderFullResultDTO,
} from "./scoring.types";
import { interestScoringEngine } from "./skill-finder/interest.scoring";
import { skillBehaviourScoringEngine } from "./skill-finder/skill-behaviour.scoring";
import { aptitudeScoringEngine } from "./skill-finder/aptitude.scoring";
import { developmentScoringEngine } from "./skill-finder/development.scoring";
import { profileGenerator } from "./skill-finder/profile.generator";

export class ScoringService {
  /**
   * Computes the complete psychometric result for a set of raw responses.
   * Version-agnostic: normalizes dynamically based on answered questions without hardcoded counts.
   */
  computeSkillFinderResult(
    attemptId: string,
    participantId: string,
    rawResponses: RawResponseItem[],
    options?: {
      versionCode?: string | null;
      versionName?: string | null;
      languageCode?: string;
    }
  ): SkillFinderFullResultDTO {
    const languageCode = options?.languageCode || "en";

    // Index responses by dimension_code and question_number
    const responsesByDimension: Record<string, RawResponseItem[]> = {};
    const responsesByQNum: Record<number, RawResponseItem> = {};

    for (const r of rawResponses) {
      const qNum = parseInt(String(r.question_number), 10);
      if (!isNaN(qNum)) {
        responsesByQNum[qNum] = r;
      }

      const dimCode = (r.dimension_code || "GENERAL").toUpperCase();
      if (!responsesByDimension[dimCode]) {
        responsesByDimension[dimCode] = [];
      }
      responsesByDimension[dimCode].push(r);
    }

    // 1. SECTION A: Interest Discovery (RIASEC)
    const interestResult = interestScoringEngine.calculate(responsesByDimension);

    // 2. SECTION B: Skill Behaviour
    const skillResult = skillBehaviourScoringEngine.calculate(responsesByDimension);

    // 3. SECTION C: Demonstrated Aptitude
    const aptitudeResult = aptitudeScoringEngine.calculate(responsesByDimension);

    // 4. SECTION D: Developmental Strengths & SECTION E: Response Quality
    const developmentalStrengths = developmentScoringEngine.calculateStrengths(responsesByDimension);
    const responseQuality = developmentScoringEngine.calculateQuality(responsesByQNum);

    // 5. Synthesis: Learning Profile Archetype, Exploration Directions, Growth Suggestions
    const learningProfile = profileGenerator.generateLearningProfile(
      interestResult,
      skillResult,
      languageCode
    );
    const explorationDirections = profileGenerator.generateExplorationDirections(
      interestResult,
      languageCode
    );
    const growthSuggestions = profileGenerator.generateGrowthSuggestions(
      interestResult,
      skillResult,
      languageCode
    );

    return {
      resultId: "",
      attemptId,
      participantId,
      assessmentCode: "SKILL_FINDER",
      assessmentName: "Skill Finder",
      versionCode: options?.versionCode || null,
      versionName: options?.versionName || null,
      language: languageCode,
      completedAt: new Date().toISOString(),
      learningProfile,
      responseQuality,
      interestDiscovery: interestResult,
      skillBehaviour: skillResult,
      demonstratedAptitude: aptitudeResult,
      developmentalStrengths,
      explorationDirections,
      growthSuggestions,
    };
  }

  /**
   * Finalizes and scores an assessment attempt.
   * Loads responses, scores constructs, persists result snapshot, and updates attempt state.
   */
  async scoreAndFinalizeAttempt(
    userId: string,
    attemptId: string,
    languageCode = "en"
  ): Promise<{ success: boolean; resultId: string; result: SkillFinderFullResultDTO }> {
    const attempt = await assessmentContentRepository.findAttemptById(attemptId);
    if (!attempt) {
      throw AppError.notFound("Assessment attempt not found.", "ATTEMPT_NOT_FOUND");
    }

    if (attempt.participant_id !== userId) {
      throw AppError.forbidden("Access denied to this assessment attempt.", "AUTH_FORBIDDEN");
    }

    if (attempt.status === "COMPLETED") {
      // Return existing snapshot if already scored
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
    if (!rawResponses || rawResponses.length === 0) {
      throw AppError.badRequest("Cannot score an attempt with no recorded answers.", "EMPTY_RESPONSES");
    }

    // Score constructs
    const result = this.computeSkillFinderResult(attemptId, userId, rawResponses, {
      versionCode: attempt.version_code,
      versionName: attempt.version_name,
      languageCode,
    });

    // Save snapshot in database
    const resultId = await assessmentContentRepository.finalizeAttemptAndSaveResult(
      attemptId,
      userId,
      attempt.assessment_code,
      result
    );

    result.resultId = resultId;

    logger.info(
      {
        userId,
        attemptId,
        resultId,
        code: attempt.assessment_code,
        archetype: result.learningProfile.archetypeTitle,
      },
      "Psychometric scoring completed and result snapshot persisted."
    );

    return {
      success: true,
      resultId,
      result,
    };
  }

  /**
   * Retrieves a student-safe psychometric result by attempt ID.
   */
  async getResultByAttemptId(
    userId: string,
    attemptId: string,
    languageCode = "en"
  ): Promise<SkillFinderFullResultDTO> {
    let savedResult = await assessmentContentRepository.findResultByAttemptId(attemptId);
    if (!savedResult) {
      // Check if attempt exists for this user and auto-score if it has answers
      const attempt = await assessmentContentRepository.findAttemptById(attemptId);
      if (attempt && attempt.participant_id === userId) {
        try {
          const scored = await this.scoreAndFinalizeAttempt(userId, attemptId, languageCode);
          return scored.result;
        } catch (scoreErr) {
          logger.warn({ scoreErr, userId, attemptId }, "Auto-scoring attempt on fetch failed or no answers submitted");
        }
      }
      throw AppError.notFound("Psychometric result report not found for this attempt.", "RESULT_NOT_FOUND");
    }

    if (savedResult.participant_id !== userId) {
      throw AppError.forbidden("Access denied to this assessment result.", "AUTH_FORBIDDEN");
    }

    const baseResult: SkillFinderFullResultDTO = savedResult.result_data;

    // Apply language localization on the fly if requested language is different
    if (languageCode && languageCode !== baseResult.language) {
      baseResult.learningProfile = profileGenerator.generateLearningProfile(
        baseResult.interestDiscovery,
        baseResult.skillBehaviour,
        languageCode
      );
      baseResult.explorationDirections = profileGenerator.generateExplorationDirections(
        baseResult.interestDiscovery,
        languageCode
      );
      baseResult.language = languageCode;
    }

    return baseResult;
  }

  /**
   * Retrieves a student-safe psychometric result by result ID.
   */
  async getResultById(
    userId: string,
    resultId: string,
    languageCode = "en"
  ): Promise<SkillFinderFullResultDTO> {
    let savedResult = await assessmentContentRepository.findResultById(resultId);
    if (!savedResult) {
      // Check if resultId was actually an attempt ID for this user
      const attempt = await assessmentContentRepository.findAttemptById(resultId);
      if (attempt && attempt.participant_id === userId) {
        try {
          const scored = await this.scoreAndFinalizeAttempt(userId, resultId, languageCode);
          return scored.result;
        } catch (scoreErr) {
          logger.warn({ scoreErr, userId, attemptId: resultId }, "Auto-scoring attempt on fetch failed or no answers submitted");
        }
      }
      throw AppError.notFound("Psychometric result not found.", "RESULT_NOT_FOUND");
    }

    if (savedResult.participant_id !== userId) {
      throw AppError.forbidden("Access denied to this assessment result.", "AUTH_FORBIDDEN");
    }

    const baseResult: SkillFinderFullResultDTO = savedResult.result_data;
    if (languageCode && languageCode !== baseResult.language) {
      baseResult.learningProfile = profileGenerator.generateLearningProfile(
        baseResult.interestDiscovery,
        baseResult.skillBehaviour,
        languageCode
      );
      baseResult.explorationDirections = profileGenerator.generateExplorationDirections(
        baseResult.interestDiscovery,
        languageCode
      );
      baseResult.language = languageCode;
    }

    return baseResult;
  }

  /**
   * Retrieves latest result for current participant.
   */
  async getLatestResultForUser(
    userId: string,
    languageCode = "en"
  ): Promise<SkillFinderFullResultDTO | null> {
    const savedResult = await assessmentContentRepository.findLatestResultByUserId(userId);
    if (!savedResult) {
      return null;
    }

    const baseResult: SkillFinderFullResultDTO = savedResult.result_data;
    if (languageCode && languageCode !== baseResult.language) {
      baseResult.learningProfile = profileGenerator.generateLearningProfile(
        baseResult.interestDiscovery,
        baseResult.skillBehaviour,
        languageCode
      );
      baseResult.explorationDirections = profileGenerator.generateExplorationDirections(
        baseResult.interestDiscovery,
        languageCode
      );
      baseResult.language = languageCode;
    }

    return baseResult;
  }
}

export const scoringService = new ScoringService();

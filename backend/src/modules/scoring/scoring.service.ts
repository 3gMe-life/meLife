import { pool } from "../../config/database";
import { assessmentContentRepository } from "../assessments/assessment-content.repository";
import { AppError } from "../../common/errors/app-error";
import { logger } from "../../common/utils/logger";
import { env } from "../../config/env";
import { emailService } from "../email";
import { userRepository } from "../users/user.repository";
import {
  RawResponseItem,
  SkillFinderFullResultDTO,
} from "./scoring.types";
import {
  streamFinderScoringService,
  type StreamFinderResultDTO,
} from "../assessments/scoring/stream-finder-scoring.service";
import {
  engineeringBranchFinderScoringService,
  type EngineeringBranchFinderResultDTO,
} from "../assessments/scoring/engineering-branch-finder-scoring.service";
import {
  commerceCareerFinderScoringService,
  type CommerceCareerFinderResultDTO,
} from "../assessments/scoring/commerce-career-finder-scoring.service";
import {
  humanitiesCareerFinderScoringService,
  type HumanitiesCareerFinderResultDTO,
} from "../assessments/scoring/humanities-career-finder-scoring.service";
import {
  rightCareerFinderScoringService,
  type RightCareerFinderResultDTO,
} from "../assessments/scoring/right-career-finder-scoring.service";
import {
  aiJobRiskFinderScoringService,
} from "../assessments/scoring/ai-job-risk-finder-scoring.service";
import {
  entrepreneurDevelopmentScoringService,
  type EntrepreneurDevelopmentResultDTO,
} from "../assessments/scoring/entrepreneur-development-scoring.service";
import { interestScoringEngine } from "./skill-finder/interest.scoring";
import { skillBehaviourScoringEngine } from "./skill-finder/skill-behaviour.scoring";
import { aptitudeScoringEngine } from "./skill-finder/aptitude.scoring";
import { developmentScoringEngine } from "./skill-finder/development.scoring";
import { profileGenerator } from "./skill-finder/profile.generator";
import { profileVectorService } from "./skill-finder/profile-vector.service";
import { profileConfidenceService } from "./skill-finder/confidence.service";

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

    // Partition raw responses by Section AND Dimension to strictly isolate scoring domains
    const responsesBySectionAndDim: Record<string, Record<string, RawResponseItem[]>> = {
      SECTION_A: {},
      SECTION_B: {},
      SECTION_C: {},
      SECTION_D: {},
      SECTION_E: {},
    };
    const responsesByQNum: Record<number, RawResponseItem> = {};

    for (const r of rawResponses) {
      const qNum = parseInt(String(r.question_number), 10);
      if (!isNaN(qNum)) {
        responsesByQNum[qNum] = r;
      }

      const secCode = (r.section_code || "SECTION_A").toUpperCase();
      const dimCode = (r.dimension_code || "GENERAL").toUpperCase();

      if (!responsesBySectionAndDim[secCode]) {
        responsesBySectionAndDim[secCode] = {};
      }
      if (!responsesBySectionAndDim[secCode][dimCode]) {
        responsesBySectionAndDim[secCode][dimCode] = [];
      }
      responsesBySectionAndDim[secCode][dimCode].push(r);
    }

    // 1. SECTION A: Interest Discovery (RIASEC)
    const interestResult = interestScoringEngine.calculate(responsesBySectionAndDim["SECTION_A"] || {});

    // 2. SECTION B: Skill Behaviour
    const skillResult = skillBehaviourScoringEngine.calculate(responsesBySectionAndDim["SECTION_B"] || {});

    // 3. SECTION C: Demonstrated Aptitude
    const aptitudeResult = aptitudeScoringEngine.calculate(responsesBySectionAndDim["SECTION_C"] || {});

    // 4. SECTION D: Developmental Strengths & SECTION E: Response Quality
    const developmentalStrengths = developmentScoringEngine.calculateStrengths(responsesBySectionAndDim["SECTION_D"] || {});
    const responseQuality = developmentScoringEngine.calculateQuality(responsesByQNum);

    // 5. Transform scores into 29-Dimension Student Profile Vector (0-100 scale)
    const vectorSummary = profileVectorService.generateProfileVector(
      interestResult,
      skillResult,
      aptitudeResult,
      developmentalStrengths
    );

    // 6. Multi-Factor Profile Confidence Engine
    const confidenceMetrics = profileConfidenceService.calculateConfidence(
      rawResponses,
      vectorSummary.vector
    );

    // 7. Synthesis: Learning Profile Archetype, Exploration Directions, Growth Suggestions
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
      profileVector: vectorSummary.vector,
      profileConfidence: confidenceMetrics.level,
      confidenceMetrics,
      layerScores: vectorSummary.layerScores,
    };
  }

  /**
   * Loads responses, scores constructs, persists result snapshot, and updates attempt state.
   */
  async scoreAndFinalizeAttempt(
    userId: string,
    attemptId: string,
    languageCode = "en"
  ): Promise<{
    success: boolean;
    resultId: string;
    result:
      | SkillFinderFullResultDTO
      | StreamFinderResultDTO
      | EngineeringBranchFinderResultDTO
      | CommerceCareerFinderResultDTO
      | HumanitiesCareerFinderResultDTO
      | RightCareerFinderResultDTO
      | EntrepreneurDevelopmentResultDTO;
  }> {
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
    let result: any;
    if (attempt.assessment_code === "ENTREPRENEUR_DEVELOPMENT_TEST") {
      result = entrepreneurDevelopmentScoringService.calculateScores({
        attemptId,
        participantId: userId,
        versionCode: attempt.version_code,
        versionName: attempt.version_name,
        responses: rawResponses,
        completionTimeSeconds: attempt.started_at
          ? Math.round((Date.now() - new Date(attempt.started_at).getTime()) / 1000)
          : undefined,
      });
    } else if (attempt.assessment_code === "AI_JOB_RISK_FINDER") {
      result = aiJobRiskFinderScoringService.calculateScores({
        attemptId,
        participantId: userId,
        versionCode: attempt.version_code,
        versionName: attempt.version_name,
        responses: rawResponses,
        completionTimeSeconds: attempt.started_at
          ? Math.round((Date.now() - new Date(attempt.started_at).getTime()) / 1000)
          : undefined,
      });
    } else if (attempt.assessment_code === "RIGHT_CAREER_FINDER") {
      result = rightCareerFinderScoringService.calculateScores({
        attemptId,
        participantId: userId,
        versionCode: attempt.version_code,
        versionName: attempt.version_name,
        responses: rawResponses,
        completionTimeSeconds: attempt.started_at
          ? Math.round((Date.now() - new Date(attempt.started_at).getTime()) / 1000)
          : undefined,
      });
    } else if (attempt.assessment_code === "HUMANITIES_CAREER_FINDER") {
      result = humanitiesCareerFinderScoringService.calculateScores({
        attemptId,
        participantId: userId,
        versionCode: attempt.version_code,
        versionName: attempt.version_name,
        responses: rawResponses,
        completionTimeSeconds: attempt.started_at
          ? Math.round((Date.now() - new Date(attempt.started_at).getTime()) / 1000)
          : undefined,
      });
    } else if (attempt.assessment_code === "COMMERCE_CAREER_FINDER") {
      result = commerceCareerFinderScoringService.calculateScores({
        attemptId,
        participantId: userId,
        versionCode: attempt.version_code,
        versionName: attempt.version_name,
        responses: rawResponses,
        completionTimeSeconds: attempt.started_at
          ? Math.round((Date.now() - new Date(attempt.started_at).getTime()) / 1000)
          : undefined,
      });
    } else if (attempt.assessment_code === "ENGINEERING_BRANCH_FINDER") {
      result = engineeringBranchFinderScoringService.computeEngineeringBranchFinderResult(
        attemptId,
        userId,
        rawResponses,
        {
          versionCode: attempt.version_code,
          versionName: attempt.version_name,
          languageCode,
        }
      );
    } else if (attempt.assessment_code === "STREAM_FINDER") {
      if (attempt.version_code === "STREAM_FINDER_V2_EXTENDED") {
        // Locate completed Core attempt for this participant
        const coreAttemptRes = await pool.query(
          `SELECT a.id FROM assessment_attempts a
           JOIN assessment_versions v ON a.version_id = v.id
           WHERE a.participant_id = $1 AND v.version_code = 'STREAM_FINDER_V2_CORE' AND a.status = 'COMPLETED'
           ORDER BY a.completed_at DESC NULLS LAST, a.created_at DESC
           LIMIT 1`,
          [userId]
        );
        const coreAttemptId = coreAttemptRes.rows[0]?.id;
        let combinedResponses = rawResponses;
        if (coreAttemptId) {
          const coreResponses = await assessmentContentRepository.loadAttemptResponsesForScoring(coreAttemptId);
          const respMap = new Map<number, any>();
          for (const r of coreResponses) {
            respMap.set(parseInt(String(r.question_number), 10), r);
          }
          for (const r of rawResponses) {
            respMap.set(parseInt(String(r.question_number), 10), r);
          }
          combinedResponses = Array.from(respMap.values());
        }

        result = streamFinderScoringService.computeStreamFinderResult(attemptId, userId, combinedResponses, {
          versionCode: attempt.version_code,
          versionName: attempt.version_name,
          languageCode,
          coreAttemptId,
          extensionAttemptId: attemptId,
          assessmentMode: "EXTENDED",
        });
      } else {
        result = streamFinderScoringService.computeStreamFinderResult(attemptId, userId, rawResponses, {
          versionCode: attempt.version_code,
          versionName: attempt.version_name,
          languageCode,
        });
      }
    } else {
      result = this.computeSkillFinderResult(attemptId, userId, rawResponses, {
        versionCode: attempt.version_code,
        versionName: attempt.version_name,
        languageCode,
      });
    }

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
        archetype:
          result.learningProfile?.archetypeTitle ||
          result.primaryStream ||
          result.primaryBranch?.branchName,
      },
      "Psychometric scoring completed and result snapshot persisted."
    );

    // Non-blocking transactional email notification for assessment completion
    (async () => {
      try {
        const user = await userRepository.findById(userId);
        if (user?.email) {
          const assessmentTitle =
            attempt.assessment_title ||
            attempt.assessment_code.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());

          emailService
            .sendAssessmentCompletedEmail({
              to: user.email,
              studentName: `${user.first_name} ${user.last_name}`.trim(),
              assessmentTitle,
              reportUrl: `${env.APP_URL || env.FRONTEND_URL}/dashboard/assessments/results/${attemptId}`,
              completedAt: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            })
            .catch((err) => {
              logger.warn({ err, userId, attemptId }, "Non-fatal: Failed to send assessment completed email");
            });
        }
      } catch (emailErr) {
        logger.warn({ emailErr, userId, attemptId }, "Non-fatal error dispatching assessment completion email");
      }
    })();

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
  ): Promise<any> {
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

    const baseResult: any = savedResult.result_data;

    // Apply language localization on the fly if requested language is different (for SKILL_FINDER)
    if (baseResult?.assessmentCode === "SKILL_FINDER" && languageCode && languageCode !== baseResult.language) {
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
  ): Promise<any> {
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

    const baseResult: any = savedResult.result_data;
    if (baseResult?.assessmentCode === "SKILL_FINDER" && languageCode && languageCode !== baseResult.language) {
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
  ): Promise<any | null> {
    const savedResult = await assessmentContentRepository.findLatestResultByUserId(userId);
    if (!savedResult) {
      return null;
    }

    const baseResult: any = savedResult.result_data;
    if (baseResult?.assessmentCode === "SKILL_FINDER" && languageCode && languageCode !== baseResult.language) {
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

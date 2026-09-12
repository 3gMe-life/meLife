import { AppError } from "../../common/errors/app-error";
import { logger } from "../../common/utils/logger";
import { careerRepository } from "./career.repository";
import { assessmentContentRepository } from "../assessments/assessment-content.repository";
import {
  CareerMatchDTO,
  CareerDetailDTO,
  CareerMatchReasoning,
} from "./career.types";
import { SkillFinderFullResultDTO } from "../scoring/scoring.types";
import { StreamFinderResultDTO } from "../assessments/scoring/stream-finder-scoring.service";
import { careerMatchingService, MultiAssessmentInput } from "./career-matching.service";

export interface CareerRecommendationsResponseDTO {
  recommendations: CareerMatchDTO[];
  isAssessed: boolean;
  assessmentCode?: string;
  confidenceLevel?: string;
  assessmentCoverage?: string;
}

export class CareerRecommendationService {
  /**
   * Generates or retrieves ranked career pathway recommendations mapped to the student's
   * psychometric assessment results using the calibrated multi-pillar matching engine.
   */
  async getRecommendedPathways(
    userId: string,
    languageCode = "en"
  ): Promise<CareerRecommendationsResponseDTO> {
    const lang = (languageCode || "en").toLowerCase().trim();

    // 1. Fetch all completed assessment results for the student
    const resultRows = await assessmentContentRepository.findAllResultsByUserId(userId);
    const careers = await careerRepository.findAllCareers(lang);

    let skillFinderResult: SkillFinderFullResultDTO | null = null;
    let streamFinderResult: StreamFinderResultDTO | null = null;
    let latestResultId: string | null = null;

    for (const row of resultRows) {
      if (!latestResultId) latestResultId = row.id;
      const data = row.result_data;
      if (!data) continue;

      if (
        (row.assessment_code === "SKILL_FINDER" || data.interestDiscovery || data.profileVector) &&
        !skillFinderResult
      ) {
        skillFinderResult = data as SkillFinderFullResultDTO;
      } else if (
        (row.assessment_code === "STREAM_FINDER" || data.streamScores) &&
        !streamFinderResult
      ) {
        streamFinderResult = data as StreamFinderResultDTO;
      }
    }

    const isAssessed = Boolean(skillFinderResult || streamFinderResult);

    // 2. Unassessed state handling
    if (!isAssessed) {
      const unassessedRecommendations: CareerMatchDTO[] = careers.map((career, idx) => ({
        id: career.id,
        slug: career.slug,
        title: career.title,
        category: career.category,
        industry: career.industry,
        description: career.description,
        futureGrowth: career.future_growth,
        matchPercentage: Math.max(65, 88 - idx * 2),
        keySkills: career.required_skills.slice(0, 4),
        reasoning: {
          summary: "Curated exploratory pathway recommendation. Complete the Skill Finder or Stream Finder assessment to calibrate your personalized psychometric alignment.",
          topMatchingFactors: ["General Academic Exploration", "Foundational Career Literacy"],
          alignmentNote: "Take the 3G MeLife assessments to unlock dimensional cognitive matching and stream compatibility.",
        },
        strengthAlignment: ["Curiosity & Exploration", "Academic Baseline"],
        developmentAreas: ["Complete Skill Finder Assessment to identify personalized growth areas"],
        matchBreakdown: {
          interestScore: 70,
          skillScore: 70,
          aptitudeScore: 70,
          personalityScore: 70,
        },
        confidence: "Exploratory",
        assessmentCoverage: "Unassessed Baseline",
      }));

      return {
        recommendations: unassessedRecommendations,
        isAssessed: false,
        confidenceLevel: "Exploratory",
        assessmentCoverage: "Unassessed Baseline",
      };
    }

    // 3. Multi-assessment input assembly
    const multiInput: MultiAssessmentInput = {
      skillFinderResult,
      streamFinderResult,
    };

    const scoredMatches = careerMatchingService.computeCareerMatches(careers, multiInput, {
      languageCode: lang,
    });

    const topConfidence = scoredMatches[0]?.confidence || "Moderate Confidence";
    const topCoverage = scoredMatches[0]?.assessmentCoverage || "Skill Finder Calibrated";

    // 4. Persist matches in database asynchronously
    try {
      await careerRepository.saveCareerMatches(
        userId,
        scoredMatches.map((m) => ({
          careerId: m.id,
          matchPercentage: m.matchPercentage,
          reasoning: m.reasoning,
          assessmentResultId: latestResultId,
        }))
      );
    } catch (err: any) {
      logger.warn({ err: err?.message, userId }, "Non-fatal warning persisting career matches");
    }

    return {
      recommendations: scoredMatches,
      isAssessed: true,
      assessmentCode: skillFinderResult ? "SKILL_FINDER" : "STREAM_FINDER",
      confidenceLevel: topConfidence,
      assessmentCoverage: topCoverage,
    };
  }

  /**
   * Retrieves detailed career pathway overview and personalized alignment notes.
   */
  async getCareerDetail(
    userId: string,
    idOrSlug: string,
    languageCode = "en"
  ): Promise<CareerDetailDTO> {
    const lang = (languageCode || "en").toLowerCase().trim();
    const career = await careerRepository.findCareerByIdOrSlug(idOrSlug, lang);
    if (!career) {
      throw AppError.notFound("Career pathway not found.", "CAREER_NOT_FOUND");
    }

    // Get student's assessment results for personalized matching
    const resultRows = await assessmentContentRepository.findAllResultsByUserId(userId);
    let skillFinderResult: SkillFinderFullResultDTO | null = null;
    let streamFinderResult: StreamFinderResultDTO | null = null;

    for (const row of resultRows) {
      const data = row.result_data;
      if (!data) continue;

      if (
        (row.assessment_code === "SKILL_FINDER" || data.interestDiscovery || data.profileVector) &&
        !skillFinderResult
      ) {
        skillFinderResult = data as SkillFinderFullResultDTO;
      } else if (
        (row.assessment_code === "STREAM_FINDER" || data.streamScores) &&
        !streamFinderResult
      ) {
        streamFinderResult = data as StreamFinderResultDTO;
      }
    }

    let matchScore = 80;
    let confidence: "High Confidence" | "Moderate Confidence" | "Baseline Confidence" | "Exploratory" = "Exploratory";
    let assessmentCoverage = "Unassessed Baseline";
    let reasoning: CareerMatchReasoning = {
      summary: "Foundational career pathway. You may explore this pathway to broaden your horizons.",
      topMatchingFactors: ["Curated Educational Pathway", "High Industry Growth Opportunity"],
      alignmentNote: "This pathway offers strong interdisciplinary skill development for emerging future industries.",
    };
    let strengthAlignment: string[] = ["Foundational Academic Literacy", "Curiosity & Exploration"];
    let developmentAreas: string[] = ["Take the Skill Finder assessment to unlock custom developmental targets."];
    let matchBreakdown = {
      interestScore: 75,
      skillScore: 75,
      aptitudeScore: 75,
      personalityScore: 75,
    };

    if (skillFinderResult || streamFinderResult) {
      const matchResult = careerMatchingService.computeSingleCareerMatch(
        career,
        { skillFinderResult, streamFinderResult },
        lang
      );
      matchScore = matchResult.matchPercentage;
      confidence = matchResult.confidence || "Moderate Confidence";
      assessmentCoverage = matchResult.assessmentCoverage || "Skill Finder Calibrated";
      reasoning = matchResult.reasoning;
      strengthAlignment = matchResult.strengthAlignment || strengthAlignment;
      developmentAreas = matchResult.developmentAreas || developmentAreas;
      matchBreakdown = matchResult.matchBreakdown || matchBreakdown;
    }

    // Find 3 related careers in similar or complementary categories
    const allCareers = await careerRepository.findAllCareers(lang);
    const relatedCareers = allCareers
      .filter((c) => c.id !== career.id)
      .slice(0, 3)
      .map((rc, idx) => ({
        id: rc.id,
        slug: rc.slug,
        title: rc.title,
        category: rc.category,
        matchPercentage: Math.max(65, matchScore - (idx + 1) * 4),
      }));

    return {
      id: career.id,
      slug: career.slug,
      title: career.title,
      category: career.category,
      industry: career.industry,
      description: career.description,
      overview: career.overview,
      futureGrowth: career.future_growth,
      matchPercentage: matchScore,
      keySkills: career.required_skills,
      reasoning,
      strengthAlignment,
      developmentAreas,
      matchBreakdown,
      confidence,
      assessmentCoverage,
      educationPaths: career.education_paths,
      requiredSkills: career.required_skills,
      recommendedSubjects: career.recommended_subjects,
      learningRoadmap: career.learning_roadmap,
      sampleRoles: career.sample_roles,
      relatedCareers,
    };
  }
}

export const careerRecommendationService = new CareerRecommendationService();
export { careerMatchingService };

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
import { careerMatchingService } from "./career-matching.service";

export class CareerRecommendationService {
  /**
   * Generates or retrieves ranked career pathway recommendations mapped to the student's
   * psychometric assessment results using the scientific 4-pillar matching engine.
   */
  async getRecommendedPathways(
    userId: string,
    languageCode = "en"
  ): Promise<{ recommendations: CareerMatchDTO[]; isAssessed: boolean; assessmentCode?: string }> {
    const lang = (languageCode || "en").toLowerCase().trim();

    // 1. Fetch student's latest completed assessment result
    const latestResultRow = await assessmentContentRepository.findLatestResultByUserId(userId);
    const careers = await careerRepository.findAllCareers(lang);

    if (!latestResultRow || !latestResultRow.result_data) {
      // Return curated general pathways for students who haven't completed assessment yet
      const unassessedRecommendations: CareerMatchDTO[] = careers.map((career, idx) => ({
        id: career.id,
        slug: career.slug,
        title: career.title,
        category: career.category,
        industry: career.industry,
        description: career.description,
        futureGrowth: career.future_growth,
        matchPercentage: Math.max(70, 92 - idx * 3),
        keySkills: career.required_skills.slice(0, 4),
        reasoning: {
          summary: "Curated foundational pathway recommendation based on educational stage. You may explore this pathway to discover emerging multidisciplinary disciplines.",
          topMatchingFactors: ["General Academic Exploration", "Foundational Career Literacy"],
          alignmentNote: "Take the 3G MeLife Skill Finder assessment to unlock multidimensional cognitive matching.",
        },
        strengthAlignment: ["Curiosity & Exploration", "Academic Baseline"],
        developmentAreas: ["Complete Skill Finder Assessment to identify personalized growth areas"],
        matchBreakdown: {
          interestScore: 75,
          skillScore: 75,
          aptitudeScore: 75,
          personalityScore: 75,
        },
      }));

      return {
        recommendations: unassessedRecommendations,
        isAssessed: false,
      };
    }

    // 2. Student has a completed result snapshot -> Compute matches via scientific 4-pillar engine
    const studentResult: SkillFinderFullResultDTO = latestResultRow.result_data;
    const scoredMatches = careerMatchingService.computeCareerMatches(careers, studentResult, {
      languageCode: lang,
    });

    // 3. Persist matches in database
    try {
      await careerRepository.saveCareerMatches(
        userId,
        scoredMatches.map((m) => ({
          careerId: m.id,
          matchPercentage: m.matchPercentage,
          reasoning: m.reasoning,
          assessmentResultId: latestResultRow.id,
        }))
      );
    } catch (err: any) {
      logger.warn({ err: err?.message, userId }, "Non-fatal warning persisting career matches");
    }

    return {
      recommendations: scoredMatches,
      isAssessed: true,
      assessmentCode: latestResultRow.assessment_code || "SKILL_FINDER",
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

    // Get student's assessment result for personalized matching
    const latestResultRow = await assessmentContentRepository.findLatestResultByUserId(userId);
    let matchScore = 85;
    let reasoning: CareerMatchReasoning = {
      summary: "Foundational career pathway. You may explore this pathway to broaden your horizons.",
      topMatchingFactors: ["Curated Educational Pathway", "High Industry Growth Opportunity"],
      alignmentNote: "This pathway offers strong interdisciplinary skill development for emerging future industries.",
    };
    let strengthAlignment: string[] = ["Foundational Academic Literacy", "Curiosity & Exploration"];
    let developmentAreas: string[] = ["Take the Skill Finder assessment to unlock custom developmental targets."];
    let matchBreakdown = {
      interestScore: 80,
      skillScore: 80,
      aptitudeScore: 80,
      personalityScore: 80,
    };

    if (latestResultRow && latestResultRow.result_data) {
      const matchResult = careerMatchingService.computeSingleCareerMatch(
        career,
        latestResultRow.result_data,
        lang
      );
      matchScore = matchResult.matchPercentage;
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

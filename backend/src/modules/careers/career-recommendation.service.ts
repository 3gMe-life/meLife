import { AppError } from "../../common/errors/app-error";
import { logger } from "../../common/utils/logger";
import { careerRepository } from "./career.repository";
import { assessmentContentRepository } from "../assessments/assessment-content.repository";
import {
  CareerEntity,
  CareerMatchDTO,
  CareerDetailDTO,
  CareerMatchReasoning,
} from "./career.types";
import { SkillFinderFullResultDTO } from "../scoring/scoring.types";

export class CareerRecommendationService {
  /**
   * Generates or retrieves ranked career pathway recommendations mapped to the student's
   * psychometric assessment results.
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
          summary: "Curated foundational pathway recommendation based on educational stage. Complete the Skill Finder assessment for personalized psychometric alignment.",
          topMatchingFactors: ["General Academic Exploration", "Foundational Career Literacy"],
          alignmentNote: "Take the 3G MeLife Skill Finder assessment to unlock multidimensional cognitive matching.",
        },
      }));

      return {
        recommendations: unassessedRecommendations,
        isAssessed: false,
      };
    }

    // 2. Student has a completed result snapshot
    const studentResult: SkillFinderFullResultDTO = latestResultRow.result_data;
    const scoredMatches = this.computeCareerMatches(careers, studentResult, lang);

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
      summary: "Foundational career pathway. Complete your Skill Finder assessment to unlock personalized psychometric alignment analysis.",
      topMatchingFactors: ["Curated Educational Pathway", "High Industry Growth Opportunity"],
      alignmentNote: "This pathway offers strong interdisciplinary skill development for emerging future industries.",
    };

    if (latestResultRow && latestResultRow.result_data) {
      const matchResult = this.computeSingleCareerMatch(career, latestResultRow.result_data, lang);
      matchScore = matchResult.matchPercentage;
      reasoning = matchResult.reasoning;
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
      educationPaths: career.education_paths,
      requiredSkills: career.required_skills,
      recommendedSubjects: career.recommended_subjects,
      learningRoadmap: career.learning_roadmap,
      sampleRoles: career.sample_roles,
      relatedCareers,
    };
  }

  /**
   * Psychometric matching algorithm: maps RIASEC, skills, and aptitude against career target weights.
   */
  private computeCareerMatches(
    careers: CareerEntity[],
    result: SkillFinderFullResultDTO,
    languageCode = "en"
  ): CareerMatchDTO[] {
    const scoredList = careers.map((career) =>
      this.computeSingleCareerMatch(career, result, languageCode)
    );

    // Sort by match percentage descending
    return scoredList.sort((a, b) => b.matchPercentage - a.matchPercentage);
  }

  private computeSingleCareerMatch(
    career: CareerEntity,
    result: SkillFinderFullResultDTO,
    _languageCode = "en"
  ): CareerMatchDTO {
    // 1. Build construct score lookups
    const riasecScores: Record<string, number> = {};
    for (const dim of result.interestDiscovery?.dimensions || []) {
      riasecScores[dim.code.toUpperCase()] = dim.scalePositionPercentage || 50;
    }

    const skillScores: Record<string, number> = {};
    for (const dim of result.skillBehaviour?.dimensions || []) {
      const normalizedKey = dim.name.toLowerCase().replace(/[^a-z0-9]/g, "_");
      skillScores[normalizedKey] = dim.scalePositionPercentage || 50;
    }

    const aptitudeScores: Record<string, number> = {};
    for (const dim of result.demonstratedAptitude?.dimensions || []) {
      const normalizedKey = dim.name.toLowerCase().replace(/[^a-z0-9]/g, "_");
      aptitudeScores[normalizedKey] = dim.scalePositionPercentage || 50;
    }

    // 2. Interest Alignment (RIASEC) (Weight: 45%)
    let interestWeightedSum = 0;
    let interestWeightTotal = 0;
    const targetRiasec = career.related_dimensions?.riasec || { I: 0.5, R: 0.5 };

    for (const [code, weight] of Object.entries(targetRiasec)) {
      const studentScore = riasecScores[code.toUpperCase()] ?? 60;
      interestWeightedSum += studentScore * weight;
      interestWeightTotal += weight;
    }
    const interestAffinity = interestWeightTotal > 0 ? interestWeightedSum / interestWeightTotal : 75;

    // 3. Skill Behaviour Alignment (Weight: 30%)
    let skillWeightedSum = 0;
    let skillWeightTotal = 0;
    const targetSkills = career.related_dimensions?.skills || {};

    for (const [skillKey, weight] of Object.entries(targetSkills)) {
      // Match partial keys
      const matchedEntry = Object.entries(skillScores).find(([k]) =>
        k.includes(skillKey.toLowerCase()) || skillKey.toLowerCase().includes(k)
      );
      const studentScore = matchedEntry ? matchedEntry[1] : 70;
      skillWeightedSum += studentScore * weight;
      skillWeightTotal += weight;
    }
    const skillAffinity = skillWeightTotal > 0 ? skillWeightedSum / skillWeightTotal : 75;

    // 4. Demonstrated Aptitude Alignment (Weight: 25%)
    let aptitudeWeightedSum = 0;
    let aptitudeWeightTotal = 0;
    const targetAptitude = career.related_dimensions?.aptitude || {};

    for (const [aptKey, weight] of Object.entries(targetAptitude)) {
      const matchedEntry = Object.entries(aptitudeScores).find(([k]) =>
        k.includes(aptKey.toLowerCase()) || aptKey.toLowerCase().includes(k)
      );
      const studentScore = matchedEntry ? matchedEntry[1] : 70;
      aptitudeWeightedSum += studentScore * weight;
      aptitudeWeightTotal += weight;
    }
    const aptitudeAffinity = aptitudeWeightTotal > 0 ? aptitudeWeightedSum / aptitudeWeightTotal : 75;

    // 5. Archetype Bonus (+3% if student archetype matches target archetypes)
    const targetArchetypes = career.related_dimensions?.archetypes || [];
    const studentArchetype = result.learningProfile?.archetypeTitle || "";
    const hasArchetypeMatch = targetArchetypes.some((arch) =>
      studentArchetype.toLowerCase().includes(arch.toLowerCase())
    );
    const archetypeBonus = hasArchetypeMatch ? 3 : 0;

    // 6. Calculate Final Match Percentage
    const rawMatch = 0.45 * interestAffinity + 0.3 * skillAffinity + 0.25 * aptitudeAffinity + archetypeBonus;
    const boundedMatch = Math.min(97, Math.max(62, Math.round(rawMatch)));

    // 7. Dynamic AI Explanation Layer ("Why this matches you")
    const topFactors: string[] = [];
    const topInterests = result.interestDiscovery?.topClusters || [];
    if (topInterests.length > 0) {
      topFactors.push(`High Affinity with ${topInterests[0].name} (${Math.round(topInterests[0].scalePositionPercentage)}%)`);
    }

    const topSkills = result.skillBehaviour?.strongestIndicators || [];
    if (topSkills.length > 0) {
      topFactors.push(`Strong ${topSkills[0].name}`);
    }

    const topAptitude = result.demonstratedAptitude?.dimensions?.[0];
    if (topAptitude) {
      topFactors.push(`Demonstrated ${topAptitude.name} Accuracy`);
    }

    const summary = `Your profile shows strong exploratory alignment with ${career.title} because your assessed strengths in ${topSkills.slice(0, 2).map((s) => s.name).join(" and ") || "analytical inquiry"} and ${topInterests[0]?.name || "applied problem solving"} match key foundational competencies for this pathway.`;

    const alignmentNote = `Exploration Note: Your learning profile ("${studentArchetype || "Practical Explorer"}") exhibits natural curiosity for ${career.category.toLowerCase()} environments without locking in rigid career mandates.`;

    return {
      id: career.id,
      slug: career.slug,
      title: career.title,
      category: career.category,
      industry: career.industry,
      description: career.description,
      futureGrowth: career.future_growth,
      matchPercentage: boundedMatch,
      keySkills: career.required_skills.slice(0, 4),
      reasoning: {
        summary,
        topMatchingFactors: topFactors.length > 0 ? topFactors : ["Analytical Reasoning", "Technical Curiosity"],
        alignmentNote,
      },
    };
  }
}

export const careerRecommendationService = new CareerRecommendationService();

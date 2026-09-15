import { AppError } from "../../common/errors/app-error";
import { logger } from "../../common/utils/logger";
import { careerRepository } from "./career.repository";
import { assessmentContentRepository } from "../assessments/assessment-content.repository";
import {
  CareerMatchDTO,
  CareerDetailDTO,
  CareerTier,
  CareerDomainSummary,
} from "./career.types";
import { SkillFinderFullResultDTO } from "../scoring/scoring.types";
import { StreamFinderResultDTO } from "../assessments/scoring/stream-finder-scoring.service";
import { RightCareerFinderResultDTO } from "../assessments/scoring/right-career-finder-scoring.service";
import { CommerceCareerFinderResultDTO } from "../assessments/scoring/commerce-career-finder-scoring.service";
import { HumanitiesCareerFinderResultDTO } from "../assessments/scoring/humanities-career-finder-scoring.service";
import { EngineeringBranchFinderResultDTO } from "../assessments/scoring/engineering-branch-finder-scoring.service";
import { careerMatchingService, MultiAssessmentInput } from "./career-matching.service";

export interface GetRecommendedPathwaysOptions {
  languageCode?: string;
  tier?: CareerTier | "ALL";
  domainCode?: string;
  familyCode?: string;
  clusterCode?: string;
  search?: string;
  page?: number;
  limit?: number;
  viewAll?: boolean;
}

export interface CareerRecommendationsResponseDTO {
  recommendations: CareerMatchDTO[];
  primaryRecommendations: CareerMatchDTO[];
  secondaryRecommendations: CareerMatchDTO[];
  exploreFurtherRecommendations: CareerMatchDTO[];
  domainSummaries: CareerDomainSummary[];
  totalCount: number;
  isAssessed: boolean;
  assessmentCode?: string;
  completedAssessments: string[];
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
    options: GetRecommendedPathwaysOptions | string = "en"
  ): Promise<CareerRecommendationsResponseDTO> {
    const opts: GetRecommendedPathwaysOptions =
      typeof options === "string" ? { languageCode: options } : options;
    const lang = (opts.languageCode || "en").toLowerCase().trim();

    // 1. Fetch all completed assessment results for the student
    const resultRows = await assessmentContentRepository.findAllResultsByUserId(userId);
    const careers = await careerRepository.findAllCareers(lang);

    let skillFinderResult: SkillFinderFullResultDTO | null = null;
    let streamFinderResult: StreamFinderResultDTO | null = null;
    let rightCareerFinderResult: RightCareerFinderResultDTO | null = null;
    let commerceCareerFinderResult: CommerceCareerFinderResultDTO | null = null;
    let humanitiesCareerFinderResult: HumanitiesCareerFinderResultDTO | null = null;
    let engineeringBranchFinderResult: EngineeringBranchFinderResultDTO | null = null;
    let latestResultId: string | null = null;
    const completedAssessments: string[] = [];

    for (const row of resultRows) {
      if (!latestResultId) latestResultId = row.id;
      const data = row.result_data;
      if (!data) continue;

      const code = row.assessment_code;
      if (
        (code === "SKILL_FINDER" || data.interestDiscovery || data.profileVector) &&
        !skillFinderResult
      ) {
        skillFinderResult = data as SkillFinderFullResultDTO;
        if (!completedAssessments.includes("SKILL_FINDER")) completedAssessments.push("SKILL_FINDER");
      } else if (
        (code === "STREAM_FINDER" || data.streamScores) &&
        !streamFinderResult
      ) {
        streamFinderResult = data as StreamFinderResultDTO;
        if (!completedAssessments.includes("STREAM_FINDER")) completedAssessments.push("STREAM_FINDER");
      } else if (
        (code === "RIGHT_CAREER_FINDER" || code === "CAREER_FINDER" || data.familyScores?.TECH_COMPUTING_AI) &&
        !rightCareerFinderResult
      ) {
        rightCareerFinderResult = data as RightCareerFinderResultDTO;
        if (!completedAssessments.includes("RIGHT_CAREER_FINDER")) completedAssessments.push("RIGHT_CAREER_FINDER");
      } else if (
        (code === "COMMERCE_CAREER_FINDER" || data.familyScores?.ACCOUNTING_AUDIT_TAX) &&
        !commerceCareerFinderResult
      ) {
        commerceCareerFinderResult = data as CommerceCareerFinderResultDTO;
        if (!completedAssessments.includes("COMMERCE_CAREER_FINDER")) completedAssessments.push("COMMERCE_CAREER_FINDER");
      } else if (
        (code === "HUMANITIES_CAREER_FINDER" || data.familyScores?.HUMAN_BEHAVIOUR_WELLBEING) &&
        !humanitiesCareerFinderResult
      ) {
        humanitiesCareerFinderResult = data as HumanitiesCareerFinderResultDTO;
        if (!completedAssessments.includes("HUMANITIES_CAREER_FINDER")) completedAssessments.push("HUMANITIES_CAREER_FINDER");
      } else if (
        (code === "ENGINEERING_BRANCH_FINDER" || data.branchScores?.CSE) &&
        !engineeringBranchFinderResult
      ) {
        engineeringBranchFinderResult = data as EngineeringBranchFinderResultDTO;
        if (!completedAssessments.includes("ENGINEERING_BRANCH_FINDER")) completedAssessments.push("ENGINEERING_BRANCH_FINDER");
      }
    }

    const isAssessed = completedAssessments.length > 0;

    // 2. Unassessed state handling
    if (!isAssessed) {
      const unassessedRecommendations: CareerMatchDTO[] = careers.map((career, idx) => {
        let tier: CareerTier = "EXPLORE_FURTHER";
        if (idx < 4) tier = "PRIMARY";
        else if (idx < 12) tier = "SECONDARY";

        return {
          id: career.id,
          careerCode: career.career_code,
          slug: career.slug,
          title: career.title,
          shortTitle: career.short_title,
          category: career.category,
          industry: career.industry,
          domainCode: career.domain_code,
          domainName: career.domain_name,
          familyCode: career.family_code,
          familyName: career.family_name,
          clusterCode: career.cluster_code,
          clusterName: career.cluster_name,
          specialization: career.specialization,
          growthCategory: career.growth_category,
          educationLevel: career.education_level,
          isEmerging: career.is_emerging,
          description: career.description,
          futureGrowth: career.future_growth,
          matchPercentage: Math.max(65, 88 - idx * 2),
          tier,
          keySkills: career.required_skills ? career.required_skills.slice(0, 4) : [],
          reasoning: {
            summary: "Curated exploratory pathway recommendation. Complete a 3G MeLife assessment to calibrate your personalized psychometric alignment.",
            topMatchingFactors: ["General Academic Exploration", "Foundational Career Literacy"],
            alignmentNote: "Take the 3G MeLife assessments to unlock dimensional cognitive matching, stream compatibility, and driver construct insights.",
          },
          driverConstructs: [
            {
              constructCode: "FOUNDATIONAL_EXPLORATION",
              constructName: "Exploratory Alignment",
              normalizedScore: 75,
              weight: 0.8,
              rationale: "Broad exploration based on future industry growth trends.",
            },
          ],
          strengthAlignment: ["Curiosity & Exploration", "Academic Baseline"],
          developmentAreas: ["Complete MeLife Assessment to identify personalized growth areas"],
          matchBreakdown: {
            interestScore: 70,
            skillScore: 70,
            aptitudeScore: 70,
            personalityScore: 70,
          },
          confidence: "Exploratory",
          assessmentCoverage: "Unassessed Baseline",
        };
      });

      const domainMap = this.buildDomainSummaries(unassessedRecommendations);

      return {
        recommendations: unassessedRecommendations.slice(0, opts.viewAll ? undefined : 12),
        primaryRecommendations: unassessedRecommendations.filter((m) => m.tier === "PRIMARY"),
        secondaryRecommendations: unassessedRecommendations.filter((m) => m.tier === "SECONDARY"),
        exploreFurtherRecommendations: unassessedRecommendations.filter((m) => m.tier === "EXPLORE_FURTHER"),
        domainSummaries: domainMap,
        totalCount: unassessedRecommendations.length,
        isAssessed: false,
        completedAssessments: [],
        confidenceLevel: "Exploratory",
        assessmentCoverage: "Unassessed Baseline",
      };
    }

    // 3. Multi-assessment input assembly
    const multiInput: MultiAssessmentInput = {
      skillFinderResult,
      streamFinderResult,
      rightCareerFinderResult,
      commerceCareerFinderResult,
      humanitiesCareerFinderResult,
      engineeringBranchFinderResult,
    };

    const scoredMatches = careerMatchingService.computeCareerMatches(careers, multiInput, {
      languageCode: lang,
    });

    const topConfidence = scoredMatches[0]?.confidence || "Moderate Confidence";
    const topCoverage = scoredMatches[0]?.assessmentCoverage || "Calibrated Profile";

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

    // 5. Compute Domain Summaries across all scored matches
    const domainSummaries = this.buildDomainSummaries(scoredMatches);

    // 6. Partition by tier
    const primaryRecommendations = scoredMatches.filter((m) => m.tier === "PRIMARY");
    const secondaryRecommendations = scoredMatches.filter((m) => m.tier === "SECONDARY");
    const exploreFurtherRecommendations = scoredMatches.filter((m) => m.tier === "EXPLORE_FURTHER");

    // 7. Apply query filters if specified
    let filteredMatches = scoredMatches;

    if (opts.tier && opts.tier !== "ALL") {
      filteredMatches = filteredMatches.filter((m) => m.tier === opts.tier);
    }

    if (opts.domainCode && opts.domainCode !== "ALL") {
      const dCode = opts.domainCode.toLowerCase().trim();
      filteredMatches = filteredMatches.filter(
        (m) => (m.domainCode || "").toLowerCase() === dCode
      );
    }

    if (opts.search) {
      const q = opts.search.toLowerCase().trim();
      filteredMatches = filteredMatches.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.shortTitle && m.shortTitle.toLowerCase().includes(q)) ||
          m.category.toLowerCase().includes(q) ||
          (m.domainName && m.domainName.toLowerCase().includes(q)) ||
          (m.familyName && m.familyName.toLowerCase().includes(q)) ||
          (m.clusterName && m.clusterName.toLowerCase().includes(q)) ||
          m.description.toLowerCase().includes(q) ||
          m.keySkills.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Paginate or limit if viewAll is false
    const totalCount = filteredMatches.length;
    let finalRecommendations = filteredMatches;

    if (!opts.viewAll && !opts.tier && !opts.domainCode && !opts.search) {
      // Default view: top 12 pathways
      finalRecommendations = filteredMatches.slice(0, 12);
    } else if (opts.limit && opts.limit > 0) {
      const page = Math.max(1, opts.page || 1);
      const start = (page - 1) * opts.limit;
      finalRecommendations = filteredMatches.slice(start, start + opts.limit);
    }

    return {
      recommendations: finalRecommendations,
      primaryRecommendations,
      secondaryRecommendations,
      exploreFurtherRecommendations,
      domainSummaries,
      totalCount,
      isAssessed: true,
      assessmentCode: completedAssessments[0] || "SKILL_FINDER",
      completedAssessments,
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
    let rightCareerFinderResult: RightCareerFinderResultDTO | null = null;
    let commerceCareerFinderResult: CommerceCareerFinderResultDTO | null = null;
    let humanitiesCareerFinderResult: HumanitiesCareerFinderResultDTO | null = null;
    let engineeringBranchFinderResult: EngineeringBranchFinderResultDTO | null = null;

    for (const row of resultRows) {
      const data = row.result_data;
      if (!data) continue;

      const code = row.assessment_code;
      if (
        (code === "SKILL_FINDER" || data.interestDiscovery || data.profileVector) &&
        !skillFinderResult
      ) {
        skillFinderResult = data as SkillFinderFullResultDTO;
      } else if (
        (code === "STREAM_FINDER" || data.streamScores) &&
        !streamFinderResult
      ) {
        streamFinderResult = data as StreamFinderResultDTO;
      } else if (
        (code === "RIGHT_CAREER_FINDER" || code === "CAREER_FINDER" || data.familyScores?.TECH_COMPUTING_AI) &&
        !rightCareerFinderResult
      ) {
        rightCareerFinderResult = data as RightCareerFinderResultDTO;
      } else if (
        (code === "COMMERCE_CAREER_FINDER" || data.familyScores?.ACCOUNTING_AUDIT_TAX) &&
        !commerceCareerFinderResult
      ) {
        commerceCareerFinderResult = data as CommerceCareerFinderResultDTO;
      } else if (
        (code === "HUMANITIES_CAREER_FINDER" || data.familyScores?.HUMAN_BEHAVIOUR_WELLBEING) &&
        !humanitiesCareerFinderResult
      ) {
        humanitiesCareerFinderResult = data as HumanitiesCareerFinderResultDTO;
      } else if (
        (code === "ENGINEERING_BRANCH_FINDER" || data.branchScores?.CSE) &&
        !engineeringBranchFinderResult
      ) {
        engineeringBranchFinderResult = data as EngineeringBranchFinderResultDTO;
      }
    }

    const multiInput: MultiAssessmentInput = {
      skillFinderResult,
      streamFinderResult,
      rightCareerFinderResult,
      commerceCareerFinderResult,
      humanitiesCareerFinderResult,
      engineeringBranchFinderResult,
    };

    const hasAnyAssessment = Boolean(
      skillFinderResult ||
      streamFinderResult ||
      rightCareerFinderResult ||
      commerceCareerFinderResult ||
      humanitiesCareerFinderResult ||
      engineeringBranchFinderResult
    );

    let matchResult: CareerMatchDTO;
    if (hasAnyAssessment) {
      matchResult = careerMatchingService.computeSingleCareerMatch(career, multiInput, lang);
    } else {
      matchResult = {
        id: career.id,
        careerCode: career.career_code,
        slug: career.slug,
        title: career.title,
        shortTitle: career.short_title,
        category: career.category,
        industry: career.industry,
        domainCode: career.domain_code,
        domainName: career.domain_name,
        familyCode: career.family_code,
        familyName: career.family_name,
        clusterCode: career.cluster_code,
        clusterName: career.cluster_name,
        specialization: career.specialization,
        growthCategory: career.growth_category,
        educationLevel: career.education_level,
        isEmerging: career.is_emerging,
        description: career.description,
        futureGrowth: career.future_growth,
        matchPercentage: 80,
        tier: "PRIMARY",
        keySkills: career.required_skills ? career.required_skills.slice(0, 5) : [],
        reasoning: {
          summary: "Foundational career pathway. Complete an assessment to see your exact dimensional compatibility.",
          topMatchingFactors: ["Curated Educational Pathway", "High Industry Growth Opportunity"],
          alignmentNote: "This pathway offers strong interdisciplinary skill development for emerging future industries.",
        },
        driverConstructs: [
          {
            constructCode: "FOUNDATIONAL_EXPLORATION",
            constructName: "Exploratory Alignment",
            normalizedScore: 75,
            weight: 0.8,
            rationale: "Broad alignment across fundamental academic and problem-solving indicators.",
          },
        ],
        strengthAlignment: ["Foundational Academic Literacy", "Curiosity & Exploration"],
        developmentAreas: ["Take a 3G MeLife assessment to unlock custom developmental targets."],
        matchBreakdown: {
          interestScore: 75,
          skillScore: 75,
          aptitudeScore: 75,
          personalityScore: 75,
        },
        confidence: "Exploratory",
        assessmentCoverage: "Unassessed Baseline",
      };
    }

    // Fetch related occupations in same cluster or family
    const allCareers = await careerRepository.findAllCareers(lang);
    const relatedCareers = allCareers
      .filter(
        (c) =>
          c.id !== career.id &&
          ((career.cluster_id && c.cluster_id === career.cluster_id) ||
            (career.family_id && c.family_id === career.family_id) ||
            (career.domain_id && c.domain_id === career.domain_id))
      )
      .slice(0, 4)
      .map((c) => {
        const cMatch = hasAnyAssessment
          ? careerMatchingService.computeSingleCareerMatch(c, multiInput, lang)
          : null;
        return {
          id: c.id,
          slug: c.slug,
          title: c.title,
          category: c.category,
          specialization: c.specialization,
          matchPercentage: cMatch?.matchPercentage || 75,
        };
      });

    return {
      ...matchResult,
      overview: career.overview,
      educationPaths: career.education_paths || [],
      requiredSkills: career.required_skills || [],
      recommendedSubjects: career.recommended_subjects || [],
      academicSubjects: career.academic_subjects || [],
      recommendedStreams: career.recommended_streams || [],
      recommendedDegrees: career.recommended_degrees || [],
      typicalQualifications: career.typical_qualifications || [],
      careerEntryPath: career.career_entry_path || [],
      workActivities: career.work_activities || [],
      knowledgeAreas: career.knowledge_areas || [],
      workEnvironment: career.work_environment || [],
      technologyAreas: career.technology_areas || [],
      learningRoadmap: career.learning_roadmap || [],
      sampleRoles: career.sample_roles || [],
      relatedOccupations: career.related_occupations || [],
      relatedCareers,
    };
  }

  /**
   * Builds domain summaries with match counts and top match percentage.
   */
  private buildDomainSummaries(matches: CareerMatchDTO[]): CareerDomainSummary[] {
    const summaryMap: Record<string, { domainName: string; count: number; maxScore: number }> = {};

    for (const m of matches) {
      const code = m.domainCode || "GENERAL";
      const name = m.domainName || m.category || "General";
      if (!summaryMap[code]) {
        summaryMap[code] = {
          domainName: name,
          count: 0,
          maxScore: 0,
        };
      }
      summaryMap[code].count += 1;
      if (m.matchPercentage > summaryMap[code].maxScore) {
        summaryMap[code].maxScore = m.matchPercentage;
      }
    }

    return Object.entries(summaryMap).map(([code, data]) => ({
      domainCode: code,
      domainName: data.domainName,
      matchCount: data.count,
      topMatchPercentage: data.maxScore,
    }));
  }
}

export const careerRecommendationService = new CareerRecommendationService();

/**
 * 3G MeLife Psychometrically Calibrated Multi-Assessment Career Matching Engine
 *
 * Implements a scientifically grounded, multi-pillar alignment algorithm across:
 * 1. Interest Alignment (RIASEC Model)
 * 2. Cognitive & Behavioural Skills (8 Core Competencies)
 * 3. Demonstrated Aptitude Tasks (8 Spatial/Logic/Numerical Constructs)
 * 4. Learning Archetype & Developmental Traits (7 Strengths + 12 Archetypes)
 * 5. Academic Stream Alignment (Stream Finder Integration)
 * 6. Specialized Domain & Career Family Affinity (Right Career, Commerce, Humanities, Engineering Finder)
 *
 * Dynamically re-normalizes weights based on assessment completeness.
 * Produces explainable, non-deterministic exploratory reasoning grounded in actual assessment vectors.
 */

import {
  CareerEntity,
  CareerMatchDTO,
  CareerMatchReasoning,
  CareerMatchDriver,
  CareerTier,
  MatchPillarBreakdown,
} from "./career.types";
import { SkillFinderFullResultDTO } from "../scoring/scoring.types";
import { StreamFinderResultDTO } from "../assessments/scoring/stream-finder-scoring.service";
import { RightCareerFinderResultDTO } from "../assessments/scoring/right-career-finder-scoring.service";
import { CommerceCareerFinderResultDTO } from "../assessments/scoring/commerce-career-finder-scoring.service";
import { HumanitiesCareerFinderResultDTO } from "../assessments/scoring/humanities-career-finder-scoring.service";
import { EngineeringBranchFinderResultDTO } from "../assessments/scoring/engineering-branch-finder-scoring.service";

export interface MultiAssessmentInput {
  skillFinderResult?: SkillFinderFullResultDTO | null;
  streamFinderResult?: StreamFinderResultDTO | null;
  rightCareerFinderResult?: RightCareerFinderResultDTO | null;
  commerceCareerFinderResult?: CommerceCareerFinderResultDTO | null;
  humanitiesCareerFinderResult?: HumanitiesCareerFinderResultDTO | null;
  engineeringBranchFinderResult?: EngineeringBranchFinderResultDTO | null;
}

export interface CareerMatchComputationOptions {
  languageCode?: string;
  stageContext?: string;
}

export class CareerMatchingService {
  /**
   * Computes ranked career pathway recommendations for a student from available assessment inputs.
   */
  computeCareerMatches(
    careers: CareerEntity[],
    input: MultiAssessmentInput | SkillFinderFullResultDTO,
    options?: CareerMatchComputationOptions
  ): CareerMatchDTO[] {
    const lang = options?.languageCode || "en";

    // Normalize input format
    const multiInput: MultiAssessmentInput =
      "assessmentCode" in input
        ? { skillFinderResult: input as SkillFinderFullResultDTO }
        : (input as MultiAssessmentInput);

    const scoredList = careers.map((career) =>
      this.computeSingleCareerMatch(career, multiInput, lang)
    );

    // Sort descending by match percentage, tie-break by display order
    scoredList.sort((a, b) => {
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }
      return 0;
    });

    // Assign tiers based on relative distribution and thresholds
    return this.assignTiersToMatches(scoredList);
  }

  /**
   * Computes a single career match against student's psychometric and academic stream results.
   */
  computeSingleCareerMatch(
    career: CareerEntity,
    input: MultiAssessmentInput | SkillFinderFullResultDTO,
    _languageCode = "en"
  ): CareerMatchDTO {
    const multiInput: MultiAssessmentInput =
      "assessmentCode" in input
        ? { skillFinderResult: input as SkillFinderFullResultDTO }
        : (input as MultiAssessmentInput);

    const skillResult = multiInput.skillFinderResult;
    const streamResult = multiInput.streamFinderResult;
    const rightCareerResult = multiInput.rightCareerFinderResult;
    const commerceResult = multiInput.commerceCareerFinderResult;
    const humanitiesResult = multiInput.humanitiesCareerFinderResult;
    const engineeringResult = multiInput.engineeringBranchFinderResult;

    const hasSkillFinder = Boolean(skillResult);
    const hasStreamFinder = Boolean(streamResult && streamResult.streamScores);
    const hasDomainCareerFinder = Boolean(
      rightCareerResult || commerceResult || humanitiesResult || engineeringResult
    );

    // ========================================================================
    // 1. EXTRACT NORMALIZED STUDENT VECTORS (0 - 100 SCALE)
    // ========================================================================
    const riasecMap = this.extractRiasecScores(skillResult);
    const skillsMap = this.extractSkillScores(skillResult);
    const aptitudeMap = this.extractAptitudeScores(skillResult);
    const developmentMap = this.extractDevelopmentScores(skillResult);
    const streamsMap = this.extractStreamScores(streamResult);
    const domainScoresMap = this.extractDomainAndSpecializedScores(multiInput);

    const targetRiasec = career.related_dimensions?.riasec || {};
    const targetSkills = career.related_dimensions?.skills || {};
    const targetAptitude = career.related_dimensions?.aptitude || {};
    const targetDevelopment = career.related_dimensions?.development || {};
    const targetStreams = career.related_dimensions?.streams || {};
    const targetArchetypes = career.related_dimensions?.archetypes || [];
    const targetSpecialized = career.related_dimensions?.specialized_dimensions || {};

    // ========================================================================
    // 2. COMPUTE PILLAR ALIGNMENT SCORES
    // ========================================================================

    // Pillar 1: Interest Alignment (RIASEC)
    const interestAffinity = this.computeWeightedAffinity(riasecMap, targetRiasec, 70);

    // Pillar 2: Cognitive & Behavioural Skills Alignment
    const skillAffinity = this.computeWeightedAffinity(skillsMap, targetSkills, 70);

    // Pillar 3: Demonstrated Aptitude Alignment
    const aptitudeAffinity = this.computeWeightedAffinity(aptitudeMap, targetAptitude, 70);

    // Pillar 4: Learning Archetype & Developmental Trait Alignment
    const studentArchetype = skillResult?.learningProfile?.archetypeTitle || "Practical Explorer";
    const devTraitAffinity = this.computeWeightedAffinity(developmentMap, targetDevelopment, 72);

    let archetypeBoost = 0;
    const hasDirectArchetypeMatch = targetArchetypes.some(
      (arch) =>
        studentArchetype.toLowerCase().includes(arch.toLowerCase()) ||
        arch.toLowerCase().includes(studentArchetype.toLowerCase())
    );
    if (hasDirectArchetypeMatch) {
      archetypeBoost = 6;
    } else {
      const archLower = studentArchetype.toLowerCase();
      const catLower = (career.category || "").toLowerCase();
      const domainLower = (career.domain_name || "").toLowerCase();
      if (
        archLower.includes("explorer") &&
        (catLower.includes("stem") || catLower.includes("tech") || catLower.includes("science") || domainLower.includes("tech") || domainLower.includes("data"))
      ) {
        archetypeBoost = 4;
      } else if (
        archLower.includes("builder") &&
        (catLower.includes("engineering") || catLower.includes("applied") || domainLower.includes("engineering"))
      ) {
        archetypeBoost = 4;
      } else if (
        archLower.includes("creator") &&
        (catLower.includes("design") || catLower.includes("arts") || domainLower.includes("creative") || domainLower.includes("media"))
      ) {
        archetypeBoost = 4;
      } else if (
        archLower.includes("coordinator") &&
        (catLower.includes("analytics") || catLower.includes("economics") || catLower.includes("business") || domainLower.includes("finance") || domainLower.includes("management"))
      ) {
        archetypeBoost = 4;
      } else if (
        (archLower.includes("catalyst") || archLower.includes("mentor") || archLower.includes("helper")) &&
        (catLower.includes("health") || catLower.includes("learning") || catLower.includes("psychology") || domainLower.includes("education") || domainLower.includes("health"))
      ) {
        archetypeBoost = 4;
      }
    }
    const personalityAffinity = Math.min(98, Math.max(50, devTraitAffinity + archetypeBoost));

    // Pillar 5: Academic Stream Alignment (Stream Finder)
    const streamAffinity = this.computeWeightedAffinity(streamsMap, targetStreams, 75);

    // Pillar 6: Domain & Specialized Career Family Affinity
    const domainAffinity = this.computeDomainAndSpecializedAffinity(
      career,
      domainScoresMap,
      targetSpecialized
    );

    // ========================================================================
    // 3. DYNAMIC WEIGHT NORMALIZATION ACROSS AVAILABLE ASSESSMENTS
    // ========================================================================
    let compositeScore = 75;
    let confidence: "High Confidence" | "Moderate Confidence" | "Baseline Confidence" | "Exploratory" =
      "Exploratory";
    let assessmentCoverage = "Exploratory Baseline";

    if (hasSkillFinder && hasStreamFinder && hasDomainCareerFinder) {
      // Full Assessment Suite (3+ Modules):
      // 25% Domain/Career Affinity + 20% RIASEC + 20% Skills + 15% Aptitude + 10% Stream + 10% Personality
      compositeScore =
        0.25 * domainAffinity +
        0.20 * interestAffinity +
        0.20 * skillAffinity +
        0.15 * aptitudeAffinity +
        0.10 * streamAffinity +
        0.10 * personalityAffinity;
      confidence = "High Confidence";
      assessmentCoverage = "Comprehensive Multi-Assessment Calibrated";
    } else if (hasSkillFinder && hasDomainCareerFinder) {
      // Skill Finder + Career Finder:
      // 30% Domain Affinity + 25% RIASEC + 20% Skills + 15% Aptitude + 10% Personality
      compositeScore =
        0.30 * domainAffinity +
        0.25 * interestAffinity +
        0.20 * skillAffinity +
        0.15 * aptitudeAffinity +
        0.10 * personalityAffinity;
      confidence = "High Confidence";
      assessmentCoverage = "Skill Finder + Career Finder Calibrated";
    } else if (hasSkillFinder && hasStreamFinder) {
      // Skill Finder + Stream Finder:
      // 25% RIASEC + 25% Skills + 20% Aptitude + 15% Personality + 15% Stream
      compositeScore =
        0.25 * interestAffinity +
        0.25 * skillAffinity +
        0.20 * aptitudeAffinity +
        0.15 * personalityAffinity +
        0.15 * streamAffinity;
      confidence = "High Confidence";
      assessmentCoverage = "Skill Finder + Stream Finder";
    } else if (hasDomainCareerFinder && hasStreamFinder) {
      // Career Finder + Stream Finder:
      // 55% Domain Affinity + 30% Stream + 15% Baseline Personality/Skills
      compositeScore = 0.55 * domainAffinity + 0.30 * streamAffinity + 0.15 * 72;
      confidence = "Moderate Confidence";
      assessmentCoverage = "Career Finder + Stream Finder Calibrated";
    } else if (hasDomainCareerFinder) {
      // Career Finder Only:
      // 70% Domain Affinity + 30% Baseline Compatibility
      compositeScore = 0.70 * domainAffinity + 0.30 * 70;
      confidence = "Moderate Confidence";
      assessmentCoverage = "Career Finder Calibrated";
    } else if (hasSkillFinder) {
      // Skill Finder Only: Re-normalize over 85 base weight
      compositeScore =
        (0.25 * interestAffinity +
          0.25 * skillAffinity +
          0.20 * aptitudeAffinity +
          0.15 * personalityAffinity) /
        0.85;
      confidence = "Moderate Confidence";
      assessmentCoverage = "Skill Finder Calibrated";
    } else if (hasStreamFinder) {
      // Stream Finder Only: 65% Stream + 35% Foundational Exploratory Baseline
      compositeScore = 0.65 * streamAffinity + 0.35 * 72;
      confidence = "Baseline Confidence";
      assessmentCoverage = "Stream Finder Calibrated";
    }

    const boundedMatch = Math.min(98, Math.max(50, Math.round(compositeScore)));

    const matchBreakdown: MatchPillarBreakdown = {
      interestScore: Math.round(interestAffinity),
      skillScore: Math.round(skillAffinity),
      aptitudeScore: Math.round(aptitudeAffinity),
      personalityScore: Math.round(personalityAffinity),
      streamScore: hasStreamFinder ? Math.round(streamAffinity) : undefined,
      domainScore: hasDomainCareerFinder ? Math.round(domainAffinity) : undefined,
    };

    // ========================================================================
    // 4. EXTRACT PERSONALIZED DRIVER CONSTRUCTS (EXPLAINABILITY LAYER)
    // ========================================================================
    const driverConstructs = this.synthesizeDriverConstructs(
      career,
      multiInput,
      riasecMap,
      skillsMap,
      aptitudeMap,
      streamsMap,
      domainScoresMap
    );

    // ========================================================================
    // 5. EXTRACT PERSONALIZED STRENGTHS & DEVELOPMENT TARGETS
    // ========================================================================
    const strengthAlignment = this.extractStrengthAlignment(
      career,
      multiInput,
      riasecMap,
      skillsMap,
      aptitudeMap,
      driverConstructs
    );

    const developmentAreas = this.extractDevelopmentAreas(
      career,
      skillResult,
      skillsMap,
      aptitudeMap
    );

    // ========================================================================
    // 6. SYNTHESIZE EXPLAINABLE EXPLORATORY REASONING
    // ========================================================================
    const reasoning = this.buildExplorationReasoning(
      career,
      studentArchetype,
      strengthAlignment,
      driverConstructs,
      hasStreamFinder ? streamResult?.primaryStream : undefined
    );

    // Initial tier assignment (refined later in bulk sorting)
    let tier: CareerTier = "EXPLORE_FURTHER";
    if (boundedMatch >= 80) tier = "PRIMARY";
    else if (boundedMatch >= 70) tier = "SECONDARY";
    else if (boundedMatch < 60) tier = "DEVELOPING";

    return {
      id: career.id,
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
      matchPercentage: boundedMatch,
      tier,
      keySkills: career.required_skills ? career.required_skills.slice(0, 5) : [],
      reasoning,
      driverConstructs,
      strengthAlignment,
      developmentAreas,
      matchBreakdown,
      confidence,
      assessmentCoverage,
    };
  }

  /**
   * Partitions scored careers into clean tiers (PRIMARY, SECONDARY, EXPLORE_FURTHER, DEVELOPING).
   */
  private assignTiersToMatches(matches: CareerMatchDTO[]): CareerMatchDTO[] {
    if (matches.length === 0) return matches;

    return matches.map((match, index) => {
      let tier: CareerTier;

      if (index < 6 || (match.matchPercentage >= 86 && index < 10)) {
        tier = "PRIMARY";
      } else if (index < 24 || (match.matchPercentage >= 78 && index < 30)) {
        tier = "SECONDARY";
      } else if (index < 60 || match.matchPercentage >= 65) {
        tier = "EXPLORE_FURTHER";
      } else {
        tier = "DEVELOPING";
      }

      return {
        ...match,
        tier,
      };
    });
  }

  // ==========================================================================
  // HELPER CALCULATION METHODS
  // ==========================================================================

  /**
   * Computes weighted average score between student score map and career target weights.
   */
  private computeWeightedAffinity(
    studentMap: Record<string, number>,
    targetWeights: Record<string, number>,
    defaultFallback = 70
  ): number {
    const entries = Object.entries(targetWeights);
    if (entries.length === 0) return defaultFallback;

    let weightedSum = 0;
    let totalWeight = 0;

    for (const [key, weight] of entries) {
      if (typeof weight !== "number" || weight <= 0) continue;
      const normalizedKey = key.toLowerCase().trim();
      const studentScore = studentMap[normalizedKey];

      if (typeof studentScore === "number") {
        weightedSum += studentScore * weight;
        totalWeight += weight;
      }
    }

    if (totalWeight === 0) return defaultFallback;
    return Math.round((weightedSum / totalWeight) * 100) / 100;
  }

  /**
   * Computes domain and specialized career family affinity.
   */
  private computeDomainAndSpecializedAffinity(
    career: CareerEntity,
    domainScoresMap: Record<string, number>,
    targetSpecialized: Record<string, number>
  ): number {
    const domainCode = (career.domain_code || "").toLowerCase();
    const familyCode = (career.family_code || "").toLowerCase();
    const clusterCode = (career.cluster_code || "").toLowerCase();

    let directDomainScore = 70;
    let matchCount = 0;
    let scoreSum = 0;

    // Check cluster code
    if (clusterCode && typeof domainScoresMap[clusterCode] === "number") {
      scoreSum += domainScoresMap[clusterCode] * 1.5;
      matchCount += 1.5;
    }

    // Check family code
    if (familyCode && typeof domainScoresMap[familyCode] === "number") {
      scoreSum += domainScoresMap[familyCode] * 1.2;
      matchCount += 1.2;
    }

    // Check domain code
    if (domainCode && typeof domainScoresMap[domainCode] === "number") {
      scoreSum += domainScoresMap[domainCode] * 1.0;
      matchCount += 1.0;
    }

    if (matchCount > 0) {
      directDomainScore = scoreSum / matchCount;
    }

    // Combine with specialized construct weights
    if (Object.keys(targetSpecialized).length > 0) {
      const specializedScore = this.computeWeightedAffinity(domainScoresMap, targetSpecialized, directDomainScore);
      return Math.round((directDomainScore * 0.5 + specializedScore * 0.5) * 10) / 10;
    }

    return Math.round(directDomainScore * 10) / 10;
  }

  /**
   * Extracts RIASEC interest dimension scores.
   */
  private extractRiasecScores(result?: SkillFinderFullResultDTO | null): Record<string, number> {
    const map: Record<string, number> = {};
    if (!result) return map;

    // If profileVector is present, return standardized vector scores
    if (result.profileVector) {
      map["r"] = result.profileVector.builder;
      map["builder"] = result.profileVector.builder;
      map["i"] = result.profileVector.explorer;
      map["explorer"] = result.profileVector.explorer;
      map["a"] = result.profileVector.creator;
      map["creator"] = result.profileVector.creator;
      map["s"] = result.profileVector.helper;
      map["helper"] = result.profileVector.helper;
      map["e"] = result.profileVector.leader;
      map["leader"] = result.profileVector.leader;
      map["c"] = result.profileVector.organiser;
      map["organiser"] = result.profileVector.organiser;
      map["organizer"] = result.profileVector.organiser;
      return map;
    }

    // Direct fallback from interestDiscovery dimensions
    for (const dim of result.interestDiscovery?.dimensions || []) {
      const code = dim.code.toLowerCase().trim();
      const pos = dim.scalePositionPercentage || 50;
      map[code] = pos;
      if (code.includes("builder") || code === "r" || code === "builder_r") {
        map["r"] = pos;
        map["builder"] = pos;
      } else if (code.includes("explorer") || code === "i" || code === "explorer_i") {
        map["i"] = pos;
        map["explorer"] = pos;
      } else if (code.includes("creator") || code === "a" || code === "creator_a") {
        map["a"] = pos;
        map["creator"] = pos;
      } else if (code.includes("helper") || code === "s" || code === "helper_s") {
        map["s"] = pos;
        map["helper"] = pos;
      } else if (code.includes("leader") || code === "e" || code === "leader_e") {
        map["e"] = pos;
        map["leader"] = pos;
      } else if (code.includes("organis") || code.includes("organiz") || code === "c" || code === "organiser_c") {
        map["c"] = pos;
        map["organiser"] = pos;
        map["organizer"] = pos;
      }
    }

    return map;
  }

  /**
   * Extracts 8 standardized skill behaviour dimension scores.
   */
  private extractSkillScores(result?: SkillFinderFullResultDTO | null): Record<string, number> {
    const map: Record<string, number> = {};
    if (!result) return map;

    if (result.profileVector) {
      map["logical_problem_solving"] = result.profileVector.logical_problem_solving;
      map["communication"] = result.profileVector.communication;
      map["creative_thinking"] = result.profileVector.creative_thinking;
      map["visual_spatial"] = result.profileVector.visual_spatial;
      map["practical_technical"] = result.profileVector.practical_technical;
      map["social_teamwork"] = result.profileVector.social_teamwork;
      map["leadership_initiative"] = result.profileVector.leadership_initiative;
      map["self_management"] = result.profileVector.self_management;
      return map;
    }

    for (const dim of result.skillBehaviour?.dimensions || []) {
      const key = dim.name.toLowerCase().replace(/[^a-z0-9]/g, "_");
      const pos = dim.scalePositionPercentage || 50;
      map[key] = pos;
      if (key.includes("logical") || key.includes("problem_solving")) map["logical_problem_solving"] = pos;
      if (key.includes("communication")) map["communication"] = pos;
      if (key.includes("creative")) map["creative_thinking"] = pos;
      if (key.includes("visual") || key.includes("spatial")) map["visual_spatial"] = pos;
      if (key.includes("practical") || key.includes("technical")) map["practical_technical"] = pos;
      if (key.includes("teamwork") || key.includes("social")) map["social_teamwork"] = pos;
      if (key.includes("leadership") || key.includes("initiative")) map["leadership_initiative"] = pos;
      if (key.includes("self") || key.includes("management")) map["self_management"] = pos;
    }

    return map;
  }

  /**
   * Extracts 8 demonstrated aptitude dimension scores.
   */
  private extractAptitudeScores(result?: SkillFinderFullResultDTO | null): Record<string, number> {
    const map: Record<string, number> = {};
    if (!result) return map;

    if (result.profileVector) {
      map["pattern_logic"] = result.profileVector.pattern_logic;
      map["numerical_reasoning"] = result.profileVector.numerical_reasoning;
      map["verbal_reasoning"] = result.profileVector.verbal_reasoning;
      map["spatial_reasoning"] = result.profileVector.spatial_reasoning;
      map["practical_troubleshooting"] = result.profileVector.practical_troubleshooting;
      map["creative_performance"] = result.profileVector.creative_performance;
      map["social_judgment"] = result.profileVector.social_judgment;
      map["planning_estimation"] = result.profileVector.planning_estimation;
      return map;
    }

    for (const dim of result.demonstratedAptitude?.dimensions || []) {
      const key = dim.name.toLowerCase().replace(/[^a-z0-9]/g, "_");
      const pos = dim.scalePositionPercentage || 50;
      map[key] = pos;
      if (key.includes("pattern")) map["pattern_logic"] = pos;
      if (key.includes("numerical")) map["numerical_reasoning"] = pos;
      if (key.includes("verbal")) map["verbal_reasoning"] = pos;
      if (key.includes("spatial")) map["spatial_reasoning"] = pos;
      if (key.includes("practical") || key.includes("troubleshoot")) map["practical_troubleshooting"] = pos;
      if (key.includes("creative")) map["creative_performance"] = pos;
      if (key.includes("judgment") || key.includes("situational")) map["social_judgment"] = pos;
      if (key.includes("planning") || key.includes("estimation")) map["planning_estimation"] = pos;
    }

    return map;
  }

  /**
   * Extracts 7 developmental strength scores.
   */
  private extractDevelopmentScores(result?: SkillFinderFullResultDTO | null): Record<string, number> {
    const map: Record<string, number> = {};
    if (!result) return map;

    if (result.profileVector) {
      map["curiosity"] = result.profileVector.curiosity;
      map["persistence"] = result.profileVector.persistence;
      map["adaptability"] = result.profileVector.adaptability;
      map["initiative"] = result.profileVector.initiative;
      map["collaboration"] = result.profileVector.collaboration;
      map["attention_to_detail"] = result.profileVector.attention_to_detail;
      map["learning_independence"] = result.profileVector.learning_independence;
      return map;
    }

    for (const dim of result.developmentalStrengths?.dimensions || []) {
      const key = dim.name.toLowerCase().replace(/[^a-z0-9]/g, "_");
      const pos = dim.scalePositionPercentage || 50;
      map[key] = pos;
      if (key.includes("curiosity")) map["curiosity"] = pos;
      if (key.includes("persistence")) map["persistence"] = pos;
      if (key.includes("adaptability")) map["adaptability"] = pos;
      if (key.includes("initiative")) map["initiative"] = pos;
      if (key.includes("collaboration")) map["collaboration"] = pos;
      if (key.includes("detail")) map["attention_to_detail"] = pos;
      if (key.includes("independence")) map["learning_independence"] = pos;
    }

    return map;
  }

  /**
   * Extracts academic stream compatibility scores from Stream Finder.
   */
  private extractStreamScores(result?: StreamFinderResultDTO | null): Record<string, number> {
    const map: Record<string, number> = {};
    if (!result || !result.streamScores) return map;

    if (result.streamScores.Science) {
      map["science"] = result.streamScores.Science.displayPercentage;
    }
    if (result.streamScores.Commerce) {
      map["commerce"] = result.streamScores.Commerce.displayPercentage;
    }
    if (result.streamScores.Humanities) {
      map["humanities"] = result.streamScores.Humanities.displayPercentage;
    }
    if (result.streamScores["Applied / Technical"]) {
      map["applied_technical"] = result.streamScores["Applied / Technical"].displayPercentage;
      map["applied"] = result.streamScores["Applied / Technical"].displayPercentage;
    }

    return map;
  }

  /**
   * Extracts specialized domain, family, and construct alignment scores across Career Finder assessments.
   */
  private extractDomainAndSpecializedScores(input: MultiAssessmentInput): Record<string, number> {
    const map: Record<string, number> = {};

    // 1. Right Career Finder (General Career Finder)
    if (input.rightCareerFinderResult) {
      const r = input.rightCareerFinderResult;
      if (r.familyScores) {
        for (const [code, details] of Object.entries(r.familyScores)) {
          const normKey = code.toLowerCase().trim();
          map[normKey] = details.displayPercentage;

          // Cross-map to taxonomy domain codes
          if (code === "TECH_COMPUTING_AI") {
            map["tech_computing"] = Math.max(map["tech_computing"] || 0, details.displayPercentage);
            map["emerging_frontiers"] = Math.max(map["emerging_frontiers"] || 0, details.displayPercentage);
          } else if (code === "BUSINESS_FINANCE_ENTERPRISE") {
            map["business_management"] = Math.max(map["business_management"] || 0, details.displayPercentage);
            map["finance_economics"] = Math.max(map["finance_economics"] || 0, details.displayPercentage);
          } else if (code === "HEALTHCARE_LIFE_SCIENCES") {
            map["healthcare_life_sciences"] = Math.max(map["healthcare_life_sciences"] || 0, details.displayPercentage);
            map["pure_applied_sciences"] = Math.max(map["pure_applied_sciences"] || 0, details.displayPercentage);
          } else if (code === "LAW_POLICY_GOVERNANCE") {
            map["law_governance"] = Math.max(map["law_governance"] || 0, details.displayPercentage);
            map["education_human_dev"] = Math.max(map["education_human_dev"] || 0, details.displayPercentage);
          } else if (code === "CREATIVE_DESIGN_MEDIA") {
            map["design_creative_media"] = Math.max(map["design_creative_media"] || 0, details.displayPercentage);
          } else if (code === "ENGINEERING_SUSTAINABILITY") {
            map["engineering_manufacturing"] = Math.max(map["engineering_manufacturing"] || 0, details.displayPercentage);
            map["environment_sustainability"] = Math.max(map["environment_sustainability"] || 0, details.displayPercentage);
            map["aviation_logistics"] = Math.max(map["aviation_logistics"] || 0, details.displayPercentage);
          }
        }
      }

      if (r.dimensionScores) {
        for (const [code, details] of Object.entries(r.dimensionScores)) {
          const normKey = code.toLowerCase().trim();
          map[normKey] = details.normalizedScore;
        }
      }
    }

    // 2. Commerce Career Finder
    if (input.commerceCareerFinderResult) {
      const c = input.commerceCareerFinderResult;
      if (c.familyScores) {
        for (const [code, details] of Object.entries(c.familyScores)) {
          const normKey = code.toLowerCase().trim();
          map[normKey] = details.displayPercentage;

          if (code === "ACCOUNTING_AUDIT_TAX" || code === "FINANCE_INVESTMENT_BANKING") {
            map["finance_economics"] = Math.max(map["finance_economics"] || 0, details.displayPercentage);
            map["business_management"] = Math.max(map["business_management"] || 0, details.displayPercentage * 0.85);
          } else if (code === "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP") {
            map["business_management"] = Math.max(map["business_management"] || 0, details.displayPercentage);
          } else if (code === "ECONOMICS_ANALYTICS_FINTECH") {
            map["finance_economics"] = Math.max(map["finance_economics"] || 0, details.displayPercentage);
            map["tech_computing"] = Math.max(map["tech_computing"] || 0, details.displayPercentage * 0.8);
          }
        }
      }

      if (c.dimensionScores) {
        for (const [code, details] of Object.entries(c.dimensionScores)) {
          map[code.toLowerCase().trim()] = details.normalizedScore;
        }
      }
    }

    // 3. Humanities Career Finder
    if (input.humanitiesCareerFinderResult) {
      const h = input.humanitiesCareerFinderResult;
      if (h.familyScores) {
        for (const [code, details] of Object.entries(h.familyScores)) {
          const normKey = code.toLowerCase().trim();
          map[normKey] = details.displayPercentage;

          if (code === "HUMAN_BEHAVIOUR_WELLBEING") {
            map["education_human_dev"] = Math.max(map["education_human_dev"] || 0, details.displayPercentage);
            map["healthcare_life_sciences"] = Math.max(map["healthcare_life_sciences"] || 0, details.displayPercentage * 0.8);
          } else if (code === "LAW_PUBLIC_AFFAIRS_JUSTICE") {
            map["law_governance"] = Math.max(map["law_governance"] || 0, details.displayPercentage);
          } else if (code === "MEDIA_COMM_CREATIVE_CULTURE") {
            map["design_creative_media"] = Math.max(map["design_creative_media"] || 0, details.displayPercentage);
          } else if (code === "EDUCATION_LANG_SOCIAL_RESEARCH") {
            map["education_human_dev"] = Math.max(map["education_human_dev"] || 0, details.displayPercentage);
          }
        }
      }

      if (h.dimensionScores) {
        for (const [code, details] of Object.entries(h.dimensionScores)) {
          map[code.toLowerCase().trim()] = details.normalizedScore;
        }
      }
    }

    // 4. Engineering Branch Finder
    if (input.engineeringBranchFinderResult) {
      const e = input.engineeringBranchFinderResult;
      if (e.branchScores) {
        for (const [code, details] of Object.entries(e.branchScores)) {
          const normKey = code.toLowerCase().trim();
          map[normKey] = details.displayPercentage;

          if (code === "CSE") {
            map["tech_computing"] = Math.max(map["tech_computing"] || 0, details.displayPercentage);
            map["emerging_frontiers"] = Math.max(map["emerging_frontiers"] || 0, details.displayPercentage);
          } else if (code === "ECE" || code === "EEE" || code === "ME" || code === "CE") {
            map["engineering_manufacturing"] = Math.max(map["engineering_manufacturing"] || 0, details.displayPercentage);
          } else if (code === "CHE" || code === "BME") {
            map["healthcare_life_sciences"] = Math.max(map["healthcare_life_sciences"] || 0, details.displayPercentage);
            map["pure_applied_sciences"] = Math.max(map["pure_applied_sciences"] || 0, details.displayPercentage);
            map["engineering_manufacturing"] = Math.max(map["engineering_manufacturing"] || 0, details.displayPercentage * 0.9);
          } else if (code === "AERO") {
            map["engineering_manufacturing"] = Math.max(map["engineering_manufacturing"] || 0, details.displayPercentage);
            map["aviation_logistics"] = Math.max(map["aviation_logistics"] || 0, details.displayPercentage);
          }
        }
      }
    }

    return map;
  }

  /**
   * Derives explainable driver constructs for why this pathway matches the student.
   */
  private synthesizeDriverConstructs(
    career: CareerEntity,
    input: MultiAssessmentInput,
    _riasecMap: Record<string, number>,
    skillsMap: Record<string, number>,
    aptitudeMap: Record<string, number>,
    _streamsMap: Record<string, number>,
    domainScoresMap: Record<string, number>
  ): CareerMatchDriver[] {
    const drivers: CareerMatchDriver[] = [];

    // 1. High scoring cognitive skills matching career requirements
    const targetSkills = career.related_dimensions?.skills || {};
    for (const [skillKey, weight] of Object.entries(targetSkills)) {
      const score = skillsMap[skillKey];
      if (typeof score === "number" && score >= 70 && weight >= 0.7) {
        const title = skillKey.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        drivers.push({
          constructCode: skillKey.toUpperCase(),
          constructName: title,
          normalizedScore: Math.round(score),
          weight,
          rationale: `Strong capability in ${title.toLowerCase()} provides solid aptitude for core activities in this occupation.`,
        });
      }
    }

    // 2. High scoring aptitude tasks matching career requirements
    const targetApt = career.related_dimensions?.aptitude || {};
    for (const [aptKey, weight] of Object.entries(targetApt)) {
      const score = aptitudeMap[aptKey];
      if (typeof score === "number" && score >= 70 && weight >= 0.7) {
        const title = aptKey.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        drivers.push({
          constructCode: aptKey.toUpperCase(),
          constructName: title,
          normalizedScore: Math.round(score),
          weight,
          rationale: `Demonstrated high performance in ${title.toLowerCase()} directly supports analytical and problem-solving demands.`,
        });
      }
    }

    // 3. Domain or Career Finder specific driver constructs
    if (input.rightCareerFinderResult?.primaryDriverConstructs) {
      for (const d of input.rightCareerFinderResult.primaryDriverConstructs) {
        if (domainScoresMap[d.dimensionCode.toLowerCase()] >= 70) {
          drivers.push({
            constructCode: d.dimensionCode,
            constructName: d.dimensionName,
            normalizedScore: d.normalizedScore,
            weight: d.weight,
            rationale: d.rationale,
          });
        }
      }
    }

    // Sort drivers by weight * normalizedScore descending and select top 3
    drivers.sort((a, b) => ((b.weight || 1) * (b.normalizedScore || 0)) - ((a.weight || 1) * (a.normalizedScore || 0)));

    // Fallbacks if no constructs identified
    if (drivers.length === 0) {
      drivers.push({
        constructCode: "FOUNDATIONAL_EXPLORATION",
        constructName: "Exploratory Alignment",
        normalizedScore: 75,
        weight: 0.8,
        rationale: "Broad alignment across fundamental academic and problem-solving indicators.",
      });
      drivers.push({
        constructCode: "GROWTH_POTENTIAL",
        constructName: "High Growth Sector Alignment",
        normalizedScore: 78,
        weight: 0.75,
        rationale: "Strong developmental fit for expanding industry demands and evolving career tracks.",
      });
    }

    return drivers.slice(0, 3);
  }

  /**
   * Derives explainable strength alignment items based on student's top validated indicators.
   */
  private extractStrengthAlignment(
    career: CareerEntity,
    input: MultiAssessmentInput,
    _riasecMap: Record<string, number> = {},
    _skillsMap: Record<string, number> = {},
    _aptitudeMap: Record<string, number> = {},
    driverConstructs: CareerMatchDriver[] = []
  ): string[] {
    const strengths: string[] = [];

    // 1. Top Interest Alignment from Skill Finder
    if (input.skillFinderResult?.interestDiscovery?.topClusters?.[0]) {
      const topInt = input.skillFinderResult.interestDiscovery.topClusters[0];
      strengths.push(`${topInt.name} Affinity (${Math.round(topInt.scalePositionPercentage)}%)`);
    }

    // 2. Top driver construct names
    for (const d of driverConstructs) {
      strengths.push(`High ${d.constructName} Alignment (${d.normalizedScore}%)`);
    }

    // 3. Stream alignment strength if available
    if (input.streamFinderResult?.primaryStream) {
      const targetStreams = career.related_dimensions?.streams || {};
      const primaryKey = input.streamFinderResult.primaryStream.toLowerCase().replace(/[^a-z]/g, "_");
      if ((targetStreams[primaryKey] || 0) >= 0.75) {
        strengths.push(`High ${input.streamFinderResult.primaryStream} Academic Compatibility`);
      }
    }

    // 4. Fallbacks if list is sparse
    if (strengths.length < 2) {
      strengths.push("Curious Inquiry & Foundational Exploration");
      strengths.push("Interdisciplinary Problem-Solving Aptitude");
    }

    return strengths.slice(0, 4);
  }

  /**
   * Derives targeted growth/development opportunities for the pathway.
   */
  private extractDevelopmentAreas(
    career: CareerEntity,
    skillResult?: SkillFinderFullResultDTO | null,
    _skillsMap: Record<string, number> = {},
    _aptitudeMap: Record<string, number> = {}
  ): string[] {
    const targets: string[] = [];

    // Extract student's growth areas if available
    if (skillResult?.developmentalStrengths?.growthAreas?.length) {
      for (const area of skillResult.developmentalStrengths.growthAreas) {
        targets.push(area);
      }
    }

    // Add career-tailored milestone if needed
    if (targets.length < 2 && career.learning_roadmap?.[0]) {
      targets.push(`Foundational Target: ${career.learning_roadmap[0].title}`);
    }

    if (targets.length === 0) {
      targets.push(
        "Project Stewardship & Time Management",
        "Applied Mathematics & Domain Fundamentals",
        "Technical Communication & Team Collaboration"
      );
    }

    return targets.slice(0, 3);
  }

  /**
   * Generates explainable, deterministic exploratory reasoning grounded in actual assessment vectors.
   */
  private buildExplorationReasoning(
    career: CareerEntity,
    archetype: string,
    strengths: string[],
    driverConstructs: CareerMatchDriver[],
    primaryStream?: string
  ): CareerMatchReasoning {
    const primaryStrength = strengths[0] || "Structured analytical reasoning";
    const streamNote = primaryStream ? ` alongside your strong compatibility with the ${primaryStream} stream` : "";

    const summary = `Your ${primaryStrength.toLowerCase()}${streamNote} indicates strong potential synergy with this pathway. You may explore this pathway to broaden your applied capabilities.`;

    const alignmentNote = `Exploration Guidance: Your profile archetype ("${archetype}") aligns naturally with ${career.category.toLowerCase()} environments. Consider engaging with foundational projects and mentorship in this sector.`;

    const topMatchingFactors = driverConstructs.map((d) => `${d.constructName} (${d.normalizedScore}%)`);

    const whyThisAppears = [
      `High affinity with your primary profile archetype ("${archetype}").`,
      ...strengths.slice(0, 2).map((s) => `Strong indicator in ${s}.`),
      `Career demands align directly with your demonstrated cognitive and interest profile.`,
    ];

    const supportingEvidence = driverConstructs.slice(0, 4).map((d) => {
      let source = "CAREER_ALIGNMENT_SYNTHESIS";
      const code = (d.constructCode || d.constructName || "").toUpperCase();
      if (code.startsWith("INT_") || code.includes("HOLLAND") || code.includes("RIASEC") || ["R", "I", "A", "S", "E", "C"].includes(code)) {
        source = "INTEREST_EVIDENCE";
      } else if (code.startsWith("SKILL_") || code.includes("BEHAVIOUR")) {
        source = "SELF_REPORTED_BEHAVIOUR";
      } else if (code.startsWith("APT_") || code.startsWith("COG_") || code.includes("LOGIC") || code.includes("REASONING")) {
        source = "DEMONSTRATED_TASK_PERFORMANCE";
      } else if (code.startsWith("HABIT_") || code.includes("CURIOSITY") || code.includes("PERSISTENCE")) {
        source = "DEVELOPMENTAL_HABIT";
      }

      return {
        source,
        dimensionCode: d.constructCode,
        label: d.constructName || d.constructCode || "Cognitive Indicator",
        score: d.normalizedScore,
      };
    });

    const developmentConsiderations = [
      `Engage with introductory hands-on projects or exploratory coursework to test sustained interest.`,
      `Seek informal mentorship or informational interviews with professionals currently active in ${career.title}.`,
      `Balance specialized preparation with broad academic fundamentals across mathematics and communication.`,
    ];

    const areasToValidate = [
      `Real-world enjoyment of day-to-day work activities in ${career.category}.`,
      `Academic alignment with prerequisites for target university programs.`,
    ];

    return {
      summary,
      topMatchingFactors,
      alignmentNote,
      whyThisAppears,
      supportingEvidence,
      developmentConsiderations,
      areasToValidate,
    };
  }
}

export const careerMatchingService = new CareerMatchingService();

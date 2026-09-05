/**
 * 3G MeLife Scientifically Structured Career Pathway Recommendation Engine
 *
 * Implements a weighted 4-pillar psychometric matching algorithm:
 * 1. Interest Alignment (RIASEC): 30%
 * 2. Cognitive & Behavioural Skills: 30%
 * 3. Demonstrated Aptitude: 25%
 * 4. Personality & Learning Archetype: 15%
 *
 * Formulates non-deterministic exploratory reasoning ("You may explore this pathway").
 */

import {
  CareerEntity,
  CareerMatchDTO,
  CareerMatchReasoning,
  MatchPillarBreakdown,
} from "./career.types";
import { SkillFinderFullResultDTO } from "../scoring/scoring.types";

export interface CareerMatchComputationOptions {
  languageCode?: string;
}

export class CareerMatchingService {
  /**
   * Computes ranked career pathway recommendations for a student result.
   */
  computeCareerMatches(
    careers: CareerEntity[],
    result: SkillFinderFullResultDTO,
    options?: CareerMatchComputationOptions
  ): CareerMatchDTO[] {
    const lang = options?.languageCode || "en";
    const scoredList = careers.map((career) =>
      this.computeSingleCareerMatch(career, result, lang)
    );

    // Sort descending by match percentage
    return scoredList.sort((a, b) => b.matchPercentage - a.matchPercentage);
  }

  /**
   * Computes a single career match against a student's psychometric result.
   */
  computeSingleCareerMatch(
    career: CareerEntity,
    result: SkillFinderFullResultDTO,
    _languageCode = "en"
  ): CareerMatchDTO {
    // 1. Build construct score lookups from student result
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

    // ========================================================================
    // PILLAR 1: Interest Match (30%) - RIASEC Domain Alignment
    // ========================================================================
    let interestWeightedSum = 0;
    let interestWeightTotal = 0;
    const targetRiasec = career.related_dimensions?.riasec || { I: 0.5, R: 0.5 };

    for (const [code, weight] of Object.entries(targetRiasec)) {
      const studentScore = riasecScores[code.toUpperCase()] ?? 60;
      interestWeightedSum += studentScore * weight;
      interestWeightTotal += weight;
    }
    const interestAffinity =
      interestWeightTotal > 0 ? interestWeightedSum / interestWeightTotal : 75;

    // ========================================================================
    // PILLAR 2: Cognitive & Behavioural Skill Match (30%)
    // ========================================================================
    let skillWeightedSum = 0;
    let skillWeightTotal = 0;
    const targetSkills = career.related_dimensions?.skills || {};

    for (const [skillKey, weight] of Object.entries(targetSkills)) {
      const matchedEntry = Object.entries(skillScores).find(([k]) =>
        k.includes(skillKey.toLowerCase()) || skillKey.toLowerCase().includes(k)
      );
      const studentScore = matchedEntry ? matchedEntry[1] : 70;
      skillWeightedSum += studentScore * weight;
      skillWeightTotal += weight;
    }
    const skillAffinity =
      skillWeightTotal > 0 ? skillWeightedSum / skillWeightTotal : 75;

    // ========================================================================
    // PILLAR 3: Demonstrated Aptitude Match (25%)
    // ========================================================================
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
    const aptitudeAffinity =
      aptitudeWeightTotal > 0 ? aptitudeWeightedSum / aptitudeWeightTotal : 75;

    // ========================================================================
    // PILLAR 4: Personality & Learning Archetype Match (15%)
    // ========================================================================
    const targetArchetypes = career.related_dimensions?.archetypes || [];
    const studentArchetype = result.learningProfile?.archetypeTitle || "Practical Explorer";

    let personalityScore = 70;
    const hasDirectArchetypeMatch = targetArchetypes.some(
      (arch) =>
        studentArchetype.toLowerCase().includes(arch.toLowerCase()) ||
        arch.toLowerCase().includes(studentArchetype.toLowerCase())
    );

    if (hasDirectArchetypeMatch) {
      personalityScore = 92;
    } else {
      // Check partial thematic alignment (e.g. explorer, builder, creator, analyst, leader, organizer)
      const archLower = studentArchetype.toLowerCase();
      const catLower = career.category.toLowerCase();
      if (
        (archLower.includes("explorer") && (catLower.includes("stem") || catLower.includes("science") || catLower.includes("tech"))) ||
        (archLower.includes("builder") && (catLower.includes("engineering") || catLower.includes("applied") || catLower.includes("tech"))) ||
        (archLower.includes("creator") && (catLower.includes("design") || catLower.includes("media") || catLower.includes("art"))) ||
        (archLower.includes("leader") && (catLower.includes("business") || catLower.includes("management") || catLower.includes("entrepreneur"))) ||
        (archLower.includes("mentor") || archLower.includes("helper")) && (catLower.includes("health") || catLower.includes("education") || catLower.includes("social"))
      ) {
        personalityScore = 86;
      } else {
        personalityScore = 74;
      }
    }

    // ========================================================================
    // FINAL COMPOSITE MATCH PERCENTAGE CALCULATION
    // Formula: 30% Interest + 30% Skills + 25% Aptitude + 15% Personality
    // ========================================================================
    const compositeScore =
      0.30 * interestAffinity +
      0.30 * skillAffinity +
      0.25 * aptitudeAffinity +
      0.15 * personalityScore;

    const boundedMatch = Math.min(97, Math.max(60, Math.round(compositeScore)));

    const matchBreakdown: MatchPillarBreakdown = {
      interestScore: Math.round(interestAffinity),
      skillScore: Math.round(skillAffinity),
      aptitudeScore: Math.round(aptitudeAffinity),
      personalityScore: Math.round(personalityScore),
    };

    // ========================================================================
    // STRENGTH ALIGNMENT & DEVELOPMENT AREAS EXTRACTION
    // ========================================================================
    const strengthAlignment: string[] = [];
    const topInterests = result.interestDiscovery?.topClusters || [];
    if (topInterests.length > 0) {
      strengthAlignment.push(`${topInterests[0].name} Affinity (${Math.round(topInterests[0].scalePositionPercentage)}%)`);
    }

    const topSkills = result.skillBehaviour?.strongestIndicators || [];
    if (topSkills.length > 0) {
      strengthAlignment.push(`Strong ${topSkills[0].name}`);
      if (topSkills[1]) {
        strengthAlignment.push(`Demonstrated ${topSkills[1].name}`);
      }
    }

    const topAptitude = result.demonstratedAptitude?.dimensions?.[0];
    if (topAptitude) {
      strengthAlignment.push(`High ${topAptitude.name}`);
    }

    // Fallback if needed
    if (strengthAlignment.length === 0) {
      strengthAlignment.push("Analytical Inquiry", "Structured Problem Solving");
    }

    // Extract Development Areas (growth competencies for this pathway)
    const developmentAreas: string[] = (result.developmentalStrengths?.growthAreas || []).slice(0, 3);
    if (developmentAreas.length === 0) {
      developmentAreas.push(
        "Project Stewardship & Time Management",
        "Domain-Specific Capstone Application",
        "Public Presentation & Technical Communication"
      );
    }

    // ========================================================================
    // EXPLORATORY AI REASONING (Strictly Non-Deterministic)
    // ========================================================================
    const primarySkillsText = topSkills.slice(0, 2).map((s) => s.name.toLowerCase()).join(" and ") || "analytical inquiry";
    const primaryInterestText = topInterests[0]?.name || "applied problem solving";

    const summary = `Your strong ${primarySkillsText}, ${primaryInterestText}, and systems thinking make this pathway a suitable exploration area. You may explore this pathway to expand your multidisciplinary capabilities.`;

    const alignmentNote = `Exploration Note: Your profile archetype ("${studentArchetype}") exhibits high curiosity for ${career.category.toLowerCase()} environments. This represents an enriching pathway for continuous growth.`;

    const reasoning: CareerMatchReasoning = {
      summary,
      topMatchingFactors: strengthAlignment.slice(0, 3),
      alignmentNote,
    };

    return {
      id: career.id,
      slug: career.slug,
      title: career.title,
      category: career.category,
      industry: career.industry,
      description: career.description,
      futureGrowth: career.future_growth,
      matchPercentage: boundedMatch,
      keySkills: career.required_skills.slice(0, 5),
      reasoning,
      strengthAlignment,
      developmentAreas,
      matchBreakdown,
    };
  }
}

export const careerMatchingService = new CareerMatchingService();

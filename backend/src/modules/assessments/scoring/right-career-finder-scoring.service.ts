import {
  RIGHT_CAREER_FAMILIES,
  RIGHT_CAREER_FINDER_DIMENSIONS,
} from "../content/right-career-finder-catalog.data";
import { RawResponseItem } from "../../scoring/scoring.types";

export type RightCareerFamilyCode =
  | "TECH_COMPUTING_AI"
  | "BUSINESS_FINANCE_ENTERPRISE"
  | "HEALTHCARE_LIFE_SCIENCES"
  | "LAW_POLICY_GOVERNANCE"
  | "CREATIVE_DESIGN_MEDIA"
  | "ENGINEERING_SUSTAINABILITY";

export type RightCareerAlignmentBand =
  | "Very Strong Alignment"
  | "Strong Alignment"
  | "Moderate Alignment"
  | "Developing Alignment"
  | "Low Alignment"
  | "Incomplete";

export type RightCareerRecommendationClarity =
  | "High Clarity"
  | "Moderate Clarity"
  | "Mixed Profile / Further Exploration"
  | "Incomplete";

export interface RightCareerFamilyScoreDetails {
  familyCode: RightCareerFamilyCode;
  familyName: string;
  likertPoints: number;
  maxLikertPoints: number;
  likertPercentage: number; // 0.0 to 1.0
  likertDisplayPercentage: number; // 0 to 100
  choiceCount: number;
  maxChoiceCount: number; // 5
  choicePercentage: number; // 0.0 to 1.0
  choiceDisplayPercentage: number; // 0 to 100
  compatibilityPercentage: number; // 0.0 to 1.0 (70% Likert + 30% Choice)
  displayPercentage: number; // 0 to 100
  alignment: RightCareerAlignmentBand;
  suggestedPathways: string;
  exampleAreas: string;
  counsellingNote: string;
}

export interface RightCareerDimensionScoreDetails {
  dimensionCode: string;
  dimensionName: string;
  description: string;
  rawScore: number;
  maxScore: number; // 25 (5 items * 5)
  normalizedScore: number; // 0 to 100
  interpretation: "Very Strong" | "Strong" | "Moderate" | "Developing";
  answeredCount: number;
  totalItems: number;
  strongestCareerLink: string;
}

export interface RightCareerResponseQualityDTO {
  isComplete: boolean;
  answeredCount: number;
  totalQuestions: number;
  straightLiningDetected: boolean;
  completionTimeSeconds?: number;
  qualityFlag: "NORMAL" | "CAUTION_LOW_VARIATION" | "INCOMPLETE";
  pilotDisclaimer: string;
}

export interface RightCareerFinderResultDTO {
  resultId: string;
  attemptId: string;
  participantId: string;
  assessmentCode: "RIGHT_CAREER_FINDER";
  assessmentName: "Career Finder";
  versionCode: string | null;
  versionName: string | null;
  completedQuestions: number;
  totalQuestions: number;
  completionPercentage: number;
  isComplete: boolean;

  // Family Scores (6 Career Families)
  familyScores: Record<RightCareerFamilyCode, RightCareerFamilyScoreDetails>;
  sortedFamilies: RightCareerFamilyScoreDetails[];

  // Primary & Secondary Exploration Focus
  primaryFamily: RightCareerFamilyScoreDetails;
  secondaryFamily: RightCareerFamilyScoreDetails;
  scoreGap: number; // e.g. 0.08
  scoreGapPercentage: number; // e.g. 8%
  clarity: RightCareerRecommendationClarity;
  isMixedProfile: boolean;

  // Explainability Layer (Top 3 Driver Constructs for Primary Match)
  primaryDriverConstructs: Array<{
    dimensionCode: string;
    dimensionName: string;
    normalizedScore: number;
    weight: number;
    rationale: string;
  }>;

  // Dimension Breakdown (9 Core Constructs)
  dimensionScores: Record<string, RightCareerDimensionScoreDetails>;
  sortedDimensions: RightCareerDimensionScoreDetails[];

  // Counsellor & Academic Guidelines
  guidance: {
    interpretationSummary: string;
    careerExplorationDirection: string;
    finalDecisionPrinciple: string;
    doGuidelines: string[];
    avoidGuidelines: string[];
    academicSubjectGuidance: string[];
    counsellorPrinciples: Array<{
      area: string;
      interpretation: string;
      doText: string;
      avoidText: string;
    }>;
  };

  // Response Quality & Administration Meta
  responseQuality: RightCareerResponseQualityDTO;
  scoredAt: string;
}

// Reverse Keyed Question Numbers in Bank: Q5, Q13, Q21, Q29, Q37, Q45, Q53, Q61, Q69
const REVERSE_KEYED_BANK_Q = new Set<number>([5, 13, 21, 29, 37, 45, 53, 61, 69]);

// Dimension Code Mapping for administered Likert items (Bank Q1..Q69, 5 items per dimension)
const LIKERT_BANK_Q_TO_DIMENSION: Record<number, string> = {
  1: "DIM_TECH_DIGITAL", 2: "DIM_TECH_DIGITAL", 3: "DIM_TECH_DIGITAL", 4: "DIM_TECH_DIGITAL", 5: "DIM_TECH_DIGITAL",
  9: "DIM_BUSINESS_ENTERPRISE", 10: "DIM_BUSINESS_ENTERPRISE", 11: "DIM_BUSINESS_ENTERPRISE", 12: "DIM_BUSINESS_ENTERPRISE", 13: "DIM_BUSINESS_ENTERPRISE",
  17: "DIM_FINANCE_ANALYTICS", 18: "DIM_FINANCE_ANALYTICS", 19: "DIM_FINANCE_ANALYTICS", 20: "DIM_FINANCE_ANALYTICS", 21: "DIM_FINANCE_ANALYTICS",
  25: "DIM_CREATIVE_MEDIA_DESIGN", 26: "DIM_CREATIVE_MEDIA_DESIGN", 27: "DIM_CREATIVE_MEDIA_DESIGN", 28: "DIM_CREATIVE_MEDIA_DESIGN", 29: "DIM_CREATIVE_MEDIA_DESIGN",
  33: "DIM_HUMAN_WELLBEING", 34: "DIM_HUMAN_WELLBEING", 35: "DIM_HUMAN_WELLBEING", 36: "DIM_HUMAN_WELLBEING", 37: "DIM_HUMAN_WELLBEING",
  41: "DIM_LEGAL_GOVERNANCE", 42: "DIM_LEGAL_GOVERNANCE", 43: "DIM_LEGAL_GOVERNANCE", 44: "DIM_LEGAL_GOVERNANCE", 45: "DIM_LEGAL_GOVERNANCE",
  49: "DIM_SCIENCE_HEALTHCARE", 50: "DIM_SCIENCE_HEALTHCARE", 51: "DIM_SCIENCE_HEALTHCARE", 52: "DIM_SCIENCE_HEALTHCARE", 53: "DIM_SCIENCE_HEALTHCARE",
  57: "DIM_ENGINEERING_HANDSON", 58: "DIM_ENGINEERING_HANDSON", 59: "DIM_ENGINEERING_HANDSON", 60: "DIM_ENGINEERING_HANDSON", 61: "DIM_ENGINEERING_HANDSON",
  65: "DIM_EDUCATION_RESEARCH", 66: "DIM_EDUCATION_RESEARCH", 67: "DIM_EDUCATION_RESEARCH", 68: "DIM_EDUCATION_RESEARCH", 69: "DIM_EDUCATION_RESEARCH",
};

// Construct weights for each of the 6 Career Families (Weights sum to 1.0)
const FAMILY_CONSTRUCT_WEIGHTS: Record<RightCareerFamilyCode, Record<string, number>> = {
  TECH_COMPUTING_AI: {
    DIM_TECH_DIGITAL: 0.50,
    DIM_ENGINEERING_HANDSON: 0.20,
    DIM_FINANCE_ANALYTICS: 0.15,
    DIM_CREATIVE_MEDIA_DESIGN: 0.10,
    DIM_BUSINESS_ENTERPRISE: 0.05,
    DIM_HUMAN_WELLBEING: 0.00,
    DIM_LEGAL_GOVERNANCE: 0.00,
    DIM_SCIENCE_HEALTHCARE: 0.00,
    DIM_EDUCATION_RESEARCH: 0.00,
  },
  BUSINESS_FINANCE_ENTERPRISE: {
    DIM_BUSINESS_ENTERPRISE: 0.40,
    DIM_FINANCE_ANALYTICS: 0.35,
    DIM_LEGAL_GOVERNANCE: 0.15,
    DIM_TECH_DIGITAL: 0.10,
    DIM_CREATIVE_MEDIA_DESIGN: 0.00,
    DIM_HUMAN_WELLBEING: 0.00,
    DIM_SCIENCE_HEALTHCARE: 0.00,
    DIM_ENGINEERING_HANDSON: 0.00,
    DIM_EDUCATION_RESEARCH: 0.00,
  },
  HEALTHCARE_LIFE_SCIENCES: {
    DIM_SCIENCE_HEALTHCARE: 0.50,
    DIM_HUMAN_WELLBEING: 0.25,
    DIM_EDUCATION_RESEARCH: 0.15,
    DIM_TECH_DIGITAL: 0.10,
    DIM_BUSINESS_ENTERPRISE: 0.00,
    DIM_FINANCE_ANALYTICS: 0.00,
    DIM_CREATIVE_MEDIA_DESIGN: 0.00,
    DIM_LEGAL_GOVERNANCE: 0.00,
    DIM_ENGINEERING_HANDSON: 0.00,
  },
  LAW_POLICY_GOVERNANCE: {
    DIM_LEGAL_GOVERNANCE: 0.45,
    DIM_EDUCATION_RESEARCH: 0.20,
    DIM_BUSINESS_ENTERPRISE: 0.20,
    DIM_HUMAN_WELLBEING: 0.15,
    DIM_TECH_DIGITAL: 0.00,
    DIM_FINANCE_ANALYTICS: 0.00,
    DIM_CREATIVE_MEDIA_DESIGN: 0.00,
    DIM_SCIENCE_HEALTHCARE: 0.00,
    DIM_ENGINEERING_HANDSON: 0.00,
  },
  CREATIVE_DESIGN_MEDIA: {
    DIM_CREATIVE_MEDIA_DESIGN: 0.50,
    DIM_TECH_DIGITAL: 0.20,
    DIM_HUMAN_WELLBEING: 0.15,
    DIM_BUSINESS_ENTERPRISE: 0.15,
    DIM_FINANCE_ANALYTICS: 0.00,
    DIM_LEGAL_GOVERNANCE: 0.00,
    DIM_SCIENCE_HEALTHCARE: 0.00,
    DIM_ENGINEERING_HANDSON: 0.00,
    DIM_EDUCATION_RESEARCH: 0.00,
  },
  ENGINEERING_SUSTAINABILITY: {
    DIM_ENGINEERING_HANDSON: 0.45,
    DIM_TECH_DIGITAL: 0.25,
    DIM_SCIENCE_HEALTHCARE: 0.20,
    DIM_BUSINESS_ENTERPRISE: 0.10,
    DIM_FINANCE_ANALYTICS: 0.00,
    DIM_CREATIVE_MEDIA_DESIGN: 0.00,
    DIM_HUMAN_WELLBEING: 0.00,
    DIM_LEGAL_GOVERNANCE: 0.00,
    DIM_EDUCATION_RESEARCH: 0.00,
  },
};

const DIMENSION_CAREER_LINK: Record<string, string> = {
  DIM_TECH_DIGITAL: "Technology, Software & Intelligent Systems",
  DIM_BUSINESS_ENTERPRISE: "Business Management, Finance & Entrepreneurship",
  DIM_FINANCE_ANALYTICS: "Finance, Quantitative Analysis & FinTech",
  DIM_CREATIVE_MEDIA_DESIGN: "Media, Digital Design & Creative Arts",
  DIM_HUMAN_WELLBEING: "Healthcare, Counselling & Social Care",
  DIM_LEGAL_GOVERNANCE: "Law, Public Affairs, Diplomacy & Social Justice",
  DIM_SCIENCE_HEALTHCARE: "Medicine, Healthcare & Life Sciences",
  DIM_ENGINEERING_HANDSON: "Engineering, Infrastructure & Environmental Sustainability",
  DIM_EDUCATION_RESEARCH: "Education, Pedagogy & Academic Social Research",
};

export class RightCareerFinderScoringService {
  calculateScores(params: {
    attemptId: string;
    participantId: string;
    responses: RawResponseItem[];
    versionCode?: string | null;
    versionName?: string | null;
    totalQuestions?: number;
    completionTimeSeconds?: number;
  }): RightCareerFinderResultDTO {
    const {
      attemptId,
      participantId,
      responses = [],
      versionCode = "RIGHT_CAREER_FINDER_V1",
      versionName = "Career Finder — Standard Pilot Edition",
      totalQuestions = 50,
      completionTimeSeconds,
    } = params;

    const scoredAt = new Date().toISOString();

    // 1. Build Response Lookup Maps
    const likertScoresByDimension: Record<string, number[]> = {
      DIM_TECH_DIGITAL: [],
      DIM_BUSINESS_ENTERPRISE: [],
      DIM_FINANCE_ANALYTICS: [],
      DIM_CREATIVE_MEDIA_DESIGN: [],
      DIM_HUMAN_WELLBEING: [],
      DIM_LEGAL_GOVERNANCE: [],
      DIM_SCIENCE_HEALTHCARE: [],
      DIM_ENGINEERING_HANDSON: [],
      DIM_EDUCATION_RESEARCH: [],
    };

    const choiceCounts: Record<RightCareerFamilyCode, number> = {
      TECH_COMPUTING_AI: 0,
      BUSINESS_FINANCE_ENTERPRISE: 0,
      HEALTHCARE_LIFE_SCIENCES: 0,
      LAW_POLICY_GOVERNANCE: 0,
      CREATIVE_DESIGN_MEDIA: 0,
      ENGINEERING_SUSTAINABILITY: 0,
    };

    let answeredCount = 0;
    const rawLikertValues: number[] = [];

    for (const resp of responses) {
      const respVal = resp?.response_value ?? (resp as any)?.selectedOptionKey ?? (resp as any)?.selected_option_key;
      if (!resp || respVal === undefined || respVal === null || String(respVal).trim() === "") {
        continue;
      }
      answeredCount++;
      const qNum = Number(resp.question_number ?? (resp as any).questionNumber);
      const optKey = String(respVal).trim();

      // Likert Items (Q1..Q69)
      if (qNum in LIKERT_BANK_Q_TO_DIMENSION) {
        const dimCode = LIKERT_BANK_Q_TO_DIMENSION[qNum];
        let val = Number(optKey);
        if (isNaN(val) || val < 1 || val > 5) {
          val = 3; // Fallback neutral
        }
        rawLikertValues.push(val);

        // Apply reverse keying if item is reverse keyed
        const finalScore = REVERSE_KEYED_BANK_Q.has(qNum) ? 6 - val : val;
        likertScoresByDimension[dimCode].push(finalScore);
      }

      // Forced-Choice Career Scenarios (Q73..Q77)
      if (qNum >= 73 && qNum <= 80) {
        if (optKey in choiceCounts) {
          choiceCounts[optKey as RightCareerFamilyCode]++;
        }
      }
    }

    // 2. Response Quality Checks
    const isComplete = answeredCount >= totalQuestions;
    const completionPercentage = totalQuestions > 0 ? Math.min(100, Math.round((answeredCount / totalQuestions) * 100)) : 0;

    let straightLiningDetected = false;
    if (rawLikertValues.length >= 20) {
      const firstVal = rawLikertValues[0];
      const identicalCount = rawLikertValues.filter((v) => v === firstVal).length;
      if (identicalCount / rawLikertValues.length >= 0.85) {
        straightLiningDetected = true;
      }
    }

    let qualityFlag: "NORMAL" | "CAUTION_LOW_VARIATION" | "INCOMPLETE" = "NORMAL";
    if (!isComplete) {
      qualityFlag = "INCOMPLETE";
    } else if (straightLiningDetected) {
      qualityFlag = "CAUTION_LOW_VARIATION";
    }

    // 3. Compute Dimension Scores (9 Construct Dimensions)
    const dimensionScores: Record<string, RightCareerDimensionScoreDetails> = {};
    const dimensionPercentageMap: Record<string, number> = {};

    for (const dim of RIGHT_CAREER_FINDER_DIMENSIONS) {
      if (dim.code === "DIM_CAREER_SCENARIOS") continue; // Scenarios handled separately

      const scores = likertScoresByDimension[dim.code] || [];
      const rawScore = scores.reduce((sum, s) => sum + s, 0);
      const totalItems = 5;
      const maxScore = totalItems * 5; // 25 points max

      // Normalized Score (0 to 100)
      const normalizedScore = Math.round((rawScore / maxScore) * 100);
      dimensionPercentageMap[dim.code] = rawScore / maxScore; // 0.0 to 1.0

      let interpretation: "Very Strong" | "Strong" | "Moderate" | "Developing" = "Moderate";
      if (normalizedScore >= 80) interpretation = "Very Strong";
      else if (normalizedScore >= 65) interpretation = "Strong";
      else if (normalizedScore >= 50) interpretation = "Moderate";
      else interpretation = "Developing";

      dimensionScores[dim.code] = {
        dimensionCode: dim.code,
        dimensionName: dim.name,
        description: dim.description,
        rawScore,
        maxScore,
        normalizedScore,
        interpretation,
        answeredCount: scores.length,
        totalItems,
        strongestCareerLink: DIMENSION_CAREER_LINK[dim.code] || dim.name,
      };
    }

    const sortedDimensions = Object.values(dimensionScores).sort(
      (a, b) => b.normalizedScore - a.normalizedScore
    );

    // 4. Compute 6 Career Family Scores (70% Likert Construct Weights + 30% Scenario Choice)
    const familyScores: Record<RightCareerFamilyCode, RightCareerFamilyScoreDetails> = {} as any;

    for (const fam of RIGHT_CAREER_FAMILIES) {
      const code = fam.code as RightCareerFamilyCode;
      const weights = FAMILY_CONSTRUCT_WEIGHTS[code] || {};

      // Calculate weighted Likert compatibility percentage (0.0 to 1.0)
      let weightedLikert = 0;
      let totalLikertPoints = 0;

      for (const [dimCode, weight] of Object.entries(weights)) {
        if (weight > 0) {
          const dimPct = dimensionPercentageMap[dimCode] || 0;
          weightedLikert += weight * dimPct;
          const dimRaw = dimensionScores[dimCode]?.rawScore || 0;
          totalLikertPoints += dimRaw * weight;
        }
      }

      const likertPercentage = Math.min(1.0, Math.max(0.0, weightedLikert));
      const likertDisplayPercentage = Math.round(likertPercentage * 1000) / 10;

      const choiceCount = choiceCounts[code] || 0;
      const maxChoiceCount = 5;
      const choicePercentage = choiceCount / maxChoiceCount;
      const choiceDisplayPercentage = Math.round(choicePercentage * 1000) / 10;

      // 70 / 30 Scoring Engine
      const compatibilityPercentage = 0.7 * likertPercentage + 0.3 * choicePercentage;
      const displayPercentage = Math.round(compatibilityPercentage * 1000) / 10;

      let alignment: RightCareerAlignmentBand = "Low Alignment";
      if (!isComplete) alignment = "Incomplete";
      else if (displayPercentage >= 80) alignment = "Very Strong Alignment";
      else if (displayPercentage >= 68) alignment = "Strong Alignment";
      else if (displayPercentage >= 55) alignment = "Moderate Alignment";
      else if (displayPercentage >= 42) alignment = "Developing Alignment";
      else alignment = "Low Alignment";

      familyScores[code] = {
        familyCode: code,
        familyName: fam.name,
        likertPoints: Math.round(totalLikertPoints * 10) / 10,
        maxLikertPoints: 25,
        likertPercentage,
        likertDisplayPercentage,
        choiceCount,
        maxChoiceCount,
        choicePercentage,
        choiceDisplayPercentage,
        compatibilityPercentage,
        displayPercentage,
        alignment,
        suggestedPathways: fam.suggestedPathways,
        exampleAreas: fam.exampleAreas,
        counsellingNote: fam.counsellingNote,
      };
    }

    const sortedFamilies = Object.values(familyScores).sort(
      (a, b) => b.displayPercentage - a.displayPercentage
    );

    const primaryFamily = sortedFamilies[0];
    const secondaryFamily = sortedFamilies[1] || primaryFamily;

    const scoreGap = Math.round((primaryFamily.compatibilityPercentage - secondaryFamily.compatibilityPercentage) * 100) / 100;
    const scoreGapPercentage = Math.round((primaryFamily.displayPercentage - secondaryFamily.displayPercentage) * 10) / 10;

    let clarity: RightCareerRecommendationClarity = "Moderate Clarity";
    let isMixedProfile = false;

    if (!isComplete) {
      clarity = "Incomplete";
    } else if (scoreGapPercentage >= 8.0) {
      clarity = "High Clarity";
    } else if (scoreGapPercentage >= 4.0) {
      clarity = "Moderate Clarity";
    } else {
      clarity = "Mixed Profile / Further Exploration";
      isMixedProfile = true;
    }

    // 5. Explainability Layer (Top 3 Driver Constructs for Primary Family)
    const primaryWeights = FAMILY_CONSTRUCT_WEIGHTS[primaryFamily.familyCode] || {};
    const primaryDriverConstructs = Object.entries(primaryWeights)
      .filter(([_, weight]) => weight > 0)
      .map(([dimCode, weight]) => {
        const dimInfo = dimensionScores[dimCode];
        return {
          dimensionCode: dimCode,
          dimensionName: dimInfo?.dimensionName || dimCode,
          normalizedScore: dimInfo?.normalizedScore || 0,
          weight,
          rationale: `Strong affinity in ${dimInfo?.dimensionName || dimCode} (${dimInfo?.normalizedScore || 0}%) strongly reinforces match with ${primaryFamily.familyName}.`,
        };
      })
      .sort((a, b) => b.weight * b.normalizedScore - a.weight * a.normalizedScore)
      .slice(0, 3);

    // 6. Counsellor and Profile Guidelines
    const guidance = {
      interpretationSummary: `The assessment identifies '${primaryFamily.familyName}' (${primaryFamily.displayPercentage}%) as the primary vocational alignment direction, supported secondarily by '${secondaryFamily.familyName}' (${secondaryFamily.displayPercentage}%). Profile clarity is rated as '${clarity}' with a score gap of ${scoreGapPercentage}%.`,
      careerExplorationDirection: `Focus immediate exploration, skill-building, and internship/academic selection around ${primaryFamily.familyName}. Explore interdisciplinary bridges connected to ${secondaryFamily.familyName}.`,
      finalDecisionPrinciple: "Career alignment reports provide psychometric exploration guidance and diagnostic insight. Final educational and vocational decisions should integrate personal values, academic track records, practical market conditions, and professional counsellor consultations.",
      doGuidelines: [
        `Prioritize core pathways within ${primaryFamily.familyName} (${primaryFamily.suggestedPathways}).`,
        `Engage in hands-on projects, real-world case studies, and informational interviews related to ${primaryFamily.exampleAreas}.`,
        "Balance psychometric interest indicators with academic aptitude and deliberate practice.",
        "Review secondary career family synergies for emerging cross-functional career tracks.",
      ],
      avoidGuidelines: [
        "Do not treat assessment rankings as rigid or deterministic career boundaries.",
        "Avoid disregarding low-scoring areas if they represent foundational professional requirements.",
        "Do not make unilateral long-term career shifts without reviewing market dynamics and mentorship guidance.",
      ],
      academicSubjectGuidance: [
        `Recommended Core Focus: High engagement in disciplines supporting ${primaryFamily.familyName}.`,
        `Complementary Electives: Skill sets bridging ${primaryFamily.familyName} and ${secondaryFamily.familyName}.`,
        "Continuous Learning: Build portfolio evidence, technical competencies, and professional communications.",
      ],
      counsellorPrinciples: [
        {
          area: "Primary Vocational Alignment",
          interpretation: primaryFamily.counsellingNote,
          doText: `Guide the student through structured roadmap milestones in ${primaryFamily.familyName}.`,
          avoidText: "Avoid dismissing the student's personal curiosity in other adjacent sectors.",
        },
        {
          area: "Secondary Synergy Alignment",
          interpretation: secondaryFamily.counsellingNote,
          doText: `Examine hybrid career pathways connecting ${primaryFamily.familyName} and ${secondaryFamily.familyName}.`,
          avoidText: "Avoid forcing a choice strictly between the top two when hybrid career niches exist.",
        },
      ],
    };

    const responseQuality: RightCareerResponseQualityDTO = {
      isComplete,
      answeredCount,
      totalQuestions,
      straightLiningDetected,
      completionTimeSeconds,
      qualityFlag,
      pilotDisclaimer:
        "3G MeLife Career Finder (Standard Pilot Edition) is an educational guidance and vocational alignment instrument. Results reflect self-reported psychometric affinities and should be utilized alongside comprehensive career counselling.",
    };

    return {
      resultId: `res_${attemptId}`,
      attemptId,
      participantId,
      assessmentCode: "RIGHT_CAREER_FINDER",
      assessmentName: "Career Finder",
      versionCode,
      versionName,
      completedQuestions: answeredCount,
      totalQuestions,
      completionPercentage,
      isComplete,
      familyScores,
      sortedFamilies,
      primaryFamily,
      secondaryFamily,
      scoreGap,
      scoreGapPercentage,
      clarity,
      isMixedProfile,
      primaryDriverConstructs,
      dimensionScores,
      sortedDimensions,
      guidance,
      responseQuality,
      scoredAt,
    };
  }
}

export const rightCareerFinderScoringService = new RightCareerFinderScoringService();

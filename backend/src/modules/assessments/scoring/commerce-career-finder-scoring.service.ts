import {
  COMMERCE_CAREER_FAMILIES,
  COMMERCE_CAREER_FINDER_DIMENSIONS,
} from "../content/commerce-career-finder-catalog.data";
import { RawResponseItem } from "../../scoring/scoring.types";

export type CommerceFamilyCode =
  | "ACCOUNTING_AUDIT_TAX"
  | "FINANCE_INVESTMENT_BANKING"
  | "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
  | "ECONOMICS_ANALYTICS_FINTECH";

export type CommerceAlignmentBand =
  | "Very Strong Alignment"
  | "Strong Alignment"
  | "Moderate Alignment"
  | "Developing Alignment"
  | "Low Alignment"
  | "Incomplete";

export type CommerceRecommendationClarity =
  | "High Clarity"
  | "Moderate Clarity"
  | "Mixed Profile / Further Exploration"
  | "Incomplete";

export interface CommerceCareerFamilyScoreDetails {
  familyCode: CommerceFamilyCode;
  familyName: string;
  likertPoints: number;
  maxLikertPoints: number; // 50 (10 items * 5)
  likertPercentage: number; // 0.0 to 1.0
  likertDisplayPercentage: number; // 0 to 100
  choiceCount: number;
  maxChoiceCount: number; // 5 (5 scenarios)
  choicePercentage: number; // 0.0 to 1.0
  choiceDisplayPercentage: number; // 0 to 100
  compatibilityPercentage: number; // 0.0 to 1.0 (70% Likert + 30% Choice)
  displayPercentage: number; // 0 to 100
  alignment: CommerceAlignmentBand;
  suggestedPathways: string;
  exampleAreas: string;
  counsellingNote: string;
}

export interface CommerceDimensionScoreDetails {
  dimensionCode: string;
  dimensionName: string;
  description: string;
  rawScore: number;
  maxScore: number;
  normalizedScore: number; // 0 to 100
  answeredCount: number;
  totalItems: number;
}

export interface CommerceResponseQualityDTO {
  isComplete: boolean;
  answeredCount: number;
  totalQuestions: number;
  straightLiningDetected: boolean;
  completionTimeSeconds?: number;
  qualityFlag: "NORMAL" | "CAUTION_LOW_VARIATION" | "INCOMPLETE";
  pilotDisclaimer: string;
}

export interface CommerceCareerFinderResultDTO {
  resultId: string;
  attemptId: string;
  participantId: string;
  assessmentCode: "COMMERCE_CAREER_FINDER";
  assessmentName: "Commerce Career Finder";
  versionCode: string | null;
  versionName: string | null;
  completedQuestions: number;
  totalQuestions: number;
  completionPercentage: number;
  isComplete: boolean;

  // Family Scores (4 Career Families from Excel)
  familyScores: Record<CommerceFamilyCode, CommerceCareerFamilyScoreDetails>;
  sortedFamilies: CommerceCareerFamilyScoreDetails[];

  // Primary & Secondary Exploration Focus
  primaryFamily: CommerceCareerFamilyScoreDetails;
  secondaryFamily: CommerceCareerFamilyScoreDetails;
  scoreGap: number; // e.g. 0.12
  scoreGapPercentage: number; // e.g. 12%
  clarity: CommerceRecommendationClarity;
  isMixedProfile: boolean;

  // Dimension Breakdown (6 Dimensions from Excel)
  dimensionScores: Record<string, CommerceDimensionScoreDetails>;
  sortedDimensions: CommerceDimensionScoreDetails[];

  // Counsellor & Academic Guidelines (Excel Sheets: Counsellor Guide, Profile & Academic)
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
  responseQuality: CommerceResponseQualityDTO;
  scoredAt: string;
}

// Map Bank Question ID -> Family Code for Likert (1..40)
const LIKERT_BANK_Q_TO_FAMILY: Record<number, CommerceFamilyCode> = {
  1: "ACCOUNTING_AUDIT_TAX",
  5: "ACCOUNTING_AUDIT_TAX",
  9: "ACCOUNTING_AUDIT_TAX",
  14: "ACCOUNTING_AUDIT_TAX",
  18: "ACCOUNTING_AUDIT_TAX",
  23: "ACCOUNTING_AUDIT_TAX",
  27: "ACCOUNTING_AUDIT_TAX",
  32: "ACCOUNTING_AUDIT_TAX",
  36: "ACCOUNTING_AUDIT_TAX",
  40: "ACCOUNTING_AUDIT_TAX",

  2: "FINANCE_INVESTMENT_BANKING",
  6: "FINANCE_INVESTMENT_BANKING",
  10: "FINANCE_INVESTMENT_BANKING",
  11: "FINANCE_INVESTMENT_BANKING",
  15: "FINANCE_INVESTMENT_BANKING",
  19: "FINANCE_INVESTMENT_BANKING",
  24: "FINANCE_INVESTMENT_BANKING",
  28: "FINANCE_INVESTMENT_BANKING",
  33: "FINANCE_INVESTMENT_BANKING",
  37: "FINANCE_INVESTMENT_BANKING",

  3: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP",
  7: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP",
  12: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP",
  16: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP",
  20: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP",
  21: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP",
  25: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP",
  29: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP",
  34: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP",
  38: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP",

  4: "ECONOMICS_ANALYTICS_FINTECH",
  8: "ECONOMICS_ANALYTICS_FINTECH",
  13: "ECONOMICS_ANALYTICS_FINTECH",
  17: "ECONOMICS_ANALYTICS_FINTECH",
  22: "ECONOMICS_ANALYTICS_FINTECH",
  26: "ECONOMICS_ANALYTICS_FINTECH",
  30: "ECONOMICS_ANALYTICS_FINTECH",
  31: "ECONOMICS_ANALYTICS_FINTECH",
  35: "ECONOMICS_ANALYTICS_FINTECH",
  39: "ECONOMICS_ANALYTICS_FINTECH",
};

// Map Bank Question ID -> Dimension Code
const LIKERT_BANK_Q_TO_DIMENSION: Record<number, string> = {
  1: "DIM_FIN_NUM", 2: "DIM_FIN_NUM", 3: "DIM_FIN_NUM", 4: "DIM_FIN_NUM", 5: "DIM_FIN_NUM",
  6: "DIM_FIN_NUM", 7: "DIM_FIN_NUM", 8: "DIM_FIN_NUM", 9: "DIM_FIN_NUM", 10: "DIM_FIN_NUM",
  11: "DIM_COMM_INT", 12: "DIM_COMM_INT", 13: "DIM_COMM_INT", 14: "DIM_COMM_INT", 15: "DIM_COMM_INT",
  16: "DIM_COMM_INT", 17: "DIM_COMM_INT", 18: "DIM_COMM_INT", 19: "DIM_COMM_INT", 20: "DIM_COMM_INT",
  21: "DIM_ANAL_DATA", 22: "DIM_ANAL_DATA", 23: "DIM_ANAL_DATA", 24: "DIM_ANAL_DATA", 25: "DIM_ANAL_DATA",
  26: "DIM_ANAL_DATA", 27: "DIM_ANAL_DATA", 28: "DIM_ANAL_DATA", 29: "DIM_ANAL_DATA", 30: "DIM_ANAL_DATA",
  31: "DIM_ENTR_LEAD", 32: "DIM_ENTR_LEAD", 33: "DIM_ENTR_LEAD", 34: "DIM_ENTR_LEAD", 35: "DIM_ENTR_LEAD",
  36: "DIM_ENTR_LEAD", 37: "DIM_ENTR_LEAD", 38: "DIM_ENTR_LEAD", 39: "DIM_ENTR_LEAD", 40: "DIM_ENTR_LEAD",
};

// Map Option Key (A, B, C, D) -> Family Code for Forced Choice (Bank Q61..Q65)
const FORCED_CHOICE_OPTION_TO_FAMILY: Record<string, CommerceFamilyCode> = {
  A: "ACCOUNTING_AUDIT_TAX",
  B: "FINANCE_INVESTMENT_BANKING",
  C: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP",
  D: "ECONOMICS_ANALYTICS_FINTECH",
};

export class CommerceCareerFinderScoringService {
  /**
   * Evaluates participant responses for Commerce Career Finder.
   * Total Standard Form Questions: 45 (40 Likert + 5 Forced Choice).
   * Formula: Compatibility % = 0.70 * Likert % + 0.30 * Choice %
   */
  public calculateScores(params: {
    attemptId: string;
    participantId: string;
    versionCode?: string | null;
    versionName?: string | null;
    responses: RawResponseItem[] | any[];
    completionTimeSeconds?: number;
  }): CommerceCareerFinderResultDTO {
    const { attemptId, participantId, versionCode, versionName, responses, completionTimeSeconds } = params;

    const totalQuestions = 45;
    const answeredResponses = (responses || []).filter((r) => {
      const val = r.response_value ?? r.responseValue ?? r.selectedOptionKey ?? r.option_key;
      return val !== null && val !== undefined && String(val).trim() !== "";
    });
    const answeredCount = answeredResponses.length;
    const isComplete = answeredCount >= totalQuestions;
    const completionPercentage = Math.min(100, Math.round((answeredCount / totalQuestions) * 100));

    // Initialise Family Tallies
    const familyLikertPoints: Record<CommerceFamilyCode, number> = {
      ACCOUNTING_AUDIT_TAX: 0,
      FINANCE_INVESTMENT_BANKING: 0,
      BUSINESS_MANAGEMENT_ENTREPRENEURSHIP: 0,
      ECONOMICS_ANALYTICS_FINTECH: 0,
    };

    const familyChoiceCounts: Record<CommerceFamilyCode, number> = {
      ACCOUNTING_AUDIT_TAX: 0,
      FINANCE_INVESTMENT_BANKING: 0,
      BUSINESS_MANAGEMENT_ENTREPRENEURSHIP: 0,
      ECONOMICS_ANALYTICS_FINTECH: 0,
    };

    // Initialise Dimension Tallies
    const dimensionTallies: Record<string, { raw: number; count: number }> = {};
    for (const d of COMMERCE_CAREER_FINDER_DIMENSIONS) {
      dimensionTallies[d.code] = { raw: 0, count: 0 };
    }

    const likertOptionValues: number[] = [];

    for (const r of answeredResponses) {
      const qNum = Number(r.question_number ?? r.questionNumber);
      const optKey = String(r.option_key ?? r.selectedOptionKey ?? r.response_value ?? r.responseValue ?? "")
        .trim()
        .toUpperCase();
      const scoreVal = Number(r.score_value ?? r.selectedOptionValue ?? r.response_value ?? r.responseValue);

      // Likert Questions (Bank Q1..Q40)
      if (qNum >= 1 && qNum <= 40) {
        const val = !isNaN(scoreVal) && scoreVal >= 1 && scoreVal <= 5 ? scoreVal : Number(optKey) || 3;
        likertOptionValues.push(val);

        const family = LIKERT_BANK_Q_TO_FAMILY[qNum];
        if (family) {
          familyLikertPoints[family] += val;
        }

        const dim = LIKERT_BANK_Q_TO_DIMENSION[qNum];
        if (dim && dimensionTallies[dim]) {
          dimensionTallies[dim].raw += val;
          dimensionTallies[dim].count += 1;
        }
      }

      // Forced-Choice Questions (Bank Q61..Q65)
      if (qNum >= 61 && qNum <= 65) {
        const family = FORCED_CHOICE_OPTION_TO_FAMILY[optKey];
        if (family) {
          familyChoiceCounts[family] += 1;
        }
      }
    }

    // Straight-lining quality check
    let straightLiningDetected = false;
    if (likertOptionValues.length >= 20) {
      const valCounts: Record<number, number> = {};
      for (const v of likertOptionValues) {
        valCounts[v] = (valCounts[v] || 0) + 1;
      }
      const maxFreq = Math.max(...Object.values(valCounts));
      if (maxFreq / likertOptionValues.length >= 0.8) {
        straightLiningDetected = true;
      }
    }

    // Build Family Details (Formula: 0.70 * Likert % + 0.30 * Choice %)
    const familyScores: Record<CommerceFamilyCode, CommerceCareerFamilyScoreDetails> = {} as any;

    for (const def of COMMERCE_CAREER_FAMILIES) {
      const code = def.code as CommerceFamilyCode;
      const likertPts = familyLikertPoints[code];
      const maxLikert = 50; // 10 items * 5 max points
      const likertPct = maxLikert > 0 ? likertPts / maxLikert : 0;
      const likertDispPct = Math.round(likertPct * 100);

      const choiceCnt = familyChoiceCounts[code];
      const maxChoice = 5; // 5 scenario questions
      const choicePct = maxChoice > 0 ? choiceCnt / maxChoice : 0;
      const choiceDispPct = Math.round(choicePct * 100);

      const compPct = 0.7 * likertPct + 0.3 * choicePct;
      const dispPct = Math.round(compPct * 100);

      // Exact Excel Alignment Thresholds:
      // >= 0.80 -> Very Strong Alignment
      // >= 0.70 -> Strong Alignment
      // >= 0.60 -> Moderate Alignment
      // >= 0.50 -> Developing Alignment
      // < 0.50  -> Low Alignment
      let alignment: CommerceAlignmentBand = "Moderate Alignment";
      if (!isComplete) {
        alignment = "Incomplete";
      } else if (compPct >= 0.8) {
        alignment = "Very Strong Alignment";
      } else if (compPct >= 0.7) {
        alignment = "Strong Alignment";
      } else if (compPct >= 0.6) {
        alignment = "Moderate Alignment";
      } else if (compPct >= 0.5) {
        alignment = "Developing Alignment";
      } else {
        alignment = "Low Alignment";
      }

      familyScores[code] = {
        familyCode: code,
        familyName: def.name,
        likertPoints: likertPts,
        maxLikertPoints: maxLikert,
        likertPercentage: parseFloat(likertPct.toFixed(4)),
        likertDisplayPercentage: likertDispPct,
        choiceCount: choiceCnt,
        maxChoiceCount: maxChoice,
        choicePercentage: parseFloat(choicePct.toFixed(4)),
        choiceDisplayPercentage: choiceDispPct,
        compatibilityPercentage: parseFloat(compPct.toFixed(4)),
        displayPercentage: dispPct,
        alignment,
        suggestedPathways: def.suggestedPathways,
        exampleAreas: def.exampleAreas,
        counsellingNote: def.counsellingNote,
      };
    }

    // Sort families by compatibility descending
    const sortedFamilies = Object.values(familyScores).sort(
      (a, b) => b.compatibilityPercentage - a.compatibilityPercentage
    );

    const primaryFamily = sortedFamilies[0];
    const secondaryFamily = sortedFamilies[1];
    const scoreGap = parseFloat(
      (primaryFamily.compatibilityPercentage - secondaryFamily.compatibilityPercentage).toFixed(4)
    );
    const scoreGapPercentage = Math.round(scoreGap * 100);

    // Exact Excel Recommendation Clarity Thresholds:
    // Gap >= 0.15 (15%) -> High Clarity
    // Gap >= 0.08 (8%)  -> Moderate Clarity
    // Otherwise        -> Mixed Profile / Further Exploration
    let clarity: CommerceRecommendationClarity = "Moderate Clarity";
    let isMixedProfile = false;

    if (!isComplete) {
      clarity = "Incomplete";
    } else if (scoreGap >= 0.15) {
      clarity = "High Clarity";
    } else if (scoreGap >= 0.08) {
      clarity = "Moderate Clarity";
    } else {
      clarity = "Mixed Profile / Further Exploration";
      isMixedProfile = true;
    }

    // Dimension Scores (6 Dimensions)
    const dimensionScores: Record<string, CommerceDimensionScoreDetails> = {};
    for (const d of COMMERCE_CAREER_FINDER_DIMENSIONS) {
      const t = dimensionTallies[d.code] || { raw: 0, count: 0 };
      const maxScore = (t.count > 0 ? t.count : 10) * 5;
      const normalizedScore = maxScore > 0 ? Math.round((t.raw / maxScore) * 100) : 0;

      dimensionScores[d.code] = {
        dimensionCode: d.code,
        dimensionName: d.name,
        description: d.description,
        rawScore: t.raw,
        maxScore,
        normalizedScore,
        answeredCount: t.count,
        totalItems: 10,
      };
    }

    const sortedDimensions = Object.values(dimensionScores).sort(
      (a, b) => b.normalizedScore - a.normalizedScore
    );

    // Build Interpretation Text from Excel Final Report formula
    let claritySentence = "The score pattern shows a clearer leading commerce-career pathway.";
    if (clarity === "Moderate Clarity") {
      claritySentence = "One pathway is stronger, while the secondary option remains meaningful.";
    } else if (clarity === "Mixed Profile / Further Exploration") {
      claritySentence = "The leading pathways are close. Explore both before making a final decision.";
    }

    const interpretationSummary = isComplete
      ? `Your current profile shows strongest alignment with ${primaryFamily.familyName} (${primaryFamily.displayPercentage}%) and secondary alignment with ${secondaryFamily.familyName} (${secondaryFamily.displayPercentage}%). ${claritySentence}`
      : "Complete all 45 responses to generate the final interpretation.";

    const careerExplorationDirection = isComplete
      ? `${primaryFamily.suggestedPathways}. Example areas: ${primaryFamily.exampleAreas}`
      : "Complete the assessment to unlock career exploration guidance.";

    const finalDecisionPrinciple =
      "Student Interest + Academic Performance + Commerce Career Finder Result + Career Goals + Subject Eligibility + Career Counsellor Guidance + Parent Support";

    const doGuidelines = [
      `Use primary (${primaryFamily.familyName}) and secondary (${secondaryFamily.familyName}) scores together.`,
      `Discuss the leading pathway and the meaningful secondary pathway.`,
      `Compare the profile with Mathematics, Accountancy, Business Studies, Economics and relevant academic performance.`,
      `Check prerequisites, strengths, learning needs, and current course requirements.`,
      `Ask what activities, subjects and work environments the student actually enjoys.`,
    ];

    const avoidGuidelines = [
      `Avoid treating one score as a guaranteed career choice.`,
      `Do not use the assessment score instead of eligibility or academic evidence.`,
      `Avoid forcing a single pathway when the profile is genuinely close.`,
      `Avoid presenting professional examples such as CA/CFA as automatic outcomes.`,
      `Do not use the result to label ability or restrict choices.`,
    ];

    const academicSubjectGuidance = [
      "Mathematics & Statistics: Required foundation for quantitative finance, economics, analytics, and actuarial domains.",
      "Accountancy & Financial Control: Core for CA, CMA, ACCA, statutory auditing, and taxation pathways.",
      "Business Studies & Management: Essential for enterprise management, consulting, marketing, and entrepreneurship.",
      "Economics & Quantitative Methods: Foundation for macroeconomic policy, market research, and FinTech data modeling.",
    ];

    const counsellorPrinciples = [
      {
        area: "Overall result",
        interpretation: "Use primary and secondary career-family scores together.",
        doText: "Discuss the leading pathway and the meaningful secondary pathway.",
        avoidText: "Treating one score as a guaranteed career choice.",
      },
      {
        area: "Academic evidence",
        interpretation: "Compare the profile with Mathematics, Accountancy, Business Studies, Economics and relevant academic performance.",
        doText: "Check prerequisites, strengths and learning needs.",
        avoidText: "Using assessment score instead of eligibility or academic evidence.",
      },
      {
        area: "Mixed profile",
        interpretation: "Close scores may indicate multiple plausible commerce pathways.",
        doText: "Explore both pathways and use student voice to narrow the direction.",
        avoidText: "Forcing a single pathway when the profile is genuinely close.",
      },
      {
        area: "Student voice",
        interpretation: "Ask what activities, subjects and work environments the student actually enjoys.",
        doText: "Use open questions and examples from the report.",
        avoidText: "Allowing parents or peers to answer for the student.",
      },
      {
        area: "Career reality",
        interpretation: "Career pathways differ by country, qualification, institution and licensing rules.",
        doText: "Check current course requirements, professional-body requirements and labour-market information.",
        avoidText: "Presenting examples such as CA/CFA as automatic outcomes.",
      },
      {
        area: "Ethics",
        interpretation: "The assessment is educational guidance evidence.",
        doText: "Combine assessment evidence with counselling, academic evidence and student goals.",
        avoidText: "Using the result to label ability or restrict choices.",
      },
    ];

    let qualityFlag: "NORMAL" | "CAUTION_LOW_VARIATION" | "INCOMPLETE" = "NORMAL";
    if (!isComplete) {
      qualityFlag = "INCOMPLETE";
    } else if (straightLiningDetected) {
      qualityFlag = "CAUTION_LOW_VARIATION";
    }

    return {
      resultId: `res_${attemptId}`,
      attemptId,
      participantId,
      assessmentCode: "COMMERCE_CAREER_FINDER",
      assessmentName: "Commerce Career Finder",
      versionCode: versionCode || "COMMERCE_CAREER_FINDER_V1",
      versionName: versionName || "Commerce Career Finder — Standard Pilot Edition",
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

      dimensionScores,
      sortedDimensions,

      guidance: {
        interpretationSummary,
        careerExplorationDirection,
        finalDecisionPrinciple,
        doGuidelines,
        avoidGuidelines,
        academicSubjectGuidance,
        counsellorPrinciples,
      },

      responseQuality: {
        isComplete,
        answeredCount,
        totalQuestions,
        straightLiningDetected,
        completionTimeSeconds,
        qualityFlag,
        pilotDisclaimer:
          "Professional Use Statement: This assessment is educational career guidance evidence. Results should be interpreted with academic records, eligibility requirements, student interests, career goals, current course requirements and professional counselling. The Standard Pilot Edition is not presented as a validated instrument.",
      },
      scoredAt: new Date().toISOString(),
    };
  }
}

export const commerceCareerFinderScoringService = new CommerceCareerFinderScoringService();

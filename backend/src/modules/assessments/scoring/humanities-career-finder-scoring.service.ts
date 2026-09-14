import {
  HUMANITIES_CAREER_FAMILIES,
  HUMANITIES_CAREER_FINDER_DIMENSIONS,
} from "../content/humanities-career-finder-catalog.data";
import { RawResponseItem } from "../../scoring/scoring.types";

export type HumanitiesFamilyCode =
  | "HUMAN_BEHAVIOUR_WELLBEING"
  | "LAW_PUBLIC_AFFAIRS_JUSTICE"
  | "MEDIA_COMM_CREATIVE_CULTURE"
  | "EDUCATION_LANG_SOCIAL_RESEARCH";

export type HumanitiesAlignmentBand =
  | "Very Strong Alignment"
  | "Strong Alignment"
  | "Moderate Alignment"
  | "Developing Alignment"
  | "Low Alignment"
  | "Incomplete";

export type HumanitiesRecommendationClarity =
  | "High Clarity"
  | "Moderate Clarity"
  | "Mixed Profile / Further Exploration"
  | "Incomplete";

export interface HumanitiesCareerFamilyScoreDetails {
  familyCode: HumanitiesFamilyCode;
  familyName: string;
  likertPoints: number;
  maxLikertPoints: number;
  likertPercentage: number; // 0.0 to 1.0
  likertDisplayPercentage: number; // 0 to 100
  choiceCount: number;
  maxChoiceCount: number; // 5 (5 scenarios)
  choicePercentage: number; // 0.0 to 1.0
  choiceDisplayPercentage: number; // 0 to 100
  compatibilityPercentage: number; // 0.0 to 1.0 (70% Likert + 30% Choice)
  displayPercentage: number; // 0 to 100
  alignment: HumanitiesAlignmentBand;
  suggestedPathways: string;
  exampleAreas: string;
  counsellingNote: string;
}

export interface HumanitiesDimensionScoreDetails {
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

export interface HumanitiesResponseQualityDTO {
  isComplete: boolean;
  answeredCount: number;
  totalQuestions: number;
  straightLiningDetected: boolean;
  completionTimeSeconds?: number;
  qualityFlag: "NORMAL" | "CAUTION_LOW_VARIATION" | "INCOMPLETE";
  pilotDisclaimer: string;
}

export interface HumanitiesCareerFinderResultDTO {
  resultId: string;
  attemptId: string;
  participantId: string;
  assessmentCode: "HUMANITIES_CAREER_FINDER";
  assessmentName: "Humanities Career Finder";
  versionCode: string | null;
  versionName: string | null;
  completedQuestions: number;
  totalQuestions: number;
  completionPercentage: number;
  isComplete: boolean;

  // Family Scores (4 Career Families from Excel)
  familyScores: Record<HumanitiesFamilyCode, HumanitiesCareerFamilyScoreDetails>;
  sortedFamilies: HumanitiesCareerFamilyScoreDetails[];

  // Primary & Secondary Exploration Focus
  primaryFamily: HumanitiesCareerFamilyScoreDetails;
  secondaryFamily: HumanitiesCareerFamilyScoreDetails;
  scoreGap: number; // e.g. 0.12
  scoreGapPercentage: number; // e.g. 12%
  clarity: HumanitiesRecommendationClarity;
  isMixedProfile: boolean;

  // Dimension Breakdown (8 Dimensions from Excel)
  dimensionScores: Record<string, HumanitiesDimensionScoreDetails>;
  sortedDimensions: HumanitiesDimensionScoreDetails[];

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
  responseQuality: HumanitiesResponseQualityDTO;
  scoredAt: string;
}

// Reverse Keyed Question Numbers in Bank: Q5, Q13, Q21, Q29, Q37, Q44, Q51, Q58
const REVERSE_KEYED_BANK_Q = new Set<number>([5, 13, 21, 29, 37, 44, 51, 58]);

// Bank Question Construct Map to weights: [HB, Law, Med, Edu]
const LIKERT_WEIGHTS_BY_CONSTRUCT: Record<string, { HB: number; Law: number; Med: number; Edu: number }> = {
  DIM_HUMAN_BEHAVIOUR: { HB: 0.50, Law: 0.10, Med: 0.15, Edu: 0.25 },
  DIM_LANGUAGE_COMM: { HB: 0.15, Law: 0.10, Med: 0.45, Edu: 0.30 },
  DIM_SOCIETY_CULTURE: { HB: 0.20, Law: 0.25, Med: 0.20, Edu: 0.35 },
  DIM_LAW_JUSTICE: { HB: 0.10, Law: 0.50, Med: 0.15, Edu: 0.25 },
  DIM_HISTORY_EVIDENCE: { HB: 0.15, Law: 0.25, Med: 0.25, Edu: 0.35 },
  DIM_CREATIVE_MEDIA: { HB: 0.20, Law: 0.10, Med: 0.50, Edu: 0.20 },
  DIM_EDUCATION_FACIL: { HB: 0.35, Law: 0.10, Med: 0.25, Edu: 0.30 },
  DIM_RESEARCH_POLICY: { HB: 0.15, Law: 0.30, Med: 0.20, Edu: 0.35 },
};

// Map Bank Question ID -> Dimension Code for Likert (1..40 pilot items)
const LIKERT_BANK_Q_TO_DIMENSION: Record<number, string> = {
  1: "DIM_HUMAN_BEHAVIOUR", 2: "DIM_HUMAN_BEHAVIOUR", 3: "DIM_HUMAN_BEHAVIOUR", 4: "DIM_HUMAN_BEHAVIOUR", 5: "DIM_HUMAN_BEHAVIOUR",
  9: "DIM_LANGUAGE_COMM", 10: "DIM_LANGUAGE_COMM", 11: "DIM_LANGUAGE_COMM", 12: "DIM_LANGUAGE_COMM", 13: "DIM_LANGUAGE_COMM",
  17: "DIM_SOCIETY_CULTURE", 18: "DIM_SOCIETY_CULTURE", 19: "DIM_SOCIETY_CULTURE", 20: "DIM_SOCIETY_CULTURE", 21: "DIM_SOCIETY_CULTURE",
  25: "DIM_LAW_JUSTICE", 26: "DIM_LAW_JUSTICE", 27: "DIM_LAW_JUSTICE", 28: "DIM_LAW_JUSTICE", 29: "DIM_LAW_JUSTICE",
  33: "DIM_HISTORY_EVIDENCE", 34: "DIM_HISTORY_EVIDENCE", 35: "DIM_HISTORY_EVIDENCE", 36: "DIM_HISTORY_EVIDENCE", 37: "DIM_HISTORY_EVIDENCE",
  40: "DIM_CREATIVE_MEDIA", 41: "DIM_CREATIVE_MEDIA", 42: "DIM_CREATIVE_MEDIA", 43: "DIM_CREATIVE_MEDIA", 44: "DIM_CREATIVE_MEDIA",
  47: "DIM_EDUCATION_FACIL", 48: "DIM_EDUCATION_FACIL", 49: "DIM_EDUCATION_FACIL", 50: "DIM_EDUCATION_FACIL", 51: "DIM_EDUCATION_FACIL",
  54: "DIM_RESEARCH_POLICY", 55: "DIM_RESEARCH_POLICY", 56: "DIM_RESEARCH_POLICY", 57: "DIM_RESEARCH_POLICY", 58: "DIM_RESEARCH_POLICY",
};

// Map Scenario Forced-Choice Option Key -> Family Code
const SCENARIO_OPTION_TO_FAMILY: Record<string, HumanitiesFamilyCode> = {
  A: "HUMAN_BEHAVIOUR_WELLBEING",
  B: "LAW_PUBLIC_AFFAIRS_JUSTICE",
  C: "MEDIA_COMM_CREATIVE_CULTURE",
  D: "EDUCATION_LANG_SOCIAL_RESEARCH",
};

export class HumanitiesCareerFinderScoringService {
  calculateScores(params: {
    attemptId: string;
    participantId: string;
    responses: RawResponseItem[];
    versionCode?: string | null;
    versionName?: string | null;
    completionTimeSeconds?: number;
    languageCode?: string;
  }): HumanitiesCareerFinderResultDTO {
    return this.computeHumanitiesCareerFinderResult(
      params.attemptId,
      params.participantId,
      params.responses,
      {
        versionCode: params.versionCode,
        versionName: params.versionName,
        completionTimeSeconds: params.completionTimeSeconds,
        languageCode: params.languageCode,
      }
    );
  }

  computeHumanitiesCareerFinderResult(
    attemptId: string,
    participantId: string,
    rawResponses: RawResponseItem[],
    meta?: {
      versionCode?: string | null;
      versionName?: string | null;
      completionTimeSeconds?: number;
      languageCode?: string;
    }
  ): HumanitiesCareerFinderResultDTO {
    const TOTAL_ADMINISTERED_QUESTIONS = 45;
    const SCENARIOS_COUNT = 5;

    // 1. Map raw responses by bank question number
    const responseMap = new Map<number, RawResponseItem>();
    for (const r of rawResponses) {
      const qNum = parseInt(String(r.question_number), 10);
      if (!isNaN(qNum)) {
        responseMap.set(qNum, r);
      }
    }

    const answeredCount = rawResponses.filter((r) => r.response_value && r.response_value.trim() !== "").length;
    const isComplete = answeredCount >= TOTAL_ADMINISTERED_QUESTIONS;
    const completionPercentage = Math.round((answeredCount / TOTAL_ADMINISTERED_QUESTIONS) * 100);

    // 2. Compute Likert Scores & Dimension Breakdown
    // Dimensions: 8 dimensions x 5 items = 25 max points each
    const dimRawScores: Record<string, { rawScore: number; answeredCount: number; totalItems: number }> = {
      DIM_HUMAN_BEHAVIOUR: { rawScore: 0, answeredCount: 0, totalItems: 5 },
      DIM_LANGUAGE_COMM: { rawScore: 0, answeredCount: 0, totalItems: 5 },
      DIM_SOCIETY_CULTURE: { rawScore: 0, answeredCount: 0, totalItems: 5 },
      DIM_LAW_JUSTICE: { rawScore: 0, answeredCount: 0, totalItems: 5 },
      DIM_HISTORY_EVIDENCE: { rawScore: 0, answeredCount: 0, totalItems: 5 },
      DIM_CREATIVE_MEDIA: { rawScore: 0, answeredCount: 0, totalItems: 5 },
      DIM_EDUCATION_FACIL: { rawScore: 0, answeredCount: 0, totalItems: 5 },
      DIM_RESEARCH_POLICY: { rawScore: 0, answeredCount: 0, totalItems: 5 },
    };

    // Family weighted Likert scores
    const familyLikertScores: Record<HumanitiesFamilyCode, number> = {
      HUMAN_BEHAVIOUR_WELLBEING: 0,
      LAW_PUBLIC_AFFAIRS_JUSTICE: 0,
      MEDIA_COMM_CREATIVE_CULTURE: 0,
      EDUCATION_LANG_SOCIAL_RESEARCH: 0,
    };

    const likertValues: number[] = [];

    // Evaluate 40 Pilot Likert Items
    for (const [bankQNumStr, dimCode] of Object.entries(LIKERT_BANK_Q_TO_DIMENSION)) {
      const bankQNum = parseInt(bankQNumStr, 10);
      const resp = responseMap.get(bankQNum);
      if (!resp || !resp.response_value) continue;

      let val = parseInt(resp.response_value, 10);
      if (isNaN(val) || val < 1 || val > 5) val = 3; // Fallback neutral

      likertValues.push(val);

      // Apply Reverse-Key Transformation if applicable: score = 6 - response
      const isReverse = REVERSE_KEYED_BANK_Q.has(bankQNum);
      const scoredVal = isReverse ? 6 - val : val;

      if (dimRawScores[dimCode]) {
        dimRawScores[dimCode].rawScore += scoredVal;
        dimRawScores[dimCode].answeredCount += 1;
      }

      // Add weighted score to career families
      const weights = LIKERT_WEIGHTS_BY_CONSTRUCT[dimCode];
      if (weights) {
        familyLikertScores.HUMAN_BEHAVIOUR_WELLBEING += scoredVal * weights.HB;
        familyLikertScores.LAW_PUBLIC_AFFAIRS_JUSTICE += scoredVal * weights.Law;
        familyLikertScores.MEDIA_COMM_CREATIVE_CULTURE += scoredVal * weights.Med;
        familyLikertScores.EDUCATION_LANG_SOCIAL_RESEARCH += scoredVal * weights.Edu;
      }
    }

    // 3. Evaluate 5 Pilot Career Scenarios (Bank Q61..Q65)
    const scenarioCounts: Record<HumanitiesFamilyCode, number> = {
      HUMAN_BEHAVIOUR_WELLBEING: 0,
      LAW_PUBLIC_AFFAIRS_JUSTICE: 0,
      MEDIA_COMM_CREATIVE_CULTURE: 0,
      EDUCATION_LANG_SOCIAL_RESEARCH: 0,
    };

    const pilotScenarioBankQs = [61, 62, 63, 64, 65];
    for (const bankQNum of pilotScenarioBankQs) {
      const resp = responseMap.get(bankQNum);
      if (!resp || !resp.response_value) continue;

      const optKey = resp.response_value.trim().toUpperCase();
      const targetFamily = SCENARIO_OPTION_TO_FAMILY[optKey];
      if (targetFamily && scenarioCounts[targetFamily] !== undefined) {
        scenarioCounts[targetFamily] += 1;
      }
    }

    // 4. Calculate Maximum Likert Points & Normalization per Career Family
    // Max Likert Points = Sum of weights across 40 items * 5
    // HB: 9.0 * 5 = 45.0
    // Law: 8.5 * 5 = 42.5
    // Med: 10.75 * 5 = 53.75
    // Edu: 11.75 * 5 = 58.75
    const MAX_LIKERT_POINTS: Record<HumanitiesFamilyCode, number> = {
      HUMAN_BEHAVIOUR_WELLBEING: 45.0,
      LAW_PUBLIC_AFFAIRS_JUSTICE: 42.5,
      MEDIA_COMM_CREATIVE_CULTURE: 53.75,
      EDUCATION_LANG_SOCIAL_RESEARCH: 58.75,
    };

    const getAlignmentBand = (pct: number): HumanitiesAlignmentBand => {
      if (!isComplete) return "Incomplete";
      if (pct >= 0.80) return "Very Strong Alignment";
      if (pct >= 0.70) return "Strong Alignment";
      if (pct >= 0.60) return "Moderate Alignment";
      if (pct >= 0.50) return "Developing Alignment";
      return "Low Alignment";
    };

    const familyScoresRecord = {} as Record<HumanitiesFamilyCode, HumanitiesCareerFamilyScoreDetails>;

    for (const fam of HUMANITIES_CAREER_FAMILIES) {
      const fCode = fam.code as HumanitiesFamilyCode;
      const likertPts = familyLikertScores[fCode] || 0;
      const maxLikertPts = MAX_LIKERT_POINTS[fCode] || 50;
      const likertPct = maxLikertPts > 0 ? Math.min(1.0, likertPts / maxLikertPts) : 0;
      const likertDisplayPct = Math.round(likertPct * 100);

      const choiceCount = scenarioCounts[fCode] || 0;
      const choicePct = choiceCount / SCENARIOS_COUNT;
      const choiceDisplayPct = Math.round(choicePct * 100);

      // Composite 70/30 Model
      const compositePct = Math.min(1.0, likertPct * 0.70 + choicePct * 0.30);
      const displayPct = Math.round(compositePct * 100);
      const alignment = getAlignmentBand(compositePct);

      familyScoresRecord[fCode] = {
        familyCode: fCode,
        familyName: fam.name,
        likertPoints: Math.round(likertPts * 100) / 100,
        maxLikertPoints: maxLikertPts,
        likertPercentage: Math.round(likertPct * 1000) / 1000,
        likertDisplayPercentage: likertDisplayPct,
        choiceCount,
        maxChoiceCount: SCENARIOS_COUNT,
        choicePercentage: Math.round(choicePct * 1000) / 1000,
        choiceDisplayPercentage: choiceDisplayPct,
        compatibilityPercentage: Math.round(compositePct * 1000) / 1000,
        displayPercentage: displayPct,
        alignment,
        suggestedPathways: fam.suggestedPathways,
        exampleAreas: fam.exampleAreas,
        counsellingNote: fam.counsellingNote,
      };
    }

    // Sorted Families by Composite Compatibility Descending
    const sortedFamilies = Object.values(familyScoresRecord).sort(
      (a, b) => b.compatibilityPercentage - a.compatibilityPercentage
    );

    const primaryFamily = sortedFamilies[0];
    const secondaryFamily = sortedFamilies[1] || sortedFamilies[0];
    const scoreGap = isComplete
      ? Math.round((primaryFamily.compatibilityPercentage - secondaryFamily.compatibilityPercentage) * 1000) / 1000
      : 0;
    const scoreGapPercentage = Math.round(scoreGap * 100);

    let clarity: HumanitiesRecommendationClarity = "Incomplete";
    if (isComplete) {
      if (scoreGap >= 0.15) {
        clarity = "High Clarity";
      } else if (scoreGap >= 0.08) {
        clarity = "Moderate Clarity";
      } else {
        clarity = "Mixed Profile / Further Exploration";
      }
    }
    const isMixedProfile = clarity === "Mixed Profile / Further Exploration";

    // 5. Dimension Breakdown (8 Dimensions)
    const dimensionStrongestLink: Record<string, string> = {
      DIM_HUMAN_BEHAVIOUR: "Human Behaviour & Wellbeing",
      DIM_LANGUAGE_COMM: "Media, Communication & Creative Culture",
      DIM_SOCIETY_CULTURE: "Education, Languages & Social Research",
      DIM_LAW_JUSTICE: "Law, Public Affairs & Social Justice",
      DIM_HISTORY_EVIDENCE: "Education, Languages & Social Research",
      DIM_CREATIVE_MEDIA: "Media, Communication & Creative Culture",
      DIM_EDUCATION_FACIL: "Human Behaviour & Wellbeing",
      DIM_RESEARCH_POLICY: "Education, Languages & Social Research",
    };

    const dimensionScoresRecord: Record<string, HumanitiesDimensionScoreDetails> = {};

    for (const dim of HUMANITIES_CAREER_FINDER_DIMENSIONS) {
      if (dim.code === "DIM_CAREER_SCEN") continue; // Exclude scenario section from dimension profile

      const rawInfo = dimRawScores[dim.code] || { rawScore: 0, answeredCount: 0, totalItems: 5 };
      const maxScore = 25; // 5 items * 5
      const normScore = Math.round((rawInfo.rawScore / maxScore) * 100);
      const ratio = rawInfo.rawScore / maxScore;

      let interp: "Very Strong" | "Strong" | "Moderate" | "Developing" = "Developing";
      if (ratio >= 0.80) interp = "Very Strong";
      else if (ratio >= 0.65) interp = "Strong";
      else if (ratio >= 0.50) interp = "Moderate";

      dimensionScoresRecord[dim.code] = {
        dimensionCode: dim.code,
        dimensionName: dim.name,
        description: dim.description,
        rawScore: rawInfo.rawScore,
        maxScore,
        normalizedScore: normScore,
        interpretation: interp,
        answeredCount: rawInfo.answeredCount,
        totalItems: rawInfo.totalItems,
        strongestCareerLink: dimensionStrongestLink[dim.code] || "Humanities Career Exploration",
      };
    }

    const sortedDimensions = Object.values(dimensionScoresRecord).sort(
      (a, b) => b.normalizedScore - a.normalizedScore
    );

    // 6. Response Quality Metrics & Straight-lining check
    let straightLiningDetected = false;
    if (likertValues.length >= 20) {
      const freqMap: Record<number, number> = {};
      for (const v of likertValues) {
        freqMap[v] = (freqMap[v] || 0) + 1;
      }
      const maxFreq = Math.max(...Object.values(freqMap));
      if (maxFreq / likertValues.length >= 0.85) {
        straightLiningDetected = true;
      }
    }

    const qualityFlag = !isComplete
      ? "INCOMPLETE"
      : straightLiningDetected
      ? "CAUTION_LOW_VARIATION"
      : "NORMAL";

    const pilotDisclaimer =
      "Standard Pilot Edition: This assessment is an educational interest and exploratory profiling tool designed to assist counselling and career exploration. It is not an empirical psychological diagnosis, fixed personality determination, or guaranteed career prediction.";

    // 7. Guidance & Counsellor Principles (Excel: Counsellor Guide, Profile & Academic)
    const interpretationSummary = isComplete
      ? `Your responses show strongest alignment with ${primaryFamily.familyName} (${primaryFamily.displayPercentage}%) and secondary alignment with ${secondaryFamily.familyName} (${secondaryFamily.displayPercentage}%). ${
          clarity === "High Clarity"
            ? "The profile shows a clearer leading pathway with distinctive interest focus."
            : clarity === "Moderate Clarity"
            ? "One pathway is stronger while another remains meaningful for complementary exploration."
            : "The leading pathways are close. Explore both pathways and interdisciplinary options before making a final decision."
        }`
      : "Complete all 45 pilot responses to generate the full humanities compatibility profile.";

    const careerExplorationDirection = isComplete
      ? `Explore: ${primaryFamily.suggestedPathways}. Example areas: ${primaryFamily.exampleAreas}. Use your secondary alignment (${secondaryFamily.familyName}) to broaden exploratory electives, internships, and project work.`
      : "Complete the assessment to unlock career exploration guidance.";

    const finalDecisionPrinciple =
      "Student Interest + Academic Performance + Humanities Career Finder Result + Career Goals + Subject Eligibility + Career Counsellor Guidance + Parent Support. No single score should determine a student's entire career decision.";

    const doGuidelines = [
      "Discuss primary and secondary alignments together as complementary interest areas.",
      "Connect dimension scores to real activities, reading habits, and project work.",
      "Review academic readiness in Languages, Social Sciences, History, and Political Science.",
      "Ask the student's own voice on why specific career pathways attract them.",
      "Encourage volunteering, debate clubs, writing, and internships to test interest authenticity.",
    ];

    const avoidGuidelines = [
      "Treating the result as a final or irreversible career decision.",
      "Calling dimensions clinical diagnoses, fixed personality traits, or innate intelligence.",
      "Using the interest score alone to override academic eligibility prerequisites.",
      "Forcing a single career path when primary and secondary scores are closely balanced.",
      "Presenting pilot assessment outcomes as guaranteed predictions.",
    ];

    const academicSubjectGuidance = [
      "English / Languages: Essential for all humanities pathways (comprehension, writing, debate, rhetoric).",
      "Social Sciences / Political Science: Fundamental for Law, Public Affairs, Governance, and Social Policy.",
      "History / Sociology / Psychology: High relevance for Human Behaviour, Research, and Cultural Studies.",
      "Economics / Informatics Practices: Valuable complementary electives for Policy, Media Analytics, and Research.",
    ];

    const counsellorPrinciples = [
      {
        area: "Overall Result",
        interpretation: "Use the full four-family profile, not only the highest score.",
        doText: "Discuss primary and secondary alignments together.",
        avoidText: "Treating the result as a final career decision.",
      },
      {
        area: "Dimension Profile",
        interpretation: "Use eight dimensions to explain the behavioral and interest pattern behind a result.",
        doText: "Connect dimensions to real activities and learning experiences.",
        avoidText: "Calling dimensions diagnoses or fixed traits.",
      },
      {
        area: "Academic Evidence",
        interpretation: "Compare interest with subject performance and eligibility.",
        doText: "Review languages, social sciences, writing, relevant subjects and prerequisites.",
        avoidText: "Using the score alone to override eligibility.",
      },
      {
        area: "Mixed Profile",
        interpretation: "Close scores can indicate more than one meaningful pathway.",
        doText: "Explore both pathways and interdisciplinary options.",
        avoidText: "Forcing one career when evidence is close.",
      },
      {
        area: "Student Voice",
        interpretation: "The student's own interests and intrinsic motivation are essential.",
        doText: "Ask why a pathway attracts the student.",
        avoidText: "Letting parents or peers answer for the student.",
      },
      {
        area: "Development",
        interpretation: "Interests can evolve with exposure, maturity, and academic growth.",
        doText: "Encourage projects, reading, volunteering and periodic reassessment.",
        avoidText: "Presenting the result as a permanent identity.",
      },
      {
        area: "Professional Claim",
        interpretation: "This is an educational career-interest assessment battery.",
        doText: "Use it collaboratively with academics and counselling guidance.",
        avoidText: "Calling it a diagnosis, guarantee or exact prediction.",
      },
    ];

    return {
      resultId: "",
      attemptId,
      participantId,
      assessmentCode: "HUMANITIES_CAREER_FINDER",
      assessmentName: "Humanities Career Finder",
      versionCode: meta?.versionCode || "HUMANITIES_CAREER_FINDER_V1",
      versionName: meta?.versionName || "Humanities Career Finder — Standard Pilot Edition",
      completedQuestions: answeredCount,
      totalQuestions: TOTAL_ADMINISTERED_QUESTIONS,
      completionPercentage,
      isComplete,
      familyScores: familyScoresRecord,
      sortedFamilies,
      primaryFamily,
      secondaryFamily,
      scoreGap,
      scoreGapPercentage,
      clarity,
      isMixedProfile,
      dimensionScores: dimensionScoresRecord,
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
        totalQuestions: TOTAL_ADMINISTERED_QUESTIONS,
        straightLiningDetected,
        completionTimeSeconds: meta?.completionTimeSeconds,
        qualityFlag,
        pilotDisclaimer,
      },
      scoredAt: new Date().toISOString(),
    };
  }
}

export const humanitiesCareerFinderScoringService =
  new HumanitiesCareerFinderScoringService();

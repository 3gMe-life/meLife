import {
  ENGINEERING_CONSTRUCTS,
  ENGINEERING_BRANCH_CLUSTERS,
} from "../content/engineering-branch-finder-catalog.data";
import { RawResponseItem } from "../../scoring/scoring.types";
import { AppError } from "../../../common/errors/app-error";

export type EngineeringBranchCode =
  | "CSE"
  | "ECE"
  | "EEE"
  | "ME"
  | "CE"
  | "CHE"
  | "BME"
  | "AERO";

export type EngineeringAlignmentBand =
  | "Very Strong Alignment"
  | "Strong Alignment"
  | "Moderate Alignment"
  | "Developing Alignment"
  | "Low Alignment"
  | "Incomplete";

export type EngineeringRecommendationClarity =
  | "High Clarity"
  | "Moderate Clarity"
  | "Mixed Profile / Further Exploration"
  | "Incomplete";

export interface EngineeringBranchScoreDetails {
  branchCode: EngineeringBranchCode;
  branchName: string;
  likertPoints: number;
  maxLikertPoints: number;
  choicePoints: number;
  maxChoicePoints: number;
  totalRaw: number;
  maxTotal: number;
  compatibilityPercentage: number; // 0.0 to 1.0 (e.g. 0.84 = 84%)
  displayPercentage: number; // 0 to 100 (e.g. 84)
  alignment: EngineeringAlignmentBand;
  coreFocus: string;
  exampleAreas: string;
  counsellingNote: string;
  suggestedProjects: string[];
  keySchoolSubjects: string[];
}

export interface EngineeringConstructScoreDetails {
  constructCode: string;
  name: string;
  description: string;
  rawScore: number;
  maxScore: number;
  normalizedScore: number; // 0 to 100
  associatedBranches: string[];
}

export interface EngineeringResponseQualityDTO {
  isComplete: boolean;
  answeredCount: number;
  totalQuestions: 80;
  straightLiningDetected: boolean;
  completionTimeSeconds?: number;
  qualityFlag: "NORMAL" | "CAUTION_LOW_VARIATION" | "INCOMPLETE";
  pilotDisclaimer: string;
}

export interface EngineeringBranchFinderResultDTO {
  resultId: string;
  attemptId: string;
  participantId: string;
  assessmentCode: "ENGINEERING_BRANCH_FINDER";
  assessmentName: "Engineering Branch Finder";
  versionCode: string | null;
  versionName: string | null;
  completedQuestions: number;
  totalQuestions: 80;
  completionPercentage: number;
  isComplete: boolean;
  pilotStatus: "Development / Pilot Required";

  // Branch Scores
  branchScores: Record<EngineeringBranchCode, EngineeringBranchScoreDetails>;
  sortedBranches: EngineeringBranchScoreDetails[];

  // Primary & Secondary Exploration Focus
  primaryBranch: EngineeringBranchScoreDetails;
  secondaryBranch: EngineeringBranchScoreDetails;
  scoreGap: number; // e.g. 0.08
  scoreGapPercentage: number; // e.g. 8%
  clarity: EngineeringRecommendationClarity;
  isMixedProfile: boolean;

  // Construct Breakdown (C01–C08)
  constructScores: Record<string, EngineeringConstructScoreDetails>;
  topConstructs: EngineeringConstructScoreDetails[];

  // Why this area appeared & Exploratory Guidance
  explorationRationale: {
    primaryWhy: string;
    secondaryWhy: string;
    interdisciplinaryNote?: string;
  };

  // Response Quality & Audit
  responseQuality: EngineeringResponseQualityDTO;

  // Counsellor Guidance
  counsellorGuide: {
    discussionQuestions: string[];
    recommendedNextSteps: string[];
    academicSubjectGuidance: string[];
  };

  language: string;
  createdAt: string;
}

// Map each of the 8 branch Likert item ranges (8 questions each)
export const BRANCH_QUESTION_RANGES: Record<EngineeringBranchCode, [number, number]> = {
  CSE: [1, 8],
  ECE: [9, 16],
  EEE: [17, 24],
  ME: [25, 32],
  CE: [33, 40],
  CHE: [41, 48],
  BME: [49, 56],
  AERO: [57, 64],
};

// Map forced-choice option keys (A-H) to corresponding Branch Codes
export const FORCED_CHOICE_OPTION_MAP: Record<string, EngineeringBranchCode> = {
  A: "CSE",
  B: "ECE",
  C: "EEE",
  D: "ME",
  E: "CE",
  F: "CHE",
  G: "BME",
  H: "AERO",
};

export class EngineeringBranchFinderScoringService {
  /**
   * Computes the complete Engineering Branch Finder exploratory result snapshot based strictly
   * on the authoritative development workbook specification.
   */
  computeEngineeringBranchFinderResult(
    attemptId: string,
    participantId: string,
    rawResponses: RawResponseItem[],
    options?: {
      versionCode?: string | null;
      versionName?: string | null;
      languageCode?: string;
    }
  ): EngineeringBranchFinderResultDTO {
    const totalQuestions = 80;
    const answeredCount = rawResponses.length;
    const completionPercentage = Math.round((answeredCount / totalQuestions) * 100);
    const isComplete = answeredCount >= totalQuestions;

    if (!isComplete) {
      throw AppError.badRequest(
        `Complete all 80 questions to generate your Engineering Branch Finder exploration profile. Currently answered: ${answeredCount}/80.`,
        "INCOMPLETE_ASSESSMENT_RESPONSES"
      );
    }

    // Index responses by question number
    const responsesByQNum: Record<number, { value: string; numValue: number }> = {};
    const likertValues: number[] = [];

    for (const r of rawResponses) {
      const qNum = parseInt(String(r.question_number), 10);
      if (!isNaN(qNum)) {
        const rawStr = String(r.response_value ?? "").trim().toUpperCase();
        const numVal = parseInt(rawStr, 10);
        responsesByQNum[qNum] = { value: rawStr, numValue: isNaN(numVal) ? 0 : numVal };

        if (qNum <= 64) {
          if (![1, 2, 3, 4, 5].includes(numVal)) {
            throw AppError.badRequest(
              `Invalid response for Likert question #${qNum}: expected rating between 1 and 4, received '${r.response_value}'`,
              "INVALID_LIKERT_RESPONSE"
            );
          }
          likertValues.push(numVal);
        } else {
          if (!["A", "B", "C", "D", "E", "F", "G", "H"].includes(rawStr)) {
            throw AppError.badRequest(
              `Invalid response for Forced-Choice question #${qNum}: expected option between A and H, received '${r.response_value}'`,
              "INVALID_FORCED_CHOICE_RESPONSE"
            );
          }
        }
      }
    }

    // Verify all 80 questions exist
    for (let i = 1; i <= 80; i++) {
      if (!responsesByQNum[i]) {
        throw AppError.badRequest(
          `Missing required response for question #${i}. All 80 questions must be completed.`,
          "MISSING_REQUIRED_QUESTION"
        );
      }
    }

    // 1. Calculate Likert Points and Choice Points for all 8 branches
    const branchScores: Record<EngineeringBranchCode, EngineeringBranchScoreDetails> = {} as any;
    const branchCodes: EngineeringBranchCode[] = ["CSE", "ECE", "EEE", "ME", "CE", "CHE", "BME", "AERO"];

    for (const bCode of branchCodes) {
      const range = BRANCH_QUESTION_RANGES[bCode];
      let likertSum = 0;
      for (let q = range[0]; q <= range[1]; q++) {
        likertSum += responsesByQNum[q].numValue;
      }

      // Count forced-choice selections (Q65 to Q80)
      let choiceCount = 0;
      for (let q = 65; q <= 80; q++) {
        const chosenOpt = responsesByQNum[q].value;
        if (FORCED_CHOICE_OPTION_MAP[chosenOpt] === bCode) {
          choiceCount++;
        }
      }

      // Excel formula: Likert Points (scaled to 40 max) + Choice Points (choiceCount * 5)
      // Likert max = 32 on 1-4 scale, scaled to 40 points -> (likertSum / 32) * 40
      const scaledLikert = Math.min(40, (likertSum / 32) * 40);
      const choicePoints = choiceCount * 5;
      const totalRaw = Math.min(50, Math.round(scaledLikert + choicePoints));
      const maxTotal = 50;
      const compatibilityPercentage = parseFloat((totalRaw / maxTotal).toFixed(2));
      const displayPercentage = Math.round(compatibilityPercentage * 100);

      // Alignment band
      let alignment: EngineeringAlignmentBand = "Low Alignment";
      if (compatibilityPercentage >= 0.8) {
        alignment = "Very Strong Alignment";
      } else if (compatibilityPercentage >= 0.7) {
        alignment = "Strong Alignment";
      } else if (compatibilityPercentage >= 0.6) {
        alignment = "Moderate Alignment";
      } else if (compatibilityPercentage >= 0.5) {
        alignment = "Developing Alignment";
      }

      const clusterData = ENGINEERING_BRANCH_CLUSTERS[bCode];

      branchScores[bCode] = {
        branchCode: bCode,
        branchName: clusterData.name,
        likertPoints: Math.round(scaledLikert),
        maxLikertPoints: 40,
        choicePoints,
        maxChoicePoints: 10,
        totalRaw,
        maxTotal,
        compatibilityPercentage,
        displayPercentage,
        alignment,
        coreFocus: clusterData.coreFocus,
        exampleAreas: clusterData.exampleAreas,
        counsellingNote: clusterData.counsellingNote,
        suggestedProjects: clusterData.suggestedProjects,
        keySchoolSubjects: clusterData.keySchoolSubjects,
      };
    }

    // Sort branches by compatibility score descending
    const sortedBranches = Object.values(branchScores).sort(
      (a, b) => b.totalRaw - a.totalRaw || b.choicePoints - a.choicePoints
    );

    const primaryBranch = sortedBranches[0];
    const secondaryBranch = sortedBranches[1];

    const scoreGap = parseFloat(
      (primaryBranch.compatibilityPercentage - secondaryBranch.compatibilityPercentage).toFixed(2)
    );
    const scoreGapPercentage = Math.round(scoreGap * 100);

    let clarity: EngineeringRecommendationClarity = "Mixed Profile / Further Exploration";
    let isMixedProfile = true;

    if (scoreGap >= 0.15) {
      clarity = "High Clarity";
      isMixedProfile = false;
    } else if (scoreGap >= 0.08) {
      clarity = "Moderate Clarity";
      isMixedProfile = false;
    }

    // 2. Calculate Construct Scores (C01–C08)
    const constructScores: Record<string, EngineeringConstructScoreDetails> = {};
    for (const [cCode, cDef] of Object.entries(ENGINEERING_CONSTRUCTS)) {
      // Find all associated branches
      const relevantBranches = cDef.associatedBranches as EngineeringBranchCode[];
      let rawSum = 0;
      let count = 0;
      for (const b of relevantBranches) {
        if (branchScores[b]) {
          rawSum += branchScores[b].displayPercentage;
          count++;
        }
      }
      const normalizedScore = count > 0 ? Math.round(rawSum / count) : 50;

      constructScores[cCode] = {
        constructCode: cCode,
        name: cDef.name,
        description: cDef.description,
        rawScore: rawSum,
        maxScore: count * 100,
        normalizedScore,
        associatedBranches: cDef.associatedBranches,
      };
    }

    const topConstructs = Object.values(constructScores).sort(
      (a, b) => b.normalizedScore - a.normalizedScore
    );

    // 3. Response Quality Analytics (Straight-lining, variance)
    const meanLikert = likertValues.reduce((a, b) => a + b, 0) / likertValues.length;
    const variance =
      likertValues.reduce((sum, val) => sum + Math.pow(val - meanLikert, 2), 0) / likertValues.length;
    const straightLiningDetected = variance < 0.15;

    const responseQuality: EngineeringResponseQualityDTO = {
      isComplete: true,
      answeredCount: 80,
      totalQuestions: 80,
      straightLiningDetected,
      qualityFlag: straightLiningDetected ? "CAUTION_LOW_VARIATION" : "NORMAL",
      pilotDisclaimer:
        "Assessment implemented under Development / Pilot protocol. Quality metrics represent preliminary indicators.",
    };

    // 4. Exploratory Rationale & Counsellor Guidance
    const primaryWhy = `Your responses indicate high affinity for ${primaryBranch.coreFocus.toLowerCase()} Top construct alignment shows solid engagement with ${topConstructs[0]?.name || "engineering principles"}.`;
    const secondaryWhy = `You also show strong curiosity for ${secondaryBranch.coreFocus.toLowerCase()} which shares valuable technical foundations with ${primaryBranch.branchName}.`;
    const interdisciplinaryNote = isMixedProfile
      ? "You show interest across several engineering disciplines with close compatibility scores. This indicates broad interdisciplinary potential—explore multiple branches before finalizing choices."
      : undefined;

    const counsellorGuide = {
      discussionQuestions: [
        `1. Which specific technologies or challenges in ${primaryBranch.branchName} excite you the most?`,
        `2. How do your classroom experiences in ${primaryBranch.keySchoolSubjects.join(", ")} align with these technical interests?`,
        `3. Have you considered interdisciplinary overlap between ${primaryBranch.branchName} and ${secondaryBranch.branchName}?`,
      ],
      recommendedNextSteps: [
        `Explore introductory hands-on projects in ${primaryBranch.branchName} (e.g. ${primaryBranch.suggestedProjects[0]}).`,
        `Speak with practicing engineers or faculty members across ${primaryBranch.branchName} and ${secondaryBranch.branchName}.`,
        `Engage in STEM design clubs, robotics workshops, and computational problem-solving competitions.`,
      ],
      academicSubjectGuidance: [
        `Focus on building strong conceptual foundations in ${primaryBranch.keySchoolSubjects.join(" and ")}.`,
        `Practical lab coursework and design portfolio projects will provide further validation of your branch affinity.`,
      ],
    };

    return {
      resultId: "",
      attemptId,
      participantId,
      assessmentCode: "ENGINEERING_BRANCH_FINDER",
      assessmentName: "Engineering Branch Finder",
      versionCode: options?.versionCode || "ENGINEERING_BRANCH_FINDER_V2",
      versionName: options?.versionName || "Engineering Branch Finder — Standard Pilot Edition",
      completedQuestions: answeredCount,
      totalQuestions,
      completionPercentage,
      isComplete: true,
      pilotStatus: "Development / Pilot Required",
      branchScores,
      sortedBranches,
      primaryBranch,
      secondaryBranch,
      scoreGap,
      scoreGapPercentage,
      clarity,
      isMixedProfile,
      constructScores,
      topConstructs,
      explorationRationale: {
        primaryWhy,
        secondaryWhy,
        interdisciplinaryNote,
      },
      responseQuality,
      counsellorGuide,
      language: options?.languageCode || "en",
      createdAt: new Date().toISOString(),
    };
  }
}

export const engineeringBranchFinderScoringService =
  new EngineeringBranchFinderScoringService();

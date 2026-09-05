/**
 * 3G MeLife — Multi-Factor Profile Confidence Engine
 * Evaluates internal response consistency, rating straight-lining bias, and
 * self-report vs demonstrated performance congruence.
 */

import { RawResponseItem } from "../scoring.types";
import { StudentProfileVector } from "./profile-vector.service";

export interface ProfileConfidenceMetrics {
  consistencyGap: number; // 0 to 3 scale (average absolute difference between paired verification items)
  ratingBiasPercentage: number; // 0 to 100% (highest frequency share of a single Likert rating)
  selfReportVsPerformanceGap: number; // 0 to 100% (average difference between self-report skills and demonstrated aptitudes)
  totalItemsEvaluated: number;
  level: "High Confidence" | "Moderate Confidence" | "Needs Further Exploration";
  interpretation: string;
}

export class ProfileConfidenceService {
  /**
   * Calculates comprehensive multi-factor profile confidence metrics.
   */
  calculateConfidence(
    rawResponses: RawResponseItem[],
    profileVector: StudentProfileVector
  ): ProfileConfidenceMetrics {
    const byQNum: Record<number, number> = {};
    const likertCounts: Record<string, number> = { "1": 0, "2": 0, "3": 0, "4": 0 };
    let selfReportCount = 0;

    for (const r of rawResponses) {
      const qNum = parseInt(String(r.question_number), 10);
      const valStr = String(r.response_value || "").trim();
      const valNum = parseInt(valStr, 10);

      if (!isNaN(qNum) && !isNaN(valNum)) {
        byQNum[qNum] = valNum;
      }

      // Count Likert responses for straight-lining detection
      if (r.question_type === "likert_1_4" || ["1", "2", "3", "4"].includes(valStr)) {
        if (likertCounts[valStr] !== undefined) {
          likertCounts[valStr]++;
          selfReportCount++;
        }
      }
    }

    // 1. Consistency Gap across paired items
    // Pairs: (Q100 vs Q53 or Q65 vs Q31), (Q101 vs Q80 or Q66 vs Q53), (Q102 vs Q2 or Q67 vs Q2), (Q103 vs Q38 or Q68 vs Q33)
    const candidatePairs = [
      { p1: byQNum[100] ?? byQNum[65], p2: byQNum[53] ?? byQNum[31] },
      { p1: byQNum[101] ?? byQNum[66], p2: byQNum[80] ?? byQNum[53] },
      { p1: byQNum[102] ?? byQNum[67], p2: byQNum[2] ?? byQNum[2] },
      { p1: byQNum[103] ?? byQNum[68], p2: byQNum[38] ?? byQNum[33] },
    ];

    let totalDiff = 0;
    let evaluatedPairs = 0;
    for (const pair of candidatePairs) {
      if (pair.p1 !== undefined && pair.p2 !== undefined) {
        totalDiff += Math.abs(pair.p1 - pair.p2);
        evaluatedPairs++;
      }
    }
    const consistencyGap = evaluatedPairs > 0 ? Math.round((totalDiff / evaluatedPairs) * 100) / 100 : 0.3;

    // 2. Rating Bias / Straight-Lining Share (Percentage)
    const maxLikertCount = Math.max(...Object.values(likertCounts));
    const ratingBiasPercentage =
      selfReportCount > 0 ? Math.round((maxLikertCount / selfReportCount) * 100) : 40;

    // 3. Self-Report vs Demonstrated Aptitude Congruence Gap (Percentage)
    // Compares 6 corresponding skill vs aptitude dimensions
    const comparisons = [
      Math.abs(profileVector.logical_problem_solving - profileVector.pattern_logic),
      Math.abs(profileVector.visual_spatial - profileVector.spatial_reasoning),
      Math.abs(profileVector.practical_technical - profileVector.practical_troubleshooting),
      Math.abs(profileVector.communication - profileVector.verbal_reasoning),
      Math.abs(profileVector.social_teamwork - profileVector.social_judgment),
      Math.abs(profileVector.self_management - profileVector.planning_estimation),
    ];
    const selfReportVsPerformanceGap = Math.round(
      comparisons.reduce((sum, val) => sum + val, 0) / comparisons.length
    );

    // 4. Overall Confidence Level Determination
    let level: "High Confidence" | "Moderate Confidence" | "Needs Further Exploration" = "High Confidence";
    let interpretation =
      "Your responses demonstrate high internal consistency, balanced self-reflection, and strong congruence with demonstrated tasks.";

    if (consistencyGap <= 0.75 && ratingBiasPercentage <= 75 && selfReportVsPerformanceGap <= 40) {
      level = "High Confidence";
      interpretation =
        "Your responses demonstrate high internal consistency, balanced self-reflection, and strong congruence with demonstrated tasks.";
    } else if (consistencyGap <= 1.5 && ratingBiasPercentage <= 85 && selfReportVsPerformanceGap <= 60) {
      level = "Moderate Confidence";
      interpretation =
        "Your responses demonstrate adequate consistency and provide a reliable baseline for exploratory career guidance.";
    } else {
      level = "Needs Further Exploration";
      interpretation =
        "Some responses show variance between self-perception and demonstrated tasks. Discussing results with a mentor is recommended.";
    }

    return {
      consistencyGap,
      ratingBiasPercentage,
      selfReportVsPerformanceGap,
      totalItemsEvaluated: rawResponses.length,
      level,
      interpretation,
    };
  }
}

export const profileConfidenceService = new ProfileConfidenceService();

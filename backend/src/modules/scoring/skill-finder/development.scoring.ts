import {
  DevelopmentalStrengthsResult,
  RawResponseItem,
  ResponseQualityResult,
  ScoredDimensionItem,
} from "../scoring.types";

export const STRENGTH_DOMAINS: Array<{
  code: string;
  name: string;
  description: string;
}> = [
  {
    code: "CURIOSITY",
    name: "Curiosity & Inquisitive Exploration",
    description: "Asking questions, seeking underlying principles, and discovering new subjects.",
  },
  {
    code: "PERSISTENCE",
    name: "Persistence & Task Resilience",
    description: "Working through obstacles, finishing difficult assignments, and maintaining focus.",
  },
  {
    code: "ADAPTABILITY",
    name: "Adaptability & Openness to Feedback",
    description: "Adjusting to new information, accepting constructive advice, and embracing change.",
  },
  {
    code: "INITIATIVE",
    name: "Initiative & Self-Drive",
    description: "Starting projects independently without waiting for external reminders.",
  },
  {
    code: "COLLABORATION",
    name: "Collaborative Learning Habits",
    description: "Sharing insights with peers, contributing fairly to group projects, and mutual support.",
  },
  {
    code: "ATTENTION_TO_DETAIL",
    name: "Attention to Detail & Accuracy",
    description: "Checking work carefully, double-checking calculations, and aiming for quality.",
  },
  {
    code: "INDEPENDENCE",
    name: "Independent Learning Mastery",
    description: "Setting personal learning goals and researching topics on one's own initiative.",
  },
];

export class DevelopmentScoringEngine {
  /**
   * Calculates Section D Developmental Strengths.
   */
  calculateStrengths(
    responsesByDimension: Record<string, RawResponseItem[]>
  ): DevelopmentalStrengthsResult {
    const dimensions: ScoredDimensionItem[] = STRENGTH_DOMAINS.map((domain) => {
      // Look up responses by canonical domain code or catalog alias
      const items =
        responsesByDimension[domain.code] ||
        (domain.code === "INDEPENDENCE" ? responsesByDimension["LEARNING_INDEPENDENCE"] : undefined) ||
        [];
      const count = items.length;

      if (count === 0) {
        return {
          code: domain.code,
          name: domain.name,
          rawScore: 0,
          maxScore: 0,
          scalePositionPercentage: 50,
          level: "Moderate",
          description: domain.description,
        };
      }

      let sum = 0;
      for (const item of items) {
        const val = parseInt(item.response_value || "2", 10);
        sum += !isNaN(val) && val >= 1 && val <= 4 ? val : 2;
      }

      const minPossible = count * 1;
      const maxPossible = count * 4;
      const pct =
        maxPossible > minPossible
          ? Math.round(((sum - minPossible) / (maxPossible - minPossible)) * 100)
          : 50;
      const normalizedPct = Math.max(0, Math.min(100, pct));

      const level: "High" | "Proficient" | "Moderate" | "Emerging" =
        normalizedPct >= 75
          ? "High"
          : normalizedPct >= 50
          ? "Proficient"
          : normalizedPct >= 25
          ? "Moderate"
          : "Emerging";

      return {
        code: domain.code,
        name: domain.name,
        rawScore: sum,
        maxScore: maxPossible,
        scalePositionPercentage: normalizedPct,
        level,
        description: domain.description,
      };
    });

    const sorted = [...dimensions].sort(
      (a, b) => b.scalePositionPercentage - a.scalePositionPercentage
    );
    const topStrengths = sorted.slice(0, 3);

    return {
      topStrengths,
      dimensions,
    };
  }

  /**
   * Evaluates Section E Response Quality & Validity Checks.
   */
  calculateQuality(responsesByQNum: Record<number, RawResponseItem>): ResponseQualityResult {
    // Parallel consistency pairs from pilot workbook
    const candidatePairs = [
      { q1: 100, q2: 53 },
      { q1: 101, q2: 80 },
      { q1: 102, q2: 2 },
      { q1: 103, q2: 38 },
    ];

    let totalDiff = 0;
    let evaluatedPairs = 0;

    for (const pair of candidatePairs) {
      const r1 = responsesByQNum[pair.q1];
      const r2 = responsesByQNum[pair.q2];
      if (r1 && r2 && r1.response_value && r2.response_value) {
        const v1 = parseInt(r1.response_value, 10);
        const v2 = parseInt(r2.response_value, 10);
        if (!isNaN(v1) && !isNaN(v2)) {
          totalDiff += Math.abs(v1 - v2);
          evaluatedPairs++;
        }
      }
    }

    const avgDiff = evaluatedPairs > 0 ? totalDiff / evaluatedPairs : 0;
    const consistencySignal: "High Consistency" | "Adequate Consistency" | "Review Suggested" =
      avgDiff <= 0.8
        ? "High Consistency"
        : avgDiff <= 1.5
        ? "Adequate Consistency"
        : "Review Suggested";

    // Attention check item: Q104 expected response is "2"
    const r104 = responsesByQNum[104];
    const attentionCheckPassed = r104
      ? r104.response_value === "2" || r104.response_value === "A little like me"
      : true;

    const interpretation =
      consistencySignal === "High Consistency" && attentionCheckPassed
        ? "Your responses demonstrate high consistency and attentiveness throughout the assessment session."
        : "Your responses demonstrate adequate consistency for exploratory career profiling.";

    return {
      consistencySignal,
      attentionCheckPassed,
      interpretation,
    };
  }
}

export const developmentScoringEngine = new DevelopmentScoringEngine();

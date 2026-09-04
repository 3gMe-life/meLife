import {
  DemonstratedAptitudeResult,
  RawResponseItem,
  ScoredDimensionItem,
} from "../scoring.types";

export const APTITUDE_DOMAINS: Array<{
  code: string;
  name: string;
  description: string;
}> = [
  {
    code: "PATTERN_LOGIC",
    name: "Pattern & Deductive Logic",
    description: "Identifying sequential patterns, geometric relationships, and deductive inferences.",
  },
  {
    code: "NUMERICAL_REASONING",
    name: "Numerical Reasoning & Proportions",
    description: "Interpreting numerical ratios, quantitative patterns, and arithmetic proportions.",
  },
  {
    code: "VERBAL_REASONING",
    name: "Verbal Analogies & Evidence",
    description: "Evaluating conceptual vocabulary analogies and text-based logical evidence.",
  },
  {
    code: "SPATIAL_REASONING",
    name: "Spatial Visualization & Mental Rotation",
    description: "Mental manipulation of 2D/3D shapes, net folding, and angle rotations.",
  },
  {
    code: "PRACTICAL_PROBLEM_SOLVING",
    name: "Practical Everyday Troubleshooting",
    description: "Applying common-sense scientific principles to everyday physical challenges.",
  },
  {
    code: "CREATIVE_THINKING_TASKS",
    name: "Creative Divergence & Ideation Tasks",
    description: "Generating diverse, original, and practical ideas under open-ended prompts.",
  },
  {
    code: "SITUATIONAL_JUDGMENT",
    name: "Situational Social Judgment",
    description: "Navigating interpersonal dynamics, group conflict, and ethical decisions.",
  },
  {
    code: "PLANNING_ESTIMATION",
    name: "Planning, Scheduling & Estimation",
    description: "Sequencing interdependent tasks, budget prioritization, and time estimation.",
  },
];

export class AptitudeScoringEngine {
  /**
   * Scores an individual aptitude task item based on item type, correct key, or open rubric.
   */
  scoreItem(item: RawResponseItem): number {
    if (!item || !item.response_value) return 0;
    const maxPts = parseFloat(String(item.max_points || "2")) || 2;
    const val = item.response_value.trim();

    if (item.question_type === "open_scored") {
      // Open creative divergent rubric: evaluate depth, count of distinct concepts & length
      const words = val.split(/\s+/).filter(Boolean);
      if (words.length >= 18) return maxPts;
      if (words.length >= 10) return Math.min(3, maxPts);
      if (words.length >= 5) return Math.min(2, maxPts);
      if (words.length >= 2) return Math.min(1, maxPts);
      return 0;
    }

    // Objective Multiple Choice
    if (item.correct_key && val) {
      const userAns = val.toUpperCase();
      const correct = item.correct_key.trim().toUpperCase();
      return userAns === correct ? maxPts : 0;
    }

    return 0;
  }

  /**
   * Calculates Section C Demonstrated Aptitude task performance.
   * Keeps cognitive dimensions separate and computes total task accuracy.
   */
  calculate(responsesByDimension: Record<string, RawResponseItem[]>): DemonstratedAptitudeResult {
    let totalEarned = 0;
    let totalPossible = 0;

    const dimensions: ScoredDimensionItem[] = APTITUDE_DOMAINS.map((domain) => {
      const items = responsesByDimension[domain.code] || [];
      if (items.length === 0) {
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

      let earned = 0;
      let possible = 0;
      for (const item of items) {
        earned += this.scoreItem(item);
        possible += parseFloat(String(item.max_points || "2")) || 2;
      }

      totalEarned += earned;
      totalPossible += possible;

      const pct = possible > 0 ? Math.round((earned / possible) * 100) : 50;
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
        rawScore: earned,
        maxScore: possible,
        scalePositionPercentage: normalizedPct,
        level,
        description: domain.description,
      };
    });

    const overallAccuracyPercentage =
      totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 75;

    return {
      overallAccuracyPercentage,
      dimensions,
    };
  }
}

export const aptitudeScoringEngine = new AptitudeScoringEngine();

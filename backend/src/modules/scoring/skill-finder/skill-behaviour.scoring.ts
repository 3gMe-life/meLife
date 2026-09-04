import {
  RawResponseItem,
  ScoredDimensionItem,
  SkillBehaviourResult,
} from "../scoring.types";

export const SKILL_BEHAVIOUR_DOMAINS: Array<{
  code: string;
  name: string;
  description: string;
}> = [
  {
    code: "LOGICAL_PROBLEM_SOLVING",
    name: "Logical & Problem-Solving Instincts",
    description: "Breaking complex puzzles down into structured logical steps and root causes.",
  },
  {
    code: "COMMUNICATION",
    name: "Communication & Expressive Articulation",
    description: "Articulating ideas clearly through speech, writing, and structured presentations.",
  },
  {
    code: "CREATIVE_THINKING",
    name: "Creative & Divergent Thinking",
    description: "Generating novel ideas, out-of-the-box angles, and unconventional combinations.",
  },
  {
    code: "VISUAL_SPATIAL_THINKING",
    name: "Visual-Spatial Thinking",
    description: "Mentally visualizing 3D layouts, maps, object rotations, and spatial diagrams.",
  },
  {
    code: "PRACTICAL_TECHNICAL_SKILL",
    name: "Practical & Technical Dexterity",
    description: "Hands-on tinkering, operating tools, assembling physical components, and troubleshooting.",
  },
  {
    code: "SOCIAL_TEAMWORK",
    name: "Social Interaction & Teamwork",
    description: "Building empathetic relationships, collaborating in diverse groups, and active listening.",
  },
  {
    code: "LEADERSHIP_INITIATIVE",
    name: "Leadership & Initiative",
    description: "Taking early initiative, motivating peers, and guiding projects forward with energy.",
  },
  {
    code: "SELF_MANAGEMENT",
    name: "Self-Management & Focus",
    description: "Organizing study time, sustaining attention on long tasks, and self-regulating priorities.",
  },
];

export class SkillBehaviourScoringEngine {
  /**
   * Calculates Section B Skill Behaviour scores dynamically.
   * Produces separate dimension scores, top indicators, and developmental opportunities.
   */
  calculate(responsesByDimension: Record<string, RawResponseItem[]>): SkillBehaviourResult {
    const dimensions: ScoredDimensionItem[] = SKILL_BEHAVIOUR_DOMAINS.map((domain) => {
      const items = responsesByDimension[domain.code] || [];
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

    const strongestIndicators = sorted.slice(0, 3);
    const developmentOpportunities = sorted.slice(-2).reverse();

    return {
      strongestIndicators,
      developmentOpportunities,
      dimensions,
    };
  }
}

export const skillBehaviourScoringEngine = new SkillBehaviourScoringEngine();

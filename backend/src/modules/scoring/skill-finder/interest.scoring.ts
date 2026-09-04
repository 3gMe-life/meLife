import {
  InterestProfileResult,
  RawResponseItem,
  ScoredDimensionItem,
} from "../scoring.types";

export const RIASEC_DOMAINS: Array<{
  code: string;
  name: string;
  clusterTitle: string;
  description: string;
}> = [
  {
    code: "BUILDER_R",
    name: "Builder (Realistic)",
    clusterTitle: "Engineering, Applied Technology & Construction",
    description: "Hands-on making, mechanical systems, robotics, architecture, and practical engineering.",
  },
  {
    code: "EXPLORER_I",
    name: "Explorer (Investigative)",
    clusterTitle: "Scientific Inquiry, Research & Computing Analytics",
    description: "Analytical investigations, algorithmic problem solving, natural sciences, and data exploration.",
  },
  {
    code: "CREATOR_A",
    name: "Creator (Artistic)",
    clusterTitle: "Creative Arts, Digital Media & Innovative Design",
    description: "Visual communication, digital illustration, storytelling, user experience design, and media production.",
  },
  {
    code: "HELPER_S",
    name: "Helper (Social)",
    clusterTitle: "Human Services, Education, Healthcare & Community",
    description: "Mentoring, community wellbeing, healthcare professions, teaching, and counseling.",
  },
  {
    code: "LEADER_E",
    name: "Leader (Enterprising)",
    clusterTitle: "Entrepreneurship, Business Strategy & Public Leadership",
    description: "Organizing initiatives, public speaking, negotiation, enterprise management, and team leadership.",
  },
  {
    code: "ORGANISER_C",
    name: "Organiser (Conventional)",
    clusterTitle: "Operations, Information Systems & Financial Management",
    description: "System administration, logistics, financial planning, database management, and structured execution.",
  },
];

export class InterestScoringEngine {
  /**
   * Calculates RIASEC Interest Discovery scores dynamically from responses.
   * Normalizes values on a 0-100 scale based on whatever number of questions were answered.
   */
  calculate(responsesByDimension: Record<string, RawResponseItem[]>): InterestProfileResult {
    const dimensions: ScoredDimensionItem[] = RIASEC_DOMAINS.map((domain) => {
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

    // Sort by scale position percentage to find top interest clusters
    const sorted = [...dimensions].sort(
      (a, b) => b.scalePositionPercentage - a.scalePositionPercentage
    );

    const topClusters = sorted.slice(0, 3).map((item) => {
      const def = RIASEC_DOMAINS.find((d) => d.code === item.code);
      return {
        code: item.code,
        name: item.name,
        scalePositionPercentage: item.scalePositionPercentage,
        clusterTitle: def?.clusterTitle || item.name,
      };
    });

    return {
      topClusters,
      dimensions,
      primaryOrientation: sorted[0]?.name,
      secondaryOrientation: sorted[1]?.name,
    };
  }
}

export const interestScoringEngine = new InterestScoringEngine();

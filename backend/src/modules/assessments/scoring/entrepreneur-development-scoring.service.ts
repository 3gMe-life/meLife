import {
  ENTREPRENEUR_DIMENSIONS,
  ENTREPRENEUR_PROFILES,
  ENTREPRENEUR_DEVELOPMENT_QUESTIONS,
  EntrepreneurArchetypeCode,
} from "../content/entrepreneur-development-catalog.data";
import { RawResponseItem } from "../../scoring/scoring.types";

export type EntrepreneurReadinessBand =
  | "Exceptional Readiness"
  | "Strong Entrepreneurial Aptitude"
  | "Developing Capability"
  | "Foundation Development";

export interface EntrepreneurDimensionScoreDetails {
  dimensionCode: string;
  dimensionName: string;
  sectionCode: string;
  description: string;
  weight: number;
  rawScore: number;
  minPossibleRaw: number;
  maxPossibleRaw: number;
  percentageScore: number; // 0 - 100
  band: "Exceptional" | "High" | "Moderate" | "Foundational";
  answeredCount: number;
  totalItems: number;
  coreIndicators: string[];
  developmentalFocus: string;
}

export interface EntrepreneurArchetypeAffinity {
  archetypeCode: EntrepreneurArchetypeCode;
  title: string;
  tagline: string;
  affinityScore: number; // 0 - 100
  isPrimary: boolean;
  isSecondary: boolean;
}

export interface StartupRoadmapPhase {
  phaseNumber: number;
  title: string;
  duration: string;
  objectives: string[];
  milestones: string[];
  keyTools: string[];
}

export interface EntrepreneurStrengthArea {
  dimensionCode: string;
  dimensionName: string;
  score: number;
  badgeText: string;
  description: string;
  leverageTip: string;
}

export interface EntrepreneurDevelopmentArea {
  dimensionCode: string;
  dimensionName: string;
  score: number;
  gapSummary: string;
  actionItem: string;
  suggestedExercise: string;
}

export interface EntrepreneurDevelopmentResultDTO {
  resultId: string;
  attemptId: string;
  participantId: string;
  assessmentCode: "ENTREPRENEUR_DEVELOPMENT_TEST";
  assessmentName: string;
  versionCode: string | null;
  versionName: string | null;
  completedAt: string;
  completionTimeSeconds?: number;

  // Executive Readiness Index
  readinessIndex: number; // 0 - 100
  readinessBand: EntrepreneurReadinessBand;
  readinessTagline: string;
  readinessSummary: string;

  // Primary & Secondary Archetype Classification
  primaryArchetype: {
    code: EntrepreneurArchetypeCode;
    title: string;
    tagline: string;
    description: string;
    keySuperpowers: string[];
    leadershipStyle: string;
    blindSpots: string[];
    idealCoFounders: string[];
  };
  secondaryArchetype: {
    code: EntrepreneurArchetypeCode;
    title: string;
    tagline: string;
    affinityScore: number;
  } | null;
  archetypeAffinities: EntrepreneurArchetypeAffinity[];

  // 10 Dimensions Breakdown
  dimensions: EntrepreneurDimensionScoreDetails[];

  // Strengths & Growth Areas
  strengths: EntrepreneurStrengthArea[];
  developmentAreas: EntrepreneurDevelopmentArea[];

  // Actionable 4-Stage Startup Roadmap
  roadmap: StartupRoadmapPhase[];

  // Curated Learning Recommendations
  learningRecommendations: {
    recommendedBooks: Array<{ title: string; author: string; rationale: string }>;
    coreFrameworks: Array<{ name: string; description: string; application: string }>;
    practicalProjects: Array<{ title: string; objective: string; deliverable: string }>;
  };

  // Response Quality & Audit
  responseQuality: {
    isComplete: boolean;
    answeredCount: number;
    totalExpected: number;
    completionPercentage: number;
  };
}

export class EntrepreneurDevelopmentScoringService {
  /**
   * Weights matrix for mapping dimension percentages to archetypes.
   */
  private readonly ARCHETYPE_WEIGHT_MATRIX: Record<
    EntrepreneurArchetypeCode,
    Record<string, number>
  > = {
    INNOVATOR: {
      DIM_INNOVATION_CREAT: 0.35,
      DIM_OPP_RECOGNITION: 0.25,
      DIM_ENTR_INTEREST: 0.20,
      DIM_RISK_TOLERANCE: 0.10,
      DIM_GROWTH_MINDSET: 0.10,
    },
    BUILDER: {
      DIM_EXECUTION_INIT: 0.35,
      DIM_BUSINESS_THINKING: 0.25,
      DIM_RESILIENCE_GRIT: 0.20,
      DIM_LEADERSHIP_INFL: 0.10,
      DIM_GROWTH_MINDSET: 0.10,
    },
    LEADER: {
      DIM_LEADERSHIP_INFL: 0.35,
      DIM_COMM_PITCHING: 0.25,
      DIM_BUSINESS_THINKING: 0.20,
      DIM_EXECUTION_INIT: 0.10,
      DIM_RESILIENCE_GRIT: 0.10,
    },
    EXPLORER: {
      DIM_ENTR_INTEREST: 0.35,
      DIM_RISK_TOLERANCE: 0.25,
      DIM_OPP_RECOGNITION: 0.20,
      DIM_INNOVATION_CREAT: 0.10,
      DIM_GROWTH_MINDSET: 0.10,
    },
    GROWTH_ENTREPRENEUR: {
      DIM_GROWTH_MINDSET: 0.30,
      DIM_OPP_RECOGNITION: 0.25,
      DIM_EXECUTION_INIT: 0.20,
      DIM_BUSINESS_THINKING: 0.15,
      DIM_COMM_PITCHING: 0.10,
    },
  };

  /**
   * Calculates complete psychometric score and venture readiness report for ED Test.
   */
  calculateScores(params: {
    attemptId: string;
    participantId: string;
    versionCode?: string | null;
    versionName?: string | null;
    responses: RawResponseItem[];
    completionTimeSeconds?: number;
  }): EntrepreneurDevelopmentResultDTO {
    const {
      attemptId,
      participantId,
      versionCode = "ENTREPRENEUR_DEVELOPMENT_V1",
      versionName = "Entrepreneur Development Test — Standard Edition",
      responses,
      completionTimeSeconds,
    } = params;

    // 1. Group responses by dimensionCode
    const responsesByDim: Record<string, RawResponseItem[]> = {};
    const questionScoresByNum: Record<number, number> = {};

    for (const r of responses) {
      const qNum = parseInt(String(r.question_number), 10);
      const scoreVal = Number(r.score_value) || 0;
      if (!isNaN(qNum)) {
        questionScoresByNum[qNum] = scoreVal;
      }

      // Map question number to dimension from static catalog if not present on response
      let dimCode = r.dimension_code;
      if (!dimCode) {
        const catQ = ENTREPRENEUR_DEVELOPMENT_QUESTIONS.find((q) => q.displayOrder === qNum);
        dimCode = catQ?.dimensionCode || "DIM_ENTR_INTEREST";
      }

      if (!responsesByDim[dimCode]) {
        responsesByDim[dimCode] = [];
      }
      responsesByDim[dimCode].push(r);
    }

    // 2. Score 10 Dimensions
    const dimensions: EntrepreneurDimensionScoreDetails[] = ENTREPRENEUR_DIMENSIONS.map((dim) => {
      const dimResponses = responsesByDim[dim.code] || [];
      const totalItemsInCatalog = ENTREPRENEUR_DEVELOPMENT_QUESTIONS.filter(
        (q) => q.dimensionCode === dim.code
      ).length || 6;

      const rawScore = dimResponses.reduce(
        (sum, r) => sum + (Number(r.score_value) || Number(r.response_value) || 0),
        0
      );
      const maxPossibleRaw = totalItemsInCatalog * 5.0; // 5.0 max points per item
      const minPossibleRaw = totalItemsInCatalog * 1.0; // 1.0 min points per item

      // Normalized percentage (0 - 100)
      const percentageScore =
        maxPossibleRaw > 0 ? Math.min(100, Math.max(0, Math.round((rawScore / maxPossibleRaw) * 100))) : 0;

      let band: "Exceptional" | "High" | "Moderate" | "Foundational" = "Foundational";
      if (percentageScore >= 85) band = "Exceptional";
      else if (percentageScore >= 70) band = "High";
      else if (percentageScore >= 50) band = "Moderate";

      return {
        dimensionCode: dim.code,
        dimensionName: dim.name,
        sectionCode: dim.sectionCode,
        description: dim.description,
        weight: dim.weight || 0.1,
        rawScore: Math.round(rawScore * 10) / 10,
        minPossibleRaw,
        maxPossibleRaw,
        percentageScore,
        band,
        answeredCount: dimResponses.length,
        totalItems: totalItemsInCatalog,
        coreIndicators: dim.coreIndicators || [],
        developmentalFocus: dim.developmentalFocus || "",
      };
    });

    // 3. Compute Entrepreneurial Readiness Index (ERI)
    // Weighted average across all 10 dimensions
    const weightedSum = dimensions.reduce((acc, d) => acc + d.percentageScore * d.weight, 0);
    const totalWeight = dimensions.reduce((acc, d) => acc + d.weight, 0);
    const readinessIndex =
      totalWeight > 0 ? Math.min(100, Math.max(0, Math.round(weightedSum / totalWeight))) : 0;

    let readinessBand: EntrepreneurReadinessBand = "Foundation Development";
    let readinessTagline = "Foundation Exploration & Entrepreneurial Skill Discovery";
    let readinessSummary =
      "You are at the foundational discovery stage. Focus on sharpening problem recognition, learning core business models, and building confidence in venture execution through low-risk sandbox projects.";

    if (readinessIndex >= 85) {
      readinessBand = "Exceptional Readiness";
      readinessTagline = "High-Caliber Venture Builder with Multi-Dimensional Readiness";
      readinessSummary =
        "You demonstrate exceptional venture readiness across strategic thinking, execution tenacity, and leadership orchestration. You possess the mental agility and grit to validate hypotheses, attract high-performing co-founders, and navigate startup uncertainty.";
    } else if (readinessIndex >= 70) {
      readinessBand = "Strong Entrepreneurial Aptitude";
      readinessTagline = "Vibrant Entrepreneurial Instincts & Strong Venture Potential";
      readinessSummary =
        "You exhibit strong entrepreneurial instincts, solid analytical acumen, and proactive problem solving. With deliberate practice in pitching, risk calibration, and systems execution, you are well-positioned to launch and scale impactful initiatives.";
    } else if (readinessIndex >= 50) {
      readinessBand = "Developing Capability";
      readinessTagline = "Emerging Entrepreneurial Mindset with High Growth Potential";
      readinessSummary =
        "You display promising entrepreneurial curiosity and emerging leadership capabilities. Targeted coaching on business unit economics, systematic customer interviews, and iterative prototyping will accelerate your venture readiness.";
    }

    // 4. Calculate Archetype Affinities
    const dimScoreMap: Record<string, number> = {};
    for (const d of dimensions) {
      dimScoreMap[d.dimensionCode] = d.percentageScore;
    }

    const affinities: EntrepreneurArchetypeAffinity[] = (
      Object.keys(ENTREPRENEUR_PROFILES) as EntrepreneurArchetypeCode[]
    ).map((archCode) => {
      const profile = ENTREPRENEUR_PROFILES[archCode];
      const weightWeights = this.ARCHETYPE_WEIGHT_MATRIX[archCode] || {};
      let totalAffinity = 0;
      let totalWeightsApplied = 0;

      for (const [dimKey, weight] of Object.entries(weightWeights)) {
        const dimScore = dimScoreMap[dimKey] ?? 50;
        totalAffinity += dimScore * weight;
        totalWeightsApplied += weight;
      }

      const normalizedAffinity =
        totalWeightsApplied > 0
          ? Math.min(100, Math.max(0, Math.round(totalAffinity / totalWeightsApplied)))
          : 50;

      return {
        archetypeCode: archCode,
        title: profile.title,
        tagline: profile.tagline,
        affinityScore: normalizedAffinity,
        isPrimary: false,
        isSecondary: false,
      };
    });

    // Sort affinities descending
    affinities.sort((a, b) => b.affinityScore - a.affinityScore);

    if (affinities.length > 0) {
      affinities[0].isPrimary = true;
    }
    if (affinities.length > 1) {
      affinities[1].isSecondary = true;
    }

    const primaryAffinity = affinities[0] || {
      archetypeCode: "INNOVATOR" as EntrepreneurArchetypeCode,
      title: "The Visionary Innovator",
      tagline: "Driven by breakthrough ideas, technological differentiation, and novel problem design.",
      affinityScore: 80,
      isPrimary: true,
      isSecondary: false,
    };

    const secondaryAffinity = affinities[1] || null;
    const primaryProfileConfig =
      ENTREPRENEUR_PROFILES[primaryAffinity.archetypeCode] || ENTREPRENEUR_PROFILES.INNOVATOR;

    // 5. Strengths (Top 3 Dimensions)
    const sortedDimsDesc = [...dimensions].sort((a, b) => b.percentageScore - a.percentageScore);
    const strengths: EntrepreneurStrengthArea[] = sortedDimsDesc.slice(0, 3).map((d) => ({
      dimensionCode: d.dimensionCode,
      dimensionName: d.dimensionName,
      score: d.percentageScore,
      badgeText: `${d.percentageScore}% — ${d.band}`,
      description: d.description,
      leverageTip: `Leverage your high ${d.dimensionName.toLowerCase()} score to take the lead in strategic decisions and mentor peers in this area.`,
    }));

    // 6. Growth & Development Areas (Lowest 3 Dimensions)
    const sortedDimsAsc = [...dimensions].sort((a, b) => a.percentageScore - b.percentageScore);
    const developmentAreas: EntrepreneurDevelopmentArea[] = sortedDimsAsc.slice(0, 3).map((d) => ({
      dimensionCode: d.dimensionCode,
      dimensionName: d.dimensionName,
      score: d.percentageScore,
      gapSummary: `Your ${d.dimensionName} score (${d.percentageScore}%) suggests room to build systematic habits and resilience frameworks.`,
      actionItem: d.developmentalFocus,
      suggestedExercise: `Complete a 14-day dedicated challenge focusing on ${d.dimensionName.toLowerCase()} drills, seeking weekly feedback from a mentor.`,
    }));

    // 7. 4-Stage Startup Roadmap
    const roadmap: StartupRoadmapPhase[] = [
      {
        phaseNumber: 1,
        title: "Stage 1: Ideation & Problem Discovery",
        duration: "Weeks 1 - 4",
        objectives: [
          primaryProfileConfig.startupRoadmap.stage1Ideation,
          "Conduct 20 customer discovery interviews to validate problem severity",
          "Map initial value proposition and draft Lean Business Model Canvas",
        ],
        milestones: ["Customer Problem-Solution Fit Validated"],
        keyTools: ["Lean Canvas", "Figma", "Notion", "Google Forms"],
      },
      {
        phaseNumber: 2,
        title: "Stage 2: Validation & Prototyping",
        duration: "Weeks 5 - 8",
        objectives: [
          primaryProfileConfig.startupRoadmap.stage2Validation,
          "Build clickable low-fidelity prototype or landing page smoke test",
          "Collect qualitative feedback from at least 15 early adopters",
        ],
        milestones: ["First 100 Signed-Up Early Adopters"],
        keyTools: ["Webflow / Next.js", "Stripe", "Loom", "Mixpanel"],
      },
      {
        phaseNumber: 3,
        title: "Stage 3: Execution & Team Building",
        duration: "Weeks 9 - 14",
        objectives: [
          primaryProfileConfig.startupRoadmap.stage3Execution,
          "Form core founding team with complementary co-founder roles",
          "Launch functional Minimum Viable Product (MVP) to early users",
        ],
        milestones: ["Live Product Launch with Active Daily Users"],
        keyTools: ["GitHub", "Linear", "Slack", "PostgreSQL"],
      },
      {
        phaseNumber: 4,
        title: "Stage 4: Scaling & Growth Loops",
        duration: "Weeks 15+",
        objectives: [
          primaryProfileConfig.startupRoadmap.stage4Scale,
          "Optimize organic referral loops and customer acquisition channels",
          "Prepare 10-slide investor pitch deck and financial projections",
        ],
        milestones: ["Consistent Month-over-Month Revenue Growth"],
        keyTools: ["Pitch.com", "HubSpot", "Google Analytics", "ChartMogul"],
      },
    ];

    // 8. Curated Learning Recommendations
    const learningRecommendations = {
      recommendedBooks: [
        {
          title: "The Lean Startup",
          author: "Eric Ries",
          rationale: "Essential guide to validated learning, rapid experimentation, and the Build-Measure-Learn feedback loop.",
        },
        {
          title: "Zero to One",
          author: "Peter Thiel",
          rationale: "Mastering vertical progress, unique secret monopolies, and contrarian startup differentiation.",
        },
        {
          title: "The Mom Test",
          author: "Rob Fitzpatrick",
          rationale: "How to talk to customers and learn if your business is a good idea when everyone is lying to you.",
        },
      ],
      coreFrameworks: [
        {
          name: "Business Model Canvas (BMC)",
          description: "9-block strategic management tool for quickly drafting, refining, and validating business models.",
          application: "Use during Phase 1 & 2 to map value propositions, distribution channels, and revenue streams.",
        },
        {
          name: "Customer Discovery Interviews",
          description: "Structured qualitative discovery framework to uncover genuine consumer friction before writing code.",
          application: "Interview 30 target users with open-ended, non-leading inquiry protocols.",
        },
        {
          name: "Objective & Key Results (OKRs)",
          description: "Goal-setting framework used by high-growth startups to drive radical execution velocity.",
          application: "Set 1 ambitious quarterly objective with 3 quantifiable weekly key results.",
        },
      ],
      practicalProjects: [
        {
          title: "48-Hour Micro-Landing Page Experiment",
          objective: "Validate market demand with actual visitor actions (email signups / pre-orders) before building product.",
          deliverable: "Live landing page with tracked CTA conversion rate from 100 targeted visitors.",
        },
        {
          title: "3-Minute Venture Pitch Video & One-Pager",
          objective: "Synthesize problem, unique solution, unit economics, and team vision into an irresistible narrative.",
          deliverable: "Recorded pitch deck presentation evaluated by an entrepreneur mentor or counsellor.",
        },
      ],
    };

    return {
      resultId: "",
      attemptId,
      participantId,
      assessmentCode: "ENTREPRENEUR_DEVELOPMENT_TEST",
      assessmentName: "Entrepreneur Development Test",
      versionCode,
      versionName,
      completedAt: new Date().toISOString(),
      completionTimeSeconds,
      readinessIndex,
      readinessBand,
      readinessTagline,
      readinessSummary,
      primaryArchetype: {
        code: primaryAffinity.archetypeCode,
        title: primaryProfileConfig.title,
        tagline: primaryProfileConfig.tagline,
        description: primaryProfileConfig.description,
        keySuperpowers: primaryProfileConfig.strengthSuperpowers || [],
        leadershipStyle: primaryProfileConfig.leadershipStyle,
        blindSpots: [
          "Tendency to focus on ideation before locking in repeatable customer validation",
          "Risk of premature optimization before core product-market fit is confirmed",
        ],
        idealCoFounders: primaryProfileConfig.dominantDimensions || [],
      },
      secondaryArchetype: secondaryAffinity
        ? {
            code: secondaryAffinity.archetypeCode,
            title: secondaryAffinity.title,
            tagline: secondaryAffinity.tagline,
            affinityScore: secondaryAffinity.affinityScore,
          }
        : null,
      archetypeAffinities: affinities,
      dimensions,
      strengths,
      developmentAreas,
      roadmap,
      learningRecommendations,
      responseQuality: {
        isComplete: responses.length >= 60,
        answeredCount: responses.length,
        totalExpected: 60,
        completionPercentage: Math.min(100, Math.round((responses.length / 60) * 100)),
      },
    };
  }
}

export const entrepreneurDevelopmentScoringService = new EntrepreneurDevelopmentScoringService();

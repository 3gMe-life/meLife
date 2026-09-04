import {
  DimensionScoreItem,
  ExplorationDirectionItem,
  SkillFinderResultDTO,
} from "../assessment-runner.types";

const EXPLORATION_MAP: Record<string, {
  clusterTitle: string;
  description: string;
  sampleExplorationAreas: string[];
  suggestedActivities: string[];
}> = {
  BUILDER_R: {
    clusterTitle: "Engineering, Applied Technology & Construction",
    description: "Hands-on making, mechanical systems, robotics, architecture, and practical engineering.",
    sampleExplorationAreas: [
      "Robotics & Mechatronics",
      "Civil & Structural Engineering",
      "Physical Product Design",
      "Aeronautics & Automotive Systems",
    ],
    suggestedActivities: [
      "Build modular robotics or Arduino / Raspberry Pi starter kits.",
      "Participate in science & maker fairs or 3D modeling workshops.",
      "Experiment with woodworking, mechanics, or bridge-building physics challenges.",
    ],
  },
  EXPLORER_I: {
    clusterTitle: "Scientific Inquiry, Research & Computing Analytics",
    description: "Analytical investigations, algorithmic problem solving, natural sciences, and data exploration.",
    sampleExplorationAreas: [
      "Data Science & Artificial Intelligence",
      "Biotechnology & Genetics",
      "Astrophysics & Space Exploration",
      "Environmental Science & Chemistry",
    ],
    suggestedActivities: [
      "Conduct home science experiments and record hypotheses.",
      "Learn foundational Python programming and algorithmic logic.",
      "Read science and astronomy journals or participate in Math Olympiads.",
    ],
  },
  CREATOR_A: {
    clusterTitle: "Creative Arts, Digital Media & Innovative Design",
    description: "Visual communication, digital illustration, storytelling, user experience design, and media production.",
    sampleExplorationAreas: [
      "UI/UX & Product Design",
      "Animation & Game Design",
      "Creative Writing & Journalism",
      "Architecture & Spatial Arts",
    ],
    suggestedActivities: [
      "Create digital art, comic strips, or 2D animation clips.",
      "Write short fiction, blog posts, or script small video sketches.",
      "Learn graphic design tools (Figma, Canva, Adobe Creative Suite).",
    ],
  },
  HELPER_S: {
    clusterTitle: "Human Services, Education, Healthcare & Community",
    description: "Mentoring, community wellbeing, healthcare professions, teaching, and counseling.",
    sampleExplorationAreas: [
      "Clinical Psychology & Counseling",
      "Medicine & Public Health",
      "Education & Special Needs Pedagogy",
      "Social Impact & Non-Profit Leadership",
    ],
    suggestedActivities: [
      "Volunteer for peer tutoring or junior student mentoring programs.",
      "Participate in community service, eco-clubs, or first-aid training.",
      "Practice active listening and lead collaborative school club discussions.",
    ],
  },
  LEADER_E: {
    clusterTitle: "Entrepreneurship, Business Strategy & Public Leadership",
    description: "Organizing initiatives, public speaking, negotiation, enterprise management, and team leadership.",
    sampleExplorationAreas: [
      "Business Management & Entrepreneurship",
      "Corporate Law & Public Policy",
      "Marketing & Brand Strategy",
      "Financial Economics & Venture Capital",
    ],
    suggestedActivities: [
      "Lead a school club, sports squad, or science exhibition team.",
      "Participate in debate competitions and Model United Nations (MUN).",
      "Organize a mini-fundraiser or school event project from concept to delivery.",
    ],
  },
  ORGANISER_C: {
    clusterTitle: "Operations, Information Systems & Financial Management",
    description: "System administration, logistics, financial planning, database management, and structured execution.",
    sampleExplorationAreas: [
      "Financial Analysis & Accounting",
      "Cybersecurity & Cloud Infrastructure",
      "Supply Chain & Operations Management",
      "Statistical Quality Control",
    ],
    suggestedActivities: [
      "Manage schedules, budgets, and inventories for school club events.",
      "Explore spreadsheet analytics and structured database tools.",
      "Learn project management techniques such as Kanban and milestone tracking.",
    ],
  },
};

const INTEREST_DOMAINS = [
  { code: "BUILDER_R", name: "Builder (R)" },
  { code: "EXPLORER_I", name: "Explorer (I)" },
  { code: "CREATOR_A", name: "Creator (A)" },
  { code: "HELPER_S", name: "Helper (S)" },
  { code: "LEADER_E", name: "Leader (E)" },
  { code: "ORGANISER_C", name: "Organiser (C)" },
];

const SKILL_DIMENSIONS = [
  { code: "LOGICAL_PROBLEM_SOLVING", name: "Logical & Problem-Solving" },
  { code: "COMMUNICATION", name: "Communication & Expression" },
  { code: "CREATIVE_THINKING", name: "Creative Thinking" },
  { code: "VISUAL_SPATIAL_THINKING", name: "Visual-Spatial Thinking" },
  { code: "PRACTICAL_TECHNICAL_SKILL", name: "Practical & Technical Skill" },
  { code: "SOCIAL_TEAMWORK", name: "Social & Teamwork" },
  { code: "LEADERSHIP_INITIATIVE", name: "Leadership & Initiative" },
  { code: "SELF_MANAGEMENT", name: "Self-Management & Focus" },
];

const APTITUDE_DIMENSIONS = [
  { code: "PATTERN_LOGIC", name: "Pattern & Deductive Logic" },
  { code: "NUMERICAL_REASONING", name: "Numerical Reasoning & Proportions" },
  { code: "VERBAL_REASONING", name: "Verbal Analogies & Evidence" },
  { code: "SPATIAL_REASONING", name: "Spatial Visualization & Mental Folding" },
  { code: "PRACTICAL_PROBLEM_SOLVING", name: "Practical Problem Solving" },
  { code: "CREATIVE_THINKING_TASKS", name: "Creative Thinking Tasks (Divergence)" },
  { code: "SITUATIONAL_JUDGMENT", name: "Situational Social Judgment" },
  { code: "PLANNING_ESTIMATION", name: "Planning, Estimation & Scheduling" },
];

const STRENGTH_DIMENSIONS = [
  { code: "CURIOSITY", name: "Curiosity & Inquisitiveness" },
  { code: "PERSISTENCE", name: "Persistence & Resilience" },
  { code: "ADAPTABILITY", name: "Adaptability & Openness to Feedback" },
  { code: "INITIATIVE", name: "Initiative & Self-Drive" },
  { code: "COLLABORATION", name: "Collaborative Learning" },
  { code: "ATTENTION_TO_DETAIL", name: "Attention to Detail & Thoroughness" },
  { code: "INDEPENDENCE", name: "Learning Independence" },
];

export class SkillFinderScoringService {
  /**
   * Evaluates participant raw responses dynamically based on whatever subset
   * of questions was present in the attempt version.
   */
  calculateResult(
    attemptId: string,
    participantId: string,
    rawResponses: any[],
    versionMetadata?: { versionCode?: string; versionName?: string }
  ): SkillFinderResultDTO {
    // Index responses by question_number and dimension_code
    const responsesByQNum: Record<number, any> = {};
    const responsesByDimension: Record<string, any[]> = {};
    const responsesBySection: Record<string, any[]> = {};

    for (const r of rawResponses) {
      const qNum = parseInt(r.question_number, 10);
      responsesByQNum[qNum] = r;

      const dimCode = (r.dimension_code || "GENERAL").toUpperCase();
      if (!responsesByDimension[dimCode]) responsesByDimension[dimCode] = [];
      responsesByDimension[dimCode].push(r);

      const secCode = (r.section_code || "GENERAL").toUpperCase();
      if (!responsesBySection[secCode]) responsesBySection[secCode] = [];
      responsesBySection[secCode].push(r);
    }

    // Helper to extract Likert 1-4 points
    const getLikertVal = (r: any): number => {
      if (!r || !r.response_value) return 2;
      const parsed = parseInt(r.response_value, 10);
      return !isNaN(parsed) && parsed >= 1 && parsed <= 4 ? parsed : 2;
    };

    // Helper to score aptitude item
    const scoreAptitudeItem = (r: any): number => {
      if (!r || !r.response_value) return 0;
      const maxPts = parseFloat(r.max_points) || 2;

      if (r.question_type === "open_scored") {
        const text = (r.response_value || "").trim();
        const words = text.split(/\s+/).filter(Boolean);
        if (words.length >= 20) return maxPts;
        if (words.length >= 12) return Math.min(3, maxPts);
        if (words.length >= 6) return Math.min(2, maxPts);
        if (words.length >= 2) return Math.min(1, maxPts);
        return 0;
      }

      // Objective MCQ
      if (r.correct_key && r.response_value) {
        const userAns = r.response_value.trim().toUpperCase();
        const correct = r.correct_key.trim().toUpperCase();
        return userAns === correct ? maxPts : 0;
      }

      return 0;
    };

    // =========================================================================
    // 1. SECTION A: Interest Discovery (Dynamic scale normalization)
    // =========================================================================
    const interestDimensions: DimensionScoreItem[] = INTEREST_DOMAINS.map((dom) => {
      const items = responsesByDimension[dom.code] || [];
      const count = items.length;
      if (count === 0) {
        return {
          code: dom.code,
          name: dom.name,
          rawScore: 0,
          maxScore: 0,
          scalePositionPercentage: 50,
          level: "Moderate",
          description: EXPLORATION_MAP[dom.code]?.description,
        };
      }

      const sum = items.reduce((acc, r) => acc + getLikertVal(r), 0);
      const minScore = count * 1;
      const maxScore = count * 4;
      const percentage = Math.round(((sum - minScore) / (maxScore - minScore)) * 100);
      const normalizedPct = Math.max(0, Math.min(100, percentage));

      return {
        code: dom.code,
        name: dom.name,
        rawScore: sum,
        maxScore,
        scalePositionPercentage: normalizedPct,
        level: normalizedPct >= 75 ? "High" : normalizedPct >= 50 ? "Proficient" : normalizedPct >= 25 ? "Moderate" : "Emerging",
        description: EXPLORATION_MAP[dom.code]?.description,
      };
    });

    const sortedInterests = [...interestDimensions].sort(
      (a, b) => b.scalePositionPercentage - a.scalePositionPercentage
    );
    const topInterestClusters = sortedInterests.slice(0, 3).map((item) => ({
      code: item.code,
      name: item.name,
      scalePositionPercentage: item.scalePositionPercentage,
      clusterTitle: EXPLORATION_MAP[item.code]?.clusterTitle || item.name,
    }));

    // =========================================================================
    // 2. SECTION B: Skill Behaviour (Dynamic scale normalization)
    // =========================================================================
    const skillDimensions: DimensionScoreItem[] = SKILL_DIMENSIONS.map((dim) => {
      const items = responsesByDimension[dim.code] || [];
      const count = items.length;
      if (count === 0) {
        return {
          code: dim.code,
          name: dim.name,
          rawScore: 0,
          maxScore: 0,
          scalePositionPercentage: 50,
          level: "Moderate",
        };
      }

      const sum = items.reduce((acc, r) => acc + getLikertVal(r), 0);
      const minScore = count * 1;
      const maxScore = count * 4;
      const percentage = Math.round(((sum - minScore) / (maxScore - minScore)) * 100);
      const normalizedPct = Math.max(0, Math.min(100, percentage));

      return {
        code: dim.code,
        name: dim.name,
        rawScore: sum,
        maxScore,
        scalePositionPercentage: normalizedPct,
        level: normalizedPct >= 75 ? "High" : normalizedPct >= 50 ? "Proficient" : normalizedPct >= 25 ? "Moderate" : "Emerging",
      };
    });

    const sortedSkills = [...skillDimensions].sort(
      (a, b) => b.scalePositionPercentage - a.scalePositionPercentage
    );
    const strongestSkillIndicators = sortedSkills.slice(0, 3);
    const developmentOpportunities = sortedSkills.slice(-2).reverse();

    // =========================================================================
    // 3. SECTION C: Demonstrated Aptitude (Dynamic accuracy calculation)
    // =========================================================================
    let totalEarnedAptitude = 0;
    let totalPossibleAptitude = 0;

    const aptitudeDimensions: DimensionScoreItem[] = APTITUDE_DIMENSIONS.map((dim) => {
      const items = responsesByDimension[dim.code] || [];
      if (items.length === 0) {
        return {
          code: dim.code,
          name: dim.name,
          rawScore: 0,
          maxScore: 0,
          scalePositionPercentage: 50,
          level: "Moderate",
        };
      }

      let earned = 0;
      let possible = 0;
      for (const item of items) {
        earned += scoreAptitudeItem(item);
        possible += parseFloat(item.max_points) || 2;
      }

      totalEarnedAptitude += earned;
      totalPossibleAptitude += possible;

      const pct = possible > 0 ? Math.round((earned / possible) * 100) : 50;
      const normalizedPct = Math.max(0, Math.min(100, pct));

      return {
        code: dim.code,
        name: dim.name,
        rawScore: earned,
        maxScore: possible,
        scalePositionPercentage: normalizedPct,
        level: normalizedPct >= 75 ? "High" : normalizedPct >= 50 ? "Proficient" : normalizedPct >= 25 ? "Moderate" : "Emerging",
      };
    });

    const overallAccuracyPercentage =
      totalPossibleAptitude > 0
        ? Math.round((totalEarnedAptitude / totalPossibleAptitude) * 100)
        : 75;

    // =========================================================================
    // 4. SECTION D: Developmental Strengths (Dynamic scale normalization)
    // =========================================================================
    const strengthDimensions: DimensionScoreItem[] = STRENGTH_DIMENSIONS.map((dim) => {
      const items = responsesByDimension[dim.code] || [];
      const count = items.length;
      if (count === 0) {
        return {
          code: dim.code,
          name: dim.name,
          rawScore: 0,
          maxScore: 0,
          scalePositionPercentage: 50,
          level: "Moderate",
        };
      }

      const sum = items.reduce((acc, r) => acc + getLikertVal(r), 0);
      const minScore = count * 1;
      const maxScore = count * 4;
      const percentage = Math.round(((sum - minScore) / (maxScore - minScore)) * 100);
      const normalizedPct = Math.max(0, Math.min(100, percentage));

      return {
        code: dim.code,
        name: dim.name,
        rawScore: sum,
        maxScore,
        scalePositionPercentage: normalizedPct,
        level: normalizedPct >= 75 ? "High" : normalizedPct >= 50 ? "Proficient" : normalizedPct >= 25 ? "Moderate" : "Emerging",
      };
    });

    const sortedStrengths = [...strengthDimensions].sort(
      (a, b) => b.scalePositionPercentage - a.scalePositionPercentage
    );
    const topStrengths = sortedStrengths.slice(0, 3);

    // =========================================================================
    // 5. SECTION E: Response Quality & Validity Checks
    // =========================================================================
    // Evaluate parallel pairs that were present in this version
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

    // Attention check: Q104 expected response is "2" ("A little like me")
    const r104 = responsesByQNum[104];
    const attentionCheckPassed = r104
      ? r104.response_value === "2" || r104.response_value === "A little like me"
      : true;

    // =========================================================================
    // 6. Map Non-Prescriptive Exploration Directions
    // =========================================================================
    const explorationDirections: ExplorationDirectionItem[] = topInterestClusters.map((cluster) => {
      const mapped = EXPLORATION_MAP[cluster.code];
      return {
        domain: cluster.name,
        clusterTitle: mapped?.clusterTitle || cluster.name,
        description: mapped?.description || "Broad exploration domain.",
        sampleExplorationAreas: mapped?.sampleExplorationAreas || [],
        suggestedActivities: mapped?.suggestedActivities || [],
      };
    });

    return {
      resultId: "",
      attemptId,
      participantId,
      assessmentCode: "SKILL_FINDER",
      assessmentName: "Skill Finder",
      versionCode: versionMetadata?.versionCode || null,
      versionName: versionMetadata?.versionName || null,
      completedAt: new Date().toISOString(),
      responseQuality: {
        consistencySignal,
        attentionCheckPassed,
        interpretation:
          consistencySignal === "High Consistency" && attentionCheckPassed
            ? "Your responses demonstrate high consistency and attentiveness throughout the assessment session."
            : "Your responses demonstrate adequate consistency for exploratory career profiling.",
      },
      interestDiscovery: {
        topClusters: topInterestClusters,
        dimensions: interestDimensions,
      },
      skillBehaviour: {
        strongestIndicators: strongestSkillIndicators,
        developmentOpportunities,
        dimensions: skillDimensions,
      },
      demonstratedAptitude: {
        overallAccuracyPercentage,
        dimensions: aptitudeDimensions,
      },
      developmentalStrengths: {
        topStrengths,
        dimensions: strengthDimensions,
      },
      explorationDirections,
      growthSuggestions: [
        `Explore introductory activities and workshops aligned with your top interest clusters (${topInterestClusters.map((c) => c.name).join(", ")}).`,
        `Engage in hands-on creative and analytical projects to further strengthen ${strongestSkillIndicators[0]?.name || "core problem-solving instincts"}.`,
        `Continue practicing collaborative group tasks and reflective learning to nurture emerging developmental habits.`,
        `Schedule a personalized guidance session with a certified career counselor for structured academic trajectory planning.`,
      ],
    };
  }
}

export const skillFinderScoringService = new SkillFinderScoringService();

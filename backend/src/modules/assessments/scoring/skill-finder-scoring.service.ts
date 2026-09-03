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

export class SkillFinderScoringService {
  /**
   * Evaluates participant raw responses against the validated Skill Finder psychometric rubric.
   */
  calculateResult(
    attemptId: string,
    participantId: string,
    rawResponses: any[]
  ): SkillFinderResultDTO {
    // Organize responses by Question Number
    const responsesByQNum: Record<number, any> = {};
    for (const r of rawResponses) {
      responsesByQNum[parseInt(r.question_number, 10)] = r;
    }

    // Helper to get score for Likert 1-4 items
    const getLikertVal = (qNum: number): number => {
      const r = responsesByQNum[qNum];
      if (!r || !r.response_value) return 2; // neutral midpoint default
      const parsed = parseInt(r.response_value, 10);
      return !isNaN(parsed) && parsed >= 1 && parsed <= 4 ? parsed : 2;
    };

    // Helper to get MCQ correctness
    const getMcqPoints = (qNum: number, correctKey: string, maxPoints = 2): number => {
      const r = responsesByQNum[qNum];
      if (!r || !r.response_value) return 0;
      const userAns = r.response_value.trim().toUpperCase();
      return userAns === correctKey.trim().toUpperCase() ? maxPoints : 0;
    };

    // Helper to score open creative tasks
    const getOpenCreativePoints = (qNum: number): number => {
      const r = responsesByQNum[qNum];
      if (!r || !r.response_value) return 0;
      const text = r.response_value.trim();
      const words = text.split(/\s+/).filter(Boolean);
      // Rubric heuristic based on word count & variety
      if (words.length >= 25) return 4;
      if (words.length >= 15) return 3;
      if (words.length >= 8) return 2;
      if (words.length >= 3) return 1;
      return 0;
    };

    // =========================================================================
    // 1. SECTION A: Interest Discovery (6 Domains, 5 items each, min 5, max 20)
    // =========================================================================
    const interestDomainConfigs = [
      { code: "BUILDER_R", name: "Builder (R)", items: [1, 7, 13, 19, 25] },
      { code: "EXPLORER_I", name: "Explorer (I)", items: [2, 8, 14, 20, 26] },
      { code: "CREATOR_A", name: "Creator (A)", items: [3, 9, 15, 21, 27] },
      { code: "HELPER_S", name: "Helper (S)", items: [4, 10, 16, 22, 28] },
      { code: "LEADER_E", name: "Leader (E)", items: [5, 11, 17, 23, 29] },
      { code: "ORGANISER_C", name: "Organiser (C)", items: [6, 12, 18, 24, 30] },
    ];

    const interestDimensions: DimensionScoreItem[] = interestDomainConfigs.map((cfg) => {
      const sum = cfg.items.reduce((acc, q) => acc + getLikertVal(q), 0);
      const percentage = Math.round(((sum - 5) / 15) * 100);
      return {
        code: cfg.code,
        name: cfg.name,
        rawScore: sum,
        maxScore: 20,
        scalePositionPercentage: Math.max(0, Math.min(100, percentage)),
        level: percentage >= 75 ? "High" : percentage >= 50 ? "Proficient" : percentage >= 25 ? "Moderate" : "Emerging",
        description: EXPLORATION_MAP[cfg.code]?.description,
      };
    });

    // Rank top interests
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
    // 2. SECTION B: Skill Behaviour (8 Dimensions, 3 items each, min 3, max 12)
    // =========================================================================
    const skillConfigs = [
      { code: "LOGICAL_PROBLEM_SOLVING", name: "Logical & Problem-Solving", items: [31, 39, 47] },
      { code: "COMMUNICATION", name: "Communication & Expression", items: [32, 40, 48] },
      { code: "CREATIVE_THINKING", name: "Creative Thinking", items: [33, 41, 49] },
      { code: "VISUAL_SPATIAL_THINKING", name: "Visual-Spatial Thinking", items: [34, 42, 50] },
      { code: "PRACTICAL_TECHNICAL_SKILL", name: "Practical & Technical Skill", items: [35, 43, 51] },
      { code: "SOCIAL_TEAMWORK", name: "Social & Teamwork", items: [36, 44, 52] },
      { code: "LEADERSHIP_INITIATIVE", name: "Leadership & Initiative", items: [37, 45, 53] },
      { code: "SELF_MANAGEMENT", name: "Self-Management & Focus", items: [38, 46, 54] },
    ];

    const skillDimensions: DimensionScoreItem[] = skillConfigs.map((cfg) => {
      const sum = cfg.items.reduce((acc, q) => acc + getLikertVal(q), 0);
      const percentage = Math.round(((sum - 3) / 9) * 100);
      return {
        code: cfg.code,
        name: cfg.name,
        rawScore: sum,
        maxScore: 12,
        scalePositionPercentage: Math.max(0, Math.min(100, percentage)),
        level: percentage >= 75 ? "High" : percentage >= 50 ? "Proficient" : percentage >= 25 ? "Moderate" : "Emerging",
      };
    });

    const sortedSkills = [...skillDimensions].sort(
      (a, b) => b.scalePositionPercentage - a.scalePositionPercentage
    );
    const strongestSkillIndicators = sortedSkills.slice(0, 3);
    const developmentOpportunities = sortedSkills.slice(-2).reverse();

    // =========================================================================
    // 3. SECTION C: Demonstrated Aptitude (8 Task Performance Areas)
    // =========================================================================
    const aptitudeConfigs = [
      {
        code: "PATTERN_LOGIC",
        name: "Pattern & Deductive Logic",
        maxScore: 8,
        calculate: () =>
          getMcqPoints(55, "C", 2) + // Q55: 95 (C)
          getMcqPoints(56, "B", 2) + // Q56: No Rino is yellow (B)
          getMcqPoints(57, "B", 2) + // Q57: Image sequence (B)
          getMcqPoints(58, "C", 2),  // Q58: Image matrix (C)
      },
      {
        code: "NUMERICAL_REASONING",
        name: "Numerical Reasoning & Proportions",
        maxScore: 8,
        calculate: () =>
          getMcqPoints(59, "B", 2) + // Q59: 8 (B)
          getMcqPoints(60, "C", 2) + // Q60: 210 (C)
          getMcqPoints(61, "C", 2) + // Q61: 24 (C)
          getMcqPoints(62, "D", 2),  // Q62: 150 (D)
      },
      {
        code: "VERBAL_REASONING",
        name: "Verbal Analogies & Evidence",
        maxScore: 8,
        calculate: () =>
          getMcqPoints(63, "B", 2) + // Q63: Eating (B)
          getMcqPoints(64, "B", 2) + // Q64: Heavy rain happened during the night (B)
          getMcqPoints(65, "C", 2) + // Q65: Foot (C)
          getMcqPoints(66, "C", 2),  // Q66: Maya paid attention to the return deadline (C)
      },
      {
        code: "SPATIAL_REASONING",
        name: "Spatial Rotation & Paper Folding",
        maxScore: 8,
        calculate: () =>
          getMcqPoints(67, "D", 2) + // Q67: West (D)
          getMcqPoints(68, "D", 2) + // Q68: Image rotation (D)
          getMcqPoints(69, "B", 2) + // Q69: Image paperfold (B)
          getMcqPoints(70, "C", 2),  // Q70: North-East (C)
      },
      {
        code: "PRACTICAL_PROBLEM_SOLVING",
        name: "Practical Troubleshooting",
        maxScore: 4,
        calculate: () =>
          getMcqPoints(71, "B", 2) + // Q71: Check batteries (B)
          getMcqPoints(72, "B", 2),  // Q72: Check chain alignment (B)
      },
      {
        code: "CREATIVE_THINKING_TASKS",
        name: "Creative Divergence & Ideation",
        maxScore: 8,
        calculate: () => getOpenCreativePoints(73) + getOpenCreativePoints(74),
      },
      {
        code: "SOCIAL_JUDGMENT",
        name: "Situational & Social Judgment",
        maxScore: 4,
        calculate: () =>
          getMcqPoints(75, "B", 2) + // Q75: Let both explain (B)
          getMcqPoints(76, "C", 2),  // Q76: Invite the student (C)
      },
      {
        code: "PLANNING_PRIORITIZATION",
        name: "Task Planning & Prioritization",
        maxScore: 4,
        calculate: () =>
          getMcqPoints(77, "B", 2) + // Q77: Plan by urgency (B)
          getMcqPoints(78, "C", 2),  // Q78: Finish urgent revision (C)
      },
    ];

    let totalAptitudeEarned = 0;
    let totalAptitudeMax = 0;

    const aptitudeDimensions: DimensionScoreItem[] = aptitudeConfigs.map((cfg) => {
      const earned = cfg.calculate();
      totalAptitudeEarned += earned;
      totalAptitudeMax += cfg.maxScore;
      const percentage = Math.round((earned / cfg.maxScore) * 100);
      return {
        code: cfg.code,
        name: cfg.name,
        rawScore: earned,
        maxScore: cfg.maxScore,
        scalePositionPercentage: percentage,
        level: percentage >= 75 ? "High" : percentage >= 50 ? "Proficient" : percentage >= 25 ? "Moderate" : "Emerging",
      };
    });

    const overallAccuracyPercentage = Math.round(
      (totalAptitudeEarned / totalAptitudeMax) * 100
    );

    // =========================================================================
    // 4. SECTION D: Developmental Strengths (7 Habits, 3 items each, min 3, max 12)
    // =========================================================================
    const devConfigs = [
      { code: "CURIOSITY", name: "Curiosity & Wonder", items: [79, 86, 93] },
      { code: "PERSISTENCE", name: "Persistence & Resilience", items: [80, 87, 94] },
      { code: "ADAPTABILITY", name: "Adaptability & Flexibility", items: [81, 88, 95] },
      { code: "INITIATIVE", name: "Initiative & Self-Start", items: [82, 89, 96] },
      { code: "COLLABORATION", name: "Collaborative Spirit", items: [83, 90, 97] },
      { code: "ATTENTION_DETAIL", name: "Attention to Detail", items: [84, 91, 98] },
      { code: "LEARNING_INDEPENDENCE", name: "Learning Independence", items: [85, 92, 99] },
    ];

    const devDimensions: DimensionScoreItem[] = devConfigs.map((cfg) => {
      const sum = cfg.items.reduce((acc, q) => acc + getLikertVal(q), 0);
      const percentage = Math.round(((sum - 3) / 9) * 100);
      return {
        code: cfg.code,
        name: cfg.name,
        rawScore: sum,
        maxScore: 12,
        scalePositionPercentage: Math.max(0, Math.min(100, percentage)),
        level: percentage >= 75 ? "High" : percentage >= 50 ? "Proficient" : percentage >= 25 ? "Moderate" : "Emerging",
      };
    });

    const sortedDevHabits = [...devDimensions].sort(
      (a, b) => b.scalePositionPercentage - a.scalePositionPercentage
    );
    const topHabits = sortedDevHabits.slice(0, 3);

    // =========================================================================
    // 5. SECTION E: Response Quality & Consistency Signal
    // =========================================================================
    const delta1 = Math.abs(getLikertVal(100) - getLikertVal(53)); // Leadership
    const delta2 = Math.abs(getLikertVal(101) - getLikertVal(80)); // Persistence
    const delta3 = Math.abs(getLikertVal(102) - getLikertVal(2));  // Explorer
    const delta4 = Math.abs(getLikertVal(103) - getLikertVal(38)); // Planning
    const avgDelta = (delta1 + delta2 + delta3 + delta4) / 4;

    const attentionCheckPassed = getLikertVal(104) === 2;

    let consistencySignal: "High Consistency" | "Adequate Consistency" | "Review Suggested" = "Review Suggested";
    if (attentionCheckPassed && avgDelta <= 0.75) {
      consistencySignal = "High Consistency";
    } else if (attentionCheckPassed && avgDelta <= 1.5) {
      consistencySignal = "Adequate Consistency";
    }

    const interpretation =
      consistencySignal === "High Consistency"
        ? "Responses show strong internal alignment across parallel items."
        : consistencySignal === "Adequate Consistency"
        ? "Responses show adequate reliability across core assessment sections."
        : "Some responses varied across similar questions. Treat findings as exploratory discussion starters.";

    // =========================================================================
    // 6. Exploration Directions Mapping
    // =========================================================================
    const explorationDirections: ExplorationDirectionItem[] = topInterestClusters.map((cluster) => {
      const info = EXPLORATION_MAP[cluster.code] || {
        clusterTitle: cluster.name,
        description: "Explore multidisciplinary projects and practical problem solving.",
        sampleExplorationAreas: ["Applied Learning", "Creative Projects", "Team Challenges"],
        suggestedActivities: ["Join student hobby clubs", "Read introductory domain books"],
      };
      return {
        domain: cluster.name,
        clusterTitle: info.clusterTitle,
        description: info.description,
        sampleExplorationAreas: info.sampleExplorationAreas,
        suggestedActivities: info.suggestedActivities,
      };
    });

    const growthSuggestions = [
      "Engage in hands-on projects related to your top interest domains through clubs, hobby workshops, or guided maker tasks.",
      "Cultivate your demonstrated aptitude strengths by tackling progressive puzzle solving, logic games, and creative writing prompts.",
      "Discuss these exploratory results with your parents or school guidance counselor to plan engaging extracurricular activities.",
    ];

    return {
      resultId: `res_${attemptId}`,
      attemptId,
      participantId,
      assessmentCode: "SKILL_FINDER",
      assessmentName: "Skill Finder (Ages 10–13)",
      completedAt: new Date().toISOString(),
      responseQuality: {
        consistencySignal,
        attentionCheckPassed,
        interpretation,
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
        topHabits,
        dimensions: devDimensions,
      },
      explorationDirections,
      growthSuggestions,
    };
  }
}

export const skillFinderScoringService = new SkillFinderScoringService();

/**
 * 3G MeLife Career Report Utilities
 * Safe dimension resolution, developmental guidance mapping, and career display diversification.
 */

import { EvidenceSource } from "./career-report.types";

/**
 * Safely resolves the canonical uppercase dimension code from any result dimension item.
 * Defends against undefined/missing code properties to prevent TypeError.
 */
export function resolveDimensionCode(dim: unknown): string | null {
  if (!dim || typeof dim !== "object") return null;

  const obj = dim as Record<string, unknown>;
  const rawCode =
    obj.code ||
    obj.dimensionCode ||
    obj.constructCode ||
    obj.key ||
    (typeof obj.dimension === "string" ? obj.dimension : undefined);

  if (typeof rawCode === "string" && rawCode.trim()) {
    return rawCode.trim().toUpperCase();
  }

  // Fallback: match recognizable canonical names
  const name = String(obj.name || obj.dimensionName || "").toLowerCase().trim();
  if (!name) return null;

  if (name.includes("pattern") || name.includes("deductive")) return "PATTERN_LOGIC";
  if (name.includes("numerical") || name.includes("quantitative")) return "NUMERICAL_REASONING";
  if (name.includes("verbal") || name.includes("analogies")) return "VERBAL_REASONING";
  if (name.includes("spatial") || name.includes("mental rotation")) return "SPATIAL_REASONING";
  if (name.includes("practical") || name.includes("troubleshoot")) return "PRACTICAL_PROBLEM_SOLVING";
  if (name.includes("creative divergence") || name.includes("ideation")) return "CREATIVE_THINKING_TASKS";
  if (name.includes("situational") || name.includes("judgment")) return "SITUATIONAL_JUDGMENT";
  if (name.includes("planning") || name.includes("estimation")) return "PLANNING_ESTIMATION";

  if (name.includes("logical & problem") || name.includes("problem-solving instinct")) return "LOGICAL_PROBLEM_SOLVING";
  if (name.includes("communication") || name.includes("articulation")) return "COMMUNICATION";
  if (name.includes("creative & divergent")) return "CREATIVE_THINKING";
  if (name.includes("visual-spatial thinking")) return "VISUAL_SPATIAL_THINKING";
  if (name.includes("practical & technical") || name.includes("dexterity")) return "PRACTICAL_TECHNICAL_SKILL";
  if (name.includes("social interaction") || name.includes("teamwork")) return "SOCIAL_TEAMWORK";
  if (name.includes("leadership & initiative")) return "LEADERSHIP_INITIATIVE";
  if (name.includes("self-management")) return "SELF_MANAGEMENT";

  // General alphanumeric normalization fallback if standard name string
  const normalized = name.toUpperCase().replace(/[^A-Z0-9]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
  return normalized || null;
}

/**
 * Central typed dictionary mapping canonical dimension codes to evidence sources and actionable practice routines.
 */
export interface DevelopmentGuidanceRule {
  dimensionCode: string;
  evidenceSource: EvidenceSource;
  displayName: string;
  focusRationale: string;
  suggestedPractice: string;
  realWorldActivity: string;
  howToImprove: string[];
  suggestedActivities: string[];
}

export const DEVELOPMENT_GUIDANCE: Record<string, DevelopmentGuidanceRule> = {
  NUMERICAL_REASONING: {
    dimensionCode: "NUMERICAL_REASONING",
    evidenceSource: "DEMONSTRATED_TASK_PERFORMANCE",
    displayName: "Algorithmic & Quantitative Reasoning",
    focusRationale: "Quantitative problem-solving benefits from structured practice with data decomposition and multi-step computational logic.",
    suggestedPractice: "Dedicate 20 minutes daily to timed problem-solving exercises in probability, data interpretation, and algorithmic flowcharts.",
    realWorldActivity: "Build a budget spreadsheet tracking personal expenses with formulas or model an investment growth simulator in Python.",
    howToImprove: [
      "Practice step-by-step problem decomposition on logic and math problem sets.",
      "Work through daily quantitative reasoning challenges and mental math puzzles.",
      "Analyze data graphs and charts in scientific articles to derive quantitative insights.",
    ],
    suggestedActivities: [
      "Participate in beginner algorithmic competitions (e.g., Bebras or LeetCode Easy).",
      "Enroll in an interactive introductory data analysis or spreadsheet modeling module.",
      "Build a simple calculator or data visualizer project.",
    ],
  },
  PATTERN_LOGIC: {
    dimensionCode: "PATTERN_LOGIC",
    evidenceSource: "DEMONSTRATED_TASK_PERFORMANCE",
    displayName: "Pattern Logic & Deductive Systems",
    focusRationale: "Recognizing underlying sequences and rule-based structures accelerates conceptual mastery in STEM and analytical disciplines.",
    suggestedPractice: "Solve non-verbal matrix reasoning tests and reverse-engineer rule sets in procedural board games or logic grids.",
    realWorldActivity: "Map out the decision tree for a complex board game strategy or write a rule engine for automated sorting.",
    howToImprove: [
      "Practice matrix reasoning, syllogisms, and formal deductive puzzles.",
      "Examine how system components interact before troubleshooting technical errors.",
      "Break multi-stage processes into discrete logical dependencies.",
    ],
    suggestedActivities: [
      "Play strategy-heavy tabletop games (e.g., Chess, Settlers of Catan, Go).",
      "Learn basic formal logic or introductory boolean algebra.",
      "Assemble modular electronic kits or mechanical model puzzles.",
    ],
  },
  VERBAL_REASONING: {
    dimensionCode: "VERBAL_REASONING",
    evidenceSource: "DEMONSTRATED_TASK_PERFORMANCE",
    displayName: "Verbal Analysis & Technical Articulation",
    focusRationale: "Precision in reading complex documentation and articulating technical arguments is essential for cross-functional impact.",
    suggestedPractice: "Read one long-form analytical essay daily and write a concise 3-sentence executive summary of the central thesis.",
    realWorldActivity: "Participate in a school debate club or write a technical review of a gadget or software tool you use.",
    howToImprove: [
      "Summarize complex articles into concise bullet points highlighting key evidence.",
      "Expand technical vocabulary across scientific and economic domains.",
      "Practice structured persuasive speaking using claim-warrant-impact framework.",
    ],
    suggestedActivities: [
      "Join the school Model UN, debate forum, or student journalism team.",
      "Write thoughtful documentation or user guides for class group projects.",
      "Host peer discussion circles on contemporary science and ethics topics.",
    ],
  },
  SPATIAL_REASONING: {
    dimensionCode: "SPATIAL_REASONING",
    evidenceSource: "DEMONSTRATED_TASK_PERFORMANCE",
    displayName: "Spatial Thinking & 3D Visualization",
    focusRationale: "Visualizing multiaxis geometry and spatial transformations underpins architecture, engineering design, and physical sciences.",
    suggestedPractice: "Engage in isometric drawing drills, origami, and 3D geometric puzzle rotations.",
    realWorldActivity: "Design a room floorplan or 3D model an everyday object using free CAD tools like Tinkercad or Blender.",
    howToImprove: [
      "Practice 2D to 3D orthographic projection sketching.",
      "Solve mental rotation challenges and topographical map reading problems.",
      "Construct physical geometric wireframes and architectural prototypes.",
    ],
    suggestedActivities: [
      "Learn basic 3D modeling using Tinkercad, SketchUp, or Blender.",
      "Participate in physical robotics fabrication or LEGO Mindstorms building.",
      "Experiment with woodworking, papercraft origami, or architectural drafting.",
    ],
  },
  SELF_MANAGEMENT: {
    dimensionCode: "SELF_MANAGEMENT",
    evidenceSource: "DEVELOPMENTAL_HABIT",
    displayName: "Project Stewardship & Time Management",
    focusRationale: "Sustained focus and structured milestones prevent cognitive overload during multi-week academic initiatives.",
    suggestedPractice: "Use a weekly time-blocking planner with daily top-3 priorities and 25-minute Pomodoro focus sprints.",
    realWorldActivity: "Take full ownership of planning a family trip itinerary, a community event, or a term revision calendar.",
    howToImprove: [
      "Decompose term assignments into weekly sub-milestones with defined deadlines.",
      "Track daily task completion visually using Kanban boards (e.g., Trello or Notion).",
      "Schedule non-negotiable deep-work blocks free from digital notifications.",
    ],
    suggestedActivities: [
      "Maintain a personal productivity journal tracking study focus and energy levels.",
      "Act as project manager or coordinator for a multi-student school presentation.",
      "Set up a personal portfolio website or organized digital knowledge repository.",
    ],
  },
  PERSISTENCE: {
    dimensionCode: "PERSISTENCE",
    evidenceSource: "DEVELOPMENTAL_HABIT",
    displayName: "Resilience & Growth Mindset Persistence",
    focusRationale: "Reframing early errors as diagnostic feedback builds the stamina required for ambitious multi-year career paths.",
    suggestedPractice: "Keep a 'Bug & Lesson Log' where setbacks are documented along with the specific adjustment tried next.",
    realWorldActivity: "Tackle a challenging self-directed project outside your comfort zone (e.g., learning a musical instrument or marathon training).",
    howToImprove: [
      "Treat initial errors as informative diagnostic feedback rather than permanent deficits.",
      "Seek constructive feedback from teachers and mentors after test evaluations.",
      "Re-attempt complex problems 24 hours later using alternative approaches.",
    ],
    suggestedActivities: [
      "Engage in long-cycle hobby mastery such as coding complex apps or competitive chess.",
      "Participate in endurance athletics, martial arts, or music recital practice.",
      "Read biographies of pioneering scientists and innovators to observe overcoming adversity.",
    ],
  },
  COMMUNICATION: {
    dimensionCode: "COMMUNICATION",
    evidenceSource: "SELF_REPORTED_BEHAVIOUR",
    displayName: "Cross-Functional Collaborative Communication",
    focusRationale: "Conveying technical rationale empathetically ensures ideas gain consensus and collective support.",
    suggestedPractice: "Practice active listening by rephrasing peer viewpoints before proposing alternative solutions.",
    realWorldActivity: "Lead a volunteer initiative or moderate a class study discussion on complex curriculum themes.",
    howToImprove: [
      "Practice active listening by paraphrasing a peer's idea before offering critiques.",
      "Take on coordinating or synthesis roles in group school assignments.",
      "Seek feedback from teammates on your collaborative contributions.",
    ],
    suggestedActivities: [
      "Participate in group science competitions or community club leadership.",
      "Facilitate peer study circles to teach and learn complex concepts mutually.",
      "Collaborate on a shared digital repository or open-source team project.",
    ],
  },
};

/**
 * Diversifies raw career matches for UX display selection without altering raw match percentages or rankings.
 * Ensures the primary 4 displayed pathways span distinct career families rather than duplicate near-identical roles.
 */
export function diversifyCareerMatches<T extends object = Record<string, unknown>>(
  rawMatches: T[],
  targetCount = 4
): {
  primaryMatches: T[];
  relatedMatches: T[];
} {
  if (!rawMatches || rawMatches.length === 0) {
    return { primaryMatches: [], relatedMatches: [] };
  }

  const primaryMatches: T[] = [];
  const relatedMatches: T[] = [];
  const seenFamilies = new Set<string>();

  // Pass 1: Select highest-scoring representative career from each distinct family/category
  for (const match of rawMatches) {
    const m = match as Record<string, unknown>;
    const familyKey = String(
      m.familyCode ||
      m.family_code ||
      m.familyName ||
      m.family_name ||
      m.domain ||
      m.category ||
      m.clusterTitle ||
      m.industry ||
      "GENERAL"
    ).toUpperCase().trim();

    if (!seenFamilies.has(familyKey) && primaryMatches.length < targetCount) {
      seenFamilies.add(familyKey);
      primaryMatches.push({ ...match });
    } else {
      relatedMatches.push({ ...match });
    }
  }

  // Pass 2: If distinct families are fewer than targetCount, fill remaining slots from remaining matches in raw score order
  if (primaryMatches.length < targetCount) {
    while (primaryMatches.length < targetCount && relatedMatches.length > 0) {
      const nextBest = relatedMatches.shift()!;
      primaryMatches.push(nextBest);
    }
  }

  // Preserve raw score order within primary matches
  const getScore = (item: T): number => {
    const obj = item as Record<string, unknown>;
    if (typeof obj.matchPercentage === "number") return obj.matchPercentage;
    if (typeof obj.overallScore === "number") return obj.overallScore;
    return 0;
  };
  primaryMatches.sort((a, b) => getScore(b) - getScore(a));

  return { primaryMatches, relatedMatches };
}

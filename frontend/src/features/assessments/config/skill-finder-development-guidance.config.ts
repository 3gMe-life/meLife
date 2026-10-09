import { EvidenceType } from "../components/results/skill-finder/EvidenceTypeBadge";

export interface ConstructGuidanceItem {
  code: string;
  name: string;
  evidenceSource: EvidenceType;
  sourceLabel: string;
  whyAppearsRelative: string;
  whyAppearsEmerging: string;
  tryNextActivities: string[];
}

export const SKILL_FINDER_DEVELOPMENT_GUIDANCE: Record<string, ConstructGuidanceItem> = {
  // Layer 2: Skill Behaviours (Self-Reported Style)
  LOGICAL_PROBLEM_SOLVING: {
    code: "LOGICAL_PROBLEM_SOLVING",
    name: "Logical & Problem-Solving Instincts",
    evidenceSource: "SELF_REPORTED_BEHAVIOUR",
    sourceLabel: "Self-Reported Skill Behaviour",
    whyAppearsRelative: "Strong existing problem-solving style with opportunities for complex algorithmic challenges.",
    whyAppearsEmerging: "Self-reported preference suggests building structured step-by-step decomposition habits.",
    tryNextActivities: [
      "Practice step-by-step problem decomposition using flowcharts or decision trees.",
      "Engage with introductory algorithmic puzzles and deductive riddle games.",
      "Break multi-step school projects into distinct testable milestones.",
    ],
  },
  COMMUNICATION: {
    code: "COMMUNICATION",
    name: "Communication & Expressive Articulation",
    evidenceSource: "SELF_REPORTED_BEHAVIOUR",
    sourceLabel: "Self-Reported Skill Behaviour",
    whyAppearsRelative: "Solid expressive foundation with headroom for structured debate and presentations.",
    whyAppearsEmerging: "Self-reported responses indicate an opportunity to practice structured public articulation.",
    tryNextActivities: [
      "Join a school debate, Model UN, or public speaking club.",
      "Practice summarizing complex ideas in 2-minute structured verbal presentations.",
      "Write reflective project logs or short explanatory articles.",
    ],
  },
  CREATIVE_THINKING: {
    code: "CREATIVE_THINKING",
    name: "Creative & Divergent Thinking",
    evidenceSource: "SELF_REPORTED_BEHAVIOUR",
    sourceLabel: "Self-Reported Skill Behaviour",
    whyAppearsRelative: "High creative ideation confidence that can be channeled into tangible multimedia design.",
    whyAppearsEmerging: "Opportunity to experiment with open-ended creative brainstorming and design tools.",
    tryNextActivities: [
      "Use mind-mapping and brainstorming techniques (e.g. SCAMPER) for school assignments.",
      "Learn digital creative tools (Figma, Canva, Adobe Creative Suite).",
      "Participate in design-thinking workshops and open-ended innovation challenges.",
    ],
  },
  VISUAL_SPATIAL_THINKING: {
    code: "VISUAL_SPATIAL_THINKING",
    name: "Visual-Spatial Thinking",
    evidenceSource: "SELF_REPORTED_BEHAVIOUR",
    sourceLabel: "Self-Reported Skill Behaviour",
    whyAppearsRelative: "Good spatial intuition with opportunities for advanced 3D modeling and architecture projects.",
    whyAppearsEmerging: "Self-reported responses indicate less frequent engagement with 3D modeling and spatial diagramming.",
    tryNextActivities: [
      "Practice mental rotation puzzles, net-folding challenges, and spatial geometry exercises.",
      "Experiment with 3D modeling software (Tinkercad, SketchUp, or Blender).",
      "Build physical scale models, origami structures, or mechanical assemblies.",
    ],
  },
  PRACTICAL_TECHNICAL_SKILL: {
    code: "PRACTICAL_TECHNICAL_SKILL",
    name: "Practical & Technical Dexterity",
    evidenceSource: "SELF_REPORTED_BEHAVIOUR",
    sourceLabel: "Self-Reported Skill Behaviour",
    whyAppearsRelative: "Strong self-reported practical confidence that will benefit from verified lab project work.",
    whyAppearsEmerging: "Opportunity to gain more hands-on tinkering experience with physical tools and hardware.",
    tryNextActivities: [
      "Build starter robotics kits or experiment with Arduino / Raspberry Pi hardware.",
      "Participate in hands-on maker fairs, woodworking, or electronics workshops.",
      "Take apart and safely troubleshoot household mechanical items with adult guidance.",
    ],
  },
  SOCIAL_TEAMWORK: {
    code: "SOCIAL_TEAMWORK",
    name: "Social Interaction & Teamwork",
    evidenceSource: "SELF_REPORTED_BEHAVIOUR",
    sourceLabel: "Self-Reported Skill Behaviour",
    whyAppearsRelative: "Established peer collaboration confidence with scope for cross-functional team leadership.",
    whyAppearsEmerging: "Opportunity to engage in more structured group projects and collaborative problem-solving.",
    tryNextActivities: [
      "Participate in group sports, theater productions, or community volunteer projects.",
      "Practice active listening techniques and peer feedback during group study.",
      "Take on distinct role-based responsibilities within school club committees.",
    ],
  },
  LEADERSHIP_INITIATIVE: {
    code: "LEADERSHIP_INITIATIVE",
    name: "Leadership & Initiative",
    evidenceSource: "SELF_REPORTED_BEHAVIOUR",
    sourceLabel: "Self-Reported Skill Behaviour",
    whyAppearsRelative: "Strong self-reported leadership drive ready for real-world project ownership.",
    whyAppearsEmerging: "Opportunity to practice initiating small self-directed group activities.",
    tryNextActivities: [
      "Propose and lead a mini-project, fundraiser, or study group among peers.",
      "Organize event logistics or timelines for a school club activity.",
      "Shadow student leaders or participate in youth leadership workshops.",
    ],
  },
  SELF_MANAGEMENT: {
    code: "SELF_MANAGEMENT",
    name: "Self-Management & Focus",
    evidenceSource: "SELF_REPORTED_BEHAVIOUR",
    sourceLabel: "Self-Reported Skill Behaviour",
    whyAppearsRelative: "High baseline self-discipline that can be enhanced through advanced milestone planning.",
    whyAppearsEmerging: "Opportunity to build structured study routines, time blocking, and distraction management.",
    tryNextActivities: [
      "Implement weekly time-blocking and digital calendar scheduling for assignments.",
      "Use the Pomodoro technique (25 min focus / 5 min break) for sustained study sessions.",
      "Conduct weekly personal reflection on completed tasks and priority adjustments.",
    ],
  },

  // Layer 3: Demonstrated Aptitude (Objective Tasks)
  PATTERN_LOGIC: {
    code: "PATTERN_LOGIC",
    name: "Pattern & Deductive Logic",
    evidenceSource: "DEMONSTRATED_APTITUDE",
    sourceLabel: "Demonstrated Cognitive Task",
    whyAppearsRelative: "Solid logic foundation that can be expanded to multi-variable matrix puzzles.",
    whyAppearsEmerging: "Task performance in this sitting indicates unfamiliarity with sequential matrix reasoning.",
    tryNextActivities: [
      "Solve progressive Raven-style matrix reasoning and geometric pattern puzzles.",
      "Practice sequence deduction and conditional logic riddles (Sudoku, Nonograms).",
      "Study truth tables and formal deductive logic concepts in mathematics.",
    ],
  },
  NUMERICAL_REASONING: {
    code: "NUMERICAL_REASONING",
    name: "Numerical Reasoning & Proportions",
    evidenceSource: "DEMONSTRATED_APTITUDE",
    sourceLabel: "Demonstrated Cognitive Task",
    whyAppearsRelative: "Good quantitative grasp with room for advanced data interpretation and statistical logic.",
    whyAppearsEmerging: "Task score reflects need for more practice with rapid arithmetic proportions and data ratios.",
    tryNextActivities: [
      "Practice speed-estimation and mental math calculations with percentages and ratios.",
      "Analyze real-world charts, financial budgets, and statistical reports.",
      "Work through quantitative reasoning challenges in competitive math workbooks.",
    ],
  },
  VERBAL_REASONING: {
    code: "VERBAL_REASONING",
    name: "Verbal Analogies & Evidence",
    evidenceSource: "DEMONSTRATED_APTITUDE",
    sourceLabel: "Demonstrated Cognitive Task",
    whyAppearsRelative: "Strong vocabulary comprehension that can tackle critical textual analysis.",
    whyAppearsEmerging: "Task score suggests practicing conceptual analogies and identifying logical fallacies in text.",
    tryNextActivities: [
      "Read advanced non-fiction articles and practice identifying core theses and supporting evidence.",
      "Solve verbal analogy puzzles and expand context-based vocabulary.",
      "Practice summarizing editorial viewpoints and assessing logical validity.",
    ],
  },
  SPATIAL_REASONING: {
    code: "SPATIAL_REASONING",
    name: "Spatial Visualization & Mental Folding",
    evidenceSource: "DEMONSTRATED_APTITUDE",
    sourceLabel: "Demonstrated Cognitive Task",
    whyAppearsRelative: "Competent mental visualization ready for engineering CAD and orthographic projection.",
    whyAppearsEmerging: "Session accuracy indicates opportunity to practice 3D isometric views and mental net-folding.",
    tryNextActivities: [
      "Practice 3D isometric drawing and 2D net-folding geometry problems.",
      "Engage with block rotation mobile apps and spatial visualization challenges.",
      "Build complex LEGO Technic, Meccano, or modular architectural models.",
    ],
  },
  PRACTICAL_PROBLEM_SOLVING: {
    code: "PRACTICAL_PROBLEM_SOLVING",
    name: "Practical Everyday Troubleshooting",
    evidenceSource: "DEMONSTRATED_APTITUDE",
    sourceLabel: "Demonstrated Cognitive Task",
    whyAppearsRelative: "Sound scientific intuition for mechanical and everyday troubleshooting.",
    whyAppearsEmerging: "Task responses indicate opportunity to apply basic physical and mechanical laws to practical problems.",
    tryNextActivities: [
      "Explore simple machines (levers, pulleys, gears) through physical physics kits.",
      "Troubleshoot basic computer hardware, home networks, or bicycle mechanics.",
      "Conduct home experiments demonstrating thermodynamics and mechanical principles.",
    ],
  },

  // Layer 4: Developmental Habits (Malleable Habits)
  CURIOSITY: {
    code: "CURIOSITY",
    name: "Curiosity & Inquisitive Exploration",
    evidenceSource: "DEVELOPMENTAL_HABIT",
    sourceLabel: "Developmental Habit Indicator",
    whyAppearsRelative: "Vibrant intellectual curiosity that can be directed into deeper scientific research.",
    whyAppearsEmerging: "Opportunity to cultivate active question-asking across unfamiliar subjects.",
    tryNextActivities: [
      "Keep a 'Curiosity Journal' to write down 3 unanswered questions every week.",
      "Explore diverse educational podcasts, documentaries, and science expos.",
      "Interview professionals in fields you know little about.",
    ],
  },
  PERSISTENCE: {
    code: "PERSISTENCE",
    name: "Persistence & Task Resilience",
    evidenceSource: "DEVELOPMENTAL_HABIT",
    sourceLabel: "Developmental Habit Indicator",
    whyAppearsRelative: "Reliable tenacity that thrives when tackling longer multi-week milestone projects.",
    whyAppearsEmerging: "Responses indicate opportunity to build resilience when facing initial task frustration.",
    tryNextActivities: [
      "Take on a challenging multi-week hobby project (e.g. learning an instrument or coding an app).",
      "Adopt a growth mindset: view errors as informative iterative feedback.",
      "Track difficulty milestones and celebrate incremental effort rather than just end results.",
    ],
  },
  ADAPTABILITY: {
    code: "ADAPTABILITY",
    name: "Adaptability & Openness to Feedback",
    evidenceSource: "DEVELOPMENTAL_HABIT",
    sourceLabel: "Developmental Habit Indicator",
    whyAppearsRelative: "High openness to constructive mentorship and flexible problem pivots.",
    whyAppearsEmerging: "Opportunity to practice adjusting smoothly when rules or project constraints change.",
    tryNextActivities: [
      "Actively seek constructive feedback from teachers on draft assignments.",
      "Engage in strategy board games that require changing tactics mid-game.",
      "Participate in rapid brainstorming hackathons with shifting scenario constraints.",
    ],
  },
  INITIATIVE: {
    code: "INITIATIVE",
    name: "Initiative & Self-Drive",
    evidenceSource: "DEVELOPMENTAL_HABIT",
    sourceLabel: "Developmental Habit Indicator",
    whyAppearsRelative: "Strong autonomous drive ready for independent passion projects.",
    whyAppearsEmerging: "Opportunity to practice starting assignments ahead of deadlines without external prompting.",
    tryNextActivities: [
      "Set personal self-directed learning goals outside of school requirements.",
      "Start assignments on the day they are assigned rather than waiting for reminders.",
      "Undertake an independent exploratory research topic of personal interest.",
    ],
  },
  ATTENTION_TO_DETAIL: {
    code: "ATTENTION_TO_DETAIL",
    name: "Attention to Detail & Accuracy",
    evidenceSource: "DEVELOPMENTAL_HABIT",
    sourceLabel: "Developmental Habit Indicator",
    whyAppearsRelative: "High precision standards that ensure quality execution across technical work.",
    whyAppearsEmerging: "Opportunity to build double-checking routines and systematic proofreading habits.",
    tryNextActivities: [
      "Create a standardized pre-submission checklist for academic assignments.",
      "Practice proofreading and verifying calculation steps in reverse order.",
      "Engage in detailed precision activities (e.g. calligraphy, coding syntax, detailed sketching).",
    ],
  },
};

export function getConstructDevelopmentGuidance(code: string, name?: string): ConstructGuidanceItem {
  const normalizedCode = (code || "").toUpperCase().trim();

  // Direct lookup
  if (SKILL_FINDER_DEVELOPMENT_GUIDANCE[normalizedCode]) {
    return SKILL_FINDER_DEVELOPMENT_GUIDANCE[normalizedCode];
  }

  // Code alias matches
  for (const [key, item] of Object.entries(SKILL_FINDER_DEVELOPMENT_GUIDANCE)) {
    if (
      normalizedCode.includes(key) ||
      key.includes(normalizedCode) ||
      (name && item.name.toLowerCase().includes(name.toLowerCase()))
    ) {
      return item;
    }
  }

  // Fallback default
  return {
    code: normalizedCode || "GENERAL_DEVELOPMENT",
    name: name || "Target Skill Construct",
    evidenceSource: "SELF_REPORTED_BEHAVIOUR",
    sourceLabel: "Development Indicator",
    whyAppearsRelative: "Solid existing capability with headroom for structured expansion.",
    whyAppearsEmerging: "Opportunity to build verified mastery through structured experiential practice.",
    tryNextActivities: [
      "Engage in structured hands-on trial projects and milestone goal setting.",
      "Review learning experiences with a teacher, mentor, or qualified career counsellor.",
      "Practice iterative reflection and gradual skill-building over time.",
    ],
  };
}

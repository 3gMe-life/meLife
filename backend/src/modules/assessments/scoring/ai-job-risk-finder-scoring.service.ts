import {
  STUDENT_READINESS_CONSTRUCTS,
  AI_JOB_RISK_FINDER_DIMENSIONS,
} from "../content/ai-job-risk-finder-catalog.data";
import { RawResponseItem } from "../../scoring/scoring.types";

export type AiTransformationVelocity =
  | "Rapid Evolution"
  | "High Transformation"
  | "Steady Evolution"
  | "Emerging Frontier";

export type AiCareerArchetype =
  | "AI_AUGMENTED_SYSTEMS"
  | "HUMAN_CENTRIC_RESILIENT"
  | "AI_TRANSFORMING"
  | "EMERGING_AI_FRONTIER";

export type StudentReadinessTier =
  | "Exceptional Readiness"
  | "Proficient / High Readiness"
  | "Developing Readiness"
  | "Foundational Orientation";

export interface StudentConstructScoreDetails {
  dimensionCode: string;
  dimensionName: string;
  sectionCode: string;
  description: string;
  rawScore: number;
  minPossibleRaw: number; // 5
  maxPossibleRaw: number; // 25
  normalizedScore: number; // 0 to 100
  level: "Exceptional" | "High" | "Moderate" | "Developing";
  answeredCount: number;
  totalItems: number;
  developmentalFocus: string;
}

export interface OccupationalTaskExposureItem {
  taskId: string;
  taskName: string;
  taskDescription: string;
  frequency: "Daily / Core" | "Periodic" | "Project-Based";
  digitalIntensity: number; // 0-100
  routineLevel: number; // 0-100
  rulePredictability: number; // 0-100
  humanJudgmentRequirement: number; // 0-100
  socialRequirement: number; // 0-100
  creativityRequirement: number; // 0-100
  aiAugmentationPotential: number; // 0-100
  taskAiExposureScore: number; // 0-100
  transformationMode: "AI-Augmented" | "Human-Led" | "Automated Streamlining" | "Collaborative Synthesis";
  counsellingInsight: string;
}

export interface OccupationalAiImpactProfile {
  careerCode: string;
  careerTitle: string;
  careerDomain: string;
  archetype: AiCareerArchetype;
  archetypeTitle: string;
  archetypeTagline: string;
  transformationVelocity: AiTransformationVelocity;

  // Aggregate Occupational Indices (0-100)
  overallTaskExposureIndex: number;
  aiAugmentationPotential: number;
  humanCriticalRequirement: number;
  adaptationUrgency: number;

  // Dimension Levels (Low / Moderate / High / Very High)
  taskExposureBand: "Low" | "Moderate" | "High" | "Very High";
  transformationBand: "Moderate" | "High" | "Very High";
  augmentationBand: "Moderate" | "High" | "Very High";
  humanCriticalBand: "High" | "Very High";

  // Task-level evidence items
  tasks: OccupationalTaskExposureItem[];

  // Human-Critical Capabilities that endure
  enduringHumanCapabilities: string[];

  // Future skills for this career
  futureSkillPriorities: Array<{
    skillName: string;
    category: "Technical / AI Fluency" | "Cognitive & Analytical" | "Human & Social";
    importance: "Critical" | "High" | "Valuable";
    rationale: string;
  }>;

  // Emerging AI-enabled opportunities in this field
  emergingOpportunities: string[];
}

export interface DualEvidenceSynthesis {
  readinessTier: StudentReadinessTier;
  readinessIndex: number; // 0-100
  synthesisSummary: string;
  alignmentHighlights: string[];
  skillsWorthDeveloping: Array<{
    skillName: string;
    construct: string;
    currentReadiness: "High" | "Developing" | "Foundational";
    actionableAdvice: string;
  }>;
  counsellorDiscussionPrompts: string[];
  methodologyNote: string;
  pilotDisclaimer: string;
}

export interface AiJobRiskFinderResultDTO {
  resultId: string;
  attemptId: string;
  participantId: string;
  assessmentCode: "AI_JOB_RISK_FINDER";
  assessmentName: "AI Job Risk Finder";
  versionCode: string | null;
  versionName: string | null;
  completedQuestions: number;
  totalQuestions: number;
  completionPercentage: number;
  isComplete: boolean;

  // Student AI Readiness Profile (6 constructs)
  studentReadinessIndex: number; // 0-100
  studentReadinessTier: StudentReadinessTier;
  constructScores: Record<string, StudentConstructScoreDetails>;
  sortedConstructs: StudentConstructScoreDetails[];
  topStrengths: StudentConstructScoreDetails[];
  priorityGrowthAreas: StudentConstructScoreDetails[];

  // Occupational AI Impact Profile
  targetCareerProfile: OccupationalAiImpactProfile;

  // Dual-Evidence Synthesis
  dualEvidenceSynthesis: DualEvidenceSynthesis;

  // Response Quality & Metadata
  responseQuality: {
    isComplete: boolean;
    answeredCount: number;
    totalQuestions: number;
    straightLiningDetected: boolean;
    completionTimeSeconds?: number;
    qualityFlag: "NORMAL" | "CAUTION_LOW_VARIATION" | "INCOMPLETE";
  };
}

// Reverse-keyed item numbers in 48-item bank (Form items: 5, 13, 21, 29, 37, 45)
const REVERSE_KEYED_QUESTIONS = new Set([5, 13, 21, 29, 37, 45]);

/**
 * Benchmark Occupational Task Evidence Library
 */
const OCCUPATIONAL_PROFILES_LIBRARY: Record<string, OccupationalAiImpactProfile> = {
  DEFAULT_TECH: {
    careerCode: "AI_ML_SOFTWARE_ENGINEER",
    careerTitle: "Software & AI Solutions Architect",
    careerDomain: "Computer Science, AI & Emerging Technologies",
    archetype: "AI_AUGMENTED_SYSTEMS",
    archetypeTitle: "AI-Augmented High-Leverage Systems",
    archetypeTagline: "High task exposure combined with very high AI augmentation and system architecture requirements.",
    transformationVelocity: "Rapid Evolution",
    overallTaskExposureIndex: 78,
    aiAugmentationPotential: 92,
    humanCriticalRequirement: 85,
    adaptationUrgency: 88,
    taskExposureBand: "High",
    transformationBand: "Very High",
    augmentationBand: "Very High",
    humanCriticalBand: "Very High",
    tasks: [
      {
        taskId: "TASK_CODE_GEN",
        taskName: "Routine Code Generation & Syntax Drafting",
        taskDescription: "Writing boilerplate functions, CRUD routines, and initial unit test templates.",
        frequency: "Daily / Core",
        digitalIntensity: 95,
        routineLevel: 80,
        rulePredictability: 85,
        humanJudgmentRequirement: 40,
        socialRequirement: 15,
        creativityRequirement: 45,
        aiAugmentationPotential: 95,
        taskAiExposureScore: 88,
        transformationMode: "AI-Augmented",
        counsellingInsight: "AI copilot tools draft syntax rapidly; human focus shifts from typing code to validating logic.",
      },
      {
        taskId: "TASK_SYS_ARCH",
        taskName: "Complex System Architecture & Distributed Design",
        taskDescription: "Designing resilient microservice topology, data schemas, security boundaries, and scalability models.",
        frequency: "Periodic",
        digitalIntensity: 85,
        routineLevel: 25,
        rulePredictability: 35,
        humanJudgmentRequirement: 92,
        socialRequirement: 60,
        creativityRequirement: 88,
        aiAugmentationPotential: 70,
        taskAiExposureScore: 48,
        transformationMode: "Human-Led",
        counsellingInsight: "Remains deeply reliant on human context, trade-off analysis, latency limits, and business goals.",
      },
      {
        taskId: "TASK_STAKEHOLDER",
        taskName: "Product Requirements & Stakeholder Negotiation",
        taskDescription: "Translating ambiguous business requirements and user needs into technical specifications.",
        frequency: "Daily / Core",
        digitalIntensity: 65,
        routineLevel: 20,
        rulePredictability: 25,
        humanJudgmentRequirement: 88,
        socialRequirement: 90,
        creativityRequirement: 78,
        aiAugmentationPotential: 55,
        taskAiExposureScore: 35,
        transformationMode: "Collaborative Synthesis",
        counsellingInsight: "Empathy, domain intuition, and active listening ensure technology addresses real human pain points.",
      },
      {
        taskId: "TASK_SEC_AUDIT",
        taskName: "Security, Privacy & Ethical Compliance Auditing",
        taskDescription: "Reviewing codebases for vulnerabilities, data leakages, and bias in automated decision pipelines.",
        frequency: "Periodic",
        digitalIntensity: 88,
        routineLevel: 45,
        rulePredictability: 60,
        humanJudgmentRequirement: 89,
        socialRequirement: 50,
        creativityRequirement: 75,
        aiAugmentationPotential: 82,
        taskAiExposureScore: 62,
        transformationMode: "AI-Augmented",
        counsellingInsight: "AI scanners detect known vulnerabilities, but human discernment resolves novel attack vectors and compliance gray zones.",
      },
    ],
    enduringHumanCapabilities: [
      "End-to-end system architecture & trade-off reasoning",
      "Translating ambiguous customer needs into elegant software design",
      "Algorithmic safety, ethical boundaries & data privacy stewardship",
      "Cross-functional team leadership & empathetic code mentoring",
    ],
    futureSkillPriorities: [
      {
        skillName: "AI-Assisted Software Orchestration & Prompt Engineering",
        category: "Technical / AI Fluency",
        importance: "Critical",
        rationale: "Leveraging LLM code assistants and agentic workflows to multiply output velocity.",
      },
      {
        skillName: "Critical Output Validation & Automated Test Design",
        category: "Cognitive & Analytical",
        importance: "Critical",
        rationale: "Rigorous verification protocols to detect subtle hallucinations in machine-generated code.",
      },
      {
        skillName: "Cloud Security, Privacy & Responsible AI Architecture",
        category: "Technical / AI Fluency",
        importance: "High",
        rationale: "Building secure, auditable pipelines resilient to adversarial threats and regulatory shifts.",
      },
      {
        skillName: "Stakeholder Empathy & Product Systems Thinking",
        category: "Human & Social",
        importance: "High",
        rationale: "Understanding real human context so software solves actual user problems rather than artificial complexity.",
      },
    ],
    emergingOpportunities: [
      "AI Solutions Architect & Agentic Workflow Engineer",
      "Ethical AI Auditor & Algorithmic Safety Specialist",
      "Cloud Infrastructure & Autonomous Systems Orchestrator",
      "Human-Centered UX & Intelligent Interface Technologist",
    ],
  },
};

export class AiJobRiskFinderScoringService {
  /**
   * Computes comprehensive AI Job Risk Finder psychometric scores, student readiness vector,
   * occupational AI task exposure synthesis, and personalized skill guidance.
   */
  calculateScores(params: {
    attemptId: string;
    participantId: string;
    versionCode?: string | null;
    versionName?: string | null;
    responses: RawResponseItem[];
    completionTimeSeconds?: number;
    targetCareerProfile?: OccupationalAiImpactProfile;
  }): AiJobRiskFinderResultDTO {
    const {
      attemptId,
      participantId,
      versionCode,
      versionName,
      responses,
      completionTimeSeconds,
    } = params;

    const totalQuestions = 30;
    const answeredResponses = responses.filter(
      (r) => r.response_value !== null && r.response_value !== undefined && r.response_value !== ""
    );
    const answeredCount = answeredResponses.length;
    const isComplete = answeredCount >= totalQuestions;
    const completionPercentage = Math.round((answeredCount / totalQuestions) * 100);

    // 1. Group responses by dimension
    const dimensionRawMap: Record<string, { sum: number; count: number; items: number[] }> = {};
    for (const d of AI_JOB_RISK_FINDER_DIMENSIONS) {
      dimensionRawMap[d.code] = { sum: 0, count: 0, items: [] };
    }

    const valueDistribution: Record<string, number> = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };

    for (const r of answeredResponses) {
      const qNum = parseInt(String(r.question_number), 10);
      const rawVal = parseInt(String(r.response_value), 10);
      if (isNaN(rawVal) || rawVal < 1 || rawVal > 5) continue;

      valueDistribution[String(rawVal)] = (valueDistribution[String(rawVal)] || 0) + 1;

      // Reverse scoring logic
      const scoredVal = REVERSE_KEYED_QUESTIONS.has(qNum) ? 6 - rawVal : rawVal;

      const dimCode = r.dimension_code;
      if (dimensionRawMap[dimCode]) {
        dimensionRawMap[dimCode].sum += scoredVal;
        dimensionRawMap[dimCode].count += 1;
        dimensionRawMap[dimCode].items.push(scoredVal);
      }
    }

    // Straight-lining check: if >= 85% of answers are identical
    let maxValCount = 0;
    for (const count of Object.values(valueDistribution)) {
      if (count > maxValCount) maxValCount = count;
    }
    const straightLiningDetected = answeredCount >= 20 && maxValCount / answeredCount >= 0.85;

    // 2. Compute Construct Scores (0-100 normalized)
    const constructScores: Record<string, StudentConstructScoreDetails> = {};
    const sortedConstructs: StudentConstructScoreDetails[] = [];
    let totalNormalized = 0;
    let countedDimensions = 0;

    for (const constructDef of STUDENT_READINESS_CONSTRUCTS) {
      const data = dimensionRawMap[constructDef.code] || { sum: 0, count: 0, items: [] };
      const rawScore = data.sum;
      const count = data.count;

      // 5 items per construct in standard form: min possible = 5, max possible = 25
      const minPossibleRaw = count > 0 ? count * 1 : 5;
      const maxPossibleRaw = count > 0 ? count * 5 : 25;
      const scoreRange = maxPossibleRaw - minPossibleRaw;

      let normalizedScore = 50;
      if (count > 0 && scoreRange > 0) {
        normalizedScore = Math.round(((rawScore - minPossibleRaw) / scoreRange) * 100);
        normalizedScore = Math.max(0, Math.min(100, normalizedScore));
      }

      let level: "Exceptional" | "High" | "Moderate" | "Developing" = "Developing";
      if (normalizedScore >= 80) level = "Exceptional";
      else if (normalizedScore >= 65) level = "High";
      else if (normalizedScore >= 50) level = "Moderate";

      const details: StudentConstructScoreDetails = {
        dimensionCode: constructDef.code,
        dimensionName: constructDef.name,
        sectionCode: constructDef.sectionCode,
        description: constructDef.description,
        rawScore,
        minPossibleRaw,
        maxPossibleRaw,
        normalizedScore,
        level,
        answeredCount: count,
        totalItems: 5,
        developmentalFocus: constructDef.developmentalFocus,
      };

      constructScores[constructDef.code] = details;
      sortedConstructs.push(details);

      totalNormalized += normalizedScore;
      countedDimensions++;
    }

    // Sort constructs descending by score
    sortedConstructs.sort((a, b) => b.normalizedScore - a.normalizedScore);

    const studentReadinessIndex =
      countedDimensions > 0 ? Math.round(totalNormalized / countedDimensions) : 50;

    let studentReadinessTier: StudentReadinessTier = "Developing Readiness";
    if (studentReadinessIndex >= 80) studentReadinessTier = "Exceptional Readiness";
    else if (studentReadinessIndex >= 65) studentReadinessTier = "Proficient / High Readiness";
    else if (studentReadinessIndex >= 50) studentReadinessTier = "Developing Readiness";
    else studentReadinessTier = "Foundational Orientation";

    const topStrengths = sortedConstructs.slice(0, 3);
    const priorityGrowthAreas = sortedConstructs.slice(-3).reverse();

    // 3. Resolve Target Career Profile
    const targetCareerProfile = params.targetCareerProfile || OCCUPATIONAL_PROFILES_LIBRARY.DEFAULT_TECH;

    // 4. Synthesize Dual-Evidence Insights
    const dualEvidenceSynthesis = this.generateSynthesis({
      studentReadinessIndex,
      studentReadinessTier,
      sortedConstructs,
      topStrengths,
      priorityGrowthAreas,
      targetCareerProfile,
    });

    return {
      resultId: "",
      attemptId,
      participantId,
      assessmentCode: "AI_JOB_RISK_FINDER",
      assessmentName: "AI Job Risk Finder",
      versionCode: versionCode || null,
      versionName: versionName || null,
      completedQuestions: answeredCount,
      totalQuestions,
      completionPercentage,
      isComplete,
      studentReadinessIndex,
      studentReadinessTier,
      constructScores,
      sortedConstructs,
      topStrengths,
      priorityGrowthAreas,
      targetCareerProfile,
      dualEvidenceSynthesis,
      responseQuality: {
        isComplete,
        answeredCount,
        totalQuestions,
        straightLiningDetected,
        completionTimeSeconds,
        qualityFlag: !isComplete
          ? "INCOMPLETE"
          : straightLiningDetected
          ? "CAUTION_LOW_VARIATION"
          : "NORMAL",
      },
    };
  }

  private generateSynthesis(params: {
    studentReadinessIndex: number;
    studentReadinessTier: StudentReadinessTier;
    sortedConstructs: StudentConstructScoreDetails[];
    topStrengths: StudentConstructScoreDetails[];
    priorityGrowthAreas: StudentConstructScoreDetails[];
    targetCareerProfile: OccupationalAiImpactProfile;
  }): DualEvidenceSynthesis {
    const {
      studentReadinessIndex,
      studentReadinessTier,
      topStrengths,
      priorityGrowthAreas,
      targetCareerProfile,
    } = params;

    const strengthNames = topStrengths.map((s) => s.dimensionName).join(", ");
    const growthNames = priorityGrowthAreas.map((g) => g.dimensionName).join(", ");

    const synthesisSummary =
      `${targetCareerProfile.careerTitle} is experiencing ${targetCareerProfile.transformationVelocity.toLowerCase()} with high AI augmentation potential (${targetCareerProfile.aiAugmentationPotential}%). ` +
      `Your student readiness profile indicates ${studentReadinessTier.toLowerCase()} (${studentReadinessIndex}/100), demonstrating particular strength in ${strengthNames}. ` +
      `Rather than replacing professionals in this field, modern AI systems are automating routine tasks while significantly increasing the premium placed on human judgment, system design, and creative problem solving. ` +
      `Proactively strengthening your capabilities in ${growthNames} will position you to lead and thrive in this evolving career landscape.`;

    const alignmentHighlights = [
      `Career AI Exposure: ${targetCareerProfile.taskExposureBand} — Repetitive digital tasks are increasingly streamlined by automated tools.`,
      `Career AI Augmentation: ${targetCareerProfile.augmentationBand} — Professionals using AI tools achieve higher productivity and creative leverage.`,
      `Human-Critical Priority: ${targetCareerProfile.humanCriticalBand} — Deep judgment, contextual empathy, and ethical reasoning remain essential non-automatable pillars.`,
      `Student AI Readiness: ${studentReadinessTier} (${studentReadinessIndex}/100) — Demonstrating strong foundation to adopt and master intelligent workflows.`,
    ];

    const skillsWorthDeveloping = priorityGrowthAreas.map((g) => ({
      skillName: g.developmentalFocus.split(",")[0] || g.dimensionName,
      construct: g.dimensionName,
      currentReadiness: g.normalizedScore >= 65 ? ("High" as const) : g.normalizedScore >= 50 ? ("Developing" as const) : ("Foundational" as const),
      actionableAdvice: `Enhance your ${g.dimensionName.toLowerCase()} through targeted projects: practice ${g.developmentalFocus.toLowerCase()}.`,
    }));

    const counsellorDiscussionPrompts = [
      `How can the student leverage their top strength (${topStrengths[0]?.dimensionName || "adaptability"}) to explore AI-enhanced workflows in ${targetCareerProfile.careerTitle}?`,
      `What practical portfolio projects or micro-credentials would help strengthen the student's development in ${priorityGrowthAreas[0]?.dimensionName || "continuous learning"}?`,
      `Discuss the distinction between routine task automation and high-value system architecture in this field.`,
      `Explore how ethical considerations and human empathy create long-term competitive advantage in technology-driven careers.`,
    ];

    const methodologyNote =
      "This assessment operates on a dual-evidence psychometric model: measuring individual student readiness constructs (0-100 normalized) and synthesizing them with empirical occupational task exposure data across 108 global careers. Scoring is deterministic, reproducible, and strictly separated from generative guessing.";

    const pilotDisclaimer =
      "Standard Pilot Edition (v1.0): Designed for formative educational and career guidance. Results reflect self-reported readiness orientations and occupational transformation benchmarks to guide proactive skill development.";

    return {
      readinessTier: studentReadinessTier,
      readinessIndex: studentReadinessIndex,
      synthesisSummary,
      alignmentHighlights,
      skillsWorthDeveloping,
      counsellorDiscussionPrompts,
      methodologyNote,
      pilotDisclaimer,
    };
  }
}

export const aiJobRiskFinderScoringService = new AiJobRiskFinderScoringService();

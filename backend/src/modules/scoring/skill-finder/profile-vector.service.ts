/**
 * 3G MeLife — 29-Dimension Student Profile Vector Engine
 * Transforms psychometric dimension scores across 4 layers (Interest 25%, Skill 30%, Aptitude 25%, Development 20%)
 * into a standardized, normalized 0–100 profile vector.
 */

import {
  InterestProfileResult,
  SkillBehaviourResult,
  DemonstratedAptitudeResult,
  DevelopmentalStrengthsResult,
  ScoredDimensionItem,
} from "../scoring.types";

export interface StudentProfileVector {
  // 1. Interest Dimensions (25% Weight)
  builder: number;
  explorer: number;
  creator: number;
  helper: number;
  leader: number;
  organiser: number;

  // 2. Skill Behaviour Dimensions (30% Weight)
  logical_problem_solving: number;
  communication: number;
  creative_thinking: number;
  visual_spatial: number;
  practical_technical: number;
  social_teamwork: number;
  leadership_initiative: number;
  self_management: number;

  // 3. Demonstrated Aptitude Dimensions (25% Weight)
  pattern_logic: number;
  numerical_reasoning: number;
  verbal_reasoning: number;
  spatial_reasoning: number;
  practical_troubleshooting: number;
  creative_performance: number;
  social_judgment: number;
  planning_estimation: number;

  // 4. Developmental Strength Dimensions (20% Weight)
  curiosity: number;
  persistence: number;
  adaptability: number;
  initiative: number;
  collaboration: number;
  attention_to_detail: number;
  learning_independence: number;
}

export interface ProfileVectorSummary {
  vector: StudentProfileVector;
  layerScores: {
    interestScore: number;
    skillScore: number;
    aptitudeScore: number;
    developmentScore: number;
    overallProfileScore: number;
  };
  dimensionCount: number;
}

export class ProfileVectorService {
  /**
   * Extracts and standardizes a dimension score from a dimension array on 0-100 scale.
   */
  private findScore(dimensions: ScoredDimensionItem[], codeMatches: string[], fallback = 50): number {
    if (!dimensions || dimensions.length === 0) return fallback;
    for (const match of codeMatches) {
      const found = dimensions.find(
        (d) => d.code.toUpperCase() === match.toUpperCase() || d.name.toLowerCase().includes(match.toLowerCase())
      );
      if (found && typeof found.scalePositionPercentage === "number") {
        return Math.max(0, Math.min(100, Math.round(found.scalePositionPercentage)));
      }
    }
    return fallback;
  }

  /**
   * Generates the complete 29-dimension profile vector from scoring module outputs.
   */
  generateProfileVector(
    interestResult: InterestProfileResult,
    skillResult: SkillBehaviourResult,
    aptitudeResult: DemonstratedAptitudeResult,
    developmentResult: DevelopmentalStrengthsResult
  ): ProfileVectorSummary {
    const intDims = interestResult?.dimensions || [];
    const skillDims = skillResult?.dimensions || [];
    const aptDims = aptitudeResult?.dimensions || [];
    const devDims = developmentResult?.dimensions || [];

    // 1. Layer 1: Interest Dimensions (6)
    const builder = this.findScore(intDims, ["BUILDER_R", "BUILDER", "REALISTIC"]);
    const explorer = this.findScore(intDims, ["EXPLORER_I", "EXPLORER", "INVESTIGATIVE"]);
    const creator = this.findScore(intDims, ["CREATOR_A", "CREATOR", "ARTISTIC"]);
    const helper = this.findScore(intDims, ["HELPER_S", "HELPER", "SOCIAL"]);
    const leader = this.findScore(intDims, ["LEADER_E", "LEADER", "ENTERPRISING"]);
    const organiser = this.findScore(intDims, ["ORGANISER_C", "ORGANISER", "ORGANIZER", "CONVENTIONAL"]);

    // 2. Layer 2: Skill Behaviour Dimensions (8)
    const logical_problem_solving = this.findScore(skillDims, ["LOGICAL_PROBLEM_SOLVING", "LOGICAL", "PROBLEM_SOLVING"]);
    const communication = this.findScore(skillDims, ["COMMUNICATION"]);
    const creative_thinking = this.findScore(skillDims, ["CREATIVE_THINKING", "CREATIVE"]);
    const visual_spatial = this.findScore(skillDims, ["VISUAL_SPATIAL_THINKING", "VISUAL_SPATIAL", "SPATIAL"]);
    const practical_technical = this.findScore(skillDims, ["PRACTICAL_TECHNICAL_SKILL", "PRACTICAL_TECHNICAL", "TECHNICAL"]);
    const social_teamwork = this.findScore(skillDims, ["SOCIAL_TEAMWORK", "TEAMWORK"]);
    const leadership_initiative = this.findScore(skillDims, ["LEADERSHIP_INITIATIVE", "LEADERSHIP"]);
    const self_management = this.findScore(skillDims, ["SELF_MANAGEMENT"]);

    // 3. Layer 3: Demonstrated Aptitude Dimensions (8)
    const pattern_logic = this.findScore(aptDims, ["PATTERN_LOGIC", "PATTERN"]);
    const numerical_reasoning = this.findScore(aptDims, ["NUMERICAL_REASONING", "NUMERICAL"]);
    const verbal_reasoning = this.findScore(aptDims, ["VERBAL_REASONING", "VERBAL"]);
    const spatial_reasoning = this.findScore(aptDims, ["SPATIAL_REASONING", "SPATIAL"]);
    const practical_troubleshooting = this.findScore(aptDims, ["PRACTICAL_PROBLEM_SOLVING", "PRACTICAL", "TROUBLESHOOTING"]);
    const creative_performance = this.findScore(aptDims, ["CREATIVE_THINKING_TASKS", "CREATIVE_PERFORMANCE", "CREATIVE_THINKING", "CREATIVE"]);
    const social_judgment = this.findScore(aptDims, ["SITUATIONAL_JUDGMENT", "SOCIAL_JUDGMENT", "SOCIAL"]);
    const planning_estimation = this.findScore(aptDims, ["PLANNING_ESTIMATION", "PLANNING"]);

    // 4. Layer 4: Developmental Strength Dimensions (7)
    const curiosity = this.findScore(devDims, ["CURIOSITY"]);
    const persistence = this.findScore(devDims, ["PERSISTENCE"]);
    const adaptability = this.findScore(devDims, ["ADAPTABILITY"]);
    const initiative = this.findScore(devDims, ["INITIATIVE"]);
    const collaboration = this.findScore(devDims, ["COLLABORATION"]);
    const attention_to_detail = this.findScore(devDims, ["ATTENTION_TO_DETAIL", "DETAIL"]);
    const learning_independence = this.findScore(devDims, ["INDEPENDENCE", "LEARNING_INDEPENDENCE"]);

    const vector: StudentProfileVector = {
      builder,
      explorer,
      creator,
      helper,
      leader,
      organiser,
      logical_problem_solving,
      communication,
      creative_thinking,
      visual_spatial,
      practical_technical,
      social_teamwork,
      leadership_initiative,
      self_management,
      pattern_logic,
      numerical_reasoning,
      verbal_reasoning,
      spatial_reasoning,
      practical_troubleshooting,
      creative_performance,
      social_judgment,
      planning_estimation,
      curiosity,
      persistence,
      adaptability,
      initiative,
      collaboration,
      attention_to_detail,
      learning_independence,
    };

    // Calculate Layer Averages
    const interestScore = Math.round((builder + explorer + creator + helper + leader + organiser) / 6);
    const skillScore = Math.round(
      (logical_problem_solving +
        communication +
        creative_thinking +
        visual_spatial +
        practical_technical +
        social_teamwork +
        leadership_initiative +
        self_management) /
        8
    );
    const aptitudeScore = Math.round(
      (pattern_logic +
        numerical_reasoning +
        verbal_reasoning +
        spatial_reasoning +
        practical_troubleshooting +
        creative_performance +
        social_judgment +
        planning_estimation) /
        8
    );
    const developmentScore = Math.round(
      (curiosity + persistence + adaptability + initiative + collaboration + attention_to_detail + learning_independence) / 7
    );

    // Weighted Overall Profile Score (Interest 25%, Skill 30%, Aptitude 25%, Development 20%)
    const overallProfileScore = Math.round(
      0.25 * interestScore + 0.3 * skillScore + 0.25 * aptitudeScore + 0.2 * developmentScore
    );

    return {
      vector,
      layerScores: {
        interestScore,
        skillScore,
        aptitudeScore,
        developmentScore,
        overallProfileScore,
      },
      dimensionCount: 29,
    };
  }
}

export const profileVectorService = new ProfileVectorService();

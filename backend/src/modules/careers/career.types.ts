/**
 * 3G MeLife Career Pathways & Exploration Types
 */

export type FutureGrowthOutlook = "Very High" | "High" | "Moderate" | "Emerging";

export interface LearningMilestone {
  stage: string; // e.g. "Stage 1: Foundation (High School)", "Stage 2: Degree / Vocational", "Stage 3: Advanced Specialization"
  title: string;
  description: string;
  focusAreas: string[];
}

export interface CareerRelatedDimensions {
  riasec?: Record<string, number>; // e.g. { I: 0.9, R: 0.8, C: 0.6, A: 0.4, E: 0.3, S: 0.2 } or { explorer: 0.9, builder: 0.8, ... }
  skills?: Record<string, number>; // e.g. { logical_problem_solving: 0.9, visual_spatial: 0.8, ... }
  aptitude?: Record<string, number>; // e.g. { pattern_logic: 0.9, numerical_reasoning: 0.85, ... }
  development?: Record<string, number>; // e.g. { curiosity: 0.9, persistence: 0.85, ... }
  streams?: Record<string, number>; // e.g. { science: 0.95, applied_technical: 0.85, commerce: 0.4, humanities: 0.3 }
  archetypes?: string[]; // e.g. ["Analytical Systems Thinker", "Practical Explorer"]
}

export interface CareerEntity {
  id: string;
  slug: string;
  title: string;
  category: string;
  industry: string;
  description: string;
  overview: string;
  future_growth: FutureGrowthOutlook;
  education_paths: string[];
  required_skills: string[];
  recommended_subjects: string[];
  learning_roadmap: LearningMilestone[];
  sample_roles: string[];
  related_dimensions: CareerRelatedDimensions;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CareerMatchReasoning {
  summary: string;
  topMatchingFactors: string[];
  alignmentNote: string;
}

export interface MatchPillarBreakdown {
  interestScore: number;
  skillScore: number;
  aptitudeScore: number;
  personalityScore: number;
  streamScore?: number;
}

export interface CareerMatchDTO {
  id: string;
  slug: string;
  title: string;
  category: string;
  industry: string;
  description: string;
  futureGrowth: FutureGrowthOutlook;
  matchPercentage: number;
  keySkills: string[];
  reasoning: CareerMatchReasoning;
  strengthAlignment?: string[];
  developmentAreas?: string[];
  matchBreakdown?: MatchPillarBreakdown;
  confidence?: "High Confidence" | "Moderate Confidence" | "Baseline Confidence" | "Exploratory";
  assessmentCoverage?: string;
}

export interface CareerDetailDTO extends CareerMatchDTO {
  overview: string;
  educationPaths: string[];
  requiredSkills: string[];
  recommendedSubjects: string[];
  learningRoadmap: LearningMilestone[];
  sampleRoles: string[];
  relatedCareers: Array<{
    id: string;
    slug: string;
    title: string;
    category: string;
    matchPercentage: number;
  }>;
}

export interface CareerTranslationEntity {
  id: string;
  career_id: string;
  language_code: string;
  title: string;
  category: string;
  industry: string;
  description: string;
  overview: string;
  education_paths: string[];
  required_skills: string[];
  recommended_subjects: string[];
  learning_roadmap: LearningMilestone[];
  sample_roles: string[];
  created_at: string;
}

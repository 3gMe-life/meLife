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
  riasec?: Record<string, number>; // e.g. { R: 0.8, I: 0.9, A: 0.5, S: 0.3, E: 0.4, C: 0.6 }
  skills?: Record<string, number>; // e.g. { "analytical_inquiry": 0.8, "technical_curiosity": 0.9, ... }
  aptitude?: Record<string, number>; // e.g. { "spatial_reasoning": 0.85, "deductive_logic": 0.8, ... }
  archetypes?: string[]; // e.g. ["Practical Explorer", "Analytical Systems Thinker"]
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

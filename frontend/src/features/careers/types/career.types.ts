/**
 * 3G MeLife Career Pathways & Exploration Frontend Types
 */

export type FutureGrowthOutlook = "Very High" | "High" | "Moderate" | "Emerging";

export interface LearningMilestone {
  stage: string;
  title: string;
  description: string;
  focusAreas: string[];
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

export interface CareerRecommendationsResponse {
  recommendations: CareerMatchDTO[];
  isAssessed: boolean;
  assessmentCode?: string;
}

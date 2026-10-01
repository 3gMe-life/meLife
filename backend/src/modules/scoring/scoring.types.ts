/**
 * 3G MeLife Psychometric Scoring Types & Contracts
 */

export interface ScoredDimensionItem {
  code: string;
  name: string;
  rawScore: number;
  maxScore: number;
  scalePositionPercentage: number;
  level: "High" | "Proficient" | "Moderate" | "Emerging";
  description?: string;
}

export interface InterestProfileResult {
  topClusters: Array<{
    code: string;
    name: string;
    scalePositionPercentage: number;
    clusterTitle: string;
  }>;
  dimensions: ScoredDimensionItem[];
  primaryOrientation?: string;
  secondaryOrientation?: string;
}

export interface SkillBehaviourResult {
  strongestIndicators: ScoredDimensionItem[];
  developmentOpportunities: ScoredDimensionItem[];
  dimensions: ScoredDimensionItem[];
}

export interface DemonstratedAptitudeResult {
  overallAccuracyPercentage: number;
  dimensions: ScoredDimensionItem[];
}

export interface DevelopmentalStrengthsResult {
  topStrengths: ScoredDimensionItem[];
  dimensions: ScoredDimensionItem[];
  developmentOpportunities?: ScoredDimensionItem[];
  growthAreas?: string[];
}

export interface ResponseQualityResult {
  consistencySignal: "High Consistency" | "Adequate Consistency" | "Review Suggested";
  attentionCheckPassed: boolean;
  interpretation: string;
}

export interface ExplorationDirectionItem {
  domain: string;
  clusterTitle: string;
  description: string;
  sampleExplorationAreas: string[];
  suggestedActivities: string[];
}

export interface LearningProfileResult {
  archetypeTitle: string;
  tagline: string;
  strengthSummary: string;
  explorationFraming: string;
  primaryTraits: string[];
}

import { StudentProfileVector, ProfileVectorSummary } from "./skill-finder/profile-vector.service";
import { ProfileConfidenceMetrics } from "./skill-finder/confidence.service";

export interface SkillFinderFullResultDTO {
  resultId: string;
  attemptId: string;
  participantId: string;
  assessmentCode: string;
  assessmentName: string;
  versionCode: string | null;
  versionName: string | null;
  language: string;
  completedAt: string;
  learningProfile: LearningProfileResult;
  responseQuality: ResponseQualityResult;
  interestDiscovery: InterestProfileResult;
  skillBehaviour: SkillBehaviourResult;
  demonstratedAptitude: DemonstratedAptitudeResult;
  developmentalStrengths: DevelopmentalStrengthsResult;
  explorationDirections: ExplorationDirectionItem[];
  growthSuggestions: string[];
  profileVector?: StudentProfileVector;
  profileConfidence?: string;
  confidenceMetrics?: ProfileConfidenceMetrics;
  layerScores?: ProfileVectorSummary["layerScores"];
}

export interface RawResponseItem {
  question_id: string;
  question_number: number | string;
  question_type: string;
  section_code: string;
  dimension_code: string;
  dimension_name?: string;
  max_points?: number | string;
  correct_key?: string | null;
  response_value: string | null;
  selected_option_id?: string | null;
  option_key?: string | null;
  score_value?: number | string | null;
}

import { DimensionScoreItem } from "@/features/assessments/types/assessment.types";

export type ScoredDimensionItem = DimensionScoreItem;

export interface ReportStudentProfile {
  studentName: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number | null;
  dateOfBirth: string | null;
  educationStage: string;
  gradeLevel: string | null;
  schoolName: string;
  curriculumOrBoard: string | null;
  assessmentName: string;
  assessmentCode: string;
  versionName: string;
  versionCode: string;
  completedAt: string;
  reportId: string;
  generatedAt: string;
}

export interface ReportExecutiveSummary {
  archetypeTitle: string;
  tagline: string;
  strengthSummary: string;
  explorationFraming: string;
  primaryTraits: string[];
  reliabilityNote: string;
}

export interface ReportInterestCluster {
  code: string;
  name: string;
  percentage: number;
  clusterTitle: string;
  description: string;
}

export interface ReportInterestProfile {
  topClusters: ReportInterestCluster[];
  dimensions: ScoredDimensionItem[];
  primaryOrientation: string;
  secondaryOrientation: string;
  summary: string;
}

export interface ReportSkillBehaviourProfile {
  strongestIndicators: ScoredDimensionItem[];
  developmentOpportunities: ScoredDimensionItem[];
  dimensions: ScoredDimensionItem[];
  summary: string;
}

export interface ReportAptitudeInsights {
  overallAccuracyPercentage: number;
  dimensions: ScoredDimensionItem[];
  summary: string;
  cognitiveStrengthsText: string;
}

export interface ReportDevelopmentalStrengths {
  topStrengths: ScoredDimensionItem[];
  dimensions: ScoredDimensionItem[];
  learningHabitsSummary: string;
  growthSuggestions: string[];
}

export interface ReportExplorationCluster {
  domain: string;
  clusterTitle: string;
  description: string;
  sampleFocusAreas: string[];
  suggestedProjectsAndActivities: string[];
}

export interface ReportExplorationAreas {
  clusters: ReportExplorationCluster[];
  framingDisclaimer: string;
}

export interface ReportParentGuidance {
  nurturingMindsetSummary: string;
  supportiveActions: string[];
  recommendedDiscussions: string[];
  dos: string[];
  donts: string[];
}

export interface SkillFinderReportDTO {
  reportId: string;
  resultId: string;
  attemptId: string;
  participantId: string;
  assessmentCode: string;
  language: string;
  templateVersion: string;
  generatedAt: string;
  studentProfile: ReportStudentProfile;
  executiveSummary: ReportExecutiveSummary;
  interestProfile: ReportInterestProfile;
  skillBehaviour: ReportSkillBehaviourProfile;
  aptitudeInsights: ReportAptitudeInsights;
  developmentalStrengths: ReportDevelopmentalStrengths;
  explorationAreas: ReportExplorationAreas;
  parentGuidance: ReportParentGuidance;
}

export interface ReportResponseData {
  reportId: string;
  resultId: string;
  status: string;
  language: string;
  generatedAt: string;
  report: SkillFinderReportDTO;
}

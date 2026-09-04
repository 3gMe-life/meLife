import { ScoredDimensionItem } from "../scoring/scoring.types";

export type ReportStatus = "PENDING" | "COMPLETED" | "FAILED";

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

export interface AssessmentReportEntity {
  id: string;
  assessment_result_id: string;
  participant_id: string;
  assessment_code: string;
  template_version: string;
  language_code: string;
  status: ReportStatus;
  report_title: string;
  profile_archetype: string | null;
  report_data: SkillFinderReportDTO;
  file_path: string | null;
  generated_at: string;
  created_at: string;
  updated_at: string;
}

export interface GenerateReportRequestDTO {
  resultId: string;
  languageCode?: string;
  forceRegenerate?: boolean;
}

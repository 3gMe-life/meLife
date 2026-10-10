import { DimensionScoreItem } from "@/features/assessments/types/assessment.types";

export type ScoredDimensionItem = DimensionScoreItem;

export type ReportAudienceView = "STUDENT" | "PARENT" | "COUNSELLOR";

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
  attemptNumber?: number;
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
  isBroadInterestPattern?: boolean;
  tiedTopDomains?: string[];
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
  rawScore?: number;
  maxScore?: number;
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
  alignmentLevel?: "High Alignment" | "Good Match" | "Exploratory Synergy";
  whyEvidence?: string[];
  developmentAreas?: string[];
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

export interface ReportResponseQuality {
  completionPercentage: number;
  consistencySignal: string;
  missingResponsesCount: number;
  validityStatus: string;
  confidenceIndicator: string;
  note?: string;
}

export interface ReportActionPlan {
  next30Days: string[];
  next3Months: string[];
  next6Months: string[];
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
  responseQuality?: ReportResponseQuality;
  interestProfile: ReportInterestProfile;
  skillBehaviour: ReportSkillBehaviourProfile;
  aptitudeInsights: ReportAptitudeInsights;
  developmentalStrengths: ReportDevelopmentalStrengths;
  explorationAreas: ReportExplorationAreas;
  parentGuidance: ReportParentGuidance;
  actionPlan?: ReportActionPlan;
}

export interface ReportResponseData {
  reportId: string;
  resultId: string;
  status: string;
  language: string;
  generatedAt: string;
  report: SkillFinderReportDTO;
}


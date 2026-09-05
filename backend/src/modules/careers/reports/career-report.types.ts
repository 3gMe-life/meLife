/**
 * 3G MeLife Career Report Types & Contracts
 * Comprehensive 10-Section Career Guidance & Psychometric Report Structure
 */

import { FutureGrowthOutlook } from "../career.types";

export type CareerReportStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface ReportCoverData {
  reportTitle: string;
  reportSubtitle: string;
  studentName: string;
  age: number | null;
  educationStage: string;
  gradeLevel: string | null;
  schoolName: string;
  assessmentDate: string;
  profileArchetype: string;
  archetypeTagline: string;
}

export interface ReportExecutiveSummaryData {
  summary: string;
  topStrengths: string[];
  learningStyle: string;
  interestPattern: string;
  explorationMindset: string;
}

export interface ReportInterestClusterData {
  key: "builder" | "explorer" | "creator" | "helper" | "leader" | "organizer";
  code: string;
  name: string;
  percentage: number;
  clusterTitle: string;
  description: string;
}

export interface ReportPsychometricProfileData {
  interestClusters: ReportInterestClusterData[];
  primaryOrientation: string;
  secondaryOrientation: string;
  summary: string;
}

export interface ReportStrengthItem {
  name: string;
  score: number;
  whatItMeans: string;
  howItHelpsLearning: string;
  howItConnectsWithCareers: string;
}

export interface ReportCareerMatchItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  industry: string;
  matchPercentage: number;
  futureGrowth: FutureGrowthOutlook;
  whyThisMatches: {
    summary: string;
    topMatchingFactors: string[];
    alignmentNote: string;
  };
  requiredSkills: string[];
}

export interface ReportCareerDeepDiveItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  overview: string;
  whatProfessionalsDo: string[];
  importantSkills: string[];
  suitableSubjects: string[];
  learningRoadmap: Array<{
    stage: string;
    title: string;
    description: string;
    focusAreas: string[];
  }>;
  futureOpportunities: string;
  sampleRoles: string[];
}

export interface ReportAlternativePathwayItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  matchPercentage: number;
  relationNote: string;
  skills: string[];
}

export interface ReportDevelopmentPlanData {
  skillsToStrengthen: Array<{
    skillName: string;
    currentLevel: string;
    howToImprove: string[];
    suggestedActivities: string[];
  }>;
  summary: string;
}

export interface ReportParentGuidanceData {
  nurturingMindset: string;
  howParentsCanSupport: string[];
  recommendedDiscussions: string[];
  thingsToAvoid: string[];
}

export interface ReportCounsellorInsightsData {
  detailedDimensionScores: Array<{
    code: string;
    name: string;
    score: number;
    band: string;
  }>;
  assessmentObservations: string[];
  suggestedDiscussionPoints: string[];
  recommendedInterventions: string[];
}

export interface CareerReportDTO {
  reportId: string;
  studentId: string;
  assessmentResultId: string | null;
  language: string;
  templateVersion: string;
  generatedAt: string;
  isAssessed: boolean;
  cover: ReportCoverData;
  executiveSummary: ReportExecutiveSummaryData;
  psychometricProfile: ReportPsychometricProfileData;
  strengthAnalysis: ReportStrengthItem[];
  careerMatches: ReportCareerMatchItem[];
  careerDeepDives: ReportCareerDeepDiveItem[];
  alternativePathways: ReportAlternativePathwayItem[];
  developmentPlan: ReportDevelopmentPlanData;
  parentGuidance: ReportParentGuidanceData;
  counsellorInsights?: ReportCounsellorInsightsData;
}

export interface CareerReportEntity {
  id: string;
  student_id: string;
  assessment_result_id: string | null;
  language_code: string;
  report_type: string;
  report_title: string;
  profile_archetype: string | null;
  report_data: CareerReportDTO;
  status: CareerReportStatus;
  file_path: string | null;
  generated_at: string;
  created_at: string;
  updated_at: string;
}

export interface GenerateCareerReportRequestDTO {
  resultId?: string;
  languageCode?: string;
  forceRegenerate?: boolean;
}

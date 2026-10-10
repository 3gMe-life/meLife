/**
 * 3G MeLife Career Report Types & Contracts
 * Comprehensive 10-Section Career Guidance & Psychometric Report Structure
 */

import { FutureGrowthOutlook } from "../career.types";

export type CareerReportStatus = "PENDING" | "COMPLETED" | "FAILED";

export type EvidenceSource =
  | "INTEREST_EVIDENCE"
  | "SELF_REPORTED_BEHAVIOUR"
  | "DEMONSTRATED_TASK_PERFORMANCE"
  | "DEVELOPMENTAL_HABIT"
  | "PROFILE_SYNTHESIS"
  | "CAREER_ALIGNMENT_SYNTHESIS";

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
  evidenceSource?: EvidenceSource;
}

export interface ReportPsychometricProfileData {
  interestClusters: ReportInterestClusterData[];
  primaryOrientation: string;
  secondaryOrientation: string;
  summary: string;
  evidenceSource?: EvidenceSource;
}

export interface ReportStrengthItem {
  name: string;
  code?: string;
  score: number;
  whatItMeans: string;
  howItHelpsLearning: string;
  howItConnectsWithCareers: string;
  evidenceSource?: EvidenceSource;
}

export interface CareerMatchSupportingEvidence {
  source: EvidenceSource;
  dimensionCode?: string;
  label: string;
  score?: number;
}

export interface CareerMatchExplanation {
  summary: string;
  whyThisAppears?: string[];
  supportingEvidence?: CareerMatchSupportingEvidence[];
  developmentConsiderations?: string[];
  areasToValidate?: string[];
  // Legacy backward-compatibility fields:
  topMatchingFactors?: string[];
  alignmentNote?: string;
}

export interface ReportCareerMatchItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  industry: string;
  matchPercentage: number;
  futureGrowth: FutureGrowthOutlook;
  whyThisMatches: CareerMatchExplanation;
  requiredSkills: string[];
  familyCode?: string;
  familyName?: string;
  evidenceSource?: EvidenceSource;
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

export interface ReportDevelopmentSkillItem {
  skillName: string;
  dimensionCode?: string;
  evidenceSource?: EvidenceSource;
  currentLevel: string;
  currentScore?: number;
  whySelected?: string;
  developmentDirection?: string;
  suggestedPractice?: string;
  realWorldActivity?: string;
  howToImprove: string[];
  suggestedActivities: string[];
}

export interface ReportDevelopmentPlanData {
  skillsToStrengthen: ReportDevelopmentSkillItem[];
  summary: string;
}

export interface ReportParentGuidanceData {
  nurturingMindset: string;
  howParentsCanSupport: string[];
  recommendedDiscussions: string[];
  thingsToAvoid: string[];
}

export interface ReportCrossEvidenceSynthesisData {
  whatYouAreDrawnToward: string;
  whatYouReportStrongly: string;
  whatYouDemonstrated: string;
  whereEvidenceAgrees: string;
  areasToValidateAndDevelop: string;
  nextExplorationSteps: string[];
}

export interface ReportMethodologyData {
  assessmentCode: string;
  assessmentName: string;
  scoringVersion: string;
  careerTaxonomyVersion: string;
  reportTemplateVersion: string;
  frameworkSummary: string;
  scoreInterpretationGuide: string;
  alignmentScoreDefinition: string;
  whatThisMeasures?: string;
  howScoresArePresented?: string;
  whatCareerAlignmentMeans?: string;
  whatScoresDoNotMean: string[];
  evidenceTaxonomy: Array<{
    source: EvidenceSource;
    label: string;
    description: string;
  }>;
  interpretationBoundaries: string[];
  reassessmentGuidance: string;
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
  crossEvidenceSynthesis?: ReportCrossEvidenceSynthesisData;
  methodology?: ReportMethodologyData;
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

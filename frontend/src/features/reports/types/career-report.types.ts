/**
 * 3G MeLife Frontend Career Report Types & Contracts
 * Comprehensive 10-Section Psychometric & Career Guidance Architecture
 */

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
  generatedDate?: string;
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
  dimensionCode?: string;
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
  slug?: string;
  title: string;
  category: string;
  industry?: string;
  matchPercentage: number;
  futureGrowth?: "High" | "Very High" | "Moderate" | "Emerging" | string;
  whyThisMatches: CareerMatchExplanation;
  requiredSkills?: string[];
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
  assessmentCode?: string;
  assessmentName?: string;
  scoringVersion?: string;
  careerTaxonomyVersion?: string;
  reportTemplateVersion?: string;
  frameworkSummary?: string;
  scoreInterpretationGuide?: string;
  alignmentScoreDefinition?: string;
  whatThisMeasures?: string;
  howScoresArePresented?: string;
  whatCareerAlignmentMeans?: string;
  whatScoresDoNotMean?: string[];
  evidenceTaxonomy?: Array<{
    source: EvidenceSource | string;
    label?: string;
    name?: string;
    description: string;
    reliabilityNote?: string;
  }>;
  interpretationBoundaries?: string[];
  reassessmentGuidance?: string;
  interpretationConfidence?: string;
  importantLimitations?: string[];
  roleOfAcademicPerformance?: string;
  roleOfRealWorldExploration?: string;
  whenToReviewAgain?: string;
  reportMetadata?: {
    assessmentVersion?: string;
    scoringVersion?: string;
    careerTaxonomyVersion?: string;
    reportTemplateVersion?: string;
    generatedAt?: string;
    evaluationDate?: string;
    studentName?: string;
    reportId?: string;
  };
}

export interface ReportCounsellorInsightsData {
  detailedDimensionScores: Array<{
    code: string;
    name: string;
    score: number;
    band: string;
  }>;
  assessmentObservations: string[];
  recommendedInterventions: string[];
  suggestedDiscussionPoints?: string[];
  longitudinalNotes: string;
}

export interface CareerReportDTO {
  reportId: string;
  studentId: string;
  isAssessed: boolean;
  language: string;
  templateVersion: string;
  generatedDate: string;
  cover: ReportCoverData;
  executiveSummary: ReportExecutiveSummaryData;
  psychometricProfile: ReportPsychometricProfileData;
  strengthAnalysis: ReportStrengthItem[];
  careerMatches: ReportCareerMatchItem[];
  careerDeepDives: ReportCareerDeepDiveItem[];
  alternativePathways: ReportAlternativePathwayItem[];
  developmentPlan: ReportDevelopmentPlanData;
  parentGuidance: ReportParentGuidanceData;
  methodology?: ReportMethodologyData;
  crossEvidenceSynthesis?: ReportCrossEvidenceSynthesisData;
  counsellorInsights?: ReportCounsellorInsightsData;
}

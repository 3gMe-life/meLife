export type AssessmentProductCode =
  | "SKILL_FINDER"
  | "STREAM_FINDER"
  | "ENGINEERING_BRANCH_FINDER"
  | "COMMERCE_CAREER_FINDER"
  | "HUMANITIES_CAREER_FINDER"
  | "RIGHT_CAREER_FINDER"
  | "AI_JOB_RISK_FINDER";

export type AssessmentStatus = "AVAILABLE" | "IN_PROGRESS" | "COMPLETED" | "LOCKED";

export type AssessmentEligibilityState =
  | "ELIGIBLE"
  | "PROFILE_INCOMPLETE"
  | "NO_ELIGIBLE_ASSESSMENTS";

export interface ParticipantAssessmentItem {
  id: string;
  code: AssessmentProductCode;
  name: string;
  category: string;
  description: string;
  estimatedMinutes: number;
  questionCount: number;
  status: AssessmentStatus;
  progressPercentage: number;
  isEligible: boolean;
  eligibilityReason?: string;
  activeAttemptId?: string | null;
}

export interface ParticipantAssessmentsResponse {
  state: AssessmentEligibilityState;
  derivedAge: number | null;
  educationStage: string | null;
  gradeLevel: string | null;
  totalAvailable: number;
  completedCount: number;
  overallProgressPercentage: number;
  assessments: ParticipantAssessmentItem[];
}

export type QuestionType =
  | "likert_1_4"
  | "mcq_text"
  | "mcq_image"
  | "open_scored";

export interface QuestionOption {
  id: string;
  optionKey: string;
  optionText: string;
  displayOrder: number;
}

export interface SanitizedQuestion {
  id: string;
  questionNumber: number;
  sectionCode: string;
  sectionName: string;
  dimensionCode: string;
  dimensionName: string;
  questionText: string;
  questionType: QuestionType;
  imageUrl: string | null;
  isRequired: boolean;
  options: QuestionOption[];
  currentResponse?: {
    selectedOptionId?: string | null;
    responseValue?: string | null;
  } | null;
}

export interface AssessmentSectionSummary {
  code: string;
  name: string;
  description: string | null;
  totalQuestions: number;
  answeredQuestions: number;
}

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  dir: "ltr" | "rtl";
}

export interface AssessmentAttemptQuestionsResponse {
  attemptId: string;
  assessmentCode: AssessmentProductCode;
  assessmentName: string;
  versionId?: string | null;
  versionCode?: string | null;
  versionName?: string | null;
  durationMinutes?: number;
  currentLanguage?: string;
  supportedLanguages?: SupportedLanguage[];
  status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
  totalQuestions: number;
  answeredCount: number;
  currentQuestionIndex: number;
  sections: AssessmentSectionSummary[];
  questions: SanitizedQuestion[];
}

export interface SaveResponsePayload {
  questionId: string;
  selectedOptionId?: string | null;
  responseValue: string;
}

export interface DimensionScoreItem {
  code: string;
  name: string;
  rawScore: number;
  maxScore: number;
  scalePositionPercentage: number;
  level: "High" | "Proficient" | "Moderate" | "Emerging";
  description?: string;
}

export interface ExplorationDirection {
  domain: string;
  clusterTitle: string;
  description: string;
  sampleExplorationAreas: string[];
  suggestedActivities: string[];
}

export interface LearningProfile {
  archetypeTitle: string;
  tagline: string;
  strengthSummary: string;
  explorationFraming: string;
  primaryTraits: string[];
}

export interface SkillFinderResult {
  resultId: string;
  attemptId: string;
  participantId: string;
  assessmentCode: AssessmentProductCode;
  assessmentName: string;
  versionCode?: string | null;
  versionName?: string | null;
  language?: string;
  completedAt: string;
  learningProfile?: LearningProfile;
  responseQuality: {
    consistencySignal: "High Consistency" | "Adequate Consistency" | "Review Suggested";
    attentionCheckPassed: boolean;
    interpretation: string;
  };
  interestDiscovery: {
    topClusters: Array<{
      code: string;
      name: string;
      scalePositionPercentage: number;
      clusterTitle: string;
    }>;
    dimensions: DimensionScoreItem[];
  };
  skillBehaviour: {
    strongestIndicators: DimensionScoreItem[];
    developmentOpportunities: DimensionScoreItem[];
    dimensions: DimensionScoreItem[];
  };
  demonstratedAptitude: {
    overallAccuracyPercentage: number;
    dimensions: DimensionScoreItem[];
  };
  developmentalStrengths: {
    topStrengths: DimensionScoreItem[];
    dimensions: DimensionScoreItem[];
  };
  explorationDirections: ExplorationDirection[];
  growthSuggestions: string[];
}

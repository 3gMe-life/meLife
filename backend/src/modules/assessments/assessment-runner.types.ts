import { AssessmentCode } from "./assessment.types";

export type QuestionType =
  | "likert_1_4"
  | "likert_1_5"
  | "forced_choice_4"
  | "mcq_text"
  | "mcq_image"
  | "open_scored";

export interface QuestionOptionDTO {
  id: string;
  optionKey: string;
  optionText: string;
  originalOptionText?: string | null;
  displayOrder: number;
}

export interface SanitizedQuestionDTO {
  id: string;
  questionNumber: number;
  sectionCode: string;
  sectionName: string;
  dimensionCode: string;
  dimensionName: string;
  questionText: string;
  originalQuestionText?: string | null;
  questionType: QuestionType;
  imageUrl: string | null;
  isRequired: boolean;
  options: QuestionOptionDTO[];
  currentResponse?: {
    selectedOptionId?: string | null;
    responseValue?: string | null;
  } | null;
}

export interface AssessmentSectionSummaryDTO {
  code: string;
  name: string;
  description: string | null;
  totalQuestions: number;
  answeredQuestions: number;
}

export interface SupportedLanguageDTO {
  code: string;
  name: string;
  nativeName: string;
  dir: "ltr" | "rtl";
}

export interface AssessmentAttemptQuestionsResponseDTO {
  attemptId: string;
  assessmentCode: AssessmentCode;
  assessmentName: string;
  versionId?: string | null;
  versionCode?: string | null;
  versionName?: string | null;
  durationMinutes?: number;
  currentLanguage?: string;
  supportedLanguages?: SupportedLanguageDTO[];
  status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
  startedAt?: string | null;
  serverTime?: string;
  totalQuestions: number;
  answeredCount: number;
  currentQuestionIndex: number;
  sections: AssessmentSectionSummaryDTO[];
  questions: SanitizedQuestionDTO[];
}

export interface SaveResponseDTO {
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

export interface ExplorationDirectionItem {
  domain: string;
  clusterTitle: string;
  description: string;
  sampleExplorationAreas: string[];
  suggestedActivities: string[];
}

export interface SkillFinderResultDTO {
  resultId: string;
  attemptId: string;
  participantId: string;
  assessmentCode: AssessmentCode;
  assessmentName: string;
  versionCode?: string | null;
  versionName?: string | null;
  completedAt: string;
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
  explorationDirections: ExplorationDirectionItem[];
  growthSuggestions: string[];
}

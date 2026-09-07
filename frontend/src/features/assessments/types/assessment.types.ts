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
  | "likert_1_5"
  | "forced_choice_4"
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

export interface StudentProfileVector {
  builder: number;
  explorer: number;
  creator: number;
  helper: number;
  leader: number;
  organiser: number;
  logical_problem_solving: number;
  communication: number;
  creative_thinking: number;
  visual_spatial: number;
  practical_technical: number;
  social_teamwork: number;
  leadership_initiative: number;
  self_management: number;
  pattern_logic: number;
  numerical_reasoning: number;
  verbal_reasoning: number;
  spatial_reasoning: number;
  practical_troubleshooting: number;
  creative_performance: number;
  social_judgment: number;
  planning_estimation: number;
  curiosity: number;
  persistence: number;
  adaptability: number;
  initiative: number;
  collaboration: number;
  attention_to_detail: number;
  learning_independence: number;
}

export interface ProfileConfidenceMetrics {
  consistencyGap: number;
  ratingBiasPercentage: number;
  selfReportVsPerformanceGap: number;
  totalItemsEvaluated: number;
  level: "High Confidence" | "Moderate Confidence" | "Needs Further Exploration";
  interpretation: string;
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
  profileVector?: StudentProfileVector;
  profileConfidence?: string;
  confidenceMetrics?: ProfileConfidenceMetrics;
  layerScores?: {
    interestScore: number;
    skillScore: number;
    aptitudeScore: number;
    developmentScore: number;
    overallProfileScore: number;
  };
}

export interface AssessmentHistoryItem {
  historyId: string;
  attemptId: string;
  resultId: string;
  attemptNumber: number;
  assessmentCode: string;
  assessmentName: string;
  profileType: string | null;
  dimensionSummary?: any;
  completedDate: string;
  startedAt?: string;
  totalQuestions: number;
  answeredCount: number;
  summary?: string | null;
  profileConfidence?: string | null;
  confidenceMetrics?: any;
}

export interface AssessmentHistoryResponse {
  totalAttempts: number;
  history: AssessmentHistoryItem[];
}

export interface DimensionComparisonItem {
  dimensionCode: string;
  dimensionName: string;
  sectionCode: string;
  oldScore: number;
  newScore: number;
  delta: number;
  oldLevel?: string;
  newLevel?: string;
  trend: "IMPROVED" | "STABLE" | "REFOCUSED";
}

export interface GrowthInsight {
  category: "INTEREST" | "SKILL" | "APTITUDE" | "STRENGTH";
  title: string;
  description: string;
  dimensionCode?: string;
  delta?: number;
}

export interface LongitudinalComparisonResult {
  comparisonId?: string;
  studentId: string;
  oldResultId: string;
  newResultId: string;
  oldCompletedDate: string;
  newCompletedDate: string;
  daysBetween: number;
  oldArchetype: {
    title: string;
    description: string;
  };
  newArchetype: {
    title: string;
    description: string;
  };
  hasArchetypeShift: boolean;
  interestComparison: DimensionComparisonItem[];
  skillsComparison: DimensionComparisonItem[];
  aptitudeComparison: DimensionComparisonItem[];
  strengthsComparison: DimensionComparisonItem[];
  profileVectorDelta: Record<string, { old: number; new: number; delta: number }>;
  topGains: DimensionComparisonItem[];
  growthTrajectory: string;
  growthSummary: string;
  narrativeInsights: GrowthInsight[];
}

export interface LatestComparisonResponse {
  hasComparison: boolean;
  comparison: LongitudinalComparisonResult | null;
  message?: string;
}

export type StreamName = "Science" | "Commerce" | "Humanities" | "Applied / Technical";

export type AlignmentBand =
  | "Very Strong Alignment"
  | "Strong Alignment"
  | "Moderate Alignment"
  | "Developing Alignment"
  | "Low Alignment"
  | "Incomplete";

export type RecommendationClarity =
  | "High Clarity"
  | "Moderate Clarity"
  | "Mixed Profile / Further Exploration"
  | "Incomplete";

export interface StreamScoreItem {
  stream: StreamName;
  traitPoints: number;
  maxTraitPoints: number;
  choicePoints: number;
  maxChoicePoints: number;
  totalRaw: number;
  maxTotal: number;
  compatibilityPercentage: number;
  displayPercentage: number;
  alignment: AlignmentBand;
}

export interface SectionStreamBreakdownItem {
  sectionCode: string;
  sectionName: string;
  questionCount: number;
  answeredCount: number;
  scienceScore: number;
  commerceScore: number;
  humanitiesScore: number;
  appliedScore: number;
}

export interface StreamCareerClusterItem {
  profileKey: string;
  suggestedCareerFamilies: string[];
  exampleAreas: string[];
  counsellingNote: string;
}

export interface AcademicEvidenceItem {
  subject: string;
  relevance: string;
  thresholdNote: string;
}

export interface StreamFinderResult {
  resultId: string;
  attemptId: string;
  participantId: string;
  assessmentCode: "STREAM_FINDER";
  assessmentName: string;
  versionCode?: string | null;
  versionName?: string | null;
  language?: string;
  completedAt: string;
  completedQuestions: number;
  totalQuestions: number;
  completionPercentage: number;
  isComplete: boolean;

  streamScores: Record<StreamName, StreamScoreItem>;
  sortedStreams: StreamScoreItem[];

  primaryStream: StreamName;
  primaryScore: number;
  primaryDisplayPercentage: number;
  primaryAlignment: AlignmentBand;

  secondaryStream: StreamName;
  secondaryScore: number;
  secondaryDisplayPercentage: number;
  secondaryAlignment: AlignmentBand;

  scoreGap: number;
  scoreGapPercentage: number;
  clarity: RecommendationClarity;
  isMixedProfile: boolean;

  careerClusters: StreamCareerClusterItem[];
  sectionBreakdown: SectionStreamBreakdownItem[];
  academicEvidence: AcademicEvidenceItem[];
  counsellingSummary: string;
}


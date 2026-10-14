export type AssessmentProductCode =
  | "SKILL_FINDER"
  | "STREAM_FINDER"
  | "ENGINEERING_BRANCH_FINDER"
  | "COMMERCE_CAREER_FINDER"
  | "HUMANITIES_CAREER_FINDER"
  | "RIGHT_CAREER_FINDER"
  | "AI_JOB_RISK_FINDER"
  | "ENTREPRENEUR_DEVELOPMENT_TEST";

export type AssessmentStatus = "AVAILABLE" | "IN_PROGRESS" | "COMPLETED" | "LOCKED";

export type AssessmentEligibilityState =
  | "ELIGIBLE"
  | "PROFILE_INCOMPLETE"
  | "NO_ELIGIBLE_ASSESSMENTS";

export interface PrerequisiteStatus {
  code: AssessmentProductCode | string;
  name: string;
  isSatisfied: boolean;
}

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
  canStart?: boolean;
  canContinue?: boolean;
  canRetake?: boolean;
  canViewResult?: boolean;
  lockReason?: string | null;
  prerequisites?: PrerequisiteStatus[];
  isRecommended?: boolean;
  recommendationReason?: string | null;
  journeyOrder?: number;
  activeAttemptId?: string | null;
  completedAt?: string | null;
}

export interface ParticipantAssessmentsResponse {
  state: AssessmentEligibilityState;
  derivedAge: number | null;
  educationStage: string | null;
  gradeLevel: string | null;
  primaryAssessmentCode?: AssessmentProductCode | string | null;
  totalAvailable: number;
  completedCount: number;
  overallProgressPercentage: number;
  assessments: ParticipantAssessmentItem[];
}

export type QuestionType =
  | "likert_1_4"
  | "likert_1_5"
  | "forced_choice_4"
  | "forced_choice_8"
  | "mcq_text"
  | "mcq_image"
  | "open_scored";

export interface QuestionOption {
  id: string;
  optionKey: string;
  optionText: string;
  originalOptionText?: string | null;
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
  originalQuestionText?: string | null;
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
  startedAt?: string | null;
  serverTime?: string;
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
  oldVersionCode?: string | null;
  newVersionCode?: string | null;
  isVersionMismatch?: boolean;
  versionNotice?: string | null;
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

  // Two-Stage Architecture Evidence Metadata
  assessmentMode?: "CORE" | "EXTENDED" | "V1_LEGACY";
  coreAttemptId?: string;
  extensionAttemptId?: string;
  totalEvidenceQuestions?: number;
  isExtensionAvailable?: boolean;
  extensionRecommended?: boolean;

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

export type EngineeringBranchCode =
  | "CSE"
  | "ECE"
  | "EEE"
  | "ME"
  | "CE"
  | "CHE"
  | "BME"
  | "AERO";

export interface EngineeringBranchScoreItem {
  branchCode: EngineeringBranchCode;
  branchName: string;
  likertPoints: number;
  maxLikertPoints: number;
  choicePoints: number;
  maxChoicePoints: number;
  totalRaw: number;
  maxTotal: number;
  compatibilityPercentage: number;
  displayPercentage: number;
  alignment: string;
  coreFocus: string;
  exampleAreas: string;
  counsellingNote: string;
  suggestedProjects: string[];
  keySchoolSubjects: string[];
}

export interface EngineeringConstructScoreItem {
  constructCode: string;
  name: string;
  description: string;
  rawScore: number;
  maxScore: number;
  normalizedScore: number;
  associatedBranches: string[];
}

export interface EngineeringBranchFinderResult {
  resultId: string;
  attemptId: string;
  participantId: string;
  assessmentCode: "ENGINEERING_BRANCH_FINDER";
  assessmentName: string;
  versionCode?: string | null;
  versionName?: string | null;
  language?: string;
  completedAt: string;
  completedQuestions: number;
  totalQuestions: number;
  completionPercentage: number;
  isComplete: boolean;
  pilotStatus: string;

  branchScores: Record<EngineeringBranchCode, EngineeringBranchScoreItem>;
  sortedBranches: EngineeringBranchScoreItem[];

  primaryBranch: EngineeringBranchScoreItem;
  secondaryBranch: EngineeringBranchScoreItem;

  scoreGap: number;
  scoreGapPercentage: number;
  clarity: string;
  isMixedProfile: boolean;

  constructScores: Record<string, EngineeringConstructScoreItem>;
  topConstructs: EngineeringConstructScoreItem[];

  explorationRationale: {
    primaryWhy: string;
    secondaryWhy: string;
    interdisciplinaryNote?: string;
  };

  responseQuality: {
    isComplete: boolean;
    answeredCount: number;
    totalQuestions: number;
    straightLiningDetected: boolean;
    qualityFlag: string;
    pilotDisclaimer: string;
  };

  counsellorGuide: {
    discussionQuestions: string[];
    recommendedNextSteps: string[];
    academicSubjectGuidance: string[];
  };
}

export type CommerceFamilyCode =
  | "ACCOUNTING_AUDIT_TAX"
  | "FINANCE_INVESTMENT_BANKING"
  | "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP"
  | "ECONOMICS_ANALYTICS_FINTECH";

export interface CommerceCareerFamilyScoreItem {
  familyCode: CommerceFamilyCode;
  familyName: string;
  likertPoints: number;
  maxLikertPoints: number;
  likertPercentage: number;
  likertDisplayPercentage: number;
  choiceCount: number;
  maxChoiceCount: number;
  choicePercentage: number;
  choiceDisplayPercentage: number;
  compatibilityPercentage: number;
  displayPercentage: number;
  alignment: string;
  suggestedPathways: string;
  exampleAreas: string;
  counsellingNote: string;
}

export interface CommerceDimensionScoreItem {
  dimensionCode: string;
  dimensionName: string;
  description: string;
  rawScore: number;
  maxScore: number;
  normalizedScore: number;
  answeredCount: number;
  totalItems: number;
}

export interface CommerceCareerFinderResult {
  resultId: string;
  attemptId: string;
  participantId: string;
  assessmentCode: "COMMERCE_CAREER_FINDER";
  assessmentName: string;
  versionCode?: string | null;
  versionName?: string | null;
  language?: string;
  completedAt?: string;
  completedQuestions: number;
  totalQuestions: number;
  completionPercentage: number;
  isComplete: boolean;

  familyScores: Record<CommerceFamilyCode, CommerceCareerFamilyScoreItem>;
  sortedFamilies: CommerceCareerFamilyScoreItem[];

  primaryFamily: CommerceCareerFamilyScoreItem;
  secondaryFamily: CommerceCareerFamilyScoreItem;

  scoreGap: number;
  scoreGapPercentage: number;
  clarity: string;
  isMixedProfile: boolean;

  dimensionScores: Record<string, CommerceDimensionScoreItem>;
  sortedDimensions: CommerceDimensionScoreItem[];

  guidance: {
    interpretationSummary: string;
    careerExplorationDirection: string;
    finalDecisionPrinciple: string;
    doGuidelines: string[];
    avoidGuidelines: string[];
    academicSubjectGuidance: string[];
    counsellorPrinciples: Array<{
      area: string;
      interpretation: string;
      doText: string;
      avoidText: string;
    }>;
  };

  responseQuality: {
    isComplete: boolean;
    answeredCount: number;
    totalQuestions: number;
    straightLiningDetected: boolean;
    completionTimeSeconds?: number;
    qualityFlag: string;
    pilotDisclaimer: string;
  };

  scoredAt?: string;
}

export type HumanitiesFamilyCode =
  | "HUMAN_BEHAVIOUR_WELLBEING"
  | "LAW_PUBLIC_AFFAIRS_JUSTICE"
  | "MEDIA_COMM_CREATIVE_CULTURE"
  | "EDUCATION_LANG_SOCIAL_RESEARCH";

export interface HumanitiesCareerFamilyScoreItem {
  familyCode: HumanitiesFamilyCode;
  familyName: string;
  likertPoints: number;
  maxLikertPoints: number;
  likertPercentage: number;
  likertDisplayPercentage: number;
  choiceCount: number;
  maxChoiceCount: number;
  choicePercentage: number;
  choiceDisplayPercentage: number;
  compatibilityPercentage: number;
  displayPercentage: number;
  alignment: string;
  suggestedPathways: string;
  exampleAreas: string;
  counsellingNote: string;
}

export interface HumanitiesDimensionScoreItem {
  dimensionCode: string;
  dimensionName: string;
  description: string;
  rawScore: number;
  maxScore: number;
  normalizedScore: number;
  interpretation: string;
  answeredCount: number;
  totalItems: number;
  strongestCareerLink: string;
}

export interface HumanitiesCareerFinderResult {
  resultId: string;
  attemptId: string;
  participantId: string;
  assessmentCode: "HUMANITIES_CAREER_FINDER";
  assessmentName: string;
  versionCode?: string | null;
  versionName?: string | null;
  language?: string;
  completedAt?: string;
  completedQuestions: number;
  totalQuestions: number;
  completionPercentage: number;
  isComplete: boolean;

  familyScores: Record<HumanitiesFamilyCode, HumanitiesCareerFamilyScoreItem>;
  sortedFamilies: HumanitiesCareerFamilyScoreItem[];

  primaryFamily: HumanitiesCareerFamilyScoreItem;
  secondaryFamily: HumanitiesCareerFamilyScoreItem;

  scoreGap: number;
  scoreGapPercentage: number;
  clarity: string;
  isMixedProfile: boolean;

  dimensionScores: Record<string, HumanitiesDimensionScoreItem>;
  sortedDimensions: HumanitiesDimensionScoreItem[];

  guidance: {
    interpretationSummary: string;
    careerExplorationDirection: string;
    finalDecisionPrinciple: string;
    doGuidelines: string[];
    avoidGuidelines: string[];
    academicSubjectGuidance: string[];
    counsellorPrinciples: Array<{
      area: string;
      interpretation: string;
      doText: string;
      avoidText: string;
    }>;
  };

  responseQuality: {
    isComplete: boolean;
    answeredCount: number;
    totalQuestions: number;
    straightLiningDetected: boolean;
    completionTimeSeconds?: number;
    qualityFlag: string;
    pilotDisclaimer: string;
  };

  scoredAt?: string;
}

export type RightCareerFamilyCode =
  | "TECH_COMPUTING_AI"
  | "BUSINESS_FINANCE_ENTERPRISE"
  | "HEALTHCARE_LIFE_SCIENCES"
  | "LAW_POLICY_GOVERNANCE"
  | "CREATIVE_DESIGN_MEDIA"
  | "ENGINEERING_SUSTAINABILITY";

export interface RightCareerFamilyScoreItem {
  familyCode: RightCareerFamilyCode;
  familyName: string;
  likertPoints: number;
  maxLikertPoints: number;
  likertPercentage: number;
  likertDisplayPercentage: number;
  choiceCount: number;
  maxChoiceCount: number;
  choicePercentage: number;
  choiceDisplayPercentage: number;
  compatibilityPercentage: number;
  displayPercentage: number;
  alignment: string;
  suggestedPathways: string;
  exampleAreas: string;
  counsellingNote: string;
}

export interface RightCareerDimensionScoreItem {
  dimensionCode: string;
  dimensionName: string;
  description: string;
  rawScore: number;
  maxScore: number;
  normalizedScore: number;
  interpretation: string;
  answeredCount: number;
  totalItems: number;
  strongestCareerLink: string;
}

export interface RightCareerFinderResult {
  resultId: string;
  attemptId: string;
  participantId: string;
  assessmentCode: "RIGHT_CAREER_FINDER";
  assessmentName: string;
  versionCode?: string | null;
  versionName?: string | null;
  language?: string;
  completedAt?: string;
  completedQuestions: number;
  totalQuestions: number;
  completionPercentage: number;
  isComplete: boolean;

  familyScores: Record<RightCareerFamilyCode, RightCareerFamilyScoreItem>;
  sortedFamilies: RightCareerFamilyScoreItem[];

  primaryFamily: RightCareerFamilyScoreItem;
  secondaryFamily: RightCareerFamilyScoreItem;

  scoreGap: number;
  scoreGapPercentage: number;
  clarity: string;
  isMixedProfile: boolean;

  primaryDriverConstructs?: Array<{
    dimensionCode: string;
    dimensionName: string;
    normalizedScore: number;
    weight: number;
    rationale: string;
  }>;

  dimensionScores: Record<string, RightCareerDimensionScoreItem>;
  sortedDimensions: RightCareerDimensionScoreItem[];

  guidance: {
    interpretationSummary: string;
    careerExplorationDirection: string;
    finalDecisionPrinciple: string;
    doGuidelines: string[];
    avoidGuidelines: string[];
    academicSubjectGuidance: string[];
    counsellorPrinciples: Array<{
      area: string;
      interpretation: string;
      doText: string;
      avoidText: string;
    }>;
  };

  responseQuality: {
    isComplete: boolean;
    answeredCount: number;
    totalQuestions: number;
    straightLiningDetected: boolean;
    completionTimeSeconds?: number;
    qualityFlag: string;
    pilotDisclaimer: string;
  };

  scoredAt?: string;
}

export type AiTransformationVelocity =
  | "Rapid Evolution"
  | "High Transformation"
  | "Steady Evolution"
  | "Emerging Frontier";

export type AiCareerArchetype =
  | "AI_AUGMENTED_SYSTEMS"
  | "HUMAN_CENTRIC_RESILIENT"
  | "AI_TRANSFORMING"
  | "EMERGING_AI_FRONTIER";

export type StudentReadinessTier =
  | "Exceptional Readiness"
  | "Proficient / High Readiness"
  | "Developing Readiness"
  | "Foundational Orientation";

export interface StudentConstructScoreDetails {
  dimensionCode: string;
  dimensionName: string;
  sectionCode: string;
  description: string;
  rawScore: number;
  minPossibleRaw: number;
  maxPossibleRaw: number;
  normalizedScore: number;
  level: "Exceptional" | "High" | "Moderate" | "Developing";
  answeredCount: number;
  totalItems: number;
  developmentalFocus: string;
}

export interface OccupationalTaskExposureItem {
  taskId: string;
  taskName: string;
  taskDescription: string;
  frequency: "Daily / Core" | "Periodic" | "Project-Based";
  digitalIntensity: number;
  routineLevel: number;
  rulePredictability: number;
  humanJudgmentRequirement: number;
  socialRequirement: number;
  creativityRequirement: number;
  aiAugmentationPotential: number;
  taskAiExposureScore: number;
  transformationMode: "AI-Augmented" | "Human-Led" | "Automated Streamlining" | "Collaborative Synthesis";
  counsellingInsight: string;
}

export interface OccupationalAiImpactProfile {
  careerCode: string;
  careerTitle: string;
  careerDomain: string;
  archetype: AiCareerArchetype;
  archetypeTitle: string;
  archetypeTagline: string;
  transformationVelocity: AiTransformationVelocity;
  overallTaskExposureIndex: number;
  aiAugmentationPotential: number;
  humanCriticalRequirement: number;
  adaptationUrgency: number;
  taskExposureBand: "Low" | "Moderate" | "High" | "Very High";
  transformationBand: "Moderate" | "High" | "Very High";
  augmentationBand: "Moderate" | "High" | "Very High";
  humanCriticalBand: "High" | "Very High";
  tasks: OccupationalTaskExposureItem[];
  enduringHumanCapabilities: string[];
  futureSkillPriorities: Array<{
    skillName: string;
    category: "Technical / AI Fluency" | "Cognitive & Analytical" | "Human & Social";
    importance: "Critical" | "High" | "Valuable";
    rationale: string;
  }>;
  emergingOpportunities: string[];
}

export interface DualEvidenceSynthesis {
  readinessTier: StudentReadinessTier;
  readinessIndex: number;
  synthesisSummary: string;
  alignmentHighlights: string[];
  skillsWorthDeveloping: Array<{
    skillName: string;
    construct: string;
    currentReadiness: "High" | "Developing" | "Foundational";
    actionableAdvice: string;
  }>;
  counsellorDiscussionPrompts: string[];
  methodologyNote: string;
  pilotDisclaimer: string;
}

export interface AiJobRiskFinderResult {
  resultId: string;
  attemptId: string;
  participantId: string;
  assessmentCode: "AI_JOB_RISK_FINDER";
  assessmentName: "AI Job Risk Finder";
  versionCode: string | null;
  versionName: string | null;
  completedQuestions: number;
  totalQuestions: number;
  completionPercentage: number;
  isComplete: boolean;

  studentReadinessIndex: number;
  studentReadinessTier: StudentReadinessTier;
  constructScores: Record<string, StudentConstructScoreDetails>;
  sortedConstructs: StudentConstructScoreDetails[];
  topStrengths: StudentConstructScoreDetails[];
  priorityGrowthAreas: StudentConstructScoreDetails[];

  targetCareerProfile: OccupationalAiImpactProfile;
  dualEvidenceSynthesis: DualEvidenceSynthesis;

  responseQuality: {
    isComplete: boolean;
    answeredCount: number;
    totalQuestions: number;
    straightLiningDetected: boolean;
    completionTimeSeconds?: number;
    qualityFlag: "NORMAL" | "CAUTION_LOW_VARIATION" | "INCOMPLETE";
  };
}

export type EntrepreneurReadinessBand =
  | "Exceptional Readiness"
  | "Strong Entrepreneurial Aptitude"
  | "Developing Capability"
  | "Foundation Development";

export interface EntrepreneurDimensionScoreDetails {
  dimensionCode: string;
  dimensionName: string;
  sectionCode: string;
  description: string;
  weight: number;
  rawScore: number;
  minPossibleRaw: number;
  maxPossibleRaw: number;
  percentageScore: number;
  band: "Exceptional" | "High" | "Moderate" | "Foundational";
  answeredCount: number;
  totalItems: number;
  coreIndicators: string[];
  developmentalFocus: string;
}

export interface EntrepreneurArchetypeAffinity {
  archetypeCode: string;
  title: string;
  tagline: string;
  affinityScore: number;
  isPrimary: boolean;
  isSecondary: boolean;
}

export interface StartupRoadmapPhase {
  phaseNumber: number;
  title: string;
  duration: string;
  objectives: string[];
  milestones: string[];
  keyTools: string[];
}

export interface EntrepreneurStrengthArea {
  dimensionCode: string;
  dimensionName: string;
  score: number;
  badgeText: string;
  description: string;
  leverageTip: string;
}

export interface EntrepreneurDevelopmentArea {
  dimensionCode: string;
  dimensionName: string;
  score: number;
  gapSummary: string;
  actionItem: string;
  suggestedExercise: string;
}

export interface EntrepreneurDevelopmentResult {
  resultId: string;
  attemptId: string;
  participantId: string;
  assessmentCode: "ENTREPRENEUR_DEVELOPMENT_TEST";
  assessmentName: string;
  versionCode: string | null;
  versionName: string | null;
  completedAt: string;
  completionTimeSeconds?: number;

  readinessIndex: number;
  readinessBand: EntrepreneurReadinessBand;
  readinessTagline: string;
  readinessSummary: string;

  primaryArchetype: {
    code: string;
    title: string;
    tagline: string;
    description: string;
    keySuperpowers: string[];
    leadershipStyle: string;
    blindSpots: string[];
    idealCoFounders: string[];
  };
  secondaryArchetype: {
    code: string;
    title: string;
    tagline: string;
    affinityScore: number;
  } | null;
  archetypeAffinities: EntrepreneurArchetypeAffinity[];

  dimensions: EntrepreneurDimensionScoreDetails[];
  strengths: EntrepreneurStrengthArea[];
  developmentAreas: EntrepreneurDevelopmentArea[];
  roadmap: StartupRoadmapPhase[];

  learningRecommendations: {
    recommendedBooks: Array<{ title: string; author: string; rationale: string }>;
    coreFrameworks: Array<{ name: string; description: string; application: string }>;
    practicalProjects: Array<{ title: string; objective: string; deliverable: string }>;
  };

  responseQuality: {
    isComplete: boolean;
    answeredCount: number;
    totalExpected: number;
    completionPercentage: number;
  };
}


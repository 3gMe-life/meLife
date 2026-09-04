export type AssessmentCode =
  | "SKILL_FINDER"
  | "STREAM_FINDER"
  | "ENGINEERING_BRANCH_FINDER"
  | "COMMERCE_CAREER_FINDER"
  | "HUMANITIES_CAREER_FINDER"
  | "RIGHT_CAREER_FINDER"
  | "AI_JOB_RISK_FINDER";

export type AssessmentCatalogStatus = "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";

export type ParticipantAssessmentStatus =
  | "AVAILABLE"
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "EXPIRED"
  | "LOCKED";

export interface AssessmentCatalogEntity {
  id: string;
  code: AssessmentCode;
  name: string;
  category: string;
  description: string;
  estimatedMinutes: number;
  questionCount: number;
  minAge: number | null;
  maxAge: number | null;
  allowedStages: string[] | null;
  allowedGrades: string[] | null;
  status: AssessmentCatalogStatus;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ParticipantAssessmentItemDTO {
  id: string;
  code: AssessmentCode;
  name: string;
  category: string;
  description: string;
  estimatedMinutes: number;
  questionCount: number;
  status: ParticipantAssessmentStatus;
  progressPercentage: number;
  isEligible: boolean;
  eligibilityReason: string;
  activeAttemptId?: string | null;
  completedAt?: string | null;
  dominantTrait?: string | null;
}

export type ParticipantEligibilityState =
  | "ELIGIBLE"
  | "PROFILE_INCOMPLETE"
  | "NO_ELIGIBLE_ASSESSMENTS";

export interface ParticipantAssessmentsResponseDTO {
  state: ParticipantEligibilityState;
  derivedAge: number | null;
  educationStage: string | null;
  gradeLevel: string | null;
  totalAvailable: number;
  completedCount: number;
  overallProgressPercentage: number;
  assessments: ParticipantAssessmentItemDTO[];
}

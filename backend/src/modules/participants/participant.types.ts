export type EducationStage =
  | "SCHOOL"
  | "COLLEGE_UNIVERSITY"
  | "WORKING_PROFESSIONAL"
  | "OTHER";

export type GradeLevel =
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | null;

export type GuardianRelationshipStatus =
  | "PENDING"
  | "VERIFIED"
  | "REVOKED";

export interface ParticipantProfile {
  id: string;
  userId: string;
  dateOfBirth: string | null;
  educationStage: EducationStage | string | null;
  gradeLevel: GradeLevel | string | null;
  schoolName: string | null;
  curriculumOrBoard: string | null;
  guardianName: string | null;
  guardianPhone: string | null;
  guardianEmail: string | null;
  guardianRelationship: string | null;
  guardianVerificationStatus: GuardianRelationshipStatus | string | null;
  isOnboarded: boolean;
  onboardingCompletedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ParticipantOnboardingDTO {
  dateOfBirth?: string | null;
  educationStage: string;
  gradeLevel?: string | null;
  schoolName?: string | null;
  curriculumOrBoard?: string | null;
  guardianName?: string | null;
  guardianPhone?: string | null;
  guardianEmail?: string | null;
  guardianRelationship?: string | null;
}

export interface UpdateParticipantProfileDTO {
  dateOfBirth?: string | null;
  educationStage?: string | null;
  gradeLevel?: string | null;
  schoolName?: string | null;
  curriculumOrBoard?: string | null;
  guardianName?: string | null;
  guardianPhone?: string | null;
  guardianEmail?: string | null;
  guardianRelationship?: string | null;
}

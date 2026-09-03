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
  | "12";

export interface ParticipantProfile {
  id: string;
  userId: string;
  dateOfBirth: string | null;
  educationStage: string | null;
  gradeLevel: string | null;
  schoolName: string | null;
  curriculumOrBoard: string | null;
  guardianName: string | null;
  guardianPhone: string | null;
  guardianEmail: string | null;
  guardianRelationship: string | null;
  guardianVerificationStatus: string | null;
  isOnboarded: boolean;
  onboardingCompletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ParticipantOnboardingPayload {
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

export interface ParticipantProfileResponse {
  success: boolean;
  data: ParticipantProfile;
  error?: {
    code: string;
    message: string;
  };
}

export interface ParticipantOnboardingResponse {
  success: boolean;
  data: {
    success: boolean;
    message: string;
    profile: ParticipantProfile;
  };
  error?: {
    code: string;
    message: string;
  };
}

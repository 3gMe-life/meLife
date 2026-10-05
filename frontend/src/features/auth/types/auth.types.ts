export type RegistrationPath =
  | "STUDENT"
  | "PARENT"
  | "COUNSELLOR"
  | "INSTITUTION";

export type UserRole =
  | "SUPER_ADMIN"
  | "COMPANY_ADMIN"
  | "PLATFORM_ADMIN"
  | "INSTITUTION_ADMIN"
  | "PARTICIPANT"
  | "PARENT_GUARDIAN"
  | "CAREER_COUNSELLOR";

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface GoogleAuthPayload {
  credential: string;
  registrationPath?: RegistrationPath;
}

export interface StudentRegistrationPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ParentRegistrationPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface CounsellorApplicationPayload {
  firstName: string;
  lastName: string;
  professionalEmail: string;
  email?: string;
  password: string;
  qualification?: string;
  organization?: string;
}

export interface InstitutionApplicationPayload {
  institutionName: string;
  institutionType: string;
  officialEmail: string;
  email?: string;
  contactName: string;
  phoneNumber: string;
}

export interface StudentOnboardingPayload {
  educationStage: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
}

export interface CounsellorApplicationInfo {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | string;
  qualification?: string | null;
  organization?: string | null;
  submittedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status?: string;
  role: UserRole;
  isOnboarded?: boolean;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user?: UserProfile;
    role?: UserRole;
    permissions?: string[];
    dashboardFeatures?: string[];
    token?: string;
    accessToken?: string;
    message?: string;
    requiresOnboarding?: boolean;
    counsellorApplication?: CounsellorApplicationInfo | null;
    applicationType?: "COUNSELLOR" | "INSTITUTION";
    status?: "PENDING";
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface CurrentUserResponse {
  success: boolean;
  data?: {
    user: UserProfile;
    role?: UserRole;
    permissions?: string[];
    dashboardFeatures?: string[];
    onboarding?: {
      completed: boolean;
      educationStage?: string | null;
      gradeLevel?: string | null;
      dateOfBirth?: string | null;
    };
    counsellorApplication?: CounsellorApplicationInfo | null;
  };
}

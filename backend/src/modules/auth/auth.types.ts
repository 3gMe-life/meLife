import { UserRole, PublicUser } from "../users/user.types";

export type RegistrationPath =
  | "STUDENT"
  | "PARENT"
  | "COUNSELLOR"
  | "INSTITUTION";

export type AuthProvider = "LOCAL" | "GOOGLE";

export interface JwtAccessPayload {
  sub: string;
  sessionId: string;
  role: UserRole;
  permissions: string[];
  iss: string;
  aud: string;
  iat?: number;
  exp?: number;
}

export interface AuthContext {
  id: string;
  email: string;
  role: UserRole;
  permissions: string[];
  sessionId: string;
}

export interface RegisterRequestDTO {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  registrationPath: RegistrationPath;
  // Counsellor application fields
  qualification?: string;
  organization?: string;
  // Institution application fields
  institutionName?: string;
  institutionType?: string;
  contactName?: string;
  phoneNumber?: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface GoogleAuthRequestDTO {
  credential: string;
  registrationPath?: RegistrationPath;
}

export interface AuthResult {
  user: PublicUser;
  role: UserRole;
  permissions: string[];
  accessToken: string;
  refreshToken: string;
  requiresOnboarding?: boolean;
  message?: string;
}

export interface ApplicationSubmissionResult {
  success: boolean;
  applicationType: "COUNSELLOR" | "INSTITUTION";
  status: "PENDING";
  message: string;
}

export interface MeResponseDTO {
  user: PublicUser;
  role: UserRole;
  permissions: string[];
  institution: null | { id: string; name: string };
  relationships: Record<string, unknown>;
  onboarding: {
    completed: boolean;
    educationStage?: string | null;
  };
}

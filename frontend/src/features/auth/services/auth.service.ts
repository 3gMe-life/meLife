import { authApi } from "../api/auth.api";
import type {
  LoginPayload,
  StudentRegistrationPayload,
  ParentRegistrationPayload,
  CounsellorApplicationPayload,
  InstitutionApplicationPayload,
  StudentOnboardingPayload,
  AuthResponse,
} from "../types/auth.types";

/**
 * Authentication Service Adapter
 * Delegates to centralized authApi
 */
export const authService = {
  login: (payload: LoginPayload): Promise<AuthResponse> => authApi.login(payload),
  registerStudent: (payload: StudentRegistrationPayload): Promise<AuthResponse> =>
    authApi.registerStudent(payload),
  registerParent: (payload: ParentRegistrationPayload): Promise<AuthResponse> =>
    authApi.registerParent(payload),
  applyCounsellor: (payload: CounsellorApplicationPayload): Promise<AuthResponse> =>
    authApi.applyCounsellor(payload),
  applyInstitution: (payload: InstitutionApplicationPayload): Promise<AuthResponse> =>
    authApi.applyInstitution(payload),
  submitOnboarding: (payload: StudentOnboardingPayload): Promise<AuthResponse> =>
    authApi.submitStudentOnboarding(payload),
  getCurrentUser: () => authApi.getCurrentUser(),
  logout: () => authApi.logout(),
};

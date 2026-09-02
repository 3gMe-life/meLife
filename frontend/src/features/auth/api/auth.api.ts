import { fetchApi } from "@/services/api/client";
import type {
  LoginPayload,
  GoogleAuthPayload,
  StudentRegistrationPayload,
  ParentRegistrationPayload,
  CounsellorApplicationPayload,
  InstitutionApplicationPayload,
  StudentOnboardingPayload,
  AuthResponse,
  CurrentUserResponse,
} from "../types/auth.types";

export const authApi = {
  /**
   * Universal Login
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    return fetchApi<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Google OAuth Sign-In & Sign-Up
   */
  async googleAuth(payload: GoogleAuthPayload): Promise<AuthResponse> {
    return fetchApi<AuthResponse>("/auth/google", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Student Registration
   */
  async registerStudent(payload: StudentRegistrationPayload): Promise<AuthResponse> {
    return fetchApi<AuthResponse>("/auth/register/student", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Parent / Guardian Registration
   */
  async registerParent(payload: ParentRegistrationPayload): Promise<AuthResponse> {
    return fetchApi<AuthResponse>("/auth/register/parent", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Counsellor Application
   */
  async applyCounsellor(payload: CounsellorApplicationPayload): Promise<AuthResponse> {
    return fetchApi<AuthResponse>("/auth/apply/counsellor", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * School / Institution Application
   */
  async applyInstitution(payload: InstitutionApplicationPayload): Promise<AuthResponse> {
    return fetchApi<AuthResponse>("/auth/apply/institution", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Student Onboarding (Class stage & Guardian information)
   */
  async submitStudentOnboarding(payload: StudentOnboardingPayload): Promise<AuthResponse> {
    return fetchApi<AuthResponse>("/students/onboarding", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Current Authenticated User profile
   */
  async getCurrentUser(): Promise<CurrentUserResponse> {
    return fetchApi<CurrentUserResponse>("/auth/me", {
      method: "GET",
    });
  },

  /**
   * User Logout
   */
  async logout(): Promise<{ success: boolean }> {
    return fetchApi<{ success: boolean }>("/auth/logout", {
      method: "POST",
    });
  },
};

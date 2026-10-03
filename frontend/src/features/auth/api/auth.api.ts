import { fetchApi, ACCESS_TOKEN_KEY } from "@/services/api/client";
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

function storeAuthToken(res: AuthResponse) {
  if (typeof window !== "undefined") {
    const token = res.data?.accessToken || res.data?.token;
    if (token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
  }
}

export const authApi = {
  /**
   * Universal Login
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await fetchApi<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    storeAuthToken(res);
    return res;
  },

  /**
   * Google OAuth Sign-In & Sign-Up
   */
  async googleAuth(payload: GoogleAuthPayload): Promise<AuthResponse> {
    const res = await fetchApi<AuthResponse>("/auth/google", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    storeAuthToken(res);
    return res;
  },

  /**
   * Student Registration
   */
  async registerStudent(payload: StudentRegistrationPayload): Promise<AuthResponse> {
    const res = await fetchApi<AuthResponse>("/auth/register/student", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    storeAuthToken(res);
    return res;
  },

  /**
   * Parent / Guardian Registration
   */
  async registerParent(payload: ParentRegistrationPayload): Promise<AuthResponse> {
    const res = await fetchApi<AuthResponse>("/auth/register/parent", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    storeAuthToken(res);
    return res;
  },

  /**
   * Counsellor Application
   */
  async applyCounsellor(payload: CounsellorApplicationPayload): Promise<AuthResponse> {
    const res = await fetchApi<AuthResponse>("/auth/apply/counsellor", {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        email: payload.professionalEmail || (payload as Record<string, unknown>).email,
      }),
    });
    storeAuthToken(res);
    return res;
  },

  /**
   * School / Institution Application
   */
  async applyInstitution(payload: InstitutionApplicationPayload): Promise<AuthResponse> {
    const res = await fetchApi<AuthResponse>("/auth/apply/institution", {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        email: payload.officialEmail || (payload as Record<string, unknown>).email,
      }),
    });
    storeAuthToken(res);
    return res;
  },

  /**
   * Student Onboarding (Class stage & Guardian information)
   */
  async submitStudentOnboarding(payload: StudentOnboardingPayload): Promise<AuthResponse> {
    const res = await fetchApi<AuthResponse>("/students/onboarding", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res;
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
    try {
      const res = await fetchApi<{ success: boolean }>("/auth/logout", {
        method: "POST",
      });
      return res;
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
      }
    }
  },

  /**
   * Change Account Password
   */
  async changePassword(payload: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ success: boolean; data?: { message: string }; error?: { message: string } }> {
    return fetchApi("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

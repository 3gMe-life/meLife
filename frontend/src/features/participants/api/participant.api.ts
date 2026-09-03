import { fetchApi } from "@/services/api/client";
import type {
  ParticipantProfileResponse,
  ParticipantOnboardingPayload,
  ParticipantOnboardingResponse,
  ParticipantProfile,
} from "../types/participant.types";

export const participantApi = {
  /**
   * Retrieves current authenticated participant profile
   */
  async getProfile(): Promise<ParticipantProfileResponse> {
    return fetchApi<ParticipantProfileResponse>("/participant/profile", {
      method: "GET",
    });
  },

  /**
   * Progressively updates participant profile
   */
  async updateProfile(
    payload: Partial<ParticipantOnboardingPayload>
  ): Promise<ParticipantProfileResponse> {
    return fetchApi<ParticipantProfileResponse>("/participant/profile", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Gets onboarding state & requirement context
   */
  async getOnboardingState(): Promise<{
    success: boolean;
    data: {
      isOnboarded: boolean;
      isGuardianRequired: boolean;
      profile: ParticipantProfile | null;
    };
  }> {
    return fetchApi<{
      success: boolean;
      data: {
        isOnboarded: boolean;
        isGuardianRequired: boolean;
        profile: ParticipantProfile | null;
      };
    }>("/participant/onboarding", {
      method: "GET",
    });
  },

  /**
   * Submits completed participant onboarding
   */
  async completeOnboarding(
    payload: ParticipantOnboardingPayload
  ): Promise<ParticipantOnboardingResponse> {
    return fetchApi<ParticipantOnboardingResponse>("/participant/onboarding", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

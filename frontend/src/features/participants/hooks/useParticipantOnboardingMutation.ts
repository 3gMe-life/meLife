"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { participantApi } from "../api/participant.api";
import type {
  ParticipantOnboardingPayload,
  ParticipantOnboardingResponse,
} from "../types/participant.types";

export function useParticipantOnboardingMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ParticipantOnboardingResponse,
    Error,
    ParticipantOnboardingPayload
  >({
    mutationFn: (payload: ParticipantOnboardingPayload) =>
      participantApi.completeOnboarding(payload),
    onSuccess: () => {
      // Invalidate both current user session & participant profile cache
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["participantProfile"] });
    },
  });
}

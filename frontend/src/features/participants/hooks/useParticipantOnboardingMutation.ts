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
    onSuccess: (_data, variables) => {
      // 1. Synchronously update currentUser cache with completed onboarding state
      queryClient.setQueryData(["currentUser"], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            onboarding: {
              ...old.data.onboarding,
              completed: true,
              educationStage: variables.educationStage,
              gradeLevel: variables.gradeLevel,
              dateOfBirth: variables.dateOfBirth,
            },
          },
        };
      });

      // 2. Invalidate all participant queries so fresh server data is fetched cleanly
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["participantProfile"] });
      queryClient.invalidateQueries({ queryKey: ["participantAssessments"] });
    },
  });
}

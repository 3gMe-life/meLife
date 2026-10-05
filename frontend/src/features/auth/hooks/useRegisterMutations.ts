"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import type {
  StudentRegistrationPayload,
  ParentRegistrationPayload,
  CounsellorApplicationPayload,
  InstitutionApplicationPayload,
  StudentOnboardingPayload,
  AuthResponse,
  CurrentUserResponse,
} from "../types/auth.types";

export function useRegisterStudentMutation() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, StudentRegistrationPayload>({
    mutationFn: (payload) => authApi.registerStudent(payload),
    onSuccess: (data) => {
      if (data?.data?.user) {
        queryClient.setQueryData(["currentUser"], {
          success: true,
          data: {
            user: data.data.user,
            role: data.data.role,
            permissions: data.data.permissions || [],
            dashboardFeatures: data.data.dashboardFeatures || [],
            onboarding: {
              completed: !data.data.requiresOnboarding,
            },
            counsellorApplication: data.data.counsellorApplication || null,
          },
        });
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      }
    },
  });
}

export function useRegisterParentMutation() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, ParentRegistrationPayload>({
    mutationFn: (payload) => authApi.registerParent(payload),
    onSuccess: (data) => {
      if (data?.data?.user) {
        queryClient.setQueryData(["currentUser"], {
          success: true,
          data: {
            user: data.data.user,
            role: data.data.role,
            permissions: data.data.permissions || [],
            dashboardFeatures: data.data.dashboardFeatures || [],
            onboarding: {
              completed: !data.data.requiresOnboarding,
            },
            counsellorApplication: data.data.counsellorApplication || null,
          },
        });
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      }
    },
  });
}

export function useApplyCounsellorMutation() {
  return useMutation<AuthResponse, Error, CounsellorApplicationPayload>({
    mutationFn: (payload) => authApi.applyCounsellor(payload),
  });
}

export function useApplyInstitutionMutation() {
  return useMutation<AuthResponse, Error, InstitutionApplicationPayload>({
    mutationFn: (payload) => authApi.applyInstitution(payload),
  });
}

export function useStudentOnboardingMutation() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, StudentOnboardingPayload>({
    mutationFn: (payload) => authApi.submitStudentOnboarding(payload),
    onSuccess: (_data, variables) => {
      // 1. Synchronously update currentUser cache with completed onboarding state
      queryClient.setQueryData<CurrentUserResponse>(["currentUser"], (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            onboarding: {
              ...old.data.onboarding,
              completed: true,
              educationStage: variables.educationStage,
            },
          },
        };
      });

      // 2. Invalidate all participant queries so fresh server data is fetched cleanly
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["participantAssessments"] });
      queryClient.invalidateQueries({ queryKey: ["participantProfile"] });
    },
  });
}

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
} from "../types/auth.types";

export function useRegisterStudentMutation() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, StudentRegistrationPayload>({
    mutationFn: (payload) => authApi.registerStudent(payload),
    onSuccess: (data) => {
      if (data?.data?.user) {
        queryClient.setQueryData(["currentUser"], { success: true, data: { user: data.data.user } });
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
        queryClient.setQueryData(["currentUser"], { success: true, data: { user: data.data.user } });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

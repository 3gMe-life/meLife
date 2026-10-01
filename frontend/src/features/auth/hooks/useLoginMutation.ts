"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import type { LoginPayload, AuthResponse } from "../types/auth.types";

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: (payload) => authApi.login(payload),
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

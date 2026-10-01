"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import type { GoogleAuthPayload, AuthResponse } from "../types/auth.types";

export function useGoogleAuthMutation() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, GoogleAuthPayload>({
    mutationFn: (payload) => authApi.googleAuth(payload),
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

"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import type { CurrentUserResponse } from "../types/auth.types";

export function useCurrentUserQuery() {
  return useQuery<CurrentUserResponse, Error>({
    queryKey: ["currentUser"],
    queryFn: () => authApi.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

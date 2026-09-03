"use client";

import { useQuery } from "@tanstack/react-query";
import { participantApi } from "../api/participant.api";
import type { ParticipantProfileResponse } from "../types/participant.types";

export function useParticipantProfileQuery() {
  return useQuery<ParticipantProfileResponse, Error>({
    queryKey: ["participantProfile"],
    queryFn: () => participantApi.getProfile(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { assessmentApi } from "../api/assessment.api";
import type { ParticipantAssessmentsResponse } from "../types/assessment.types";

export function useParticipantAssessmentsQuery() {
  return useQuery<ParticipantAssessmentsResponse, Error>({
    queryKey: ["participantAssessments"],
    queryFn: () => assessmentApi.getParticipantAssessments(),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

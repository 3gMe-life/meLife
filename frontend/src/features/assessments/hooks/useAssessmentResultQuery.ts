import { useQuery } from "@tanstack/react-query";
import { assessmentApi } from "../api/assessment.api";

export function useAssessmentResultQuery(attemptId: string, language = "en") {
  return useQuery({
    queryKey: ["assessmentResult", attemptId, language],
    queryFn: () => assessmentApi.getAttemptResult(attemptId, language),
    enabled: Boolean(attemptId),
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });
}

export function useLatestAssessmentResultQuery(language = "en") {
  return useQuery({
    queryKey: ["assessmentResult", "latest", language],
    queryFn: () => assessmentApi.getLatestResult(language),
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  });
}

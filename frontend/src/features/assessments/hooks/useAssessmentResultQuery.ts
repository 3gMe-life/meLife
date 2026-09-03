import { useQuery } from "@tanstack/react-query";
import { assessmentApi } from "../api/assessment.api";

export function useAssessmentResultQuery(attemptId: string) {
  return useQuery({
    queryKey: ["assessmentResult", attemptId],
    queryFn: () => assessmentApi.getAttemptResult(attemptId),
    enabled: Boolean(attemptId),
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });
}

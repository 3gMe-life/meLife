import { useQuery } from "@tanstack/react-query";
import { assessmentApi } from "../api/assessment.api";

export function useAssessmentAttemptQuestionsQuery(attemptId: string) {
  return useQuery({
    queryKey: ["attemptQuestions", attemptId],
    queryFn: () => assessmentApi.getAttemptQuestions(attemptId),
    enabled: Boolean(attemptId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: false,
  });
}

import { useQuery } from "@tanstack/react-query";
import { assessmentApi } from "../api/assessment.api";

export function useAssessmentAttemptQuestionsQuery(
  attemptId: string,
  language = "en"
) {
  return useQuery({
    queryKey: ["attemptQuestions", attemptId, language],
    queryFn: () => assessmentApi.getAttemptQuestions(attemptId, language),
    enabled: Boolean(attemptId),
    staleTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false,
    retry: false,
  });
}

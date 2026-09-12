import { useQuery } from "@tanstack/react-query";
import { assessmentApi } from "../api/assessment.api";

interface UseAssessmentHistoryQueryOptions {
  enabled?: boolean;
}

export function useAssessmentHistoryQuery(
  assessmentCode = "skill-finder",
  options?: UseAssessmentHistoryQueryOptions
) {
  return useQuery({
    queryKey: ["assessmentHistory", assessmentCode],
    queryFn: () => assessmentApi.getAssessmentHistory(assessmentCode),
    enabled: Boolean(assessmentCode) && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

import { useQuery } from "@tanstack/react-query";
import { assessmentApi } from "../api/assessment.api";

interface UseLatestAssessmentComparisonQueryOptions {
  enabled?: boolean;
}

export function useLatestAssessmentComparisonQuery(
  assessmentCode = "skill-finder",
  options?: UseLatestAssessmentComparisonQueryOptions
) {
  return useQuery({
    queryKey: ["latestAssessmentComparison", assessmentCode],
    queryFn: () => assessmentApi.compareLatestResults(assessmentCode),
    enabled: Boolean(assessmentCode) && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
}

import { useQuery } from "@tanstack/react-query";
import { assessmentApi } from "../api/assessment.api";

export function useLatestAssessmentComparisonQuery(assessmentCode = "skill-finder") {
  return useQuery({
    queryKey: ["latestAssessmentComparison", assessmentCode],
    queryFn: () => assessmentApi.compareLatestResults(assessmentCode),
    enabled: Boolean(assessmentCode),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
}

import { useQuery } from "@tanstack/react-query";
import { assessmentApi } from "../api/assessment.api";

export function useAssessmentComparisonQuery(oldResultId: string, newResultId: string) {
  return useQuery({
    queryKey: ["assessmentComparison", oldResultId, newResultId],
    queryFn: () => assessmentApi.compareResults(oldResultId, newResultId),
    enabled: Boolean(oldResultId && newResultId),
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
  });
}

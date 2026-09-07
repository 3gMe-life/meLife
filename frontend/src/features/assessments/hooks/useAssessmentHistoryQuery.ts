import { useQuery } from "@tanstack/react-query";
import { assessmentApi } from "../api/assessment.api";

export function useAssessmentHistoryQuery(assessmentCode = "skill-finder") {
  return useQuery({
    queryKey: ["assessmentHistory", assessmentCode],
    queryFn: () => assessmentApi.getAssessmentHistory(assessmentCode),
    enabled: Boolean(assessmentCode),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportApi } from "../api/report.api";
import { ReportResponseData } from "../types/report.types";

/**
 * Hook to fetch a report by its UUID.
 */
export function useReportQuery(reportId?: string, language = "en") {
  return useQuery<ReportResponseData, Error>({
    queryKey: ["assessmentReport", reportId, language],
    queryFn: () => reportApi.getReport(reportId!, language),
    enabled: Boolean(reportId),
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch or auto-generate a report for a specific result ID.
 */
export function useResultReportQuery(resultId?: string, language = "en") {
  return useQuery<ReportResponseData, Error>({
    queryKey: ["resultReport", resultId, language],
    queryFn: () => reportApi.getReportByResult(resultId!, language),
    enabled: Boolean(resultId),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch the participant's latest report.
 */
export function useLatestReportQuery(language = "en") {
  return useQuery<ReportResponseData, Error>({
    queryKey: ["latestReport", language],
    queryFn: () => reportApi.getLatestReport(language),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to generate or regenerate a report snapshot.
 */
export function useGenerateReportMutation() {
  const queryClient = useQueryClient();

  return useMutation<ReportResponseData, Error, { resultId: string; language?: string }>({
    mutationFn: ({ resultId, language = "en" }) => reportApi.generateReport(resultId, language),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["assessmentReport", data.reportId, variables.language || "en"], data);
      queryClient.setQueryData(["resultReport", variables.resultId, variables.language || "en"], data);
      queryClient.invalidateQueries({ queryKey: ["latestReport"] });
    },
  });
}

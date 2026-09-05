import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { careerReportApi } from "../api/career-report.api";

export const careerReportQueryKeys = {
  all: ["career-reports"] as const,
  latest: (language: string) => [...careerReportQueryKeys.all, "latest", language] as const,
  byId: (id: string, language: string) => [...careerReportQueryKeys.all, "detail", id, language] as const,
  counsellorStudent: (studentId: string, language: string) =>
    [...careerReportQueryKeys.all, "counsellor", studentId, language] as const,
};

/**
 * Hook to fetch the student's latest career report.
 */
export function useLatestCareerReport(language = "en", enabled = true) {
  return useQuery({
    queryKey: careerReportQueryKeys.latest(language),
    queryFn: () => careerReportApi.getLatestCareerReport(language),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch a specific career report by ID.
 */
export function useCareerReport(reportId: string, language = "en", enabled = true) {
  return useQuery({
    queryKey: careerReportQueryKeys.byId(reportId, language),
    queryFn: () => careerReportApi.getCareerReportById(reportId, language),
    enabled: Boolean(reportId) && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for counsellors to fetch a student's career report with Section 10 Insights.
 */
export function useStudentCareerReportForCounsellor(studentId: string, language = "en", enabled = true) {
  return useQuery({
    queryKey: careerReportQueryKeys.counsellorStudent(studentId, language),
    queryFn: () => careerReportApi.getStudentCareerReportForCounsellor(studentId, language),
    enabled: Boolean(studentId) && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Mutation to generate or regenerate a career report.
 */
export function useGenerateCareerReportMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      resultId,
      language,
      forceRegenerate,
    }: {
      resultId?: string;
      language?: string;
      forceRegenerate?: boolean;
    }) => careerReportApi.generateCareerReport(resultId, language, forceRegenerate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerReportQueryKeys.all });
    },
  });
}

/**
 * Mutation to download the vector PDF version of the report.
 */
export function useDownloadCareerReportPdfMutation() {
  return useMutation({
    mutationFn: ({
      reportId,
      language,
      filename,
    }: {
      reportId: string;
      language?: string;
      filename?: string;
    }) => careerReportApi.downloadCareerReportPdf(reportId, language, filename),
  });
}

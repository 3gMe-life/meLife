import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assessmentApi } from "../api/assessment.api";

export function useStartRetakeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assessmentCode,
      versionCode,
    }: {
      assessmentCode: string;
      versionCode?: string;
    }) => assessmentApi.startRetake(assessmentCode, versionCode),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["participantAssessments"] });
      queryClient.invalidateQueries({ queryKey: ["assessmentHistory", variables.assessmentCode] });
      queryClient.invalidateQueries({ queryKey: ["assessmentComparison"] });
    },
  });
}

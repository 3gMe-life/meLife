import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assessmentApi } from "../api/assessment.api";

export function useStartAssessmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assessmentCode: string) =>
      assessmentApi.startAssessment(assessmentCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participantAssessments"] });
    },
  });
}

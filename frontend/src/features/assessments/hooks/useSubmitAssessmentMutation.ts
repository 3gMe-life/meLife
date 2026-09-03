import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assessmentApi } from "../api/assessment.api";

export function useSubmitAssessmentMutation(attemptId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => assessmentApi.submitAttempt(attemptId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attemptQuestions", attemptId] });
      queryClient.invalidateQueries({ queryKey: ["participantAssessments"] });
      queryClient.setQueryData(["assessmentResult", attemptId], data.result);
    },
  });
}

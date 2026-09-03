import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assessmentApi } from "../api/assessment.api";
import {
  AssessmentAttemptQuestionsResponse,
  SaveResponsePayload,
} from "../types/assessment.types";

export function useSaveAssessmentResponseMutation(attemptId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SaveResponsePayload) =>
      assessmentApi.saveResponse(attemptId, payload),
    onMutate: async (newResponse) => {
      // Optimistic update of local cache
      await queryClient.cancelQueries({
        queryKey: ["attemptQuestions", attemptId],
      });

      const prevData =
        queryClient.getQueryData<AssessmentAttemptQuestionsResponse>([
          "attemptQuestions",
          attemptId,
        ]);

      if (prevData) {
        const updatedQuestions = prevData.questions.map((q) => {
          if (q.id === newResponse.questionId) {
            return {
              ...q,
              currentResponse: {
                selectedOptionId: newResponse.selectedOptionId,
                responseValue: newResponse.responseValue,
              },
            };
          }
          return q;
        });

        const answeredCount = updatedQuestions.filter(
          (q) =>
            q.currentResponse?.responseValue !== undefined &&
            q.currentResponse?.responseValue !== null &&
            q.currentResponse?.responseValue !== ""
        ).length;

        queryClient.setQueryData<AssessmentAttemptQuestionsResponse>(
          ["attemptQuestions", attemptId],
          {
            ...prevData,
            answeredCount,
            questions: updatedQuestions,
          }
        );
      }

      return { prevData };
    },
    onError: (_err, _newResponse, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(
          ["attemptQuestions", attemptId],
          context.prevData
        );
      }
    },
    onSettled: () => {
      // Invalidate to ensure sync
      queryClient.invalidateQueries({
        queryKey: ["attemptQuestions", attemptId],
      });
    },
  });
}

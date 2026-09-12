import { useMutation } from "@tanstack/react-query";
import { assessmentApi } from "../api/assessment.api";
import { SaveResponsePayload } from "../types/assessment.types";

export function useSaveAssessmentResponseMutation(attemptId: string) {
  return useMutation({
    mutationFn: (payload: SaveResponsePayload) =>
      assessmentApi.saveResponse(attemptId, payload),
    retry: 2,
  });
}

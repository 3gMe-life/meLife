import { fetchApi } from "@/services/api/client";
import {
  ParticipantAssessmentsResponse,
  AssessmentAttemptQuestionsResponse,
  SaveResponsePayload,
  SkillFinderResult,
} from "../types/assessment.types";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const assessmentApi = {
  /**
   * Retrieves participant-eligible assessments from eligibility engine.
   */
  async getParticipantAssessments(): Promise<ParticipantAssessmentsResponse> {
    const res = await fetchApi<ApiResponse<ParticipantAssessmentsResponse>>(
      "/participant/assessments"
    );
    return res.data;
  },

  /**
   * Starts a new attempt or resumes existing active attempt for an assessment code.
   */
  async startAssessment(
    assessmentCode: string
  ): Promise<{ attemptId: string; status: string; isNew: boolean }> {
    const res = await fetchApi<
      ApiResponse<{ attemptId: string; status: string; isNew: boolean }>
    >(`/assessments/${assessmentCode}/start`, {
      method: "POST",
    });
    return res.data;
  },

  /**
   * Fetches sanitized question bank and existing participant responses for an attempt.
   */
  async getAttemptQuestions(
    attemptId: string
  ): Promise<AssessmentAttemptQuestionsResponse> {
    const res = await fetchApi<
      ApiResponse<AssessmentAttemptQuestionsResponse>
    >(`/attempts/${attemptId}/questions`);
    return res.data;
  },

  /**
   * Saves a single answer response.
   */
  async saveResponse(
    attemptId: string,
    payload: SaveResponsePayload
  ): Promise<{ success: boolean; message: string }> {
    const res = await fetchApi<ApiResponse<{ success: boolean; message: string }>>(
      `/attempts/${attemptId}/responses`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    return res.data;
  },

  /**
   * Submits the assessment attempt for psychometric scoring and final result snapshot.
   */
  async submitAttempt(
    attemptId: string
  ): Promise<{ success: boolean; resultId: string; result: SkillFinderResult }> {
    const res = await fetchApi<
      ApiResponse<{ success: boolean; resultId: string; result: SkillFinderResult }>
    >(`/attempts/${attemptId}/submit`, {
      method: "POST",
    });
    return res.data;
  },

  /**
   * Fetches the finalized result report snapshot.
   */
  async getAttemptResult(attemptId: string): Promise<SkillFinderResult> {
    const res = await fetchApi<ApiResponse<SkillFinderResult>>(
      `/results/${attemptId}`
    );
    return res.data;
  },
};

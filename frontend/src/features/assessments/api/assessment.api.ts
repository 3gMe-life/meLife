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
   * Fetches sanitized question bank and existing participant responses for an attempt in specified language.
   */
  async getAttemptQuestions(
    attemptId: string,
    language = "en"
  ): Promise<AssessmentAttemptQuestionsResponse> {
    const res = await fetchApi<
      ApiResponse<AssessmentAttemptQuestionsResponse>
    >(`/attempts/${attemptId}/questions?language=${encodeURIComponent(language)}`);
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
    attemptId: string,
    language = "en"
  ): Promise<{ success: boolean; resultId: string; result: SkillFinderResult }> {
    const res = await fetchApi<
      ApiResponse<{ success: boolean; resultId: string; result: SkillFinderResult }>
    >(`/attempts/${attemptId}/submit?language=${encodeURIComponent(language)}`, {
      method: "POST",
    });
    return res.data;
  },

  /**
   * Triggers scoring for an attempt explicitly.
   */
  async scoreAttempt(
    attemptId: string,
    language = "en"
  ): Promise<{ success: boolean; resultId: string; result: SkillFinderResult }> {
    const res = await fetchApi<
      ApiResponse<{ success: boolean; resultId: string; result: SkillFinderResult }>
    >(`/attempts/${attemptId}/score?language=${encodeURIComponent(language)}`, {
      method: "POST",
    });
    return res.data;
  },

  /**
   * Fetches the finalized result report snapshot for an attempt or 'latest'.
   */
  async getAttemptResult(
    attemptId: string,
    language = "en"
  ): Promise<SkillFinderResult | null> {
    const res = await fetchApi<ApiResponse<SkillFinderResult | null>>(
      `/results/${attemptId}?language=${encodeURIComponent(language)}`
    );
    return res.data;
  },

  /**
   * Fetches the participant's most recently completed assessment result.
   */
  async getLatestResult(language = "en"): Promise<SkillFinderResult | null> {
    const res = await fetchApi<ApiResponse<SkillFinderResult | null>>(
      `/assessments/results/latest?language=${encodeURIComponent(language)}`
    );
    return res.data;
  },

  /**
   * Fetches all completed assessment results for the participant.
   */
  async getAllResults(): Promise<unknown[]> {
    const res = await fetchApi<ApiResponse<unknown[]>>("/results");
    return res.data;
  },
};

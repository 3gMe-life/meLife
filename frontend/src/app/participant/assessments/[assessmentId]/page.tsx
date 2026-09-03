"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ProtectedRouteGuard } from "@/features/dashboard/guards/ProtectedRouteGuard";
import { assessmentApi } from "@/features/assessments/api/assessment.api";
import { useAssessmentAttemptQuestionsQuery } from "@/features/assessments/hooks/useAssessmentAttemptQuestionsQuery";
import { AssessmentRunner } from "@/features/assessments/components/runner/AssessmentRunner";

export default function AssessmentRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = Array.isArray(params?.assessmentId)
    ? params.assessmentId[0]
    : (params?.assessmentId as string);

  // 1. Initialize or resume active attempt via start API
  const {
    data: startData,
    isLoading: isStartLoading,
    isError: isStartError,
    error: startError,
  } = useQuery({
    queryKey: ["startOrResumeAttempt", rawId],
    queryFn: () => assessmentApi.startAssessment(rawId),
    enabled: Boolean(rawId),
    staleTime: 1000 * 60 * 10,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const attemptId = startData?.attemptId || "";

  // 2. Fetch questions and saved responses once attemptId is resolved
  const {
    data: attemptQuestionsData,
    isLoading: isQuestionsLoading,
    isError: isQuestionsError,
    error: questionsError,
  } = useAssessmentAttemptQuestionsQuery(attemptId);

  const isLoading = isStartLoading || (Boolean(attemptId) && isQuestionsLoading);
  const isError = isStartError || isQuestionsError;
  const errorMessage =
    (startError ? startError.message : null) ||
    (questionsError ? questionsError.message : null) ||
    "Unable to load the requested assessment attempt. Please verify your internet connection or return to the dashboard.";

  return (
    <ProtectedRouteGuard allowedRoles={["PARTICIPANT"]}>
      {isLoading ? (
        <div className="min-h-screen bg-[#F7FAF9] dark:bg-[#0D1C1B] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 border-3 border-[#00BFA5] border-t-transparent rounded-full animate-spin mb-4" />
          <h2 className="text-lg font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
            Loading Assessment Engine...
          </h2>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0] max-w-sm">
            Setting up your secure psychometric evaluation session and calibrating question items.
          </p>
        </div>
      ) : isError || !attemptQuestionsData ? (
        <div className="min-h-screen bg-[#F7FAF9] dark:bg-[#0D1C1B] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-2">
            Assessment Session Error
          </h2>
          <p className="text-sm text-[#526866] dark:text-[#9FB3B0] max-w-md mb-6">
            {errorMessage}
          </p>
          <button
            onClick={() => router.push("/participant/assessments")}
            className="px-6 py-2.5 rounded-xl bg-[#00BFA5] text-[#172B2A] font-bold text-sm hover:bg-[#008F83] hover:text-white transition-colors cursor-pointer"
          >
            Back to Assessments
          </button>
        </div>
      ) : (
        <AssessmentRunner attemptData={attemptQuestionsData} />
      )}
    </ProtectedRouteGuard>
  );
}

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

  // Read initial stored language preference if available
  const [preferredLang, setPreferredLang] = React.useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("preferred_assessment_language") || "en";
    }
    return "en";
  });

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

  // 2. Fetch questions and saved responses once attemptId is resolved with preferred language
  const {
    data: attemptQuestionsData,
    isLoading: isQuestionsLoading,
    isError: isQuestionsError,
    error: questionsError,
  } = useAssessmentAttemptQuestionsQuery(attemptId, preferredLang);

  const isLoading = isStartLoading || (Boolean(attemptId) && isQuestionsLoading);
  const isError = isStartError || isQuestionsError;
  const errorMessage =
    (startError ? startError.message : null) ||
    (questionsError ? questionsError.message : null) ||
    "Unable to load the requested assessment attempt. Please verify your internet connection or return to the dashboard.";

  const isLockedError =
    (startError as any)?.code === "ASSESSMENT_LOCKED" ||
    (startError as any)?.status === 403 ||
    (errorMessage && /locked|prerequisite/i.test(errorMessage));

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
          {isLockedError ? (
            <div className="max-w-md w-full bg-white dark:bg-[#172B2A] rounded-3xl border border-[#E3ECEA] dark:border-white/10 p-8 shadow-sm text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                Assessment Locked
              </h2>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                {errorMessage}
              </p>
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <button
                  onClick={() => router.push("/participant/assessments")}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#00BFA5] text-[#172B2A] font-bold text-xs hover:bg-[#008F83] hover:text-white transition-colors cursor-pointer"
                >
                  View Assessment Catalog
                </button>
                <button
                  onClick={() => router.push("/participant/dashboard")}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#EBF2F0] dark:bg-white/10 text-[#172B2A] dark:text-[#F7FAF9] font-bold text-xs hover:bg-[#E3ECEA] dark:hover:bg-white/20 transition-colors cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-md w-full bg-white dark:bg-[#172B2A] rounded-3xl border border-[#E3ECEA] dark:border-white/10 p-8 shadow-sm text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                Assessment Session Error
              </h2>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                {errorMessage}
              </p>
              <button
                onClick={() => router.push("/participant/assessments")}
                className="px-6 py-2.5 rounded-xl bg-[#00BFA5] text-[#172B2A] font-bold text-xs hover:bg-[#008F83] hover:text-white transition-colors cursor-pointer"
              >
                Back to Assessments
              </button>
            </div>
          )}
        </div>
      ) : (
        <AssessmentRunner attemptData={attemptQuestionsData} />
      )}
    </ProtectedRouteGuard>
  );
}

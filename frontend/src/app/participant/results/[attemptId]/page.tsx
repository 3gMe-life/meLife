"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRouteGuard } from "@/features/dashboard/guards/ProtectedRouteGuard";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { useAssessmentResultQuery } from "@/features/assessments/hooks/useAssessmentResultQuery";
import { SkillFinderResultView } from "@/features/assessments/components/results/SkillFinderResultView";

export default function AssessmentResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = Array.isArray(params?.attemptId)
    ? params.attemptId[0]
    : (params?.attemptId as string);

  const { data: result, isLoading, isError } = useAssessmentResultQuery(attemptId || "");

  return (
    <ProtectedRouteGuard allowedRoles={["PARTICIPANT"]}>
      <DashboardShell allowedRoles={["PARTICIPANT"]}>
        <div className="space-y-6">
          {/* Back Action Bar */}
          <div className="flex items-center justify-between print:hidden">
            <button
              onClick={() => router.push("/participant/dashboard")}
              className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Dashboard</span>
            </button>
          </div>

          {isLoading ? (
            <div className="bg-surface-elevated rounded-3xl border border-border-default p-12 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <h3 className="text-base font-bold text-text-primary">
                Generating Psychometric Report...
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                Aggregating interest clusters, aptitude accuracy, and developmental habits.
              </p>
            </div>
          ) : isError || !result ? (
            <div className="bg-surface-elevated rounded-3xl border border-border-default p-12 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">
                Assessment Report Not Found
              </h3>
              <p className="text-xs text-text-secondary mb-6 leading-relaxed">
                We could not locate the completed psychometric evaluation for this attempt ID. It may still be in progress or unauthorized.
              </p>
              <button
                onClick={() => router.push("/participant/assessments")}
                className="px-6 py-2.5 rounded-xl bg-primary text-slate-900 font-bold text-sm hover:bg-primary-hover transition-colors"
              >
                Go to Assessments
              </button>
            </div>
          ) : (
            <SkillFinderResultView result={result} />
          )}
        </div>
      </DashboardShell>
    </ProtectedRouteGuard>
  );
}

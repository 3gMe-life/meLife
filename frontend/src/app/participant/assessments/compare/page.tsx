"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProtectedRouteGuard } from "@/features/dashboard/guards/ProtectedRouteGuard";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { useLatestAssessmentComparisonQuery } from "@/features/assessments/hooks/useLatestAssessmentComparisonQuery";
import { useAssessmentComparisonQuery } from "@/features/assessments/hooks/useAssessmentComparisonQuery";
import { AssessmentComparisonView } from "@/features/assessments/components/comparison/AssessmentComparisonView";
import Link from "next/link";
import { ArrowLeft, AlertCircle, History } from "lucide-react";

function ComparisonContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oldResultId = searchParams?.get("oldResultId");
  const newResultId = searchParams?.get("newResultId");
  const assessmentCode = searchParams?.get("code") || "skill-finder";

  const isSpecificComparison = Boolean(oldResultId && newResultId);

  // If specific comparison IDs are provided, use specific query, otherwise use latest comparison
  const specificQuery = useAssessmentComparisonQuery(
    oldResultId || "",
    newResultId || ""
  );

  const latestQuery = useLatestAssessmentComparisonQuery(assessmentCode);

  const isLoading = isSpecificComparison ? specificQuery.isLoading : latestQuery.isLoading;
  const isError = isSpecificComparison ? specificQuery.isError : latestQuery.isError;
  const comparisonData = isSpecificComparison
    ? specificQuery.data
    : latestQuery.data?.comparison;

  const hasComparison = isSpecificComparison
    ? Boolean(comparisonData)
    : Boolean(latestQuery.data?.hasComparison && comparisonData);

  return (
    <div className="space-y-6">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between print:hidden">
        <button
          type="button"
          onClick={() => router.push("/participant/dashboard")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <Link
          href={`/participant/assessments/history?code=${encodeURIComponent(assessmentCode)}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008F83] dark:text-[#00BFA5] hover:underline"
        >
          <History className="w-3.5 h-3.5" />
          <span>View All Attempt History</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="bg-white dark:bg-[#172B2A] rounded-3xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-3 border-[#00BFA5] border-t-transparent rounded-full animate-spin mb-4" />
          <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9]">
            Synthesizing Longitudinal Comparison...
          </h3>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-1">
            Calculating construct deltas, skill trajectories, and growth insights.
          </p>
        </div>
      ) : isError || !hasComparison || !comparisonData ? (
        <div className="bg-white dark:bg-[#172B2A] rounded-3xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-12 text-center max-w-xl mx-auto space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-[#172B2A] dark:text-[#F7FAF9]">
            Comparison Requires at Least 2 Completed Attempts
          </h3>
          <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
            Longitudinal growth tracking compares your earlier baseline against a subsequent evaluation. Take a retake assessment to unlock side-by-side growth analytics.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/participant/assessments/${assessmentCode}`}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00BFA5] to-[#00C896] hover:opacity-95 text-[#172B2A] font-extrabold text-xs shadow-md shadow-[#00BFA5]/25 transition-all"
            >
              Start Skill Finder Assessment
            </Link>
            <Link
              href="/participant/dashboard"
              className="px-5 py-2.5 rounded-xl bg-[#EBF2F0] hover:bg-[#E3ECEA] dark:bg-white/5 dark:hover:bg-white/10 border border-[#E3ECEA] dark:border-white/15 text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] text-xs font-bold transition-all"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <AssessmentComparisonView
          comparison={comparisonData}
          assessmentCode={assessmentCode}
        />
      )}
    </div>
  );
}

export default function AssessmentComparePage() {
  return (
    <ProtectedRouteGuard allowedRoles={["PARTICIPANT"]}>
      <DashboardShell allowedRoles={["PARTICIPANT"]}>
        <Suspense
          fallback={
            <div className="bg-white dark:bg-[#172B2A] rounded-3xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-12 text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-3 border-[#00BFA5] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">Loading comparison view...</p>
            </div>
          }
        >
          <ComparisonContent />
        </Suspense>
      </DashboardShell>
    </ProtectedRouteGuard>
  );
}

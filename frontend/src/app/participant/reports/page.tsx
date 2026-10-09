"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { ProtectedRouteGuard } from "@/features/dashboard/guards/ProtectedRouteGuard";
import { useFeatureAccess } from "@/features/access-control/hooks/useFeatureAccess";
import {
  useLatestCareerReport,
  useDownloadCareerReportPdfMutation,
} from "@/features/reports/hooks/useCareerReportQueries";
import {
  useAllAssessmentResultsQuery,
  CompletedAssessmentResultSummary,
} from "@/features/assessments/hooks/useAssessmentResultQuery";
import {
  CompletedAssessmentReportCard,
  CompletedAssessmentGroup,
} from "@/features/reports/components/CompletedAssessmentReportCard";
import {
  Compass,
  FileText,
  Download,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  RefreshCw,
  BrainCircuit,
  Award,
} from "lucide-react";

export default function ParticipantReportsIndexPage() {
  const router = useRouter();
  const { canAccess } = useFeatureAccess();
  const { data: careerReport, isLoading: isCareerLoading } = useLatestCareerReport("en");
  const downloadMutation = useDownloadCareerReportPdfMutation();

  const {
    data: allResults,
    isLoading: isResultsLoading,
    isError: isResultsError,
    refetch: refetchResults,
  } = useAllAssessmentResultsQuery();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/participant/dashboard");
    }
  };

  const handleDownloadCareerPdf = async () => {
    if (!careerReport) return;
    await downloadMutation.mutateAsync({
      reportId: careerReport.reportId || "latest",
      language: "en",
      filename: `3G_MeLife_Career_Report_${careerReport.cover.studentName.replace(/\s+/g, "_")}.pdf`,
    });
  };

  // Group all completed results by assessmentCode and select the latest attempt for each
  const completedAssessmentGroups: CompletedAssessmentGroup[] = useMemo(() => {
    if (!allResults || !Array.isArray(allResults) || allResults.length === 0) {
      return [];
    }

    const map = new Map<string, CompletedAssessmentResultSummary[]>();

    allResults.forEach((res) => {
      if (!res.assessmentCode) return;
      const code = res.assessmentCode.toUpperCase();
      if (!map.has(code)) {
        map.set(code, []);
      }
      map.get(code)!.push(res);
    });

    const groups: CompletedAssessmentGroup[] = [];

    map.forEach((attempts, assessmentCode) => {
      // Sort attempts by completedAt descending (newest first)
      const sorted = [...attempts].sort((a, b) => {
        const timeA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const timeB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return timeB - timeA;
      });

      const latest = sorted[0];

      groups.push({
        assessmentCode,
        latestAttemptId: latest.attemptId || latest.resultId,
        latestResultId: latest.resultId,
        latestCompletedAt: latest.completedAt || new Date().toISOString(),
        totalAttempts: sorted.length,
        allAttempts: sorted.map((att) => ({
          attemptId: att.attemptId,
          resultId: att.resultId,
          completedAt: att.completedAt,
          result: att.result,
        })),
        reportId: latest.result?.reportId,
      });
    });

    // Sort assessment groups by latestCompletedAt descending
    groups.sort((a, b) => {
      const timeA = new Date(a.latestCompletedAt).getTime();
      const timeB = new Date(b.latestCompletedAt).getTime();
      return timeB - timeA;
    });

    return groups;
  }, [allResults]);

  const completedCount = completedAssessmentGroups.length;

  return (
    <ProtectedRouteGuard allowedRoles={["PARTICIPANT"]}>
      <DashboardShell allowedRoles={["PARTICIPANT"]}>
        <div className="space-y-8 pb-12">
          {/* Header with Back Navigation */}
          <div className="flex items-start gap-3.5">
            <button
              type="button"
              onClick={handleBack}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-teal-600 dark:hover:text-teal-400 transition-all cursor-pointer shadow-2xs group mt-1"
              title="Go back to previous page"
              aria-label="Go back to previous page"
            >
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                <FileText className="h-4 w-4" /> Reports & Assessment Records
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Career Guidance & Psychometric Reports
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                Access your comprehensive career exploration documents, download official vector PDF reports, and review multidimensional psychometric insights.
              </p>
            </div>
          </div>

          {/* Featured Card: 10-Section Comprehensive Career Report */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-teal-500/30 bg-gradient-to-br from-slate-900 via-[#0B1E1D] to-slate-900 p-6 md:p-8 text-white shadow-xl">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-teal-500/15 blur-3xl" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 border border-teal-500/40 px-3 py-1 text-xs font-bold text-teal-300">
                  <Sparkles className="h-3.5 w-3.5" /> 10-Section Comprehensive Report
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  Career Exploration & Guidance Report
                </h2>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  Full multidimensional analysis synthesizing your RIASEC interest profile, 4-stage cognitive strength impact, ranked career match affinities, 4-stage educational roadmaps, skill development plan, and parent guidance framework.
                </p>

                <div className="flex flex-wrap gap-2 pt-2 text-xs text-teal-200">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" /> RIASEC Clusters
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" /> Cognitive Strengths
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" /> Top 3 Deep Dives
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" /> Parent Guidance
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
                <Link
                  href="/participant/career-reports"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-5 py-3 text-xs md:text-sm font-bold text-slate-950 hover:bg-teal-400 transition-all shadow-md"
                >
                  <Compass className="h-4 w-4" />
                  <span>Open Interactive Report</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <button
                  type="button"
                  onClick={handleDownloadCareerPdf}
                  disabled={isCareerLoading || downloadMutation.isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-xs md:text-sm font-bold text-white hover:bg-white/20 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {downloadMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  <span>
                    {downloadMutation.isPending ? "Generating PDF..." : "Download Official PDF"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* COMPLETED ASSESSMENT REPORTS SECTION */}
          {/* ========================================================================= */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                    Assessment Reports
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.2 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                    {isResultsLoading ? "Loading..." : `${completedCount} Completed`}
                  </span>
                </div>
                <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  Completed Assessment Reports
                </h2>
              </div>

              <Link
                href="/participant/assessments"
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Assessment Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Loading State: Skeleton Cards */}
            {isResultsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((n) => (
                  <div
                    key={n}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 animate-pulse shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
                        <div className="space-y-1.5">
                          <div className="w-24 h-3 rounded-full bg-slate-200 dark:bg-slate-800" />
                          <div className="w-16 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800/60" />
                        </div>
                      </div>
                      <div className="w-20 h-6 rounded-full bg-slate-200 dark:bg-slate-800" />
                    </div>
                    <div className="space-y-2 pt-2">
                      <div className="w-3/4 h-4 rounded-md bg-slate-200 dark:bg-slate-800" />
                      <div className="w-1/2 h-3 rounded-md bg-slate-100 dark:bg-slate-800/60" />
                      <div className="w-full h-12 rounded-md bg-slate-100 dark:bg-slate-800/40" />
                    </div>
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                      <div className="w-28 h-8 rounded-xl bg-slate-200 dark:bg-slate-800" />
                      <div className="w-20 h-6 rounded-md bg-slate-100 dark:bg-slate-800" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isResultsError ? (
              /* Error State with Retry Button */
              <div className="rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 p-6 text-center space-y-3">
                <BrainCircuit className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto" />
                <h3 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                  Unable to Retrieve Completed Reports
                </h3>
                <p className="text-xs text-amber-800 dark:text-amber-300 max-w-md mx-auto">
                  We could not fetch your completed assessment records. Please try again.
                </p>
                <button
                  type="button"
                  onClick={() => refetchResults()}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
              </div>
            ) : completedCount === 0 ? (
              /* Empty State: No Completed Assessments */
              <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto border border-teal-500/20">
                  <Award className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    No Completed Assessment Reports Yet
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                    Complete your psychometric assessments to generate localized multi-page reports, cognitive analytics, and educational stream insights.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/participant/assessments"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-md shadow-teal-500/20"
                  >
                    <span>Start Your First Assessment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              /* Dynamic Grid of Completed Assessment Report Cards */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedAssessmentGroups.map((group) => (
                  <CompletedAssessmentReportCard
                    key={group.assessmentCode}
                    assessmentGroup={group}
                    currentLanguage="en"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Secondary Action: 1-on-1 Counsellor Guidance Consultation */}
          {canAccess("participant.counsellor") && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 shrink-0">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-amber-100 dark:bg-amber-950 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                      Expert Guidance
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
                    1-on-1 Educational Guidance Consultation
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                    Share your verified assessment reports directly with an accredited 3G MeLife career counsellor for personalized stream selection and strategic guidance.
                  </p>
                </div>
              </div>

              <Link
                href="/participant/counsellors"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 w-full sm:w-auto"
              >
                <span>Book Counselling Session</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </DashboardShell>
    </ProtectedRouteGuard>
  );
}

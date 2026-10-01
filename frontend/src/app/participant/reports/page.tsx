"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { ProtectedRouteGuard } from "@/features/dashboard/guards/ProtectedRouteGuard";
import { useFeatureAccess } from "@/features/access-control/hooks/useFeatureAccess";
import { useLatestCareerReport, useDownloadCareerReportPdfMutation } from "@/features/reports/hooks/useCareerReportQueries";
import { Compass, FileText, Download, ArrowRight, ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";

export default function ParticipantReportsIndexPage() {
  const router = useRouter();
  const { canAccess } = useFeatureAccess();
  const { data: careerReport, isLoading } = useLatestCareerReport("en");
  const downloadMutation = useDownloadCareerReportPdfMutation();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/participant/dashboard");
    }
  };

  const handleDownloadPdf = async () => {
    if (!careerReport) return;
    await downloadMutation.mutateAsync({
      reportId: careerReport.reportId || "latest",
      language: "en",
      filename: `3G_MeLife_Career_Report_${careerReport.cover.studentName.replace(/\s+/g, "_")}.pdf`,
    });
  };

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
                Access your comprehensive 10-section career exploration documents, download official vector PDF reports, and review multidimensional psychometric insights.
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
                <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-teal-400" /> RIASEC Clusters</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-teal-400" /> Cognitive Strengths</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-teal-400" /> Top 3 Deep Dives</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-teal-400" /> Parent Guidance</span>
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
                onClick={handleDownloadPdf}
                disabled={isLoading || downloadMutation.isPending}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-xs md:text-sm font-bold text-white hover:bg-white/20 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {downloadMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span>{downloadMutation.isPending ? "Generating PDF..." : "Download Official PDF"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Grid of Reports */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skill Finder Psychometric Profile */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Assessment Level
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-4">
                Skill Finder Assessment Report
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Detailed psychometric evaluation of learning behaviors, cognitive aptitude accuracy, and developmental opportunities from your assessment attempts.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/participant/reports/skill-finder"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
              >
                <span>View Skill Finder Report</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Counsellor Guided Briefing */}
          {canAccess("participant.counsellor") && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-amber-100 dark:bg-amber-950 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                    Mentorship Ready
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-4">
                  1-on-1 Guidance Consultation
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Share your 10-section report directly with an accredited 3G MeLife career counsellor for structured educational stream selection and strategic guidance.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href="/participant/counsellors"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  <span>Book Counselling Session</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  </ProtectedRouteGuard>
  );
}

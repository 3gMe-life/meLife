"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { useReportQuery } from "@/features/reports/hooks/useReportQuery";
import { SkillFinderReportView } from "@/features/reports/components/SkillFinderReportView";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ParticipantReportDetailPage() {
  const params = useParams();
  const rawReportId = Array.isArray(params?.reportId)
    ? params.reportId[0]
    : (params?.reportId as string);

  const [language, setLanguage] = useState("en");

  const {
    data: reportData,
    isLoading,
    isError,
    error,
  } = useReportQuery(rawReportId, language);

  return (
    <DashboardShell allowedRoles={["PARTICIPANT"]}>
      {isLoading ? (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-3 border-[#00BFA5] border-t-transparent rounded-full animate-spin" />
          <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9]">
            Generating Psychometric Report...
          </h3>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
            Synthesizing multidimensional construct insights and localized report templates.
          </p>
        </div>
      ) : isError || !reportData?.report ? (
        <div className="rounded-3xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 p-8 text-center max-w-lg mx-auto space-y-4 my-12">
          <AlertCircle className="w-10 h-10 text-rose-600 dark:text-rose-400 mx-auto" />
          <h2 className="text-lg font-bold text-rose-950 dark:text-rose-200">
            Unable to Load Psychometric Report
          </h2>
          <p className="text-xs text-rose-800 dark:text-rose-300">
            {error?.message || "The requested report could not be found or you do not have permission to view it."}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              href="/participant/results"
              className="px-4 py-2 rounded-xl bg-white dark:bg-white/10 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-900 dark:text-rose-200"
            >
              Back to Results
            </Link>
          </div>
        </div>
      ) : !reportData.report.executiveSummary && reportData.report.assessmentCode && reportData.report.assessmentCode !== "SKILL_FINDER" ? (
        <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-8 text-center max-w-lg mx-auto space-y-4 my-12 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#172B2A] dark:text-[#F7FAF9]">
            {reportData.report.assessmentCode.replace(/_/g, " ")} Report
          </h2>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
            This assessment evaluation is available in your personalized result dashboard.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              href={`/participant/results/${reportData.report.attemptId || reportData.resultId}`}
              className="px-5 py-2.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all shadow-md shadow-[#00BFA5]/25"
            >
              View Assessment Results
            </Link>
          </div>
        </div>
      ) : (
        <SkillFinderReportView
          report={reportData.report}
          currentLanguage={language}
          onLanguageChange={setLanguage}
        />
      )}
    </DashboardShell>
  );
}

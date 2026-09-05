"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { ProtectedRouteGuard } from "@/features/dashboard/guards/ProtectedRouteGuard";
import { useLatestCareerReport, useGenerateCareerReportMutation } from "@/features/reports/hooks/useCareerReportQueries";
import { CareerReportView } from "@/features/reports/components/career-report/CareerReportView";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

export default function StudentCareerReportPage() {
  const [language, setLanguage] = useState("en");
  const { data: report, isLoading, isError, error, refetch } = useLatestCareerReport(language);
  const generateMutation = useGenerateCareerReportMutation();

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
  };

  const handleRegenerate = async () => {
    await generateMutation.mutateAsync({ language, forceRegenerate: true });
    refetch();
  };

  return (
    <ProtectedRouteGuard allowedRoles={["PARTICIPANT"]}>
      <DashboardShell allowedRoles={["PARTICIPANT"]}>
        {isLoading ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Synthesizing Career Exploration Report...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Analyzing psychometric dimensions and aligning occupational pathways
              </p>
            </div>
          </div>
        ) : isError || !report ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="max-w-md">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Unable to Load Career Report
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {(error as any)?.message || "An unexpected error occurred while retrieving your career report."}
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => refetch()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 transition-all cursor-pointer shadow-sm"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Try Again
                </button>
                <button
                  onClick={handleRegenerate}
                  disabled={generateMutation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-2xs"
                >
                  Regenerate Report
                </button>
              </div>
            </div>
          </div>
        ) : (
          <CareerReportView
            report={report}
            currentLanguage={language}
            onLanguageChange={handleLanguageChange}
            isCounsellorView={false}
          />
        )}
      </DashboardShell>
    </ProtectedRouteGuard>
  );
}

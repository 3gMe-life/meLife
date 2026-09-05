"use client";

import React, { useState, use } from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { ProtectedRouteGuard } from "@/features/dashboard/guards/ProtectedRouteGuard";
import { useCareerReport } from "@/features/reports/hooks/useCareerReportQueries";
import { CareerReportView } from "@/features/reports/components/career-report/CareerReportView";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CareerReportByIdSingularPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [language, setLanguage] = useState("en");
  const { data: report, isLoading, isError, error } = useCareerReport(resolvedParams.id, language);

  return (
    <ProtectedRouteGuard allowedRoles={["PARTICIPANT"]}>
      <DashboardShell allowedRoles={["PARTICIPANT"]}>
        {isLoading ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Loading Career Guidance Report...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Retrieving document {resolvedParams.id.slice(0, 8)}...
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
                Report Not Found
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {(error as any)?.message || "The requested career exploration report could not be found or you do not have permission to view it."}
              </p>
              <div className="mt-4">
                <Link
                  href="/participant/career-reports"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 transition-all shadow-sm"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  View Latest Report
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <CareerReportView
            report={report}
            currentLanguage={language}
            onLanguageChange={setLanguage}
            isCounsellorView={false}
          />
        )}
      </DashboardShell>
    </ProtectedRouteGuard>
  );
}

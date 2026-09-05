"use client";

import React, { useState, use } from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { ProtectedRouteGuard } from "@/features/dashboard/guards/ProtectedRouteGuard";
import { useStudentCareerReportForCounsellor } from "@/features/reports/hooks/useCareerReportQueries";
import { CareerReportView } from "@/features/reports/components/career-report/CareerReportView";
import { Loader2, AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ studentId: string }>;
}

export default function CounsellorStudentCareerReportPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [language, setLanguage] = useState("en");
  const { data: report, isLoading, isError, error } = useStudentCareerReportForCounsellor(
    resolvedParams.studentId,
    language
  );

  return (
    <ProtectedRouteGuard allowedRoles={["CAREER_COUNSELLOR", "PLATFORM_ADMIN", "SUPER_ADMIN"]}>
      <DashboardShell allowedRoles={["CAREER_COUNSELLOR", "PLATFORM_ADMIN", "SUPER_ADMIN"]}>
        {isLoading ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2">
                <ShieldCheck className="h-5 w-5 text-teal-600" />
                Loading Practitioner Career Report & Diagnostics...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Accessing confidential psychometric profile for student {resolvedParams.studentId.slice(0, 8)}...
              </p>
            </div>
          </div>
        ) : isError || !report ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="text-center max-w-md">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Unable to Load Student Report
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {(error as any)?.message || "The requested student career exploration report could not be accessed."}
              </p>
              <div className="mt-4">
                <Link
                  href="/counsellor/students"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 transition-all shadow-sm"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Students List
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl px-5 py-3 text-xs text-amber-900 dark:text-amber-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>Practitioner Consultation Mode: Full Access including Section 10 Counsellor Diagnostic Insights</span>
              </div>
              <Link
                href={`/counsellor/students`}
                className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-bold"
              >
                &larr; Return to Assigned Students
              </Link>
            </div>

            <CareerReportView
              report={report}
              currentLanguage={language}
              onLanguageChange={setLanguage}
              isCounsellorView={true}
            />
          </div>
        )}
      </DashboardShell>
    </ProtectedRouteGuard>
  );
}

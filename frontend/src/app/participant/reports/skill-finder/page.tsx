"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { useLatestReportQuery } from "@/features/reports/hooks/useReportQuery";
import { SkillFinderReportView } from "@/features/reports/components/SkillFinderReportView";
import { ArrowRight, BookOpen } from "lucide-react";

export default function SkillFinderReportDirectPage() {
  const [language, setLanguage] = useState("en");

  const {
    data: reportData,
    isLoading,
    isError,
  } = useLatestReportQuery(language);

  return (
    <DashboardShell allowedRoles={["PARTICIPANT"]}>
      {isLoading ? (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-3 border-[#00BFA5] border-t-transparent rounded-full animate-spin" />
          <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9]">
            Loading Skill Finder Report...
          </h3>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
            Retrieving latest psychometric report snapshot.
          </p>
        </div>
      ) : isError || !reportData?.report ? (
        <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-10 text-center max-w-lg mx-auto space-y-4 my-12 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#172B2A] dark:text-[#F7FAF9]">
            No Skill Finder Report Found
          </h2>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
            Please complete your Skill Finder assessment to generate your personalized multidimensional report.
          </p>
          <div className="pt-2">
            <Link
              href="/participant/assessments/skill-finder"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all shadow-md shadow-[#00BFA5]/25"
            >
              <span>Start Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
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

"use client";

import React from "react";
import Link from "next/link";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { ProtectedRouteGuard } from "@/features/dashboard/guards/ProtectedRouteGuard";
import { useLatestAssessmentResultQuery } from "@/features/assessments/hooks/useAssessmentResultQuery";
import { SkillFinderResultView } from "@/features/assessments/components/results/SkillFinderResultView";
import { Sparkles, ArrowRight, BrainCircuit, RefreshCw } from "lucide-react";

export default function ParticipantResultsPage() {
  const [language, setLanguage] = React.useState<string>("en");
  const {
    data: latestResult,
    isLoading,
    isError,
    refetch,
  } = useLatestAssessmentResultQuery(language);

  return (
    <ProtectedRouteGuard allowedRoles={["PARTICIPANT"]}>
      <DashboardShell allowedRoles={["PARTICIPANT"]}>
        <div className="space-y-6">
          {isLoading ? (
            <div className="bg-surface-elevated rounded-3xl border border-border-default p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-3 border-[#00BFA5] border-t-transparent rounded-full animate-spin" />
              <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                Loading Psychometric Report...
              </h3>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
                Retrieving your validated career interests and cognitive dimension analytics.
              </p>
            </div>
          ) : isError ? (
            <div className="bg-surface-elevated rounded-3xl border border-border-default p-10 text-center max-w-lg mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/30 text-amber-600 flex items-center justify-center mx-auto">
                <BrainCircuit className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                Unable to Load Psychometric Insights
              </h3>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                We encountered an issue retrieving your assessment results. Please check your connection or try again.
              </p>
              <button
                onClick={() => refetch()}
                className="px-6 py-2.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry</span>
              </button>
            </div>
          ) : !latestResult ? (
            /* Empty State: No completed assessments yet */
            <div className="rounded-3xl bg-gradient-to-r from-white via-[#F7FAF9] to-[#EBF2F0] dark:from-[#172B2A] dark:via-[#172B2A]/95 dark:to-[#0D1C1B] border border-[#E3ECEA] dark:border-white/10 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-sm">
              <div className="w-16 h-16 rounded-3xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center mx-auto border border-[#00BFA5]/30">
                <BrainCircuit className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Psychometric Evaluation Pending</span>
                </span>
                <h2 className="text-2xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
                  No Assessment Completed Yet
                </h2>
                <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0] max-w-md mx-auto leading-relaxed">
                  Complete your calibrated Skill Finder assessment to unlock your official psychometric archetype, RIASEC interest clusters, and verified career pathways.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/participant/assessments"
                  className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white font-black text-xs transition-all shadow-lg shadow-[#00BFA5]/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Take Assessment Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/participant/dashboard"
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#EBF2F0] hover:bg-[#E3ECEA] dark:bg-white/5 dark:hover:bg-white/10 text-[#172B2A] dark:text-[#F7FAF9] font-bold text-xs transition-colors flex items-center justify-center"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            /* Render Live Validated Psychometric Evaluation */
            <SkillFinderResultView
              result={latestResult}
              currentLanguage={language}
              onLanguageChange={setLanguage}
            />
          )}
        </div>
      </DashboardShell>
    </ProtectedRouteGuard>
  );
}

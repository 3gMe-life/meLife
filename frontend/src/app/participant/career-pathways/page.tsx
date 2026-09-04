"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { ProtectedRouteGuard } from "@/features/dashboard/guards/ProtectedRouteGuard";
import { useCareerPathwaysQuery } from "@/features/careers/hooks/useCareerPathwaysQuery";
import { CareerPathwaysListView } from "@/features/careers/components/CareerPathwaysListView";
import { Compass, RefreshCw } from "lucide-react";

export default function ParticipantCareerPathwaysPage() {
  const [language, setLanguage] = useState<string>("en");
  const { data, isLoading, isError, refetch } = useCareerPathwaysQuery(language);

  return (
    <ProtectedRouteGuard allowedRoles={["PARTICIPANT"]}>
      <DashboardShell allowedRoles={["PARTICIPANT"]}>
        <div className="space-y-6">
          {isLoading ? (
            <div className="bg-surface-elevated rounded-3xl border border-border-default p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-3 border-[#00BFA5] border-t-transparent rounded-full animate-spin" />
              <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                Mapping Career Pathways...
              </h3>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
                Synthesizing psychometric alignment across technology, engineering, sciences, design, and business streams.
              </p>
            </div>
          ) : isError ? (
            <div className="bg-surface-elevated rounded-3xl border border-border-default p-10 text-center max-w-lg mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/30 text-amber-600 flex items-center justify-center mx-auto">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                Unable to Load Career Pathways
              </h3>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                We encountered an issue retrieving career exploration pathways. Please try again.
              </p>
              <button
                onClick={() => refetch()}
                className="px-6 py-2.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry</span>
              </button>
            </div>
          ) : (
            <CareerPathwaysListView
              recommendations={data?.recommendations || []}
              isAssessed={data?.isAssessed ?? false}
              currentLanguage={language}
              onLanguageChange={setLanguage}
            />
          )}
        </div>
      </DashboardShell>
    </ProtectedRouteGuard>
  );
}

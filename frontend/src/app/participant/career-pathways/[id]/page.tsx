"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { ProtectedRouteGuard } from "@/features/dashboard/guards/ProtectedRouteGuard";
import { useCareerDetailQuery } from "@/features/careers/hooks/useCareerPathwaysQuery";
import { CareerDetailView } from "@/features/careers/components/CareerDetailView";
import { Compass, ArrowLeft, RefreshCw } from "lucide-react";

export default function CareerPathwayDetailPage() {
  const params = useParams();
  const rawId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
  const [language, setLanguage] = useState<string>("en");

  const {
    data: career,
    isLoading,
    isError,
    refetch,
  } = useCareerDetailQuery(rawId, language);

  return (
    <ProtectedRouteGuard allowedRoles={["PARTICIPANT"]}>
      <DashboardShell allowedRoles={["PARTICIPANT"]}>
        <div className="space-y-6">
          {isLoading ? (
            <div className="bg-surface-elevated rounded-3xl border border-border-default p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-3 border-[#00BFA5] border-t-transparent rounded-full animate-spin" />
              <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                Loading Career Pathway Details...
              </h3>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
                Synthesizing career roadmap, educational milestones, and AI psychometric alignment.
              </p>
            </div>
          ) : isError || !career ? (
            <div className="bg-surface-elevated rounded-3xl border border-border-default p-10 text-center max-w-lg mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/30 text-amber-600 flex items-center justify-center mx-auto">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                Career Pathway Not Found
              </h3>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                The requested career pathway could not be found or is unavailable in the selected language.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link
                  href="/participant/career-pathways"
                  className="px-5 py-2.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white font-bold text-xs transition-colors inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Pathways</span>
                </Link>
                <button
                  onClick={() => refetch()}
                  className="px-5 py-2.5 rounded-xl bg-[#EBF2F0] dark:bg-white/10 text-[#172B2A] dark:text-[#F7FAF9] font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry</span>
                </button>
              </div>
            </div>
          ) : (
            <CareerDetailView
              career={career}
              currentLanguage={language}
              onLanguageChange={setLanguage}
            />
          )}
        </div>
      </DashboardShell>
    </ProtectedRouteGuard>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { PageHeader } from "@/features/dashboard/components/common/PageHeader";
import { AssessmentProgressCard } from "@/features/dashboard/components/common/AssessmentProgressCard";
import { VoucherRedeemModal } from "@/features/dashboard/components/common/VoucherRedeemModal";
import { useParticipantAssessmentsQuery } from "@/features/assessments/hooks/useParticipantAssessmentsQuery";
import { KeyRound, BookOpen, AlertCircle, ArrowRight } from "lucide-react";

export default function ParticipantAssessmentsPage() {
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "COMPLETED" | "PENDING">("ALL");

  const { data: assessmentData, isLoading, isError } = useParticipantAssessmentsQuery();

  const assessmentsResult = assessmentData;
  const isProfileIncomplete = assessmentsResult?.state === "PROFILE_INCOMPLETE";
  const allAssessments = assessmentsResult?.assessments || [];
  const completedCount = assessmentsResult?.completedCount || 0;
  const totalCount = assessmentsResult?.totalAvailable || 0;
  const pendingCount = totalCount - completedCount;

  const filteredAssessments = allAssessments.filter((a) => {
    if (filter === "COMPLETED") return a.status === "COMPLETED";
    if (filter === "PENDING") return a.status !== "COMPLETED";
    return true;
  });

  return (
    <DashboardShell allowedRoles={["PARTICIPANT"]}>
      <VoucherRedeemModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
      />

      <div className="space-y-6 animate-in fade-in duration-200">
        <PageHeader
          title="Psychometric Assessments"
          subtitle="Complete your validated assessments calibrated to your age and educational profile to generate your multi-dimensional career pathway."
          badge={totalCount > 0 ? `${totalCount} Calibrated Module${totalCount > 1 ? "s" : ""}` : "Assessment Battery"}
          actionElement={
            <button
              type="button"
              onClick={() => setIsVoucherModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#00BFA5]/10 dark:bg-[#00BFA5]/20 hover:bg-[#00BFA5]/20 dark:hover:bg-[#00BFA5]/30 border border-[#00BFA5]/30 text-xs font-semibold text-[#008F83] dark:text-[#00BFA5] transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <KeyRound className="w-4 h-4 text-[#00B8D4]" />
              <span>Redeem Assessment Code</span>
            </button>
          }
        />

        {/* Incomplete Profile Banner */}
        {isProfileIncomplete && (
          <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                  Profile Calibration Required
                </h3>
                <p className="text-xs text-amber-700 dark:text-amber-300/80 mt-0.5">
                  Complete your educational calibration to view your age-appropriate psychometric assessments.
                </p>
              </div>
            </div>
            <Link
              href="/participant/onboarding"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Complete Setup</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {(["ALL", "PENDING", "COMPLETED"] as const).map((f) => {
            const count = f === "ALL" ? totalCount : f === "PENDING" ? pendingCount : completedCount;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  filter === f
                    ? "bg-[#00BFA5] text-[#172B2A] font-bold shadow-sm shadow-[#00BFA5]/20"
                    : "bg-white dark:bg-white/5 hover:bg-[#EBF2F0] dark:hover:bg-white/10 text-[#526866] dark:text-[#9FB3B0] border border-[#E3ECEA] dark:border-white/10"
                }`}
              >
                {f === "ALL" ? `All Assessments (${count})` : f === "PENDING" ? `Pending (${count})` : `Completed (${count})`}
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 space-y-4 animate-pulse"
              >
                <div className="flex justify-between items-center">
                  <div className="w-24 h-4 bg-[#EBF2F0] dark:bg-white/10 rounded-full" />
                  <div className="w-16 h-4 bg-[#EBF2F0] dark:bg-white/10 rounded-full" />
                </div>
                <div className="w-2/3 h-5 bg-[#EBF2F0] dark:bg-white/10 rounded-md" />
                <div className="w-full h-12 bg-[#EBF2F0] dark:bg-white/10 rounded-md" />
                <div className="w-full h-9 bg-[#EBF2F0] dark:bg-white/10 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="rounded-3xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 mx-auto" />
            <h3 className="text-base font-bold text-rose-900 dark:text-rose-200">
              Unable to load assessments
            </h3>
            <p className="text-xs text-rose-700 dark:text-rose-300">
              Please check your connection or refresh the page to retry.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredAssessments.length === 0 && (
          <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9]">
              {isProfileIncomplete
                ? "Calibration Incomplete"
                : filter !== "ALL"
                ? `No ${filter.toLowerCase()} assessments found`
                : "No assessments currently available"}
            </h3>
            <p className="text-xs text-[#526866] dark:text-[#9FB3B0] max-w-md mx-auto leading-relaxed">
              {isProfileIncomplete
                ? "Complete your participant calibration to unlock your personalized psychometric assessments."
                : "No modules match the current filter selection."}
            </p>
            {isProfileIncomplete && (
              <Link
                href="/participant/onboarding"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all mt-2"
              >
                <span>Complete Calibration</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        )}

        {/* Assessments Grid */}
        {!isLoading && !isError && filteredAssessments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAssessments.map((assessment) => (
              <AssessmentProgressCard key={assessment.id} assessment={assessment} />
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

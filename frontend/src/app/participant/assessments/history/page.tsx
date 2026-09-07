"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ProtectedRouteGuard } from "@/features/dashboard/guards/ProtectedRouteGuard";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { useAssessmentHistoryQuery } from "@/features/assessments/hooks/useAssessmentHistoryQuery";
import { useStartRetakeMutation } from "@/features/assessments/hooks/useStartRetakeMutation";
import { AssessmentHistoryCard } from "@/features/assessments/components/history/AssessmentHistoryCard";
import { AssessmentTimeline } from "@/features/assessments/components/history/AssessmentTimeline";
import { RetakeConfirmationModal } from "@/features/assessments/components/history/RetakeConfirmationModal";
import {
  ArrowLeft,
  History,
  RotateCcw,
  GitCompare,
  Sparkles,
  Award,
  AlertCircle,
} from "lucide-react";

function HistoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentCode = searchParams?.get("code") || "skill-finder";

  const [isRetakeModalOpen, setIsRetakeModalOpen] = useState(false);

  const { data: historyData, isLoading, isError } = useAssessmentHistoryQuery(assessmentCode);
  const startRetakeMutation = useStartRetakeMutation();

  const history = historyData?.history || [];
  const totalAttempts = historyData?.totalAttempts || 0;
  const canCompare = totalAttempts >= 2;

  const handleStartRetake = () => {
    startRetakeMutation.mutate(
      { assessmentCode },
      {
        onSuccess: () => {
          setIsRetakeModalOpen(false);
          router.push(`/participant/assessments/${assessmentCode}`);
        },
        onError: (err) => {
          console.error("Failed to start retake:", err);
          setIsRetakeModalOpen(false);
          router.push(`/participant/assessments/${assessmentCode}`);
        },
      }
    );
  };

  const handleCompareWithLatest = (attemptId: string, resultId: string) => {
    const latestResultId = history[0]?.resultId;
    if (latestResultId && resultId !== latestResultId) {
      router.push(
        `/participant/assessments/compare?oldResultId=${encodeURIComponent(resultId)}&newResultId=${encodeURIComponent(latestResultId)}&code=${encodeURIComponent(assessmentCode)}`
      );
    } else {
      router.push(`/participant/assessments/compare?code=${encodeURIComponent(assessmentCode)}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/participant/dashboard")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        {canCompare && (
          <Link
            href={`/participant/assessments/compare?code=${encodeURIComponent(assessmentCode)}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00BFA5]/10 hover:bg-[#00BFA5]/20 border border-[#00BFA5]/30 text-xs font-bold text-[#008F83] dark:text-[#00BFA5] transition-all"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare Longitudinal Growth</span>
          </Link>
        )}
      </div>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#172B2A] via-[#1A3331] to-[#0D1C1B] border border-[#00BFA5]/25 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00BFA5]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00BFA5]/15 text-[#00BFA5] border border-[#00BFA5]/30 text-xs font-bold">
              <History className="w-3.5 h-3.5" />
              <span>Assessment History & Longitudinal Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Skill Finder Developmental Journey
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Track your psychometric evaluations across time. Every attempt is permanently saved so you can review previous reports and track skill growth.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={() => setIsRetakeModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#00BFA5] to-[#00C896] hover:opacity-95 text-[#172B2A] font-extrabold text-xs shadow-lg shadow-[#00BFA5]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Assessment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Body */}
      {isLoading ? (
        <div className="bg-white dark:bg-[#172B2A] rounded-3xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-12 h-12 border-3 border-[#00BFA5] border-t-transparent rounded-full animate-spin mb-4" />
          <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9]">Loading Assessment History...</h3>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-1">Retrieving previous evaluations and milestones.</p>
        </div>
      ) : isError ? (
        <div className="bg-white dark:bg-[#172B2A] rounded-3xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#172B2A] dark:text-[#F7FAF9]">Unable to Load History</h3>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">Please check your connection and try again.</p>
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white dark:bg-[#172B2A] rounded-3xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#00BFA5]/10 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-[#172B2A] dark:text-[#F7FAF9]">No Completed Assessments Yet</h3>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
            Take your first Skill Finder assessment to establish your developmental baseline and unlock career pathways.
          </p>
          <div className="pt-2">
            <Link
              href={`/participant/assessments/${assessmentCode}`}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00BFA5] to-[#00C896] hover:opacity-95 text-[#172B2A] font-extrabold text-xs shadow-md shadow-[#00BFA5]/25 transition-all"
            >
              <span>Begin Assessment</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Comparison CTA if multiple attempts */}
          {canCompare && (
            <div className="rounded-3xl bg-gradient-to-r from-[#00BFA5]/15 via-white to-white dark:via-[#172B2A] dark:to-[#172B2A] border border-[#00BFA5]/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs dark:shadow-none">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-tr from-[#00B8D4] via-[#00BFA5] to-[#00C896] text-[#172B2A] shrink-0 shadow-md shadow-[#00BFA5]/20">
                  <GitCompare className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                    Longitudinal Comparison Available
                  </h3>
                  <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-0.5">
                    You have completed {totalAttempts} evaluations. View side-by-side growth analytics and skill gains.
                  </p>
                </div>
              </div>

              <Link
                href={`/participant/assessments/compare?code=${encodeURIComponent(assessmentCode)}`}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00BFA5] to-[#00C896] hover:opacity-95 text-[#172B2A] font-extrabold text-xs shadow-sm transition-all whitespace-nowrap"
              >
                Compare Latest Results
              </Link>
            </div>
          )}

          {/* Timeline Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                Developmental Milestone Timeline
              </h2>
              <span className="text-xs text-[#728B88] dark:text-[#7D9491]">
                {totalAttempts} Total Evaluation{totalAttempts > 1 ? "s" : ""}
              </span>
            </div>

            <AssessmentTimeline history={history} />
          </div>

          {/* Attempt Cards Grid */}
          <div className="space-y-4 pt-4 border-t border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)]">
            <h2 className="text-lg font-bold text-[#172B2A] dark:text-[#F7FAF9]">
              All Completed Attempts & Reports
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((item, idx) => (
                <AssessmentHistoryCard
                  key={item.historyId || item.attemptId}
                  item={item}
                  isLatest={idx === 0}
                  onCompareWithLatest={handleCompareWithLatest}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Retake Confirmation Modal */}
      <RetakeConfirmationModal
        isOpen={isRetakeModalOpen}
        onClose={() => setIsRetakeModalOpen(false)}
        onConfirm={handleStartRetake}
        isPending={startRetakeMutation.isPending}
        assessmentName="Skill Finder"
      />
    </div>
  );
}

export default function AssessmentHistoryPage() {
  return (
    <ProtectedRouteGuard allowedRoles={["PARTICIPANT"]}>
      <DashboardShell allowedRoles={["PARTICIPANT"]}>
        <Suspense
          fallback={
            <div className="bg-white dark:bg-[#172B2A] rounded-3xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-12 text-center flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-3 border-[#00BFA5] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">Loading history...</p>
            </div>
          }
        >
          <HistoryContent />
        </Suspense>
      </DashboardShell>
    </ProtectedRouteGuard>
  );
}

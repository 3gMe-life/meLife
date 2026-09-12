"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  HelpCircle,
  Play,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  SlidersHorizontal,
  Lock,
  AlertCircle,
} from "lucide-react";
import type { ParticipantAssessmentItem } from "@/features/assessments/types/assessment.types";

interface MyAssessmentsPanelProps {
  assessments: ParticipantAssessmentItem[];
  isLoading?: boolean;
  isProfileIncomplete?: boolean;
  onRetake?: (code: string) => void;
}

type FilterTab = "ALL" | "AVAILABLE" | "IN_PROGRESS" | "COMPLETED" | "LOCKED";

export function MyAssessmentsPanel({
  assessments,
  isLoading = false,
  isProfileIncomplete = false,
  onRetake,
}: MyAssessmentsPanelProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");

  const completedCount = assessments.filter((a) => a.status === "COMPLETED").length;
  const inProgressCount = assessments.filter((a) => a.status === "IN_PROGRESS").length;
  const availableCount = assessments.filter((a) => a.status === "AVAILABLE").length;
  const lockedCount = assessments.filter((a) => a.status === "LOCKED").length;

  const filteredAssessments = assessments.filter((item) => {
    if (activeTab === "COMPLETED") return item.status === "COMPLETED";
    if (activeTab === "IN_PROGRESS") return item.status === "IN_PROGRESS";
    if (activeTab === "AVAILABLE") return item.status === "AVAILABLE";
    if (activeTab === "LOCKED") return item.status === "LOCKED";
    return true;
  });

  return (
    <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-7 shadow-xs hover:shadow-sm transition-all duration-200 space-y-6">
      {/* 1. Panel Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3ECEA] dark:border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
              My Assessments
            </h2>
            {assessments.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30">
                {assessments.length} Total Modules
              </span>
            )}
          </div>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
            Validated multidimensional psychometric evaluation battery and career exploration roadmap.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "ALL"
                ? "bg-[#00BFA5] text-[#172B2A] shadow-xs"
                : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9]"
            }`}
          >
            All ({assessments.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("AVAILABLE")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "AVAILABLE"
                ? "bg-[#00BFA5] text-[#172B2A] shadow-xs"
                : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9]"
            }`}
          >
            Available ({availableCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("IN_PROGRESS")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "IN_PROGRESS"
                ? "bg-[#00BFA5] text-[#172B2A] shadow-xs"
                : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9]"
            }`}
          >
            In Progress ({inProgressCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("COMPLETED")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "COMPLETED"
                ? "bg-[#00BFA5] text-[#172B2A] shadow-xs"
                : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9]"
            }`}
          >
            Completed ({completedCount})
          </button>
          {lockedCount > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("LOCKED")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "LOCKED"
                  ? "bg-amber-500/20 text-amber-800 dark:text-amber-300 shadow-xs border border-amber-500/40"
                  : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9]"
              }`}
            >
              Locked ({lockedCount})
            </button>
          )}
        </div>
      </div>

      {/* 2. Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 animate-pulse space-y-3"
            >
              <div className="flex justify-between items-center">
                <div className="w-32 h-5 bg-[#EBF2F0] dark:bg-white/10 rounded-md" />
                <div className="w-20 h-5 bg-[#EBF2F0] dark:bg-white/10 rounded-full" />
              </div>
              <div className="w-3/4 h-4 bg-[#EBF2F0] dark:bg-white/10 rounded-md" />
              <div className="w-full h-2 bg-[#EBF2F0] dark:bg-white/10 rounded-full" />
            </div>
          ))}
        </div>
      )}

      {/* 3. Empty State */}
      {!isLoading && filteredAssessments.length === 0 && (
        <div className="p-8 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#172B2A] dark:text-[#F7FAF9]">
            {isProfileIncomplete
              ? "Calibration Required"
              : activeTab === "COMPLETED"
              ? "No assessments completed yet"
              : activeTab === "IN_PROGRESS"
              ? "No active assessments in progress"
              : activeTab === "LOCKED"
              ? "No locked assessments"
              : "No assessments found"}
          </h3>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0] max-w-sm mx-auto leading-relaxed">
            {isProfileIncomplete
              ? "Complete your educational demographic setup to unlock your personalized assessment battery."
              : "Your assessments will help you discover your cognitive aptitudes, interests, and future pathways."}
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

      {/* 4. Assessment List */}
      {!isLoading && filteredAssessments.length > 0 && (
        <div className="space-y-3.5">
          {filteredAssessments.map((assessment) => {
            const isCompleted = assessment.status === "COMPLETED";
            const isInProgress = assessment.status === "IN_PROGRESS";
            const isLocked = assessment.status === "LOCKED";
            const isRecommended = !!assessment.isRecommended;
            const code = assessment.code || assessment.id;

            return (
              <div
                key={assessment.id}
                className={`p-5 rounded-2xl border transition-all duration-200 space-y-3.5 group relative overflow-hidden ${
                  isRecommended && !isCompleted
                    ? "bg-gradient-to-r from-[#00BFA5]/[0.08] via-[#00B8D4]/[0.03] to-transparent dark:from-[#00BFA5]/15 dark:via-white/[0.04] dark:to-transparent border-[#00BFA5]/50 dark:border-[#00BFA5]/40 shadow-xs ring-1 ring-[#00BFA5]/30"
                    : isLocked
                    ? "bg-[#F4F8F7]/60 dark:bg-white/[0.03] border-[#E3ECEA]/80 dark:border-white/5 opacity-90 hover:opacity-100 hover:border-amber-400/40"
                    : "bg-[#F4F8F7] dark:bg-white/5 border-[#E3ECEA] dark:border-white/10 hover:border-[#00BFA5]/40"
                }`}
              >
                {/* Row 1: Status Icon + Title + Badges + Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* Status Circle */}
                    <div
                      className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center font-bold text-xs mt-0.5 border ${
                        isCompleted
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                          : isInProgress
                          ? "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border-[#00BFA5]/30 animate-pulse"
                          : isRecommended
                          ? "bg-[#00BFA5]/20 text-[#008F83] dark:text-[#00BFA5] border-[#00BFA5]/40"
                          : isLocked
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                          : "bg-white dark:bg-white/10 text-[#526866] dark:text-[#9FB3B0] border-[#E3ECEA] dark:border-white/10"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isLocked ? (
                        <Lock className="w-4 h-4" />
                      ) : isRecommended ? (
                        <Sparkles className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </div>

                    {/* Title and Metadata */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className={`text-sm sm:text-base font-black transition-colors ${
                          isLocked
                            ? "text-[#3D5250] dark:text-[#E0E8E6]"
                            : "text-[#172B2A] dark:text-[#F7FAF9] group-hover:text-[#008F83] dark:group-hover:text-[#00BFA5]"
                        }`}>
                          {assessment.name}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-white/10 border border-[#E3ECEA] dark:border-white/10 text-[#526866] dark:text-[#9FB3B0] uppercase tracking-wider">
                          {assessment.category || "Psychometric Battery"}
                        </span>
                        {isRecommended && !isCompleted && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#00BFA5]/25 to-[#00B8D4]/25 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/40 shadow-2xs">
                            <Sparkles className="w-3 h-3 fill-current text-[#00BFA5]" />
                            <span>Recommended for You</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#526866] dark:text-[#9FB3B0] line-clamp-1">
                        {assessment.description}
                      </p>

                      {/* Recommendation Explanation Subtitle */}
                      {isRecommended && assessment.recommendationReason && !isCompleted && (
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#008F83] dark:text-[#00BFA5] pt-0.5">
                          <Sparkles className="w-3 h-3 text-[#00BFA5] shrink-0" />
                          <span>{assessment.recommendationReason}</span>
                        </div>
                      )}

                      {/* Locked Explanatory Subtitle */}
                      {isLocked && assessment.lockReason && (
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300 pt-0.5">
                          <Lock className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                          <span>{assessment.lockReason}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Status Badge */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
                    ) : isInProgress ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30">
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{assessment.progressPercentage}% In Progress</span>
                      </span>
                    ) : isLocked ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Locked</span>
                      </span>
                    ) : isRecommended ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-[#00BFA5]/20 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/40">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Recommended</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-white dark:bg-white/10 text-[#526866] dark:text-[#9FB3B0] border border-[#E3ECEA] dark:border-white/10">
                        <span>Available</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Prerequisite Tags if available */}
                {assessment.prerequisites && assessment.prerequisites.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[10px]">
                    <span className="font-semibold text-[#728B88] dark:text-[#7D9491]">Prerequisites:</span>
                    {assessment.prerequisites.map((prereq) => (
                      <span
                        key={prereq.code}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold border ${
                          prereq.isSatisfied
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {prereq.isSatisfied ? (
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        ) : (
                          <Lock className="w-2.5 h-2.5" />
                        )}
                        <span>{prereq.name}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Row 2: Stats & Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-[#728B88] dark:text-[#7D9491]">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#00B8D4]" />
                        ~{assessment.estimatedMinutes} mins
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <HelpCircle className="w-3.5 h-3.5 text-[#00BFA5]" />
                        {assessment.questionCount} Questions
                      </span>
                    </div>

                    {!isLocked && (
                      <span className="font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                        {assessment.progressPercentage}%
                      </span>
                    )}
                  </div>

                  {/* Meter Bar */}
                  {!isLocked && (
                    <div className="w-full h-1.5 rounded-full bg-[#EBF2F0] dark:bg-black/30 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isCompleted
                            ? "bg-gradient-to-r from-[#00BFA5] to-[#00C896]"
                            : "bg-gradient-to-r from-[#00B8D4] via-[#00BFA5] to-[#00C896]"
                        }`}
                        style={{ width: `${Math.max(5, assessment.progressPercentage)}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Row 3: Action Buttons */}
                <div className="pt-2 flex items-center justify-end gap-2.5">
                  {isCompleted ? (
                    <>
                      {onRetake && (
                        <button
                          type="button"
                          onClick={() => onRetake(code)}
                          className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-white/10 hover:bg-[#EBF2F0] dark:hover:bg-white/20 border border-[#E3ECEA] dark:border-white/15 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-[#00BFA5]" />
                          <span>Retake</span>
                        </button>
                      )}

                      <Link
                        href={
                          assessment.activeAttemptId
                            ? `/participant/results/${assessment.activeAttemptId}`
                            : `/participant/results`
                        }
                        className="px-4 py-1.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all shadow-sm shadow-[#00BFA5]/20 flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>View Result</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </>
                  ) : isInProgress ? (
                    <Link
                      href={`/participant/assessments/${code}`}
                      className="px-4 py-1.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all shadow-sm shadow-[#00BFA5]/20 flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Continue Assessment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : isLocked ? (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#E3ECEA]/40 dark:bg-white/5 border border-[#E3ECEA]/80 dark:border-white/10 text-xs font-bold text-[#728B88] dark:text-[#7D9491] cursor-not-allowed select-none">
                      <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>{assessment.lockReason || "Prerequisites Required"}</span>
                    </div>
                  ) : (
                    <Link
                      href={`/participant/assessments/${code}`}
                      className="px-4 py-1.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all shadow-sm shadow-[#00BFA5]/20 flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isRecommended ? "Start Recommended Assessment" : "Start Assessment"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

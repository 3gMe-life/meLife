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
} from "lucide-react";
import type { ParticipantAssessmentItem } from "@/features/assessments/types/assessment.types";

interface MyAssessmentsPanelProps {
  assessments: ParticipantAssessmentItem[];
  isLoading?: boolean;
  isProfileIncomplete?: boolean;
  onRetake?: (code: string) => void;
}

type FilterTab = "ALL" | "IN_PROGRESS" | "COMPLETED" | "AVAILABLE";

export function MyAssessmentsPanel({
  assessments,
  isLoading = false,
  isProfileIncomplete = false,
  onRetake,
}: MyAssessmentsPanelProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");

  const filteredAssessments = assessments.filter((item) => {
    if (activeTab === "COMPLETED") return item.status === "COMPLETED";
    if (activeTab === "IN_PROGRESS") return item.status === "IN_PROGRESS";
    if (activeTab === "AVAILABLE") return item.status !== "COMPLETED" && item.status !== "IN_PROGRESS";
    return true;
  });

  const completedCount = assessments.filter((a) => a.status === "COMPLETED").length;
  const inProgressCount = assessments.filter((a) => a.status === "IN_PROGRESS").length;

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
                {assessments.length} Available
              </span>
            )}
          </div>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
            Validated multidimensional psychometric evaluation battery.
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
        </div>
      </div>

      {/* 2. Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2].map((n) => (
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
            const code = assessment.code || assessment.id;

            return (
              <div
                key={assessment.id}
                className="p-5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 hover:border-[#00BFA5]/40 transition-all duration-200 space-y-3.5 group"
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
                          : "bg-white dark:bg-white/10 text-[#526866] dark:text-[#9FB3B0] border-[#E3ECEA] dark:border-white/10"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </div>

                    {/* Title and Metadata */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm sm:text-base font-black text-[#172B2A] dark:text-[#F7FAF9] group-hover:text-[#008F83] dark:group-hover:text-[#00BFA5] transition-colors">
                          {assessment.name}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-white/10 border border-[#E3ECEA] dark:border-white/10 text-[#526866] dark:text-[#9FB3B0] uppercase tracking-wider">
                          {assessment.category || "Psychometric Battery"}
                        </span>
                      </div>
                      <p className="text-xs text-[#526866] dark:text-[#9FB3B0] line-clamp-1">
                        {assessment.description}
                      </p>
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
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-white dark:bg-white/10 text-[#526866] dark:text-[#9FB3B0] border border-[#E3ECEA] dark:border-white/10">
                        <span>Available</span>
                      </span>
                    )}
                  </div>
                </div>

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

                    <span className="font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                      {assessment.progressPercentage}%
                    </span>
                  </div>

                  {/* Meter Bar */}
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
                  ) : (
                    <Link
                      href={`/participant/assessments/${code}`}
                      className="px-4 py-1.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all shadow-sm shadow-[#00BFA5]/20 flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Assessment</span>
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

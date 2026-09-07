"use client";

import React from "react";
import { CheckCircle2, TrendingUp, Sparkles, ShieldCheck } from "lucide-react";

interface OverallProgressWidgetProps {
  progressPercentage: number;
  completedCount: number;
  totalCount: number;
  isProfileIncomplete?: boolean;
}

export function OverallProgressWidget({
  progressPercentage,
  completedCount,
  totalCount,
  isProfileIncomplete = false,
}: OverallProgressWidgetProps) {
  const safePercentage = Math.min(100, Math.max(0, progressPercentage));

  return (
    <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-5 sm:p-6 shadow-xs hover:shadow-sm transition-all duration-200 space-y-4">
      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-sm font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
            Progress
          </h3>
          <p className="text-[11px] text-[#728B88] dark:text-[#7D9491]">
            Overall Discovery Calibration
          </p>
        </div>

        <span className="text-lg font-black text-[#008F83] dark:text-[#00BFA5] font-mono">
          {safePercentage}%
        </span>
      </div>

      {/* 2. Horizontal Progress Bar */}
      <div className="space-y-2">
        <div className="w-full h-3 rounded-full bg-[#EBF2F0] dark:bg-black/30 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#00B8D4] via-[#00BFA5] to-[#00C896] transition-all duration-1000 ease-out shadow-sm"
            style={{ width: `${Math.max(4, safePercentage)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#526866] dark:text-[#9FB3B0]">
          <span className="font-semibold">
            {completedCount} of {totalCount} modules completed
          </span>
          <span className="font-bold text-[#008F83] dark:text-[#00BFA5]">
            {totalCount - completedCount === 0 && totalCount > 0 ? "Fully Calibrated" : `${totalCount - completedCount} Remaining`}
          </span>
        </div>
      </div>

      {/* 3. Milestone Checks */}
      <div className="pt-2 border-t border-[#E3ECEA] dark:border-white/10 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[#526866] dark:text-[#9FB3B0]">
            <CheckCircle2
              className={`w-3.5 h-3.5 ${
                !isProfileIncomplete
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-[#B3C4C1] dark:text-[#4A5D5A]"
              }`}
            />
            <span>Profile Calibration</span>
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F4F8F7] dark:bg-white/5 text-[#526866] dark:text-[#9FB3B0]">
            {!isProfileIncomplete ? "Done" : "Pending"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[#526866] dark:text-[#9FB3B0]">
            <CheckCircle2
              className={`w-3.5 h-3.5 ${
                completedCount > 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-[#B3C4C1] dark:text-[#4A5D5A]"
              }`}
            />
            <span>Skill Finder Assessment</span>
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F4F8F7] dark:bg-white/5 text-[#526866] dark:text-[#9FB3B0]">
            {completedCount > 0 ? "Completed" : "Active"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[#526866] dark:text-[#9FB3B0]">
            <CheckCircle2
              className={`w-3.5 h-3.5 ${
                completedCount > 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-[#B3C4C1] dark:text-[#4A5D5A]"
              }`}
            />
            <span>Career Guidance Report</span>
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F4F8F7] dark:bg-white/5 text-[#526866] dark:text-[#9FB3B0]">
            {completedCount > 0 ? "Ready" : "Locked"}
          </span>
        </div>
      </div>
    </div>
  );
}

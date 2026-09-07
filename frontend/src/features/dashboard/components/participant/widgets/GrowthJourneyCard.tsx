"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  Sparkles,
  ArrowRight,
  RotateCcw,
  ArrowUpRight,
  ShieldCheck,
  History,
  CheckCircle2,
} from "lucide-react";
import type {
  LatestComparisonResponse,
  LongitudinalComparisonResult,
  DimensionComparisonItem,
} from "@/features/assessments/types/assessment.types";

interface GrowthJourneyCardProps {
  comparisonData?: LatestComparisonResponse | null;
  totalAttempts?: number;
  onOpenRetakeModal: () => void;
}

export function GrowthJourneyCard({
  comparisonData,
  totalAttempts = 1,
  onOpenRetakeModal,
}: GrowthJourneyCardProps) {
  const hasComparison = comparisonData?.hasComparison && Boolean(comparisonData.comparison);
  const comparison: LongitudinalComparisonResult | null | undefined = comparisonData?.comparison;

  return (
    <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-7 shadow-xs hover:shadow-sm transition-all duration-200 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E3ECEA] dark:border-white/10 pb-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
              My Growth Journey & Retest
            </h3>
          </div>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
            Longitudinal skill development and cognitive progression over time.
          </p>
        </div>

        {hasComparison && (
          <Link
            href="/participant/results?tab=growth"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008F83] dark:text-[#00BFA5] hover:text-[#00BFA5] dark:hover:text-[#00C896] hover:underline transition-colors self-start sm:self-auto"
          >
            <span>Full Growth Breakdown</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Case 1: Multiple Attempts & Comparison Available */}
      {hasComparison && comparison ? (
        <div className="space-y-4">
          {/* Comparison Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#E6F7F5] via-white to-[#F0FAF8] dark:from-[#172B2A] dark:via-[#142827] dark:to-[#0D1C1B] border border-[#00BFA5]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  {comparison.growthTrajectory || "Active Growth"}
                </span>
                <span className="text-xs font-bold text-[#728B88] dark:text-[#7D9491]">
                  Longitudinal Comparison
                </span>
              </div>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
                {comparison.growthSummary || "Comparing initial baseline against your latest milestone evaluation."}
              </p>
            </div>

            {/* Score Delta Pill */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-white/10 border border-[#00BFA5]/30 shrink-0 shadow-2xs">
              <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                  {comparison.daysBetween} Days
                </span>
                <span className="text-[10px] text-[#728B88] dark:text-[#7D9491] block">Between Attempts</span>
              </div>
            </div>
          </div>

          {/* Top Gains Grid */}
          {comparison.topGains && comparison.topGains.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {comparison.topGains.slice(0, 2).map((gain: DimensionComparisonItem, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                      {gain.dimensionName}
                    </span>
                    <span className="text-[10px] text-[#728B88] dark:text-[#7D9491] block">
                      {gain.oldScore}% → {gain.newScore}%
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-mono">
                    {gain.delta > 0 ? `+${gain.delta}%` : `${gain.delta}%`}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onOpenRetakeModal}
              className="px-4 py-2 rounded-xl bg-white dark:bg-white/10 hover:bg-[#EBF2F0] dark:hover:bg-white/20 border border-[#E3ECEA] dark:border-white/15 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#00BFA5]" />
              <span>Retake Evaluation</span>
            </button>
          </div>
        </div>
      ) : (
        /* Case 2: Single Baseline Attempt (Encourage Retake) */
        <div className="p-5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                  Initial Baseline Established ({totalAttempts} Attempt)
                </h4>
              </div>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                Retaking the assessment at your next milestone unlocks longitudinal side-by-side growth tracking, measuring cognitive gains and evolving interests.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onOpenRetakeModal}
              className="px-4 py-2 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all shadow-sm shadow-[#00BFA5]/20 flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Begin Retake Assessment</span>
            </button>

            <Link
              href="/participant/assessments/history"
              className="px-4 py-2 rounded-xl bg-white dark:bg-white/10 hover:bg-[#EBF2F0] dark:hover:bg-white/20 border border-[#E3ECEA] dark:border-white/15 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] transition-all flex items-center gap-2"
            >
              <History className="w-3.5 h-3.5 text-[#00B8D4]" />
              <span>View History Ledger</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

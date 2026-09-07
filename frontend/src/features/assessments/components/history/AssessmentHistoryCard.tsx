import React from "react";
import Link from "next/link";
import { AssessmentHistoryItem } from "../../types/assessment.types";
import { Calendar, Award, CheckCircle2, ArrowRight, GitCompare, ShieldCheck } from "lucide-react";

interface AssessmentHistoryCardProps {
  item: AssessmentHistoryItem;
  isLatest?: boolean;
  onCompareWithLatest?: (attemptId: string, resultId: string) => void;
}

export function AssessmentHistoryCard({
  item,
  isLatest = false,
  onCompareWithLatest,
}: AssessmentHistoryCardProps) {
  const formattedDate = item.completedDate
    ? new Date(item.completedDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Completed";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between ${
        isLatest
          ? "bg-gradient-to-br from-[#00BFA5]/5 via-white to-white dark:from-[#00BFA5]/10 dark:via-[#172B2A] dark:to-[#172B2A] border-[#00BFA5]/50 shadow-sm"
          : "bg-white dark:bg-[#172B2A] border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] hover:border-[#00BFA5]/40 shadow-xs dark:shadow-none"
      }`}
    >
      <div>
        {/* Attempt Badge & Date */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                isLatest
                  ? "bg-[#00BFA5] text-[#172B2A] shadow-sm shadow-[#00BFA5]/20"
                  : "bg-[#EBF2F0] dark:bg-white/5 text-[#526866] dark:text-[#9FB3B0] border border-[#E3ECEA] dark:border-white/10"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Attempt #{item.attemptNumber}</span>
            </span>

            {isLatest && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/25">
                Current / Latest
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#728B88] dark:text-[#7D9491]">
            <Calendar className="w-3.5 h-3.5 text-[#00B8D4]" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-1.5 mb-4">
          <h3 className="text-base sm:text-lg font-black text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#00BFA5]" />
            <span>{item.profileType || "Skill Finder Profile"}</span>
          </h3>

          {item.summary && (
            <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed line-clamp-2">
              {item.summary}
            </p>
          )}

          {/* Profile Confidence Badge */}
          {item.profileConfidence && (
            <div className="pt-1.5 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Confidence: {item.profileConfidence}</span>
              </span>
            </div>
          )}
        </div>

        {/* Dimension Snapshot Pills if available */}
        {item.dimensionSummary && typeof item.dimensionSummary === "object" && (
          <div className="p-3 rounded-2xl bg-[#F7FAF9] dark:bg-[#0D1C1B]/80 border border-[#E3ECEA] dark:border-white/10 mb-4">
            <span className="text-[10px] font-extrabold text-[#728B88] dark:text-[#7D9491] uppercase tracking-wider block mb-2">
              Construct Highlights
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              {item.dimensionSummary.archetypeTitle && (
                <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#172B2A] text-[#172B2A] dark:text-[#F7FAF9] font-bold border border-[#E3ECEA] dark:border-white/10 text-[11px]">
                  {item.dimensionSummary.archetypeTitle}
                </span>
              )}
              {item.dimensionSummary.topInterestCluster && (
                <span className="px-2.5 py-1 rounded-xl bg-[#00BFA5]/10 text-[#008F83] dark:text-[#00BFA5] font-bold border border-[#00BFA5]/20 text-[11px]">
                  {item.dimensionSummary.topInterestCluster}
                </span>
              )}
              {item.dimensionSummary.topSkill && (
                <span className="px-2.5 py-1 rounded-xl bg-[#00B8D4]/10 text-[#008F83] dark:text-[#00B8D4] font-bold border border-[#00B8D4]/20 text-[11px]">
                  {item.dimensionSummary.topSkill}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)]">
        <Link
          href={`/participant/results/${item.attemptId}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EBF2F0] hover:bg-[#E3ECEA] dark:bg-white/5 dark:hover:bg-white/10 border border-[#E3ECEA] dark:border-white/15 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] transition-all"
        >
          <span>View Report</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#00BFA5]" />
        </Link>

        {onCompareWithLatest && !isLatest && (
          <button
            type="button"
            onClick={() => onCompareWithLatest(item.attemptId, item.resultId)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00BFA5]/10 hover:bg-[#00BFA5]/20 border border-[#00BFA5]/30 text-xs font-bold text-[#008F83] dark:text-[#00BFA5] transition-all cursor-pointer"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare with Latest</span>
          </button>
        )}
      </div>
    </div>
  );
}

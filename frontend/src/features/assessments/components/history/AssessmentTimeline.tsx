import React from "react";
import Link from "next/link";
import { AssessmentHistoryItem } from "../../types/assessment.types";
import { CheckCircle2, Award, Calendar, ArrowRight, TrendingUp } from "lucide-react";

interface AssessmentTimelineProps {
  history: AssessmentHistoryItem[];
  onSelectAttempt?: (item: AssessmentHistoryItem) => void;
}

export function AssessmentTimeline({ history, onSelectAttempt }: AssessmentTimelineProps) {
  if (!history || history.length === 0) {
    return null;
  }

  // Sort ascending by attempt number or completed date for chronological journey
  const sortedHistory = [...history].sort(
    (a, b) => (a.attemptNumber || 0) - (b.attemptNumber || 0)
  );

  return (
    <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-[#00BFA5] via-[#00B8D4] to-[#E3ECEA] dark:to-white/10">
      {sortedHistory.map((item, idx) => {
        const isLatest = idx === sortedHistory.length - 1;
        const formattedDate = item.completedDate
          ? new Date(item.completedDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Completed";

        return (
          <div key={item.historyId || item.attemptId} className="relative group">
            {/* Timeline Node Icon */}
            <div
              className={`absolute -left-6 sm:-left-8 top-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition-transform duration-200 group-hover:scale-110 ${
                isLatest
                  ? "bg-[#00BFA5] border-white dark:border-[#172B2A] text-[#172B2A] shadow-md shadow-[#00BFA5]/30"
                  : "bg-white dark:bg-[#172B2A] border-[#E3ECEA] dark:border-white/20 text-[#526866] dark:text-[#9FB3B0]"
              }`}
            >
              {isLatest ? (
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </div>

            {/* Timeline Card */}
            <div
              className={`rounded-3xl border p-5 sm:p-6 transition-all duration-200 ${
                isLatest
                  ? "bg-white dark:bg-[#172B2A] border-[#00BFA5]/50 shadow-sm"
                  : "bg-[#F7FAF9] dark:bg-[#0D1C1B]/60 border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)] hover:bg-white dark:hover:bg-[#172B2A] hover:border-[#00BFA5]/30"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#008F83] dark:text-[#00BFA5] uppercase tracking-wider">
                    Milestone {item.attemptNumber}
                  </span>
                  {isLatest && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/25">
                      Latest Evaluation
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#728B88] dark:text-[#7D9491]">
                  <Calendar className="w-3.5 h-3.5 text-[#00B8D4]" />
                  <span>{formattedDate}</span>
                </div>
              </div>

              <h4 className="text-sm sm:text-base font-black text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-2">
                <Award className="w-4 h-4 text-[#00BFA5]" />
                <span>{item.profileType || "Standard Evaluation"}</span>
              </h4>

              {item.summary && (
                <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-1.5 leading-relaxed line-clamp-2">
                  {item.summary}
                </p>
              )}

              <div className="mt-4 pt-3.5 border-t border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)] flex items-center justify-between">
                <Link
                  href={`/participant/results/${item.attemptId}`}
                  className="text-xs font-bold text-[#008F83] dark:text-[#00BFA5] hover:underline flex items-center gap-1"
                >
                  <span>Explore Evaluation Snapshot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {onSelectAttempt && (
                  <button
                    type="button"
                    onClick={() => onSelectAttempt(item)}
                    className="text-xs font-semibold text-[#728B88] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] transition-colors cursor-pointer"
                  >
                    Select for Compare
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

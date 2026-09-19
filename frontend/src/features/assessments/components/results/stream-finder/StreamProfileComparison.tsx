"use client";

import React from "react";
import { BarChart3, Info, Sparkles, Scale } from "lucide-react";
import { StreamFinderResult, StreamName, StreamScoreItem } from "../../../types/assessment.types";

interface StreamProfileComparisonProps {
  result: StreamFinderResult;
}

const STREAM_COLORS: Record<StreamName, { color: string; border: string; bg: string }> = {
  Science: { color: "#00BFA5", border: "border-[#00BFA5]/40", bg: "bg-[#00BFA5]" },
  Commerce: { color: "#38BDF8", border: "border-[#38BDF8]/40", bg: "bg-[#38BDF8]" },
  Humanities: { color: "#F59E0B", border: "border-[#F59E0B]/40", bg: "bg-[#F59E0B]" },
  "Applied / Technical": { color: "#EC4899", border: "border-[#EC4899]/40", bg: "bg-[#EC4899]" },
};

export const StreamProfileComparison: React.FC<StreamProfileComparisonProps> = ({ result }) => {
  const sorted = result.sortedStreams || [];
  const topScore = sorted[0]?.displayPercentage || 0;
  const secondScore = sorted[1]?.displayPercentage || 0;
  const thirdScore = sorted[2]?.displayPercentage || 0;

  // Check if scores are close
  const topTwoClose = Math.abs(topScore - secondScore) <= 8;
  const topThreeClose = Math.abs(topScore - thirdScore) <= 8;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0B1B19] via-[#112926] to-[#0A1615] border border-[#00BFA5]/30 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden print:p-5 print:rounded-2xl print:bg-none print:bg-white print:text-[#172B2A] print:border-[#E3ECEA]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5 mb-6 print:border-[#E3ECEA] print:pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5 print:text-[#008F83]">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>02. Stream Profile Comparison</span>
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight print:text-[#172B2A]">
            4-Stream Affinity Spectrum
          </h3>
          <p className="text-xs sm:text-sm text-[#9FB3B0] max-w-xl leading-relaxed print:text-[#526866]">
            Comparative overview across all four senior secondary streams. Percentages reflect your relative alignment score.
          </p>
        </div>

        {/* Close Score Balancing Badge */}
        {topTwoClose && (
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-1.5 self-start sm:self-auto print:border-amber-300 print:text-amber-800 print:bg-amber-50">
            <Scale className="w-3.5 h-3.5 shrink-0" />
            <span className="font-bold">Balanced Multi-Stream Leaning</span>
          </div>
        )}
      </div>

      {/* 4 Stream Progress Bars */}
      <div className="space-y-4 relative z-10">
        {sorted.map((item, idx) => {
          const style = STREAM_COLORS[item.stream] || STREAM_COLORS.Science;
          const isTop = idx === 0;

          return (
            <div
              key={item.stream}
              className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A] print:p-3"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: style.color }}
                  />
                  <h4 className="text-sm sm:text-base font-black text-white print:text-[#172B2A]">
                    {item.stream}
                  </h4>
                  {isTop && (
                    <span className="text-[10px] font-black uppercase px-2 py-0.2 rounded-full bg-[#00BFA5]/20 text-[#00C896] border border-[#00BFA5]/30 print:border-[#00BFA5] print:text-[#008F83]">
                      Primary Leaning
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/50 font-medium print:text-[#688582]">
                    {item.alignment}
                  </span>
                  <span className="text-base sm:text-lg font-mono font-black text-white print:text-[#172B2A]">
                    {item.displayPercentage}%
                  </span>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden print:bg-[#E3ECEA]">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.max(item.displayPercentage, 4)}%`,
                    backgroundColor: style.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Balanced Interpretation Callout */}
      {topTwoClose && (
        <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5 relative z-10 print:bg-amber-50 print:border-amber-200 print:text-amber-900">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Interpreting Close Scores:</strong>{" "}
            {topThreeClose
              ? "Your top three streams show relatively similar alignment. Exploring all three may help you make a more informed academic decision without artificially narrowing your options."
              : "Your top two streams are within a close score margin. Both represent genuine academic affinities that can be pursued directly or combined through interdisciplinary subject electives."}
          </div>
        </div>
      )}
    </div>
  );
};

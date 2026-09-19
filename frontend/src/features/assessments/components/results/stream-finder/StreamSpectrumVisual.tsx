"use client";

import React from "react";
import { BarChart3, Info, Scale } from "lucide-react";
import { StreamFinderResult, StreamName } from "../../../types/assessment.types";

interface StreamSpectrumVisualProps {
  result: StreamFinderResult;
}

const STREAM_SPECTRUM_CONFIG: Record<
  StreamName,
  {
    themeColor: string;
    focus: string;
    summary: string;
  }
> = {
  Science: {
    themeColor: "#00BFA5",
    focus: "Analytical Reasoning",
    summary: "Empirical inquiry, mathematics, technological systems & physical principles.",
  },
  Commerce: {
    themeColor: "#38BDF8",
    focus: "Enterprise Dynamics",
    summary: "Market economics, financial analytics, business systems & organizational management.",
  },
  Humanities: {
    themeColor: "#F59E0B",
    focus: "Social & Critical Thought",
    summary: "Verbal interpretation, social structures, human behaviour, history & policy inquiry.",
  },
  "Applied / Technical": {
    themeColor: "#EC4899",
    focus: "Practical Innovation",
    summary: "Functional design, hands-on prototyping, digital tools & applied execution.",
  },
};

export const StreamSpectrumVisual: React.FC<StreamSpectrumVisualProps> = ({ result }) => {
  const sorted = result.sortedStreams || [];
  const topScore = sorted[0]?.displayPercentage || 0;
  const secondScore = sorted[1]?.displayPercentage || 0;
  const isCloseGap = Math.abs(topScore - secondScore) <= 8;

  // Determine tie labels safely without arbitrary rank bias
  const getRankBadge = (idx: number, currentItem: (typeof sorted)[0]) => {
    const isTiedWithPrev = idx > 0 && sorted[idx - 1].displayPercentage === currentItem.displayPercentage;
    const isTiedWithNext = idx < sorted.length - 1 && sorted[idx + 1].displayPercentage === currentItem.displayPercentage;
    const isTied = isTiedWithPrev || isTiedWithNext;

    if (idx === 0) {
      return isTied ? "★ Primary (Tied)" : "★ Primary Alignment";
    }
    if (idx === 1) {
      if (isTiedWithPrev) return "★ Primary (Tied)";
      return isTied ? "✦ Close Alignment (Tied)" : "✦ Close Alignment";
    }
    if (isCloseGap && Math.abs(topScore - currentItem.displayPercentage) <= 8) {
      return isTied ? "✦ Close Alignment (Tied)" : "✦ Close Alignment";
    }
    return isTied ? `Relative Tier (Tied)` : `Rank #0${idx + 1}`;
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0B1B19] via-[#112926] to-[#0A1615] border border-[#00BFA5]/30 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden print:p-5 print:rounded-2xl print:bg-none print:bg-white print:text-[#172B2A] print:border-[#E3ECEA] flex flex-col justify-between space-y-4 print:space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3 print:border-[#E3ECEA] print:pb-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5 print:text-[#008F83]">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>02. Stream Profile Comparison</span>
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight print:text-[#172B2A]">
            The 4-Stream Affinity Spectrum
          </h3>
          <p className="text-xs text-[#9FB3B0] max-w-xl leading-relaxed print:text-[#526866]">
            Visual distribution of your relative psychometric alignment across all four senior secondary disciplines.
          </p>
        </div>

        {isCloseGap ? (
          <div className="px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-1.5 self-start sm:self-auto print:border-amber-300 print:text-amber-800 print:bg-amber-50">
            <Scale className="w-3.5 h-3.5 shrink-0" />
            <span className="font-bold">Balanced Leaning (Gap ≤ 8%)</span>
          </div>
        ) : (
          <div className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 self-start sm:self-auto print:border-[#E3ECEA] print:text-[#526866]">
            <span className="font-mono text-[11px]">Top Gap: +{result.scoreGapPercentage}%</span>
          </div>
        )}
      </div>

      {/* 4 Vertical Spectrum Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
        {sorted.map((item, idx) => {
          const config = STREAM_SPECTRUM_CONFIG[item.stream] || STREAM_SPECTRUM_CONFIG.Science;
          const isPrimary = idx === 0;
          const isSecondary = idx === 1;
          const rankLabel = getRankBadge(idx, item);

          return (
            <div
              key={item.stream}
              className={`rounded-2xl p-4 border transition-all flex flex-col justify-between relative overflow-hidden ${
                isPrimary
                  ? "bg-gradient-to-b from-[#00BFA5]/20 via-white/[0.04] to-transparent border-[#00BFA5] shadow-lg shadow-[#00BFA5]/15 print:bg-emerald-50/50 print:border-[#00BFA5]"
                  : isSecondary
                  ? "bg-gradient-to-b from-sky-500/15 via-white/[0.03] to-transparent border-sky-400/50 print:bg-sky-50/50 print:border-sky-300"
                  : "bg-white/[0.02] border-white/10 print:bg-[#F7FAF9] print:border-[#E3ECEA]"
              } print:text-[#172B2A] print:p-3`}
            >
              <div>
                {/* Top Rank Badge */}
                <div className="flex items-center justify-between gap-1.5 mb-2">
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      isPrimary
                        ? "bg-[#00BFA5]/25 text-[#00C896] border-[#00BFA5]/50 print:text-[#008F83] print:border-[#00BFA5]"
                        : isSecondary
                        ? "bg-sky-500/20 text-sky-300 border-sky-500/40 print:text-[#0284C7] print:border-sky-300"
                        : "bg-white/10 text-white/50 border-white/15 print:text-[#688582] print:border-[#E3ECEA]"
                    }`}
                  >
                    {rankLabel}
                  </span>
                  <span className="text-[9px] font-mono text-white/40 uppercase truncate print:text-[#688582]">
                    {config.focus}
                  </span>
                </div>

                <h4 className="text-base font-black text-white tracking-tight mb-1 print:text-[#172B2A]">
                  {item.stream}
                </h4>

                {/* Score & Progress */}
                <div className="my-2 space-y-1">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black font-mono" style={{ color: config.themeColor }}>
                        {item.displayPercentage}%
                      </span>
                      <span className="text-[8.5px] font-bold text-white/50 uppercase tracking-tight print:text-[#688582]">
                        Relative
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-white/60 print:text-[#526866]">
                      {item.alignment}
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden print:bg-[#E3ECEA]">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.max(item.displayPercentage, 6)}%`,
                        backgroundColor: config.themeColor,
                      }}
                    />
                  </div>
                </div>

                <p className="text-[11px] text-[#C5D6D3] leading-relaxed pt-1 print:text-[#415654]">
                  {config.summary}
                </p>
              </div>

              {/* Trait vs Choice point breakdown */}
              <div className="mt-2.5 pt-2 border-t border-white/5 text-[9px] font-mono text-white/50 flex justify-between print:border-[#E3ECEA] print:text-[#688582]">
                <span>Trait: {item.traitPoints}/{item.maxTraitPoints}</span>
                <span>Choice: {item.choicePoints}/{item.maxChoicePoints}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* "How to read this" Guide */}
      <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5 relative z-10 print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A]">
        <Info className="w-4 h-4 text-[#00BFA5] shrink-0 mt-0.5 print:text-[#008F83]" />
        <div className="text-[11px] text-[#9FB3B0] leading-relaxed space-y-0.5 print:text-[#526866]">
          <strong className="text-white print:text-[#172B2A]">How to read these scores:</strong>{" "}
          Percentages represent relative alignment across academic disciplines based on your responses. They are not examination percentages, GPA, IQ metrics, or admission probabilities. If two streams are within 8% of each other, both represent viable complementary directions.
        </div>
      </div>
    </div>
  );
};

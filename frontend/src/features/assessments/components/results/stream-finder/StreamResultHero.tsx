"use client";

import React from "react";
import { Sparkles, Award, ArrowUpRight, Compass, CheckCircle2 } from "lucide-react";
import { StreamFinderResult, StreamName } from "../../../types/assessment.types";

interface StreamResultHeroProps {
  result: StreamFinderResult;
}

const STREAM_DESCRIPTIONS: Record<StreamName, string> = {
  Science:
    "Your responses show relatively stronger alignment with analytical inquiry, empirical problem solving, and understanding natural and technological systems.",
  Commerce:
    "Your responses show relatively stronger alignment with commercial systems, quantitative decision-making, enterprise dynamics, and market economics.",
  Humanities:
    "Your responses show relatively stronger alignment with verbal, social, interpretive, and human-centric understanding of society, culture, and behaviour.",
  "Applied / Technical":
    "Your responses show relatively stronger alignment with hands-on experimentation, functional design, practical problem solving, and direct real-world application.",
};

export const StreamResultHero: React.FC<StreamResultHeroProps> = ({ result }) => {
  const primaryStream = result.primaryStream || "Science";
  const secondaryStream = result.secondaryStream || "Commerce";
  const explanation =
    result.counsellingSummary ||
    STREAM_DESCRIPTIONS[primaryStream] ||
    "Your responses indicate a distinct learning preference aligned with this academic discipline.";

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0B1B19] via-[#112926] to-[#0A1615] border border-[#00BFA5]/30 p-6 sm:p-9 text-white shadow-2xl relative overflow-hidden print:p-5 print:rounded-2xl print:bg-none print:bg-white print:text-[#172B2A] print:border-[#E3ECEA]">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#00BFA5]/15 blur-3xl print:hidden" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-[#38BDF8]/10 blur-3xl print:hidden" />

      <div className="relative z-10 space-y-6">
        {/* Section Label */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4 print:border-[#E3ECEA] print:pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5 print:text-[#008F83]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>01. Your Result • Academic Direction</span>
            </span>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/15 print:border-[#E3ECEA] print:text-[#526866]">
            Exploratory Alignment
          </span>
        </div>

        {/* Primary Stream Showcase */}
        <div className="space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-[#00BFA5] font-mono block print:text-[#008F83]">
            Primary Academic Leaning
          </span>
          <div className="flex flex-wrap items-baseline gap-4">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight print:text-[#172B2A]">
              {primaryStream}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black font-mono text-[#00C896] bg-[#00BFA5]/15 px-3 py-0.5 rounded-2xl border border-[#00BFA5]/30 print:text-[#008F83] print:bg-emerald-50">
                {result.primaryDisplayPercentage}%
              </span>
              <span className="text-xs font-bold text-white/70 print:text-[#526866]">
                • {result.primaryAlignment}
              </span>
            </div>
          </div>

          {/* Dynamic Non-Deterministic Explanation */}
          <p className="text-sm sm:text-base text-[#C5D6D3] max-w-3xl leading-relaxed pt-1 print:text-[#415654]">
            {explanation}
          </p>
        </div>

        {/* Secondary Complementary Stream Banner */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block print:text-[#688582]">
              Secondary Complementary Option
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-base font-black text-white print:text-[#172B2A]">
                {secondaryStream}
              </span>
              <span className="text-xs font-mono font-bold text-[#38BDF8] print:text-[#0284C7]">
                ({result.secondaryDisplayPercentage}%)
              </span>
              <span className="text-xs text-white/60 print:text-[#526866]">
                • {result.secondaryAlignment}
              </span>
            </div>
          </div>

          <div className="text-xs text-[#9FB3B0] max-w-xs leading-snug print:text-[#526866]">
            {result.scoreGapPercentage < 8 ? (
              <span className="text-amber-300 font-bold print:text-amber-700">
                Dual-affinity profile (Gap &lt; 8%). Both streams provide strong academic synergy.
              </span>
            ) : (
              <span>
                Clear primary preference (+{result.scoreGapPercentage}% advantage). Keep {secondaryStream} as a viable elective or backup.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

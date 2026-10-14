"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowUpRight, Scale, Info, Compass, CheckCircle2, Zap, Layers, ArrowRight, Loader2 } from "lucide-react";
import { StreamFinderResult, StreamName } from "../../../types/assessment.types";
import { assessmentApi } from "../../../api/assessment.api";

interface StreamResultHeroCardProps {
  result: StreamFinderResult;
}

const STREAM_DESCRIPTIONS: Record<StreamName, string> = {
  Science:
    "Your responses show relatively stronger alignment with analytical inquiry, empirical problem solving, and understanding natural, physical, and computational systems.",
  Commerce:
    "Your responses show relatively stronger alignment with commercial systems, quantitative decision-making, enterprise dynamics, and market economics.",
  Humanities:
    "Your responses show relatively stronger alignment with verbal, social, interpretive, and human-centric understanding of society, culture, history, and behaviour.",
  "Applied / Technical":
    "Your responses show relatively stronger alignment with hands-on experimentation, functional design, practical problem solving, and direct real-world application.",
};

export const StreamResultHeroCard: React.FC<StreamResultHeroCardProps> = ({ result }) => {
  const router = useRouter();
  const [isExtending, setIsExtending] = useState(false);
  const [extendError, setExtendError] = useState<string | null>(null);

  const primaryStream = result.primaryStream || "Science";
  const secondaryStream = result.secondaryStream || "Commerce";
  const explanation =
    result.counsellingSummary ||
    STREAM_DESCRIPTIONS[primaryStream] ||
    "Your responses indicate a distinct learning preference aligned with this academic discipline.";

  const isCloseScore = result.scoreGapPercentage <= 8;

  const handleExtendAssessment = async () => {
    try {
      setIsExtending(true);
      setExtendError(null);
      const res = await assessmentApi.startStreamFinderExtension(result.attemptId);
      if (res?.attemptId) {
        router.push(`/participant/assessments/${res.attemptId}`);
      }
    } catch (err: any) {
      console.error("Failed to start extension assessment:", err);
      setExtendError(err.message || "Failed to start extension assessment. Please try again.");
      setIsExtending(false);
    }
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0D2421] via-[#102B28] to-[#0A1615] border-2 border-[#00BFA5]/40 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden print:p-5 print:rounded-2xl print:bg-none print:bg-white print:text-[#172B2A] print:border-[#00BFA5] flex flex-col justify-between space-y-4 print:space-y-3">
      {/* Glow background (screen only) */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#00BFA5]/20 blur-3xl print:hidden" />

      <div className="relative z-10 space-y-4 print:space-y-3">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 print:border-[#E3ECEA] print:pb-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5 print:text-[#008F83]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>01. Your Result • Strongest Academic Alignment</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/15 print:border-[#E3ECEA] print:text-[#526866]">
              {result.assessmentMode === "CORE"
                ? "Core Form • 48 Questions"
                : result.assessmentMode === "EXTENDED"
                ? "Extended Battery • 80 Questions"
                : "80 Questions"}
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/15 print:border-[#E3ECEA] print:text-[#526866]">
              Relative Alignment Profile
            </span>
          </div>
        </div>

        {/* Primary Result Headline */}
        <div className="space-y-2.5 print:space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#00C896] block print:text-[#008F83]">
            YOUR PRIMARY DIRECTION
          </span>

          <div className="flex flex-wrap items-baseline gap-3 sm:gap-5">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight print:text-[#172B2A]">
              {primaryStream}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-mono font-black text-[#00C896] bg-[#00BFA5]/20 px-3 py-0.5 rounded-xl border border-[#00BFA5]/40 print:text-[#008F83] print:bg-emerald-50 print:border-[#00BFA5]">
                {result.primaryDisplayPercentage}%
              </span>
              <span className="text-xs font-bold text-white/80 uppercase tracking-wider print:text-[#526866]">
                • {result.primaryAlignment} (Relative Alignment)
              </span>
            </div>
          </div>

          {/* "What this may mean" Narrative */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1 mt-1 print:bg-[#F7FAF9] print:border-[#E3ECEA]">
            <span className="text-[10.5px] font-black uppercase tracking-wider text-[#00BFA5] block print:text-[#008F83]">
              What this may mean:
            </span>
            <p className="text-xs sm:text-sm text-[#E0EBE8] leading-relaxed print:text-[#2A4442]">
              {explanation}
            </p>
          </div>
        </div>

        {/* Secondary "Also Explore" Synergy Banner */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A]">
          <div className="space-y-0.5">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#38BDF8] flex items-center gap-1 print:text-[#0284C7]">
              <ArrowUpRight className="w-3 h-3" />
              SECONDARY / COMPLEMENTARY ALIGNMENT
            </span>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black text-white print:text-[#172B2A]">
                {secondaryStream}
              </span>
              <span className="text-xs font-mono font-bold text-[#38BDF8] print:text-[#0284C7]">
                {result.secondaryDisplayPercentage}% Relative Alignment
              </span>
              <span className="text-xs text-white/60 print:text-[#526866]">
                • {result.secondaryAlignment}
              </span>
            </div>
          </div>

          <div className="text-xs text-[#9FB3B0] max-w-sm leading-snug sm:text-right print:text-[#526866] print:text-left">
            {isCloseScore ? (
              <div className="flex items-start sm:justify-end gap-1 text-amber-300 font-semibold print:text-amber-800">
                <Scale className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Dual-affinity profile (Gap ≤ 8%). Both streams provide strong synergy.</span>
              </div>
            ) : (
              <span>
                Clear primary preference (+{result.scoreGapPercentage}% advantage). Retain {secondaryStream} as an elective or complementary option.
              </span>
            )}
          </div>
        </div>

        {/* Strategic Guidance Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5 print:bg-[#F7FAF9] print:border-[#E3ECEA]">
            <div className="flex items-center gap-1.5 text-[#00C896] text-[10.5px] font-bold print:text-[#008F83]">
              <Zap className="w-3 h-3" />
              <span>Recommended Next Subject Step</span>
            </div>
            <p className="text-[11px] text-[#C5D6D3] leading-snug print:text-[#526866]">
              Review the detailed Class 11–12 curriculum syllabus for <strong>{primaryStream}</strong> and compare introductory topics against your current interests.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5 print:bg-[#F7FAF9] print:border-[#E3ECEA]">
            <div className="flex items-center gap-1.5 text-[#38BDF8] text-[10.5px] font-bold print:text-[#0284C7]">
              <Compass className="w-3 h-3" />
              <span>Interdisciplinary Flexibility</span>
            </div>
            <p className="text-[11px] text-[#C5D6D3] leading-snug print:text-[#526866]">
              Under modern education boards (CBSE, ISC, IB), you can frequently combine <strong>{primaryStream}</strong> with elective subjects from <strong>{secondaryStream}</strong>.
            </p>
          </div>
        </div>

        {/* Stage 2 Extension Banner / Callout */}
        {result.assessmentMode === "CORE" && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#00BFA5]/15 via-[#008F83]/10 to-white/[0.02] border border-[#00BFA5]/40 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#00BFA5]/20 text-[#00C896] border border-[#00BFA5]/30">
                  Stage 2 • Extended Diagnostic
                </span>
                {result.extensionRecommended && (
                  <span className="text-[10px] font-bold text-amber-300">
                    Recommended for your profile
                  </span>
                )}
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Gather 32 Additional Evidence Questions
              </h3>
              <p className="text-xs text-[#C5D6D3] max-w-xl leading-relaxed">
                You have completed the 48-item Core Form. To gain higher resolution between your top streams, take the 32 extension questions without retaking the assessment from scratch.
              </p>
              {extendError && (
                <p className="text-xs text-rose-400 font-semibold">{extendError}</p>
              )}
            </div>

            <button
              type="button"
              disabled={isExtending}
              onClick={handleExtendAssessment}
              className="px-4 py-2.5 rounded-xl bg-[#00BFA5] hover:bg-[#00d8bc] text-[#0A1615] font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#00BFA5]/20 shrink-0 cursor-pointer disabled:opacity-50"
            >
              {isExtending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Launching...</span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  <span>Start 32 Extension Items</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        )}

        {result.assessmentMode === "EXTENDED" && (
          <div className="p-3 sm:p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs text-emerald-200 print:text-[#172B2A] print:bg-emerald-50 print:border-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00C896] shrink-0" />
              <span>
                <strong>Comprehensive Profile:</strong> Scored across the full 80-question battery (48 Core + 32 Extension items).
              </span>
            </div>
            <span className="text-[10.5px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/90 border border-white/15 shrink-0 print:border-[#E3ECEA] print:text-[#526866]">
              80 / 80 Evidence Points
            </span>
          </div>
        )}
      </div>

      {/* Non-Prescriptive Educational Safeguard Footer */}
      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] text-[#9FB3B0] leading-snug flex items-center gap-2 print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#526866] print:p-2.5">
        <Info className="w-3.5 h-3.5 text-[#00BFA5] shrink-0 print:text-[#008F83]" />
        <span>
          <strong>Methodological Note:</strong> Stream Finder provides exploratory orientation based on current interests and problem-solving habits. It is non-prescriptive and should be evaluated in consultation with school performance and career counsellors.
        </span>
      </div>
    </div>
  );
};

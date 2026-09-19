"use client";

import React from "react";
import { Sparkles, Compass, ShieldCheck, User, Calendar, GraduationCap, ArrowUpRight, Scale, Info } from "lucide-react";
import { StreamFinderResult, StreamName } from "../../../types/assessment.types";
import { useParticipantProfileQuery } from "@/features/participants/hooks/useParticipantProfileQuery";
import { formatFullAssessmentDate } from "@/lib/date.utils";

interface StreamCoverHeroProps {
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

export const StreamCoverHero: React.FC<StreamCoverHeroProps> = ({ result }) => {
  const { data: profileData } = useParticipantProfileQuery();
  const profile = profileData?.data;

  // Student name extraction with graceful fallback
  const studentName = profile?.firstName
    ? `${profile.firstName} ${profile.lastName || ""}`.trim()
    : "Student";

  const gradeLevel = profile?.gradeLevel ? `Class ${profile.gradeLevel}` : "Class 9–10";

  // Robust date formatting
  const formattedDate = formatFullAssessmentDate(result.completedAt || (result as any).createdAt);

  const primaryStream = result.primaryStream || "Science";
  const secondaryStream = result.secondaryStream || "Commerce";
  const explanation =
    result.counsellingSummary ||
    STREAM_DESCRIPTIONS[primaryStream] ||
    "Your responses indicate a distinct learning preference aligned with this academic discipline.";

  const isCloseScore = result.scoreGapPercentage <= 8;

  return (
    <div className="space-y-6">
      {/* 1. Report Cover Header Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0B1B19] via-[#112926] to-[#0A1615] border border-[#00BFA5]/30 p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden print:p-6 print:rounded-2xl print:bg-none print:bg-white print:text-[#172B2A] print:border-[#E3ECEA]">
        {/* Subtle geometric SVG backdrop */}
        <div className="pointer-events-none absolute inset-0 opacity-15 overflow-hidden print:hidden">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" preserveAspectRatio="none">
            <defs>
              <radialGradient id="coverGlow" cx="70%" cy="30%" r="60%">
                <stop offset="0%" stopColor="#00BFA5" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00BFA5" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="700" cy="80" r="280" fill="url(#coverGlow)" />
            <path d="M 0,200 Q 250,50 500,200 T 1000,200" fill="none" stroke="#00BFA5" strokeWidth="1" strokeDasharray="6 6" />
            <path d="M 0,250 Q 300,100 600,250 T 1200,250" fill="none" stroke="#38BDF8" strokeWidth="0.8" opacity="0.6" />
            <circle cx="250" cy="125" r="4" fill="#00C896" />
            <circle cx="500" cy="200" r="5" fill="#38BDF8" />
            <circle cx="650" cy="180" r="4" fill="#F59E0B" />
          </svg>
        </div>

        <div className="relative z-10 space-y-6 sm:space-y-8">
          {/* Top Brand Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5 print:border-[#E3ECEA] print:pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-[#00BFA5]/20 text-[#00C896] border border-[#00BFA5]/30 flex items-center gap-1.5 print:border-[#00BFA5] print:text-[#008F83]">
                <Compass className="w-3.5 h-3.5" />
                <span>3G ME LIFE • STREAM FINDER</span>
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 print:border-[#00BFA5] print:text-[#008F83]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Psychometric Evaluation</span>
              </span>
            </div>
            <span className="text-xs font-mono text-white/50 print:text-[#688582]">
              ID: {result.resultId?.slice(0, 10) || "SF-2026"}
            </span>
          </div>

          {/* Title & Core Philosophy */}
          <div className="space-y-3 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00BFA5] print:text-[#008F83]">
              Senior Secondary Academic Discovery Report
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight print:text-[#172B2A]">
              Understanding where your interests, thinking style and learning preferences fit.
            </h1>
            <p className="text-sm sm:text-base text-[#9FB3B0] leading-relaxed print:text-[#526866]">
              A non-prescriptive discovery framework mapping your natural cognitive inclinations across Senior Secondary (Class 11–12) academic pathways.
            </p>
          </div>

          {/* Student Profile Metadata Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A]">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider flex items-center gap-1 print:text-[#688582]">
                <User className="w-3 h-3 text-[#00BFA5]" />
                Student Name
              </span>
              <p className="text-sm sm:text-base font-black text-white truncate print:text-[#172B2A]">
                {studentName}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider flex items-center gap-1 print:text-[#688582]">
                <GraduationCap className="w-3 h-3 text-[#38BDF8]" />
                Class / Stage
              </span>
              <p className="text-sm sm:text-base font-black text-white print:text-[#172B2A]">
                {gradeLevel}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider flex items-center gap-1 print:text-[#688582]">
                <Compass className="w-3 h-3 text-[#F59E0B]" />
                Assessment
              </span>
              <p className="text-sm sm:text-base font-black text-white truncate print:text-[#172B2A]">
                Senior Secondary Exploration
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider flex items-center gap-1 print:text-[#688582]">
                <Calendar className="w-3 h-3 text-[#00C896]" />
                Evaluation Date
              </span>
              <p className="text-sm sm:text-base font-black text-white truncate print:text-[#172B2A]">
                {formattedDate}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. "Your Result" Hero Showcase Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0D2421] via-[#102B28] to-[#0A1615] border-2 border-[#00BFA5]/40 p-6 sm:p-9 text-white shadow-2xl relative overflow-hidden print:p-5 print:rounded-2xl print:bg-none print:bg-white print:text-[#172B2A] print:border-[#00BFA5]">
        {/* Glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#00BFA5]/20 blur-3xl print:hidden" />

        <div className="relative z-10 space-y-6">
          {/* Section Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 print:border-[#E3ECEA] print:pb-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5 print:text-[#008F83]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>01. Your Strongest Alignment</span>
            </span>
            <span className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/15 print:border-[#E3ECEA] print:text-[#526866]">
              Psychometric Leaning
            </span>
          </div>

          {/* Primary Result Headline */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00C896] block print:text-[#008F83]">
              YOUR PRIMARY DIRECTION
            </span>

            <div className="flex flex-wrap items-baseline gap-4 sm:gap-6">
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight print:text-[#172B2A]">
                {primaryStream}
              </h2>
              <div className="flex items-center gap-2.5">
                <span className="text-3xl sm:text-4xl font-mono font-black text-[#00C896] bg-[#00BFA5]/20 px-3.5 py-1 rounded-2xl border border-[#00BFA5]/40 print:text-[#008F83] print:bg-emerald-50 print:border-[#00BFA5]">
                  {result.primaryDisplayPercentage}%
                </span>
                <span className="text-xs sm:text-sm font-bold text-white/80 uppercase tracking-wider print:text-[#526866]">
                  • {result.primaryAlignment}
                </span>
              </div>
            </div>

            {/* "What this may mean" Narrative */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 mt-2 print:bg-[#F7FAF9] print:border-[#E3ECEA]">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#00BFA5] block print:text-[#008F83]">
                What this may mean:
              </span>
              <p className="text-xs sm:text-sm text-[#E0EBE8] leading-relaxed print:text-[#2A4442]">
                {explanation}
              </p>
            </div>
          </div>

          {/* Secondary "Also Explore" Synergy Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A]">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] flex items-center gap-1 print:text-[#0284C7]">
                <ArrowUpRight className="w-3 h-3" />
                ALSO EXPLORE (Secondary Alignment)
              </span>
              <div className="flex items-center gap-2.5">
                <span className="text-lg sm:text-xl font-black text-white print:text-[#172B2A]">
                  {secondaryStream}
                </span>
                <span className="text-sm font-mono font-bold text-[#38BDF8] print:text-[#0284C7]">
                  {result.secondaryDisplayPercentage}%
                </span>
                <span className="text-xs text-white/60 print:text-[#526866]">
                  • {result.secondaryAlignment}
                </span>
              </div>
            </div>

            <div className="text-xs text-[#9FB3B0] max-w-sm leading-relaxed sm:text-right print:text-[#526866] print:text-left">
              {isCloseScore ? (
                <div className="flex items-start sm:justify-end gap-1.5 text-amber-300 font-semibold print:text-amber-800">
                  <Scale className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>Dual-affinity profile (Gap ≤ 8%). Both streams provide strong academic synergy.</span>
                </div>
              ) : (
                <span>
                  Clear primary leaning (+{result.scoreGapPercentage}% score gap). Retain {secondaryStream} for elective or interdisciplinary exploration.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

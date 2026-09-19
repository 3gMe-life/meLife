"use client";

import React from "react";
import { Zap, HelpCircle, ArrowRight } from "lucide-react";
import { StreamFinderResult } from "../../../types/assessment.types";
import Link from "next/link";

interface StreamOnePageSummaryProps {
  result: StreamFinderResult;
}

const HOW_TO_USE_STEPS = [
  { step: "01", title: "Discover", desc: "Identify your strongest primary alignment and natural learning inclinations." },
  { step: "02", title: "Compare", desc: "Examine score gaps, secondary affinities, and potential interdisciplinary options." },
  { step: "03", title: "Explore", desc: "Review syllabus requirements, degree programs, and potential career families." },
  { step: "04", title: "Validate", desc: "Check your school examination marks and prerequisite readiness with mentors." },
  { step: "05", title: "Discuss", desc: "Share these insights with your parents and an accredited educational counsellor." },
];

export const StreamOnePageSummary: React.FC<StreamOnePageSummaryProps> = ({ result }) => {
  const primaryStream = result.primaryStream || "Science";
  const secondaryStream = result.secondaryStream || "Commerce";
  const clusters = result.careerClusters || [];

  // Top career families
  const topCareerFamilies = Array.from(
    new Set(clusters.flatMap((c) => c.suggestedCareerFamilies))
  ).slice(0, 5);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0B1B19] via-[#102B28] to-[#0A1615] border-2 border-[#00BFA5]/40 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden print:p-5 print:rounded-2xl print:bg-none print:bg-white print:text-[#172B2A] print:border-[#00BFA5] flex flex-col justify-between space-y-4 print:space-y-3">
      {/* Background glow (screen only) */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#00BFA5]/15 blur-3xl print:hidden" />

      <div className="relative z-10 space-y-4 print:space-y-3">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3 print:border-[#E3ECEA] print:pb-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5 print:text-[#008F83]">
                <Zap className="w-3.5 h-3.5" />
                <span>08. Discovery Snapshot & User Guide</span>
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight print:text-[#172B2A]">
              Quick Discovery Snapshot
            </h3>
          </div>

          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 self-start sm:self-auto print:border-[#00BFA5] print:text-[#008F83]">
            Executive Discovery Brief
          </span>
        </div>

        {/* 4-Box Key Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Box 1: Primary Stream */}
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-[#00BFA5]/40 space-y-1.5 print:bg-[#F7FAF9] print:border-[#00BFA5] print:text-[#172B2A] print:p-2.5">
            <span className="text-[9.5px] font-mono font-bold uppercase text-[#00C896] block print:text-[#008F83]">
              01. Primary Leaning
            </span>
            <div className="flex items-baseline justify-between">
              <h4 className="text-base sm:text-lg font-black text-white print:text-[#172B2A]">
                {primaryStream}
              </h4>
              <span className="text-base font-mono font-bold text-[#00C896] print:text-[#008F83]">
                {result.primaryDisplayPercentage}%
              </span>
            </div>
            <span className="text-[10.5px] text-white/60 block print:text-[#526866]">
              {result.primaryAlignment}
            </span>
          </div>

          {/* Box 2: Secondary Stream */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5 print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A] print:p-2.5">
            <span className="text-[9.5px] font-mono font-bold uppercase text-[#38BDF8] block print:text-[#0284C7]">
              02. Complementary Path
            </span>
            <div className="flex items-baseline justify-between">
              <h4 className="text-base sm:text-lg font-black text-white print:text-[#172B2A]">
                {secondaryStream}
              </h4>
              <span className="text-base font-mono font-bold text-[#38BDF8] print:text-[#0284C7]">
                {result.secondaryDisplayPercentage}%
              </span>
            </div>
            <span className="text-[10.5px] text-white/60 block print:text-[#526866]">
              {result.secondaryAlignment}
            </span>
          </div>

          {/* Box 3: Top-Score Gap / Differentiation */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5 print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A] print:p-2.5">
            <span className="text-[9.5px] font-mono font-bold uppercase text-[#F59E0B] block print:text-[#B45309]">
              03. Profile Differentiation
            </span>
            <h4 className="text-base sm:text-lg font-black text-white print:text-[#172B2A]">
              {result.clarity}
            </h4>
            <span className="text-[10.5px] text-white/60 block print:text-[#526866]">
              +{result.scoreGapPercentage}% Score Gap Delta
            </span>
          </div>

          {/* Box 4: Next Action */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5 print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A] print:p-2.5">
            <span className="text-[9.5px] font-mono font-bold uppercase text-[#EC4899] block print:text-[#BE185D]">
              04. Recommended Action
            </span>
            <h4 className="text-sm sm:text-base font-black text-white print:text-[#172B2A]">
              Review Core Syllabi
            </h4>
            <span className="text-[10.5px] text-[#A7F3D0] block print:text-[#065F46]">
              Validate prerequisite marks
            </span>
          </div>
        </div>

        {/* Top Exploratory Career Highlights Strip */}
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A] print:p-2.5">
          <div className="space-y-1">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-white/50 block print:text-[#688582]">
              Top High-Synergy Career Families
            </span>
            <div className="flex flex-wrap gap-1.5">
              {topCareerFamilies.map((fam, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-lg bg-white/5 text-[11px] text-white/90 border border-white/10 font-medium print:bg-white print:border-[#E3ECEA] print:text-[#172B2A]"
                >
                  {fam}
                </span>
              ))}
            </div>
          </div>

          <Link
            href="/participant/counsellors"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#0B1B19] text-xs font-black shrink-0 transition-all shadow-md shadow-[#00BFA5]/20 print:hidden"
          >
            <span>Book Guidance</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* HOW TO USE YOUR REPORT SECTION */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5 print:bg-[#F7FAF9] print:border-[#E3ECEA] print:p-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5 print:text-[#008F83]">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>HOW TO USE YOUR REPORT • 5-STEP STUDENT & PARENT GUIDE</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {HOW_TO_USE_STEPS.map((s) => (
              <div
                key={s.step}
                className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-0.5 print:bg-white print:border-[#E3ECEA]"
              >
                <span className="text-[9px] font-mono font-bold text-[#00C896] block print:text-[#008F83]">
                  STEP {s.step}
                </span>
                <h5 className="text-[11px] font-black text-white print:text-[#172B2A]">{s.title}</h5>
                <p className="text-[10px] text-[#9FB3B0] leading-snug print:text-[#526866]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

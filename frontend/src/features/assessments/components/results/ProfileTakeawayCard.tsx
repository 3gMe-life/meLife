"use client";

import React from "react";
import { Sparkles, Compass, Lightbulb, CheckCircle2 } from "lucide-react";

interface ProfileTakeawayCardProps {
  archetypeTitle?: string;
  topTraits?: string[];
  topInterests?: string[];
  topSkills?: string[];
  growthSuggestions?: string[];
  className?: string;
}

export function ProfileTakeawayCard({
  archetypeTitle = "Multidimensional Learner",
  topTraits = [],
  topInterests = [],
  topSkills = [],
  growthSuggestions = [],
  className = "",
}: ProfileTakeawayCardProps) {
  const defaultTips = [
    "Engage in open-ended projects that allow you to experiment with tangible tools and design processes.",
    "Pursue multidisciplinary clubs (robotics, digital design, science fairs) to apply your strongest cognitive strengths.",
    "Keep this profile as an exploratory springboard rather than a rigid boundary — continue testing new interests over time.",
  ];

  const tipsToDisplay = growthSuggestions.length > 0 ? growthSuggestions.slice(0, 3) : defaultTips;

  return (
    <div
      className={`rounded-3xl bg-gradient-to-br from-[#0C1A19] via-[#112624] to-[#0A1817] text-white border border-[#00BFA5]/30 p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-6 print:p-5 print:rounded-2xl print:bg-white print:text-[#172B2A] print:border-[#00BFA5]/40 print:shadow-none print-break-avoid ${className}`}
    >
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#00BFA5]/10 rounded-full blur-3xl pointer-events-none print:hidden" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 print:border-[#E3ECEA] print:pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#00BFA5]/20 text-[#00C896] flex items-center justify-center shrink-0 print:border print:border-[#00BFA5]/30 print:text-[#008F83]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white print:text-[#172B2A] tracking-tight">
              What This Profile Suggests
            </h3>
            <p className="text-[11px] text-[#A7C2BF] print:text-[#526866]">
              Non-prescriptive directional synthesis and exploratory roadmap
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/15 self-start sm:self-auto print:border-[#00BFA5] print:text-[#008F83] print:bg-[#F0FDF4]">
          Exploratory Guidance
        </span>
      </div>

      {/* 3 Structured Takeaway Columns */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1: Current Profile Orientation */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 print:bg-[#F7FAF9] print:border-[#E3ECEA]">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#00BFA5] print:text-[#008F83]">
            <Compass className="w-4 h-4" />
            <span>01. Current Alignment</span>
          </div>
          <p className="text-xs text-[#E0EBE8] print:text-[#2A4442] leading-relaxed">
            Your current profile indicates strong exploratory alignment with <strong className="text-white print:text-[#172B2A]">{archetypeTitle}</strong> patterns
            {topInterests.length > 0 && ` (especially across ${topInterests.slice(0, 2).join(" & ")})`}.
          </p>
        </div>

        {/* Pillar 2: Core Strength Vectors */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 print:bg-[#F7FAF9] print:border-[#E3ECEA]">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400 print:text-[#059669]">
            <CheckCircle2 className="w-4 h-4" />
            <span>02. Strongest Reported Vectors</span>
          </div>
          <p className="text-xs text-[#E0EBE8] print:text-[#2A4442] leading-relaxed">
            Your most strongly endorsed self-reported behaviours show standout confidence in{" "}
            <strong className="text-white print:text-[#172B2A]">
              {topSkills.length > 0 ? topSkills.slice(0, 2).join(" & ") : "analytical and creative problem solving"}
            </strong>
            {topTraits.length > 0 && `, reinforced by ${topTraits[0]}`}. Explore whether this confidence is reinforced through repeated hands-on experience.
          </p>
        </div>

        {/* Pillar 3: High-Leverage Next Steps */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 print:bg-[#F7FAF9] print:border-[#E3ECEA]">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-300 print:text-[#B45309]">
            <Lightbulb className="w-4 h-4" />
            <span>03. Next Explorations</span>
          </div>
          <p className="text-xs text-[#E0EBE8] print:text-[#2A4442] leading-relaxed">
            You will benefit from trying tangible starter projects, participating in collaborative school challenges, and discussing your findings with a career counsellor.
          </p>
        </div>
      </div>

      {/* Suggested Action Directions */}
      <div className="relative z-10 p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 print:bg-[#F0FDF4] print:border-[#00BFA5]/30">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#00BFA5] print:text-[#008F83] block">
          Actionable Exploratory Suggestions:
        </span>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-[#C5D6D3] print:text-[#2A4442]">
          {tipsToDisplay.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2 leading-relaxed">
              <span className="text-[#00BFA5] print:text-[#008F83] mt-0.5">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Non-Deterministic Disclaimer */}
      <div className="relative z-10 text-[10.5px] text-[#A7C2BF] print:text-[#526866] italic leading-relaxed border-t border-white/10 print:border-[#E3ECEA] pt-3">
        * Important: This assessment highlights exploratory affinity and current task performance. It is an exploratory synthesis, not a fixed identity or career prescription.
      </div>
    </div>
  );
}

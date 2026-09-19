"use client";

import React, { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp, CheckCircle2, TrendingUp, AlertCircle, ArrowUpRight, ShieldCheck, Zap } from "lucide-react";

interface ExplainableCareerCardProps {
  career: {
    id?: string;
    slug?: string;
    title?: string;
    clusterTitle?: string;
    domain?: string;
    category?: string;
    industry?: string;
    matchPercentage?: number;
    futureGrowth?: string;
    alignmentLevel?: string;
    description?: string;
    overview?: string;
    whyThisMatches?: {
      summary?: string;
      topMatchingFactors?: string[];
      alignmentNote?: string;
    };
    whyEvidence?: string[];
    requiredSkills?: string[];
    sampleFocusAreas?: string[];
    suggestedProjectsAndActivities?: string[];
    developmentAreas?: string[];
  };
  rank?: number;
}

export const ExplainableCareerCard: React.FC<ExplainableCareerCardProps> = ({
  career,
  rank = 1,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(rank === 1);

  const title = career.title || career.clusterTitle || career.domain || "Career Field";
  const category = career.category || career.domain || career.industry || "Technology & Strategy";
  const matchScore = career.matchPercentage ?? (96 - (rank - 1) * 4);
  const futureGrowth = career.futureGrowth || "Very High Growth";
  const summary =
    career.whyThisMatches?.summary ||
    career.description ||
    career.overview ||
    "Strong multidimensional synergy between your cognitive problem-solving style and this field's analytical demands.";

  const matchingFactors =
    career.whyThisMatches?.topMatchingFactors ||
    career.whyEvidence || [
      "High alignment with your Investigative & Creator Holland interest codes",
      "Leverages calibrated strengths in Logical Deduction & Systems Thinking",
      "Matches your preferred autonomous, deep-inquiry working style",
    ];

  const skills =
    career.requiredSkills ||
    career.sampleFocusAreas ||
    career.suggestedProjectsAndActivities?.slice(0, 4) || [
      "Analytical Problem Solving",
      "Domain Architecture",
      "Cross-Functional Communication",
      "Continuous Learning",
    ];

  const growthHorizon =
    career.developmentAreas?.slice(0, 2) || [
      "Broaden practical industry tooling exposure",
      "Develop rapid prototyping velocity",
    ];

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? "bg-white/[0.04] border-[#00BFA5]/50 shadow-xl shadow-[#00BFA5]/10"
          : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.03]"
      } print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A]`}
    >
      {/* Clickable Header Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
      >
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-mono font-black text-sm text-[#00BFA5] shrink-0 print:bg-white print:border-[#00BFA5]">
            #{rank}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00BFA5] print:text-[#008F83]">
                {category}
              </span>
              <span className="text-[9px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 print:border-[#00BFA5] print:text-[#008F83]">
                📈 {futureGrowth}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white print:text-[#172B2A]">
              {title}
            </h3>
          </div>
        </div>

        {/* Match Percentage & Toggle Button */}
        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5 print:border-[#E3ECEA]">
          <div className="text-right">
            <div className="text-xl font-black font-mono text-[#00BFA5] flex items-center gap-1 print:text-[#008F83]">
              <Zap className="w-4 h-4 fill-current text-[#00BFA5]" />
              {matchScore}%
            </div>
            <span className="text-[9px] uppercase tracking-wider text-white/40 block print:text-[#688582]">Profile Fit Match</span>
          </div>

          <button
            aria-label="Toggle details"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors print:hidden"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Transparent Evidence Drawer */}
      {isOpen && (
        <div className="p-5 pt-0 border-t border-white/5 space-y-4 print:border-[#E3ECEA] print:block">
          {/* Summary */}
          <p className="text-xs sm:text-sm text-[#C5D6D3] leading-relaxed pt-3 print:text-[#415654]">
            {summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Left: Why this matches evidence */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2.5 print:bg-white print:border-[#E3ECEA]">
              <div className="text-[11px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5 print:text-[#008F83]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Explainable Evidence: Why You Match</span>
              </div>
              <ul className="space-y-1.5">
                {matchingFactors.map((factor, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#E0EBE8] print:text-[#2A4442]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00BFA5] shrink-0 mt-0.5" />
                    <span className="leading-snug">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Skills & Development */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3 print:bg-white print:border-[#E3ECEA]">
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-[#38BDF8] flex items-center gap-1.5 mb-2 print:text-[#0284C7]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Key Skills to Cultivate</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white/5 text-white/90 border border-white/10 print:bg-[#F0FDF4] print:border-[#00BFA5]/30 print:text-[#172B2A]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {growthHorizon.length > 0 && (
                <div className="pt-2 border-t border-white/5 print:border-[#E3ECEA]">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#F59E0B] block mb-1">
                    🌱 Growth Horizon in this Field:
                  </span>
                  <ul className="text-xs text-[#9FB3B0] space-y-1 print:text-[#526866]">
                    {growthHorizon.map((g, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="text-[#F59E0B]">•</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

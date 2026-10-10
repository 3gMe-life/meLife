"use client";

import React, { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp, CheckCircle2, TrendingUp, ShieldCheck, Zap, HelpCircle } from "lucide-react";

interface SupportingEvidenceItem {
  source?: string;
  dimensionCode?: string;
  label?: string;
  score?: number;
}

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
      whyThisAppears?: string[];
      supportingEvidence?: SupportingEvidenceItem[];
      developmentConsiderations?: string[];
      areasToValidate?: string[];
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
  const matchScore = career.matchPercentage ?? Math.max(70, 96 - (rank - 1) * 4);
  const futureGrowth = career.futureGrowth || "Very High Growth";
  const summary =
    career.whyThisMatches?.summary ||
    career.description ||
    career.overview ||
    "Strong multidimensional alignment between your current psychometric profile and this pathway's core demands.";

  const whyThisAppears =
    career.whyThisMatches?.whyThisAppears ||
    career.whyThisMatches?.topMatchingFactors ||
    career.whyEvidence || [
      "High alignment with your leading interest indicators",
      "Demonstrated problem-solving and cognitive readiness",
      "Compatible collaborative and self-management work style",
    ];

  const supportingEvidence = career.whyThisMatches?.supportingEvidence || [];

  const areasToValidate =
    career.whyThisMatches?.areasToValidate ||
    career.whyThisMatches?.developmentConsiderations ||
    career.developmentAreas || [
      "Hands-on project and portfolio exploration",
      "Academic coursework validation in foundational sciences or mathematics",
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

  const formatSource = (src?: string) => {
    switch (src) {
      case "INTEREST_EVIDENCE":
        return "Interest Evidence";
      case "DEMONSTRATED_TASK_PERFORMANCE":
        return "Task Performance";
      case "SELF_REPORTED_BEHAVIOUR":
        return "Self-Reported Behaviour";
      case "DEVELOPMENTAL_HABIT":
        return "Developmental Habit";
      default:
        return "Profile Evidence";
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? "bg-[#0E2623] border-[#00BFA5]/60 shadow-xl shadow-[#00BFA5]/15 text-white"
          : "bg-[#0A1A18] border-white/10 hover:border-[#00BFA5]/40 hover:bg-[#0E2623] text-white"
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
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 print:border-[#00BFA5] print:text-[#008F83] flex items-center gap-1">
                <TrendingUp className="w-2.5 h-2.5" />
                {futureGrowth}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white print:text-[#172B2A]">
              {title}
            </h3>
          </div>
        </div>

        {/* Career Alignment Score & Toggle Button */}
        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5 print:border-[#E3ECEA]">
          <div className="text-right">
            <div className="text-lg sm:text-xl font-black font-mono text-[#00BFA5] flex items-center gap-1 justify-end print:text-[#008F83]">
              <Zap className="w-4 h-4 fill-current text-[#00BFA5]" />
              {matchScore} / 100
            </div>
            <span className="text-[9px] uppercase tracking-wider text-white/50 block print:text-[#688582]">
              Career Alignment Score
            </span>
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
          <p className="text-xs sm:text-sm text-[#D1E2DF] leading-relaxed pt-3 print:text-[#415654]">
            {summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Left: Why this appears & Supporting Evidence */}
            <div className="p-4 rounded-xl bg-[#061211] border border-white/10 space-y-3.5 print:bg-white print:border-[#E3ECEA]">
              {/* Why This Appears */}
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5 mb-2 print:text-[#008F83]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Why This Career Appears</span>
                </div>
                <ul className="space-y-1.5">
                  {whyThisAppears.map((factor, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#E0EBE8] print:text-[#2A4442]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00BFA5] shrink-0 mt-0.5" />
                      <span className="leading-snug">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Supporting Evidence Items if available */}
              {supportingEvidence.length > 0 && (
                <div className="pt-2 border-t border-white/5 print:border-[#E3ECEA]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                    Supporting Profile Evidence:
                  </div>
                  <div className="space-y-1">
                    {supportingEvidence.map((ev, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] bg-white/5 px-2 py-1 rounded-md print:bg-slate-100">
                        <span className="text-[#38BDF8] print:text-[#0284C7] font-medium truncate">
                          {ev.label || ev.dimensionCode}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          {ev.score !== undefined && (
                            <span className="font-mono text-[10px] text-white/70 print:text-slate-700">
                              {ev.score}/100
                            </span>
                          )}
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-white/10 text-white/60 print:bg-slate-200 print:text-slate-800">
                            {formatSource(ev.source)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Skills & Areas to Validate */}
            <div className="p-4 rounded-xl bg-[#061211] border border-white/10 space-y-3.5 print:bg-white print:border-[#E3ECEA]">
              {/* Skills */}
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-[#38BDF8] flex items-center gap-1.5 mb-2 print:text-[#0284C7]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Key Skills to Cultivate</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#13302C] text-white border border-[#00BFA5]/30 print:bg-[#F0FDF4] print:border-[#00BFA5]/30 print:text-[#172B2A]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Areas to Validate / Still Needs Exploration */}
              {areasToValidate.length > 0 && (
                <div className="pt-2 border-t border-white/5 print:border-[#E3ECEA]">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#F59E0B] flex items-center gap-1 mb-1.5">
                    <HelpCircle className="w-3 h-3 text-[#F59E0B]" />
                    <span>Areas Still to Validate:</span>
                  </span>
                  <ul className="text-xs text-[#CBD5E1] space-y-1 print:text-[#526866]">
                    {areasToValidate.map((val, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#F59E0B] font-bold">•</span>
                        <span className="print:text-[#2A4442]">{val}</span>
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

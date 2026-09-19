"use client";

import React from "react";
import { HelpCircle, CheckCircle2 } from "lucide-react";
import { StreamFinderResult, StreamName } from "../../../types/assessment.types";

interface StreamWhyResultAppearedProps {
  result: StreamFinderResult;
}

interface EvidenceSignal {
  profileSignal: string;
  responsePattern: string[];
  whatThisMayMean: string;
  optimalEnvironment: string;
}

const STREAM_EVIDENCE_MAP: Record<StreamName, EvidenceSignal> = {
  Science: {
    profileSignal: "ANALYTICAL & EMPIRICAL INQUIRY",
    responsePattern: [
      "Curiosity about physical laws, life sciences, and computational algorithms",
      "Systematic step-by-step problem breakdown over subjective opinion",
      "High comfort with quantitative calculations and logical deduction",
      "Interest in laboratory testing, experimental proof, and technical systems",
    ],
    whatThisMayMean:
      "You naturally gravitate toward objective reasoning, hypothesis testing, and understanding the mechanistic functioning of physical and digital systems.",
    optimalEnvironment:
      "Laboratory research, technical engineering studios, mathematics colloquiums, data science hubs, and structured experimental coursework.",
  },
  Commerce: {
    profileSignal: "COMMERCIAL & ENTERPRISE DYNAMICS",
    responsePattern: [
      "Interest in economic trade, resource management, and business strategy",
      "Preference for quantitative financial calculations and commercial logic",
      "Engagement with organizational leadership, markets, and entrepreneurship",
      "Enjoyment of real-world business case studies and decision optimization",
    ],
    whatThisMayMean:
      "You naturally enjoy understanding how financial value is created, traded, organized, managed, and scaled in modern economies.",
    optimalEnvironment:
      "Business simulation labs, financial analysis desks, project management seminars, and entrepreneurial venture incubators.",
  },
  Humanities: {
    profileSignal: "VERBAL, SOCIAL & CULTURAL CURIOSITY",
    responsePattern: [
      "Deep interest in human behaviour, historical contexts, and society",
      "Strong aptitude for verbal articulation, essays, and text interpretation",
      "Engagement with legal systems, ethics, philosophy, and public policy",
      "Preference for seminar debates, creative reasoning, and empathetic inquiry",
    ],
    whatThisMayMean:
      "You thrive when exploring multifaceted human perspectives, cultural narratives, linguistic expression, and civic governance structures.",
    optimalEnvironment:
      "Seminar discussions, legal moots, policy think-tanks, social research field studies, and creative writing workshops.",
  },
  "Applied / Technical": {
    profileSignal: "FUNCTIONAL DESIGN & HANDS-ON BUILD",
    responsePattern: [
      "Preference for tangible experimentation, machinery, and digital tools",
      "Learning best by direct prototyping, visual fabrication, and troubleshooting",
      "Interest in technical arts, engineering graphics, and software workflows",
      "High retention when theoretical concepts are immediately applied to real projects",
    ],
    whatThisMayMean:
      "You enjoy creating functional prototypes, solving concrete physical/digital challenges, and seeing immediate practical results from your effort.",
    optimalEnvironment:
      "Makerspaces, design studios, digital fabrication workshops, and iterative project-based engineering labs.",
  },
};

export const StreamWhyResultAppeared: React.FC<StreamWhyResultAppearedProps> = ({ result }) => {
  const primary = result.primaryStream || "Science";
  const secondary = result.secondaryStream || "Commerce";

  const primaryEvidence = STREAM_EVIDENCE_MAP[primary] || STREAM_EVIDENCE_MAP.Science;
  const secondaryEvidence = STREAM_EVIDENCE_MAP[secondary] || STREAM_EVIDENCE_MAP.Commerce;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0B1B19] via-[#112926] to-[#0A1615] border border-[#00BFA5]/30 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden print:p-5 print:rounded-2xl print:bg-none print:bg-white print:text-[#172B2A] print:border-[#E3ECEA] flex flex-col justify-between space-y-4 print:space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3 print:border-[#E3ECEA] print:pb-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5 print:text-[#008F83]">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>04. Assessment Response Analysis</span>
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight print:text-[#172B2A]">
            Response-Derived Profile Evidence
          </h3>
          <p className="text-xs text-[#9FB3B0] max-w-xl leading-relaxed print:text-[#526866]">
            Structured evidence mapping your observed response patterns into aligned learning environments.
          </p>
        </div>

        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 self-start sm:self-auto print:border-[#00BFA5] print:text-[#008F83]">
          Response Evidence Matrix
        </span>
      </div>

      {/* 2-Column Evidence Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 relative z-10">
        {/* Primary Stream Evidence Card */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border-2 border-[#00BFA5]/40 flex flex-col justify-between space-y-2.5 print:bg-[#F7FAF9] print:border-[#00BFA5] print:text-[#172B2A] print:p-3">
          <div className="space-y-2">
            {/* Tag */}
            <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-1.5 print:border-[#E3ECEA]">
              <span className="text-[9px] font-black uppercase tracking-wider text-[#00C896] bg-[#00BFA5]/20 px-2 py-0.5 rounded-full border border-[#00BFA5]/30 print:text-[#008F83] print:bg-emerald-50">
                Primary Vector ({result.primaryDisplayPercentage}% Relative Alignment)
              </span>
              <span className="text-xs font-black text-white print:text-[#172B2A]">
                {primary}
              </span>
            </div>

            {/* Profile Signal */}
            <div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#00BFA5] block print:text-[#008F83]">
                [Profile Signal]
              </span>
              <h4 className="text-xs sm:text-sm font-black text-white mt-0.5 print:text-[#172B2A]">
                {primaryEvidence.profileSignal}
              </h4>
            </div>

            {/* Observed Response Patterns */}
            <div className="space-y-1">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-white/50 block print:text-[#688582]">
                [Observed Response Patterns]
              </span>
              <ul className="space-y-1 pt-0.5">
                {primaryEvidence.responsePattern.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[11px] text-[#E0EBE8] leading-snug print:text-[#2A4442]">
                    <CheckCircle2 className="w-3 h-3 text-[#00BFA5] shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What this may mean */}
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] space-y-0.5 print:bg-white print:border-[#E3ECEA]">
              <span className="text-[9px] font-black uppercase tracking-wider text-[#00BFA5] block print:text-[#008F83]">
                [Interpretation • What This May Mean]
              </span>
              <p className="text-[#C5D6D3] leading-relaxed print:text-[#415654]">
                {primaryEvidence.whatThisMayMean}
              </p>
            </div>
          </div>

          {/* Academic Environment */}
          <div className="pt-2 border-t border-white/5 text-[10.5px] text-[#A7F3D0] leading-snug print:border-[#E3ECEA] print:text-[#065F46]">
            <strong>Where This May Fit:</strong> {primaryEvidence.optimalEnvironment}
          </div>
        </div>

        {/* Secondary Stream Evidence Card */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-sky-400/40 transition-all flex flex-col justify-between space-y-2.5 print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A] print:p-3">
          <div className="space-y-2">
            {/* Tag */}
            <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-1.5 print:border-[#E3ECEA]">
              <span className="text-[9px] font-black uppercase tracking-wider text-[#38BDF8] bg-sky-500/20 px-2 py-0.5 rounded-full border border-sky-500/30 print:text-[#0284C7] print:bg-sky-50">
                Secondary Vector ({result.secondaryDisplayPercentage}% Relative Alignment)
              </span>
              <span className="text-xs font-black text-white print:text-[#172B2A]">
                {secondary}
              </span>
            </div>

            {/* Profile Signal */}
            <div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#38BDF8] block print:text-[#0284C7]">
                [Profile Signal]
              </span>
              <h4 className="text-xs sm:text-sm font-black text-white mt-0.5 print:text-[#172B2A]">
                {secondaryEvidence.profileSignal}
              </h4>
            </div>

            {/* Observed Response Patterns */}
            <div className="space-y-1">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-white/50 block print:text-[#688582]">
                [Observed Response Patterns]
              </span>
              <ul className="space-y-1 pt-0.5">
                {secondaryEvidence.responsePattern.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[11px] text-[#E0EBE8] leading-snug print:text-[#2A4442]">
                    <CheckCircle2 className="w-3 h-3 text-[#38BDF8] shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What this may mean */}
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] space-y-0.5 print:bg-white print:border-[#E3ECEA]">
              <span className="text-[9px] font-black uppercase tracking-wider text-[#38BDF8] block print:text-[#0284C7]">
                [Interpretation • What This May Mean]
              </span>
              <p className="text-[#C5D6D3] leading-relaxed print:text-[#415654]">
                {secondaryEvidence.whatThisMayMean}
              </p>
            </div>
          </div>

          {/* Academic Environment */}
          <div className="pt-2 border-t border-white/5 text-[10.5px] text-[#BAE6FD] leading-snug print:border-[#E3ECEA] print:text-[#0369A1]">
            <strong>Where This May Fit:</strong> {secondaryEvidence.optimalEnvironment}
          </div>
        </div>
      </div>
    </div>
  );
};

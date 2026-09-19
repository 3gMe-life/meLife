"use client";

import React, { useState } from "react";
import { Compass, GraduationCap, Building2, Briefcase, ArrowRight, Sparkles, CheckCircle2, ChevronRight, Layers } from "lucide-react";
import { ReportExplorationCluster } from "../../types/report.types";
import { ReportCareerMatchItem } from "../../types/career-report.types";

interface CareerExplorationPathwayMapProps {
  clusters?: ReportExplorationCluster[];
  careerMatches?: ReportCareerMatchItem[];
  archetypeTitle?: string;
}

interface PathwayMilestone {
  title: string;
  stage: string;
  category: string;
  highSecondaryStreams: string[];
  undergradDegrees: string[];
  entryRoles: string[];
  fiveYearHorizon: string[];
  skills: string[];
  description: string;
}

export const CareerExplorationPathwayMap: React.FC<CareerExplorationPathwayMapProps> = ({
  clusters = [],
  careerMatches = [],
  archetypeTitle = "Systems Innovator & Creative Strategist",
}) => {
  const [selectedBranchIndex, setSelectedBranchIndex] = useState<number>(0);

  // Synthesize rich pathways from passed clusters or career matches
  const pathways: PathwayMilestone[] = (clusters.length > 0 ? clusters : careerMatches).map((item: any, idx: number) => {
    const title = item.clusterTitle || item.title || item.domain || `Exploration Frontier ${idx + 1}`;
    const category = item.domain || item.category || "Cross-Disciplinary Technology & Strategy";
    const desc = item.description || item.whyThisMatches?.summary || item.overview || "High-synergy domain aligned with your cognitive synthesis.";

    // Generate educational stream mappings based on domain
    const lower = (title + " " + category).toLowerCase();

    let streams = ["Science with Mathematics (Physics, Chemistry, Math, Computer Science)"];
    let degrees = ["B.Tech Computer Science & AI", "B.Sc Data Science & Computing", "Integrated M.Sc in Cognitive Systems"];
    let entryRoles = ["Junior Systems Engineer", "AI/ML Solutions Associate", "Data Intelligence Analyst"];
    let futureHorizon = ["Principal AI Architect", "Director of Systems Innovation", "Chief Technology Officer"];
    let skills = ["Algorithmic Logic", "Data Analysis", "System Architecture", "Continuous Learning"];

    if (lower.includes("design") || lower.includes("creative") || lower.includes("art") || lower.includes("media")) {
      streams = ["Humanities with Fine Arts / Applied Design", "Science or Commerce with Multimedia & Informatics"];
      degrees = ["B.Des Interaction & Product Design", "B.A. Digital Media & Visual Communication", "B.Sc Game Design & HCI"];
      entryRoles = ["UI/UX Product Designer", "Creative Technology Associate", "Digital Experience Specialist"];
      futureHorizon = ["Head of Product Design", "Creative Director", "VP of Brand & User Experience"];
      skills = ["Human-Centered Design", "Visual Storytelling", "Prototyping", "Design Systems"];
    } else if (lower.includes("business") || lower.includes("leader") || lower.includes("manage") || lower.includes("entre")) {
      streams = ["Commerce with Mathematics & Economics", "Humanities with Economics & Business Studies"];
      degrees = ["BBA in Strategic Management & Analytics", "B.A. Economics & Econometrics", "B.Com Honors in Financial Systems"];
      entryRoles = ["Associate Management Consultant", "Growth Product Analyst", "Business Operations Lead"];
      futureHorizon = ["Managing Partner", "Chief Strategy Officer", "Venture Partner / Founder"];
      skills = ["Strategic Thinking", "Financial Modeling", "Stakeholder Leadership", "Negotiation"];
    } else if (lower.includes("health") || lower.includes("bio") || lower.includes("medic") || lower.includes("psych")) {
      streams = ["Science with Biology (Physics, Chemistry, Biology, Psychology / Biotech)"];
      degrees = ["B.Sc Cognitive Neuroscience & Psychology", "MBBS / Allied Health Sciences", "B.Tech Biomedical Informatics"];
      entryRoles = ["Clinical Research Associate", "Healthcare Solutions Specialist", "Behavioral Insights Analyst"];
      futureHorizon = ["Lead Neuropsychologist", "Healthcare Innovation Director", "Clinical Systems Principal"];
      skills = ["Scientific Method", "Empathetic Patient Care", "Statistical Analysis", "Ethical Protocol"];
    }

    if (item.sampleFocusAreas?.length > 0) {
      entryRoles = item.sampleFocusAreas.slice(0, 3);
    }
    if (item.suggestedProjectsAndActivities?.length > 0) {
      skills = item.suggestedProjectsAndActivities.slice(0, 4);
    }

    return {
      title,
      stage: item.alignmentLevel || "High Alignment",
      category,
      highSecondaryStreams: streams,
      undergradDegrees: degrees,
      entryRoles,
      fiveYearHorizon: futureHorizon,
      skills,
      description: desc,
    };
  });

  const active = pathways[selectedBranchIndex] || pathways[0];

  if (!active) return null;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0B1B19] via-[#112926] to-[#0A1615] border border-[#00BFA5]/30 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden print:p-5 print:rounded-2xl print:bg-none print:bg-white print:text-[#172B2A] print:border-[#E3ECEA]">
      {/* Background glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#00B8D4]/15 blur-3xl print:hidden" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-[#00BFA5]/15 blur-3xl print:hidden" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6 print:border-[#E3ECEA] print:pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>08. Educational & Career Pathway Architecture</span>
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 print:border-[#00B8D4] print:text-[#008F83]">
              Secondary $\rightarrow$ UG $\rightarrow$ Career Tree
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight print:text-[#172B2A]">
            Milestone Pathway Navigator
          </h2>
          <p className="text-xs sm:text-sm text-[#9FB3B0] max-w-xl leading-relaxed print:text-[#526866]">
            Clear, progressive educational roadmap mapping your {archetypeTitle} profile into high-school streams, degree paths, and early career horizons.
          </p>
        </div>

        {/* Pathway count badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 self-start sm:self-auto print:hidden">
          <Layers className="w-3.5 h-3.5 text-[#00BFA5]" />
          <span className="text-xs font-bold text-white/80">{pathways.length} Pathways Mapped</span>
        </div>
      </div>

      {/* Branch Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar relative z-10 print:hidden">
        {pathways.map((p, idx) => {
          const isSelected = selectedBranchIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedBranchIndex(idx)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 border ${
                isSelected
                  ? "bg-[#00BFA5] text-[#0B1B19] border-[#00BFA5] shadow-lg shadow-[#00BFA5]/25"
                  : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>Pathway {idx + 1}:</span>
              <span>{p.title.split(":")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Active Pathway Details Card */}
      <div className="relative z-10 space-y-6">
        {/* Banner */}
        <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A]">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-[#00BFA5] font-mono mb-0.5 print:text-[#008F83]">
              Domain Focus: {active.category}
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white print:text-[#172B2A]">{active.title}</h3>
            <p className="text-xs text-[#9FB3B0] max-w-2xl mt-1 print:text-[#526866]">{active.description}</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 self-start sm:self-auto shrink-0 print:border-[#00BFA5] print:text-[#008F83]">
            {active.stage}
          </span>
        </div>

        {/* 4-Step Milestone Sequence */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* STEP 1: Higher Secondary Stream */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:border-[#00BFA5]/40 transition-all print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A]">
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#00BFA5]">Stage 1</span>
                <GraduationCap className="w-4 h-4 text-[#00BFA5]" />
              </div>
              <h4 className="text-xs font-black uppercase tracking-wide text-white mb-2 print:text-[#172B2A]">
                High School Stream (Grade 11-12)
              </h4>
              <ul className="space-y-1.5 text-xs text-[#C5D6D3] print:text-[#415654]">
                {active.highSecondaryStreams.map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5 leading-snug">
                    <span className="text-[#00BFA5] mt-0.5">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 pt-2 border-t border-white/5 text-[10px] text-white/40 uppercase font-mono print:border-[#E3ECEA]">
              Foundational Focus
            </div>
          </div>

          {/* STEP 2: Undergraduate Majors */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:border-[#38BDF8]/40 transition-all print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A]">
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#38BDF8]">Stage 2</span>
                <Building2 className="w-4 h-4 text-[#38BDF8]" />
              </div>
              <h4 className="text-xs font-black uppercase tracking-wide text-white mb-2 print:text-[#172B2A]">
                Undergraduate Degree Majors
              </h4>
              <ul className="space-y-1.5 text-xs text-[#C5D6D3] print:text-[#415654]">
                {active.undergradDegrees.map((d, i) => (
                  <li key={i} className="flex items-start gap-1.5 leading-snug">
                    <span className="text-[#38BDF8] mt-0.5">•</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 pt-2 border-t border-white/5 text-[10px] text-white/40 uppercase font-mono print:border-[#E3ECEA]">
              Core Mastery
            </div>
          </div>

          {/* STEP 3: Early Career Roles */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:border-[#F59E0B]/40 transition-all print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A]">
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#F59E0B]">Stage 3</span>
                <Briefcase className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <h4 className="text-xs font-black uppercase tracking-wide text-white mb-2 print:text-[#172B2A]">
                Early Career Roles (0-3 Yrs)
              </h4>
              <ul className="space-y-1.5 text-xs text-[#C5D6D3] print:text-[#415654]">
                {active.entryRoles.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5 leading-snug">
                    <span className="text-[#F59E0B] mt-0.5">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 pt-2 border-t border-white/5 text-[10px] text-white/40 uppercase font-mono print:border-[#E3ECEA]">
              Practical Execution
            </div>
          </div>

          {/* STEP 4: 5-10 Year Leadership Horizon */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:border-[#EC4899]/40 transition-all print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A]">
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#EC4899]">Stage 4</span>
                <Sparkles className="w-4 h-4 text-[#EC4899]" />
              </div>
              <h4 className="text-xs font-black uppercase tracking-wide text-white mb-2 print:text-[#172B2A]">
                5-10 Year Leadership Horizon
              </h4>
              <ul className="space-y-1.5 text-xs text-[#C5D6D3] print:text-[#415654]">
                {active.fiveYearHorizon.map((h, i) => (
                  <li key={i} className="flex items-start gap-1.5 leading-snug">
                    <span className="text-[#EC4899] mt-0.5">•</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 pt-2 border-t border-white/5 text-[10px] text-white/40 uppercase font-mono print:border-[#E3ECEA]">
              Strategic Impact
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

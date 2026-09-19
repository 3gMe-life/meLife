"use client";

import React, { useState } from "react";
import { Sprout, Sparkles, TrendingUp, Compass, ArrowUpRight, CheckCircle2, ChevronDown, Lightbulb } from "lucide-react";
import { ScoredDimensionItem } from "../../types/report.types";

interface GrowthOpportunitiesSectionProps {
  growthAreas: ScoredDimensionItem[];
  growthSuggestions?: string[];
  title?: string;
  subtitle?: string;
}

export const GrowthOpportunitiesSection: React.FC<GrowthOpportunitiesSectionProps> = ({
  growthAreas,
  growthSuggestions = [],
  title = "High-Leverage Growth Frontiers",
  subtitle = "Every world-class thinker cultivates emerging capabilities. Here are your highest-upside growth horizons—framed with positive, actionable micro-habits.",
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  // Take top growth areas
  const areas = growthAreas.slice(0, 4);

  // Generate encouraging cultivation blueprint for each area
  const getGrowthBlueprint = (name: string, desc?: string) => {
    const lower = name.toLowerCase();

    if (lower.includes("time") || lower.includes("organ") || lower.includes("plan") || lower.includes("struct")) {
      return {
        frontierTag: "Executive Velocity & Flow",
        whyExciting: "Mastering light organizational systems frees up mental RAM for deep creative breakthroughs.",
        dailyMicroHabit: "Run a 2-minute 'Top 3 Priorities' check before opening any browser or study app each morning.",
        projectDrill: "Set up a 3-column Kanban board (To Do, In Progress, Complete) for your current term assignments.",
      };
    } else if (lower.includes("comm") || lower.includes("presen") || lower.includes("speak") || lower.includes("express")) {
      return {
        frontierTag: "Influential Articulation",
        whyExciting: "Bridging your sharp inner ideas with effortless public communication makes your work 10x more impactful.",
        dailyMicroHabit: "Record a 60-second voice memo explaining one interesting thing you learned today.",
        projectDrill: "Volunteer to present the opening 2 minutes of your next group presentation.",
      };
    } else if (lower.includes("detail") || lower.includes("precis") || lower.includes("accur")) {
      return {
        frontierTag: "Refinement & Polish",
        whyExciting: "Adding deliberate quality checks elevates brilliant raw drafts into publication-ready masterworks.",
        dailyMicroHabit: "Perform a 'Reverse Review' on written work: inspect citations and math steps backward from end to start.",
        projectDrill: "Build a single reusable checklist for your major coursework submissions.",
      };
    } else if (lower.includes("resilien") || lower.includes("adapt") || lower.includes("stress") || lower.includes("confid")) {
      return {
        frontierTag: "Dynamic Adaptability",
        whyExciting: "Viewing unexpected pivots as puzzles rather than roadblocks develops unstoppable grit.",
        dailyMicroHabit: "When facing a roadblock, write down 2 alternative routes before asking for help.",
        projectDrill: "Engage in timed chess tactics or rapid prototyping sprints where quick iteration beats perfection.",
      };
    }

    return {
      frontierTag: "Emerging Capability",
      whyExciting: "Cultivating this domain compounds your primary strengths and unlocks cross-functional versatility.",
      dailyMicroHabit: "Dedicate 5 uninterrupted minutes each morning to deliberate practice in this skill.",
      projectDrill: "Partner with a peer who excels in this area and observe their thought process on a shared task.",
    };
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0B1B19] via-[#112926] to-[#0A1615] border border-[#00BFA5]/30 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden print:p-5 print:rounded-2xl print:bg-none print:bg-white print:text-[#172B2A] print:border-[#E3ECEA]">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#10B981]/15 blur-3xl print:hidden" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-[#00BFA5]/15 blur-3xl print:hidden" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6 print:border-[#E3ECEA] print:pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#10B981] flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5" />
              <span>07. Growth Frontiers & Cultivation Blueprint</span>
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 print:hidden">
              🌱 Nurture & Expand
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight print:text-[#172B2A]">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-[#9FB3B0] max-w-xl leading-relaxed print:text-[#526866]">
            {subtitle}
          </p>
        </div>

        {/* Growth Philosophy Pill */}
        <div className="px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 max-w-xs self-start sm:self-auto print:hidden">
          <div className="text-[10px] font-black uppercase tracking-wider text-[#10B981] flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Growth Mindset Principle
          </div>
          <p className="text-[11px] text-white/80 leading-snug mt-0.5">
            Capabilities are dynamic muscles, not fixed ceilings.
          </p>
        </div>
      </div>

      {/* Growth Cards Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
        {areas.map((item, idx) => {
          const score = item.scalePositionPercentage ?? (item as any).score ?? (item as any).rawScore ?? 55;
          const bp = getGrowthBlueprint(item.name, item.description);
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={item.code || idx}
              className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 hover:border-[#10B981]/40 hover:bg-white/[0.05] transition-all duration-300 flex flex-col justify-between print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A] print:p-4"
            >
              <div>
                {/* Frontier Tag & Score */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#10B981] bg-[#10B981]/15 px-2.5 py-0.5 rounded-full border border-[#10B981]/30">
                    🌱 {bp.frontierTag}
                  </span>
                  <span className="text-xs font-mono text-white/50 print:text-[#688582]">
                    Current Base: <strong className="text-white print:text-[#172B2A]">{score}%</strong>
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-black text-white print:text-[#172B2A] mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-[#9FB3B0] leading-relaxed mb-4 print:text-[#526866]">
                  {item.description || "An emerging area where small deliberate habit adjustments will yield disproportionate performance compounding."}
                </p>

                {/* 3-Step Cultivation Formula */}
                <div className="space-y-2.5 pt-2 border-t border-white/5 print:border-[#E3ECEA]">
                  {/* Step 1: Why Exciting */}
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-[#C5D6D3] print:bg-white print:border-[#E3ECEA] print:text-[#2A4442]">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#10B981] block mb-0.5">
                      1. The Upside Advantage:
                    </span>
                    <p className="leading-snug text-[11px]">{bp.whyExciting}</p>
                  </div>

                  {/* Step 2: 5-Min Habit */}
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-[#A7F3D0] print:bg-emerald-50 print:border-[#00BFA5]/30 print:text-[#065F46]">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#00BFA5] block mb-0.5">
                      2. Daily 5-Minute Micro-Habit:
                    </span>
                    <p className="leading-snug text-[11px]">{bp.dailyMicroHabit}</p>
                  </div>

                  {/* Step 3: Project Drill */}
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-[#BAE6FD] print:bg-cyan-50 print:border-[#38BDF8]/30 print:text-[#0369A1]">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#38BDF8] block mb-0.5">
                      3. Real-World Drill:
                    </span>
                    <p className="leading-snug text-[11px]">{bp.projectDrill}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/50 print:border-[#E3ECEA] print:text-[#688582]">
                <span>Progress Milestone</span>
                <span className="font-bold text-[#10B981]">Ready to Accelerate 🚀</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggested Growth Action Checklist if available */}
      {growthSuggestions.length > 0 && (
        <div className="mt-6 p-5 rounded-2xl bg-white/[0.03] border border-white/10 relative z-10 print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A]">
          <div className="text-xs font-black uppercase tracking-wider text-[#10B981] flex items-center gap-1.5 mb-3">
            <Lightbulb className="w-4 h-4 text-[#10B981]" />
            <span>High-Impact Recommendations for Your Next Academic Cycle</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {growthSuggestions.map((sug, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-[#C5D6D3] print:bg-white print:border-[#E3ECEA] print:text-[#2A4442]"
              >
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{sug}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

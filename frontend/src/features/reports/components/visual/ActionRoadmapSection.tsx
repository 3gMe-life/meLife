"use client";

import React, { useState } from "react";
import { Calendar, CheckSquare, Square, Sparkles, ArrowRight, Target, Flame, Trophy } from "lucide-react";
import { ReportActionPlan } from "../../types/report.types";

interface ActionRoadmapSectionProps {
  actionPlan?: ReportActionPlan;
  topStrengths?: string[];
  growthSuggestions?: string[];
}

export const ActionRoadmapSection: React.FC<ActionRoadmapSectionProps> = ({
  actionPlan,
  topStrengths = [],
  growthSuggestions = [],
}) => {
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setCompletedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Build high-leverage milestones for 30d, 90d, 180d
  const next30Days = actionPlan?.next30Days?.length
    ? actionPlan.next30Days
    : [
        "Implement a 50-minute focused study block cadence with active recall note-taking.",
        "Set up a 3-column Kanban board for your upcoming assignments and weekly milestones.",
        "Explore 2 reputable industry podcasts or documentary deep-dives in your top matched career domain.",
        "Identify 1 study partner to practice the Feynman explanation technique on complex exam topics.",
      ];

  const next3Months = actionPlan?.next3Months?.length
    ? actionPlan.next3Months
    : [
        "Initiate a self-directed mini-project (e.g., prototype, scientific inquiry, essay) applying your top strength.",
        "Join a relevant school club, hackathon, debate society, or science Olympiad group.",
        "Conduct a 15-minute informal informational interview with a senior student or professional in your field of interest.",
        "Review your growth area micro-habits and calibrate improvement velocity with your mentor.",
      ];

  const next6Months = actionPlan?.next6Months?.length
    ? actionPlan.next6Months
    : [
        "Align your Grade 11-12 subject stream selections or college major electives with your RIASEC interest profile.",
        "Build a simple digital portfolio or GitHub/Notion repository showcasing 2 polished milestone projects.",
        "Attend 2 virtual university open days or industry career exploratory workshops.",
        "Complete a certified introductory online micro-course in an emerging technical or creative domain.",
      ];

  const stages = [
    {
      id: "30d",
      badge: "Immediate Sprint",
      timeframe: "Next 30 Days",
      icon: Flame,
      color: "#00BFA5",
      items: next30Days,
      objective: "Establish bedrock study habits & ignite active curiosity.",
    },
    {
      id: "3m",
      badge: "Quarterly Horizon",
      timeframe: "Next 3 Months",
      icon: Target,
      color: "#38BDF8",
      items: next3Months,
      objective: "Build tangible project proof & test collaborative teamwork.",
    },
    {
      id: "6m",
      badge: "Semester Milestone",
      timeframe: "Next 6 Months",
      icon: Trophy,
      color: "#EC4899",
      items: next6Months,
      objective: "Lock in academic stream alignment & build a distinctive portfolio.",
    },
  ];

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0B1B19] via-[#112926] to-[#0A1615] border border-[#00BFA5]/30 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden print:p-5 print:rounded-2xl print:bg-none print:bg-white print:text-[#172B2A] print:border-[#E3ECEA]">
      {/* Background glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#00BFA5]/15 blur-3xl print:hidden" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-[#EC4899]/15 blur-3xl print:hidden" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6 print:border-[#E3ECEA] print:pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>10. Execution Roadmap & Milestones</span>
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 print:hidden">
              Action Plan
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight print:text-[#172B2A]">
            Progressive 30-Day / 3-Month / 6-Month Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-[#9FB3B0] max-w-xl leading-relaxed print:text-[#526866]">
            Concrete milestones to transform your psychometric discoveries into compounding academic mastery and personal growth.
          </p>
        </div>

        {/* Action Prompt */}
        <div className="px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 self-start sm:self-auto print:hidden">
          <div className="text-[10px] font-black uppercase tracking-wider text-[#00BFA5]">Interactive Tracker</div>
          <p className="text-xs text-white/80 mt-0.5">Click milestones to track progress</p>
        </div>
      </div>

      {/* 3-Column Progressive Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
        {stages.map((stage) => {
          const Icon = stage.icon;
          return (
            <div
              key={stage.id}
              className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between hover:border-[#00BFA5]/40 transition-all print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A] print:p-4"
            >
              <div>
                {/* Top Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                    style={{ backgroundColor: `${stage.color}20`, color: stage.color }}
                  >
                    {stage.badge}
                  </span>
                  <div
                    className="p-2 rounded-xl"
                    style={{ backgroundColor: `${stage.color}15`, color: stage.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-base font-black text-white mb-1 print:text-[#172B2A]">
                  {stage.timeframe}
                </h3>
                <p className="text-xs text-[#9FB3B0] leading-snug mb-4 print:text-[#526866]">
                  {stage.objective}
                </p>

                {/* Milestone Checklist */}
                <div className="space-y-2.5 pt-2 border-t border-white/5 print:border-[#E3ECEA]">
                  {stage.items.map((item, idx) => {
                    const itemKey = `${stage.id}-${idx}`;
                    const isChecked = !!completedItems[itemKey];

                    return (
                      <div
                        key={idx}
                        onClick={() => toggleItem(itemKey)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-2.5 ${
                          isChecked
                            ? "bg-emerald-500/15 border-emerald-500/40 text-[#A7F3D0] print:bg-emerald-50 print:border-[#00BFA5]"
                            : "bg-white/[0.02] border-white/5 text-[#C5D6D3] hover:bg-white/[0.05] print:bg-white print:border-[#E3ECEA] print:text-[#2A4442]"
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-[#00BFA5]" />
                          ) : (
                            <Square className="w-4 h-4 text-white/40" />
                          )}
                        </div>
                        <span
                          className={`text-xs leading-relaxed ${
                            isChecked ? "line-through opacity-80" : ""
                          }`}
                        >
                          {item}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Progress Count */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/50 print:border-[#E3ECEA] print:text-[#688582]">
                <span>Phase Progress</span>
                <span className="font-mono font-bold text-white print:text-[#172B2A]">
                  {stage.items.filter((_, idx) => completedItems[`${stage.id}-${idx}`]).length} / {stage.items.length} Completed
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

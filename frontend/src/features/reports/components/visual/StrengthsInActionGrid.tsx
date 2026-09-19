"use client";

import React, { useState } from "react";
import { Sparkles, Zap, GraduationCap, Users, Lightbulb, Compass, Award, CheckCircle2, ArrowRight } from "lucide-react";
import { ScoredDimensionItem } from "../../types/report.types";

interface StrengthsInActionGridProps {
  strengths: ScoredDimensionItem[];
  title?: string;
  subtitle?: string;
}

interface ActionContext {
  id: "academic" | "teamwork" | "projects" | "creative" | "digital";
  label: string;
  icon: any;
  color: string;
}

const ACTION_CONTEXTS: ActionContext[] = [
  { id: "academic", label: "Academics & Study", icon: GraduationCap, color: "#00BFA5" },
  { id: "teamwork", label: "Teamwork & Leadership", icon: Users, color: "#38BDF8" },
  { id: "projects", label: "Independent Inquiry", icon: Lightbulb, color: "#F59E0B" },
  { id: "creative", label: "Extracurriculars & Clubs", icon: Compass, color: "#EC4899" },
];

export const StrengthsInActionGrid: React.FC<StrengthsInActionGridProps> = ({
  strengths,
  title = "Signature Strengths in Real-World Action",
  subtitle = "How your top psychometric abilities translate into concrete everyday success across school, collaborative teams, and future careers.",
}) => {
  const [activeContext, setActiveContext] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Take top calibrated strengths
  const topStrengths = strengths.slice(0, 6);

  // Generate dynamic contextual actions for each strength
  const getContextualAdvice = (name: string, desc: string, score: number) => {
    const lower = name.toLowerCase();
    
    if (lower.includes("analy") || lower.includes("logic") || lower.includes("inquiry") || lower.includes("critical")) {
      return {
        academic: "Excel in STEM, Economics, and Data coursework by breaking multi-step formulas into logical tree diagrams.",
        teamwork: "Act as the objective anchor in team debates—help peers evaluate evidence and verify assumptions before building.",
        projects: "Lead investigative science fair projects or independent market analysis where rigorous proof matters.",
        creative: "Design strategy game mechanics, debate tournament cases, or complex algorithmic puzzle solvers.",
      };
    } else if (lower.includes("creat") || lower.includes("art") || lower.includes("innov") || lower.includes("design")) {
      return {
        academic: "Synthesize complex historical concepts and literature through visual mind maps, sketchnotes, and conceptual metaphors.",
        teamwork: "Serve as the visionary storyteller—translate abstract ideas into compelling slide decks and engaging presentations.",
        projects: "Create digital media, UI prototypes, or creative writing portfolios that challenge conventional norms.",
        creative: "Join film making, theater set design, literary magazines, or digital art hackathons.",
      };
    } else if (lower.includes("social") || lower.includes("empath") || lower.includes("collab") || lower.includes("communi")) {
      return {
        academic: "Thrive in peer study pods and seminar-style discussions by explaining difficult concepts back to peers.",
        teamwork: "Bridge communication divides, resolve interpersonal friction, and ensure every group member feels valued.",
        projects: "Organize community outreach initiatives, mentorship circles, or social impact campaigns.",
        creative: "Participate in Model UN, student council leadership, podcasts, and community storytelling.",
      };
    } else if (lower.includes("leader") || lower.includes("enterpris") || lower.includes("initiat") || lower.includes("organ")) {
      return {
        academic: "Set structured 30-day revision goals, track study sprint velocity, and maintain meticulous academic planners.",
        teamwork: "Drive project timelines, coordinate deliverables, define milestone checkpoints, and inspire team momentum.",
        projects: "Launch student clubs, organize school conferences, or build entrepreneurial mini-ventures.",
        creative: "Lead event organizing committees, debate societies, or student entrepreneurship incubators.",
      };
    }

    return {
      academic: "Apply your disciplined focus to systematically master core foundational concepts ahead of exam schedules.",
      teamwork: "Provide reliable execution and thoughtful feedback to keep collaborative initiatives on track.",
      projects: "Tackle structured challenges that reward patience, precision, and continuous iterative refinement.",
      creative: "Explore diverse multidisciplinary clubs and cross-domain workshops to expand your horizons.",
    };
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0B1B19] via-[#112926] to-[#0A1615] border border-[#00BFA5]/30 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden print:p-5 print:rounded-2xl print:bg-none print:bg-white print:text-[#172B2A] print:border-[#E3ECEA]">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#00BFA5]/15 blur-3xl print:hidden" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6 print:border-[#E3ECEA] print:pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>05. Strengths in Action Engine</span>
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#00BFA5]/20 text-[#00C896] border border-[#00BFA5]/30 print:hidden">
              Actionable Translations
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight print:text-[#172B2A]">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-[#9FB3B0] max-w-xl leading-relaxed print:text-[#526866]">
            {subtitle}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap print:hidden">
          <button
            onClick={() => setActiveContext("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeContext === "all"
                ? "bg-[#00BFA5] text-[#0B1B19] shadow-md shadow-[#00BFA5]/25"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
            }`}
          >
            All Contexts
          </button>
          {ACTION_CONTEXTS.map((ctx) => {
            const Icon = ctx.icon;
            const isActive = activeContext === ctx.id;
            return (
              <button
                key={ctx.id}
                onClick={() => setActiveContext(ctx.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? "bg-[#00BFA5] text-[#0B1B19] shadow-md shadow-[#00BFA5]/25"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{ctx.label.split("&")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Strengths Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
        {topStrengths.map((item, idx) => {
          const score = item.scalePositionPercentage ?? (item as any).score ?? (item as any).rawScore ?? 80;
          const advice = getContextualAdvice(item.name, item.description || "", score);
          const isExpanded = expandedId === item.code || idx === 0;

          return (
            <div
              key={item.code || idx}
              className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 hover:border-[#00BFA5]/40 hover:bg-white/[0.05] transition-all duration-300 flex flex-col justify-between group print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A] print:p-4"
            >
              <div>
                {/* Card Top: Rank + Score Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1 bg-[#00BFA5]/10 px-2.5 py-0.5 rounded-full border border-[#00BFA5]/20 print:bg-white print:border-[#00BFA5]">
                    <Award className="w-3 h-3" />
                    Top Strength #{idx + 1}
                  </span>
                  <div className="text-right">
                    <span className="text-xs font-mono font-black text-white print:text-[#172B2A]">{score}%</span>
                    <span className="text-[9px] uppercase tracking-wider text-white/40 block print:text-[#688582]">Percentile</span>
                  </div>
                </div>

                {/* Strength Title */}
                <h3 className="text-base font-black text-white group-hover:text-[#00BFA5] transition-colors print:text-[#172B2A] mb-1.5">
                  {item.name}
                </h3>
                <p className="text-xs text-[#9FB3B0] leading-relaxed mb-4 line-clamp-2 print:text-[#526866]">
                  {item.description || "Demonstrates strong psychometric proficiency and consistent execution in this behavioral domain."}
                </p>

                {/* Contextual Action Items */}
                <div className="space-y-2.5 pt-2 border-t border-white/5 print:border-[#E3ECEA]">
                  {(activeContext === "all" || activeContext === "academic") && (
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-[#C5D6D3] print:bg-white print:border-[#E3ECEA] print:text-[#2A4442]">
                      <div className="flex items-center gap-1.5 font-bold text-[#00BFA5] text-[11px] mb-1">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Academic Superpower</span>
                      </div>
                      <p className="leading-snug text-[11px]">{advice.academic}</p>
                    </div>
                  )}

                  {(activeContext === "all" || activeContext === "teamwork") && (
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-[#C5D6D3] print:bg-white print:border-[#E3ECEA] print:text-[#2A4442]">
                      <div className="flex items-center gap-1.5 font-bold text-[#38BDF8] text-[11px] mb-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>In Team Sprints</span>
                      </div>
                      <p className="leading-snug text-[11px]">{advice.teamwork}</p>
                    </div>
                  )}

                  {(activeContext === "all" || activeContext === "projects") && (
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-[#C5D6D3] print:bg-white print:border-[#E3ECEA] print:text-[#2A4442]">
                      <div className="flex items-center gap-1.5 font-bold text-[#F59E0B] text-[11px] mb-1">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Project Breakthrough</span>
                      </div>
                      <p className="leading-snug text-[11px]">{advice.projects}</p>
                    </div>
                  )}

                  {(activeContext === "all" || activeContext === "creative") && (
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-[#C5D6D3] print:bg-white print:border-[#E3ECEA] print:text-[#2A4442]">
                      <div className="flex items-center gap-1.5 font-bold text-[#EC4899] text-[11px] mb-1">
                        <Compass className="w-3.5 h-3.5" />
                        <span>Extracurricular Zone</span>
                      </div>
                      <p className="leading-snug text-[11px]">{advice.creative}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer: Level Tag */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] print:border-[#E3ECEA]">
                <span className="text-white/40 uppercase font-mono tracking-wider print:text-[#688582]">Calibration</span>
                <span className="font-bold text-[#00C896] bg-[#00BFA5]/10 px-2 py-0.5 rounded-md print:text-[#008F83] print:bg-emerald-50">
                  {item.level || (score >= 80 ? "Mastery Anchor" : "High Strength")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

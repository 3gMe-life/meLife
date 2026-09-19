"use client";

import React from "react";
import Link from "next/link";
import { Compass, Sparkles, Brain, Briefcase, Map, Users, CheckCircle2, ArrowRight } from "lucide-react";

const JOURNEY_STEPS = [
  {
    step: 1,
    title: "Assessment Profile",
    desc: "Baseline demographic & academic identity setup.",
    href: "/participant/dashboard",
    icon: Compass,
    state: "completed" as const,
  },
  {
    step: 2,
    title: "Stream Finder",
    desc: "Senior Secondary (Class 11–12) stream orientation.",
    href: "/participant/results",
    icon: Sparkles,
    state: "current" as const,
  },
  {
    step: 3,
    title: "Skill Finder",
    desc: "RIASEC vocational interests & cognitive strengths.",
    href: "/participant/assessments",
    icon: Brain,
    state: "next" as const,
  },
  {
    step: 4,
    title: "Career Finder",
    desc: "Discipline-specific career battery evaluations.",
    href: "/participant/assessments",
    icon: Briefcase,
    state: "future" as const,
  },
  {
    step: 5,
    title: "Career Pathways",
    desc: "Interactive educational milestones & course catalogs.",
    href: "/participant/careers",
    icon: Map,
    state: "future" as const,
  },
  {
    step: 6,
    title: "Counsellor Connect",
    desc: "1-on-1 guidance to lock in subjects & future roadmap.",
    href: "/participant/counsellors",
    icon: Users,
    state: "future" as const,
  },
];

export const StreamMeLifeJourneyMap: React.FC = () => {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0B1B19] via-[#112926] to-[#0A1615] border border-[#00BFA5]/30 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden print:p-5 print:rounded-2xl print:bg-none print:bg-white print:text-[#172B2A] print:border-[#E3ECEA]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5 mb-6 print:border-[#E3ECEA] print:pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5 print:text-[#008F83]">
              <Map className="w-3.5 h-3.5" />
              <span>07. Exploration Roadmap</span>
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight print:text-[#172B2A]">
            The MeLife Discovery Journey
          </h3>
          <p className="text-xs sm:text-sm text-[#9FB3B0] max-w-xl leading-relaxed print:text-[#526866]">
            Where your Stream Finder evaluation sits within the progressive 6-stage career navigation lifecycle.
          </p>
        </div>

        <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[#00BFA5]/20 text-[#00C896] border border-[#00BFA5]/30 self-start sm:self-auto print:border-[#00BFA5] print:text-[#008F83]">
          Step 2 of 6 Completed
        </span>
      </div>

      {/* 6-Stage Timeline (Responsive Horizontal Desktop, Vertical Mobile) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        {JOURNEY_STEPS.map((item) => {
          const Icon = item.icon;
          const isCurrent = item.state === "current";
          const isCompleted = item.state === "completed";
          const isNext = item.state === "next";

          return (
            <Link
              key={item.step}
              href={item.href}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between group ${
                isCurrent
                  ? "bg-[#00BFA5]/15 border-[#00BFA5] shadow-lg shadow-[#00BFA5]/15 print:bg-emerald-50 print:border-[#00BFA5]"
                  : isCompleted
                  ? "bg-white/[0.03] border-white/10 hover:border-white/20 print:bg-[#F7FAF9] print:border-[#E3ECEA]"
                  : isNext
                  ? "bg-sky-500/10 border-sky-500/30 hover:border-sky-400/50 print:bg-sky-50/50 print:border-sky-200"
                  : "bg-white/[0.01] border-white/5 opacity-80 hover:opacity-100 hover:border-white/15 print:bg-white print:border-[#E3ECEA]"
              } print:text-[#172B2A] print:p-4`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-mono font-black flex items-center justify-center ${
                        isCurrent
                          ? "bg-[#00BFA5] text-[#0B1B19]"
                          : isCompleted
                          ? "bg-emerald-500/20 text-[#00C896]"
                          : isNext
                          ? "bg-sky-500/20 text-sky-300"
                          : "bg-white/10 text-white/60 print:bg-[#E3ECEA] print:text-[#172B2A]"
                      }`}
                    >
                      {item.step}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-white/50 print:text-[#688582]">
                      Stage 0{item.step}
                    </span>
                  </div>

                  <div
                    className={`p-1.5 rounded-xl ${
                      isCurrent
                        ? "bg-[#00BFA5]/20 text-[#00C896]"
                        : isCompleted
                        ? "bg-emerald-500/15 text-emerald-400"
                        : isNext
                        ? "bg-sky-500/20 text-sky-300"
                        : "bg-white/5 text-white/60 print:bg-[#E3ECEA]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h4 className="text-sm font-black text-white group-hover:text-[#00BFA5] transition-colors print:text-[#172B2A] mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-[#C5D6D3] leading-relaxed print:text-[#526866]">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] print:border-[#E3ECEA]">
                <span
                  className={`font-bold ${
                    isCurrent
                      ? "text-[#00C896] print:text-[#008F83]"
                      : isCompleted
                      ? "text-emerald-400 print:text-[#059669]"
                      : isNext
                      ? "text-sky-300 print:text-[#0284C7]"
                      : "text-white/40 print:text-[#688582]"
                  }`}
                >
                  {isCurrent
                    ? "Current Active Phase"
                    : isCompleted
                    ? "Completed ✓"
                    : isNext
                    ? "Next Recommended Phase"
                    : "Future Exploration"}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all print:hidden" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

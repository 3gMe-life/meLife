"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckSquare, Square, ArrowRight, Target, Users, BookOpen, Brain, Map, Sparkles, Compass } from "lucide-react";

interface ActionStepItem {
  id: string;
  stepNumber: string;
  action: string;
  whyItMatters: string;
  whatToDo: string;
  href: string;
  icon: any;
  buttonLabel: string;
}

const ACTION_STEPS: ActionStepItem[] = [
  {
    id: "step-1",
    stepNumber: "01",
    action: "Explore Aligned Stream Syllabi",
    whyItMatters: "Validates classroom interest against real Senior Secondary textbook chapters and curriculum rigor.",
    whatToDo: "Download Class 11–12 NCERT / Board textbook chapters in your top two aligned streams and review introductory topics.",
    href: "/participant/results",
    icon: BookOpen,
    buttonLabel: "View Syllabi",
  },
  {
    id: "step-2",
    stepNumber: "02",
    action: "Review Core Subject Readiness",
    whyItMatters: "Ensures that your academic baseline and examination confidence match higher secondary prerequisites.",
    whatToDo: "Review your term marks in foundational prerequisites (Mathematics, Physical Sciences, Social Sciences, Languages).",
    href: "/participant/dashboard",
    icon: Target,
    buttonLabel: "Check Performance",
  },
  {
    id: "step-3",
    stepNumber: "03",
    action: "Cross-Reference with Skill Finder",
    whyItMatters: "Connects stream preferences to your broader RIASEC vocational interest profile and problem-solving metrics.",
    whatToDo: "Complete or review your Skill Finder assessment to identify complementary cognitive strengths and interest vectors.",
    href: "/participant/assessments",
    icon: Brain,
    buttonLabel: "Open Skill Finder",
  },
  {
    id: "step-4",
    stepNumber: "04",
    action: "Explore 100+ Career Pathways",
    whyItMatters: "Broadens horizons beyond traditional career paths to modern interdisciplinary degrees and emerging specializations.",
    whatToDo: "Browse the MeLife Career Navigator to evaluate degree options, eligibility requirements, and long-term vocational cultures.",
    href: "/participant/careers",
    icon: Map,
    buttonLabel: "Explore Careers",
  },
  {
    id: "step-5",
    stepNumber: "05",
    action: "Consult with a Counsellor / Mentor",
    whyItMatters: "Provides objective expert facilitation to align student aspirations, parental expectations, and school criteria.",
    whatToDo: "Schedule a 1-on-1 session with an accredited school counsellor to lock in elective combinations and curriculum streams.",
    href: "/participant/counsellors",
    icon: Users,
    buttonLabel: "Book Session",
  },
];

const JOURNEY_MILESTONES = [
  { step: 1, title: "Assessment Profile", state: "Completed ✓", isCurrent: false, icon: Compass },
  { step: 2, title: "Stream Finder", state: "Current Active", isCurrent: true, icon: Sparkles },
  { step: 3, title: "Skill Finder", state: "Next Milestone", isCurrent: false, icon: Brain },
  { step: 4, title: "Career Finder", state: "Future Horizon", isCurrent: false, icon: Target },
  { step: 5, title: "Career Pathways", state: "Future Horizon", isCurrent: false, icon: Map },
  { step: 6, title: "Counsellor Connect", state: "Future Horizon", isCurrent: false, icon: Users },
];

export const StreamActionPlanRoadmap: React.FC = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0B1B19] via-[#112926] to-[#0A1615] border border-[#00BFA5]/30 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden print:p-5 print:rounded-2xl print:bg-none print:bg-white print:text-[#172B2A] print:border-[#E3ECEA] flex flex-col justify-between space-y-3 print:space-y-2">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3 mb-3 print:border-[#E3ECEA] print:pb-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5 print:text-[#008F83]">
                <Target className="w-3.5 h-3.5" />
                <span>07. Journey & Action Plan</span>
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight print:text-[#172B2A]">
              Discovery Journey & Action Plan
            </h3>
            <p className="text-xs text-[#9FB3B0] max-w-xl leading-relaxed print:text-[#526866]">
              Structured roadmap connecting your current assessment milestone with 5 concrete action steps.
            </p>
          </div>

          <div className="text-xs font-mono font-bold text-[#00C896] bg-[#00BFA5]/20 px-2.5 py-0.5 rounded-lg border border-[#00BFA5]/30 self-start sm:self-auto print:border-[#00BFA5] print:text-[#008F83]">
            {completedCount} of {ACTION_STEPS.length} Steps Completed
          </div>
        </div>

        {/* 6-Stage Journey Horizontal Strip */}
        <div className="mb-3 p-3 rounded-xl bg-white/[0.03] border border-white/10 print:bg-[#F7FAF9] print:border-[#E3ECEA] print:p-2">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#00C896] block mb-1.5 print:text-[#008F83]">
            THE MELIFE 6-STAGE EXPLORATION LIFECYCLE
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
            {JOURNEY_MILESTONES.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.step}
                  className={`p-1.5 rounded-lg border text-center space-y-0.5 ${
                    m.isCurrent
                      ? "bg-[#00BFA5]/20 border-[#00BFA5] text-[#00C896] print:bg-emerald-50 print:border-[#00BFA5]"
                      : "bg-white/[0.02] border-white/10 text-white/70 print:bg-white print:border-[#E3ECEA] print:text-[#526866]"
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <Icon className="w-3 h-3" />
                  </div>
                  <p className="text-[10px] font-black truncate text-white print:text-[#172B2A]">{m.title}</p>
                  <span className="text-[8px] font-mono block opacity-80">{m.state}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5 Steps Action Table */}
        <div className="space-y-2 relative z-10">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-white/50 block print:text-[#688582]">
            DECISION ACTION ROADMAP
          </span>

          {ACTION_STEPS.map((step) => {
            const isDone = !!checked[step.id];

            return (
              <div
                key={step.id}
                className={`p-2.5 sm:p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                  isDone
                    ? "bg-emerald-500/15 border-emerald-500/40 text-[#A7F3D0] print:bg-emerald-50 print:border-[#00BFA5]"
                    : "bg-white/[0.03] border-white/10 hover:border-white/20 print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A]"
                } print:p-2`}
              >
                <div
                  onClick={() => toggleCheck(step.id)}
                  className="flex items-start gap-2.5 cursor-pointer select-none flex-1"
                >
                  <div className="shrink-0 mt-0.5">
                    {isDone ? (
                      <CheckSquare className="w-4 h-4 text-[#00BFA5]" />
                    ) : (
                      <Square className="w-4 h-4 text-white/40 print:text-[#688582]" />
                    )}
                  </div>

                  <div className="space-y-0.5 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 rounded bg-white/10 text-white/80 border border-white/15 print:border-[#E3ECEA] print:text-[#172B2A]">
                        STEP {step.stepNumber}
                      </span>
                      <h4 className={`text-xs sm:text-sm font-black text-white print:text-[#172B2A] ${isDone ? "line-through opacity-80" : ""}`}>
                        {step.action}
                      </h4>
                    </div>

                    <p className="text-[10.5px] text-[#9FB3B0] leading-snug print:text-[#526866]">
                      <strong className="text-white/80 print:text-[#172B2A]">Why it matters:</strong> {step.whyItMatters}
                    </p>
                    <p className="text-[10.5px] text-[#C5D6D3] leading-snug print:text-[#415654]">
                      <strong className="text-white/80 print:text-[#172B2A]">What to do:</strong> {step.whatToDo}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md ${isDone ? "bg-emerald-500/20 text-[#00C896]" : "bg-white/5 text-white/50"}`}>
                    {isDone ? "COMPLETED" : "PENDING"}
                  </span>
                  <Link
                    href={step.href}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-bold transition-all print:hidden"
                  >
                    <span>{step.buttonLabel}</span>
                    <ArrowRight className="w-3 h-3 text-[#00BFA5]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckSquare, Square, ArrowRight, Target, Users, BookOpen, Brain, Map } from "lucide-react";

const NEXT_STEPS = [
  {
    id: "step-1",
    title: "Explore Your Aligned Stream Syllabi",
    desc: "Review the Class 11–12 textbook chapters and subject requirements for your top aligned streams.",
    href: "/participant/results",
    icon: BookOpen,
  },
  {
    id: "step-2",
    title: "Review Your Core Subject Readiness",
    desc: "Assess your current confidence and term performance in foundational prerequisite subjects (Maths, Science, Social Sciences).",
    href: "/participant/dashboard",
    icon: Target,
  },
  {
    id: "step-3",
    title: "Evaluate Your Skill Finder Psychometrics",
    desc: "Cross-reference your stream leaning with your cognitive problem-solving style and RIASEC interest code.",
    href: "/participant/assessments",
    icon: Brain,
  },
  {
    id: "step-4",
    title: "Explore Detailed Career Pathways",
    desc: "Browse 100+ degree programs, entrance requirements, and early career horizons in the Career Pathways navigator.",
    href: "/participant/careers",
    icon: Map,
  },
  {
    id: "step-5",
    title: "Discuss Options with a Counsellor or Mentor",
    desc: "Have a structured conversation with your parents and an accredited educational counsellor before final subject selection.",
    href: "/participant/counsellors",
    icon: Users,
  },
];

export const StreamNextStepsSection: React.FC = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0B1B19] via-[#112926] to-[#0A1615] border border-[#00BFA5]/30 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden print:p-5 print:rounded-2xl print:bg-none print:bg-white print:text-[#172B2A] print:border-[#E3ECEA]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5 mb-6 print:border-[#E3ECEA] print:pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5 print:text-[#008F83]">
              <Target className="w-3.5 h-3.5" />
              <span>08. Action Plan • Your Next Steps</span>
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight print:text-[#172B2A]">
            Actionable Decision Milestones
          </h3>
          <p className="text-xs sm:text-sm text-[#9FB3B0] max-w-xl leading-relaxed print:text-[#526866]">
            Concrete, low-pressure steps to help you validate your stream decision before senior secondary school enrollment.
          </p>
        </div>

        <div className="text-xs font-mono font-bold text-[#00C896] bg-[#00BFA5]/15 px-3 py-1 rounded-xl border border-[#00BFA5]/30 self-start sm:self-auto print:hidden">
          {Object.values(checked).filter(Boolean).length} of {NEXT_STEPS.length} Completed
        </div>
      </div>

      {/* 5 Steps Checklist */}
      <div className="space-y-3 relative z-10">
        {NEXT_STEPS.map((step, idx) => {
          const isDone = !!checked[step.id];
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDone
                  ? "bg-emerald-500/15 border-emerald-500/40 text-[#A7F3D0] print:bg-emerald-50 print:border-[#00BFA5]"
                  : "bg-white/[0.03] border-white/10 hover:border-white/20 print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A]"
              }`}
            >
              <div
                onClick={() => toggleCheck(step.id)}
                className="flex items-start gap-3.5 cursor-pointer select-none flex-1"
              >
                <div className="shrink-0 mt-0.5">
                  {isDone ? (
                    <CheckSquare className="w-5 h-5 text-[#00BFA5]" />
                  ) : (
                    <Square className="w-5 h-5 text-white/40 print:text-[#688582]" />
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/40 print:text-[#688582]">
                      Step {idx + 1}
                    </span>
                    <h4
                      className={`text-sm sm:text-base font-black text-white print:text-[#172B2A] ${
                        isDone ? "line-through opacity-80" : ""
                      }`}
                    >
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-xs text-[#C5D6D3] leading-relaxed print:text-[#526866]">
                    {step.desc}
                  </p>
                </div>
              </div>

              <Link
                href={step.href}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-bold shrink-0 self-start sm:self-auto transition-all print:hidden"
              >
                <span>Open Module</span>
                <ArrowRight className="w-3 h-3 text-[#00BFA5]" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

"use client";

import React from "react";
import { Brain, BookOpen, Lightbulb, Target, Wrench, Sparkles, Compass } from "lucide-react";
import { StreamFinderResult } from "../../../types/assessment.types";

interface StreamProfileInterpretationProps {
  result: StreamFinderResult;
}

const SECTION_META: Record<
  string,
  { icon: any; color: string; studentSummary: string; keyTakeaway: string }
> = {
  ACADEMIC_INTEREST: {
    icon: BookOpen,
    color: "#00BFA5",
    studentSummary: "Your natural curiosity and spontaneous enjoyment when engaging with core subject domains.",
    keyTakeaway: "Reflects which school topics energize your attention during independent study.",
  },
  PROBLEM_SOLVING: {
    icon: Brain,
    color: "#38BDF8",
    studentSummary: "How you naturally approach complex challenges, analytical puzzles, and structured reasoning.",
    keyTakeaway: "Highlights whether you lean toward step-by-step logic, conceptual metaphors, or intuitive synthesis.",
  },
  LEARNING_STYLE: {
    icon: Lightbulb,
    color: "#F59E0B",
    studentSummary: "Your preferred environment and sensory mode for absorbing and retaining difficult concepts.",
    keyTakeaway: "Indicates how you learn fastest—through diagrams, applied building, or deep reflective reading.",
  },
  CAREER_ORIENTATION: {
    icon: Target,
    color: "#EC4899",
    studentSummary: "The long-term work environments, societal contributions, and vocational goals you find meaningful.",
    keyTakeaway: "Connects your classroom interests to broader professional impact and career cultures.",
  },
  APTITUDE_PREFERENCE: {
    icon: Compass,
    color: "#10B981",
    studentSummary: "Intuitive preferences revealed when choosing between competing academic and intellectual tasks.",
    keyTakeaway: "Measures where your natural instincts gravitate when faced with equal-value options.",
  },
  SITUATIONAL_INDICATORS: {
    icon: Wrench,
    color: "#6366F1",
    studentSummary: "Real-world decision-making patterns in practical team, lab, and project scenarios.",
    keyTakeaway: "Shows how your academic inclinations translate into tangible everyday actions.",
  },
};

export const StreamProfileInterpretation: React.FC<StreamProfileInterpretationProps> = ({ result }) => {
  const sections = result.sectionBreakdown || [];

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0B1B19] via-[#112926] to-[#0A1615] border border-[#00BFA5]/30 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden print:p-5 print:rounded-2xl print:bg-none print:bg-white print:text-[#172B2A] print:border-[#E3ECEA]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5 mb-6 print:border-[#E3ECEA] print:pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5 print:text-[#008F83]">
              <Brain className="w-3.5 h-3.5" />
              <span>03. What Your Profile Suggests</span>
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight print:text-[#172B2A]">
            Cognitive & Behavioral Dimensions
          </h3>
          <p className="text-xs sm:text-sm text-[#9FB3B0] max-w-xl leading-relaxed print:text-[#526866]">
            Explains what your assessment responses indicate across the 6 core evaluated psychometric constructs.
          </p>
        </div>

        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 self-start sm:self-auto print:border-[#00B8D4] print:text-[#008F83]">
          6 Evaluated Dimensions
        </span>
      </div>

      {/* 6 Dimension Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        {sections.map((sec, idx) => {
          const meta = SECTION_META[sec.sectionCode] || {
            icon: Sparkles,
            color: "#00BFA5",
            studentSummary: "Evaluates your domain response patterns and learning inclinations.",
            keyTakeaway: "Informs your holistic profile synthesis.",
          };
          const Icon = meta.icon;

          return (
            <div
              key={sec.sectionCode || idx}
              className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#00BFA5]/40 transition-all flex flex-col justify-between print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A] print:p-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div
                    className="p-2 rounded-xl"
                    style={{ backgroundColor: `${meta.color}20`, color: meta.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider print:text-[#688582]">
                    Dimension 0{idx + 1}
                  </span>
                </div>

                <h4 className="text-sm font-black text-white mb-1.5 print:text-[#172B2A]">
                  {sec.sectionName}
                </h4>
                <p className="text-xs text-[#C5D6D3] leading-relaxed mb-3 print:text-[#415654]">
                  {meta.studentSummary}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-white/5 text-[11px] text-[#00C896] font-medium leading-snug print:border-[#E3ECEA] print:text-[#008F83]">
                💡 {meta.keyTakeaway}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

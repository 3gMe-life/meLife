"use client";

import React from "react";
import { Compass, Activity, Brain, Target, Info } from "lucide-react";

interface HowToReadReportProps {
  className?: string;
}

export function HowToReadReport({ className = "" }: HowToReadReportProps) {
  const cards = [
    {
      title: "Interests",
      meaning: "What kinds of activities and environments attract you.",
      badge: "Interest Alignment",
      icon: <Compass className="w-4 h-4 text-[#008F83] dark:text-[#00BFA5]" />,
      style: "border-[#00BFA5]/30 bg-[#00BFA5]/5 text-[#172B2A] dark:text-[#F7FAF9]",
      badgeStyle: "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5]",
    },
    {
      title: "Skill Behaviours",
      meaning: "How you describe your typical approach to problem solving, communication, and collaboration.",
      badge: "Self-Reported Style",
      icon: <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      style: "border-emerald-500/30 bg-emerald-500/5 text-[#172B2A] dark:text-[#F7FAF9]",
      badgeStyle: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    },
    {
      title: "Demonstrated Aptitude",
      meaning: "How you performed on objective cognitive tasks in this specific assessment session.",
      badge: "Current Task Score",
      icon: <Brain className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />,
      style: "border-cyan-500/30 bg-cyan-500/5 text-[#172B2A] dark:text-[#F7FAF9]",
      badgeStyle: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400",
    },
    {
      title: "Developmental Habits",
      meaning: "Learning habits and adaptability that strengthen through practice, mentorship, and experience.",
      badge: "Malleable Habits",
      icon: <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      style: "border-amber-500/30 bg-amber-500/5 text-[#172B2A] dark:text-[#F7FAF9]",
      badgeStyle: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
    },
  ];

  return (
    <div
      className={`rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-5 sm:p-7 shadow-sm space-y-4 print:p-5 print:rounded-2xl print:border-[#E3ECEA] print:shadow-none print-break-avoid ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E3ECEA] dark:border-white/10 pb-3 print:pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
              How to Read Your ME LIFE Profile
            </h3>
            <p className="text-[11px] text-[#728B88] dark:text-[#9FB3B0]">
              Understanding the 4 distinct forms of psychometric evidence in this report
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-[#526866] dark:text-[#9FB3B0] self-start sm:self-auto">
          Interpretation Guide
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-2xl border ${card.style} flex flex-col justify-between space-y-2 transition-all`}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {card.icon}
                  <span className="text-xs font-bold">{card.title}</span>
                </div>
                <span
                  className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md ${card.badgeStyle}`}
                >
                  {card.badge}
                </span>
              </div>
              <p className="text-[11px] text-[#526866] dark:text-[#A7C2BF] leading-snug">
                {card.meaning}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-[11px] text-[#526866] dark:text-[#A7C2BF] flex items-start gap-2 leading-relaxed">
        <span className="text-[#00BFA5] font-bold text-xs shrink-0 mt-0.5">📌</span>
        <span>
          <strong className="text-[#172B2A] dark:text-white font-semibold">Important Interpretation Note: </strong>
          These scores describe different forms of evidence and should not be directly compared as if they measure the same thing. For example, a high self-reported interest score indicates what you enjoy, while an aptitude score reflects your performance on specific timed tasks today.
        </span>
      </div>
    </div>
  );
}

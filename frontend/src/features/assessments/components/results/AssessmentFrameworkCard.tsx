"use client";

import React from "react";
import { Layers, Compass, Activity, Brain, Target } from "lucide-react";

interface AssessmentFrameworkCardProps {
  className?: string;
}

export function AssessmentFrameworkCard({ className = "" }: AssessmentFrameworkCardProps) {
  const pillars = [
    {
      title: "Interest Profile",
      code: "RIASEC",
      weight: "25%",
      dimensions: "6 Dimensions",
      desc: "Intrinsic vocational attraction across task environments",
      icon: <Compass className="w-4 h-4 text-[#008F83] dark:text-[#00BFA5]" />,
      barColor: "bg-[#00BFA5]",
      bgBadge: "bg-[#00BFA5]/10 text-[#008F83] dark:text-[#00BFA5] border-[#00BFA5]/25",
    },
    {
      title: "Skill Behaviours",
      code: "STYLE",
      weight: "30%",
      dimensions: "8 Dimensions",
      desc: "Self-reported problem solving, communication & collaboration style",
      icon: <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      barColor: "bg-emerald-500",
      bgBadge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
    },
    {
      title: "Cognitive Aptitude",
      code: "ACCURACY",
      weight: "25%",
      dimensions: "8 Dimensions",
      desc: "Objective task performance across reasoning & logic challenges",
      icon: <Brain className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />,
      barColor: "bg-cyan-500",
      bgBadge: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/25",
    },
    {
      title: "Developmental Habits",
      code: "GROWTH",
      weight: "20%",
      dimensions: "7 Dimensions",
      desc: "Trainable learning habits, curiosity, adaptability & drive",
      icon: <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      barColor: "bg-amber-500",
      bgBadge: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25",
    },
  ];

  return (
    <div
      className={`rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-5 sm:p-7 shadow-sm space-y-4 print:p-5 print:rounded-2xl print:border-[#E3ECEA] print:shadow-none print-break-avoid ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E3ECEA] dark:border-white/10 pb-3 print:pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
              Four-Layer Assessment Framework
            </h3>
            <p className="text-[11px] text-[#728B88] dark:text-[#9FB3B0]">
              29 Dimensions evaluated across 4 complementary evidence layers
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 self-start sm:self-auto px-2.5 py-1 rounded-full bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-[10px] font-mono font-bold text-[#526866] dark:text-[#9FB3B0]">
          <span>29 Dimensions Evaluated</span>
          <span>•</span>
          <span className="text-[#008F83] dark:text-[#00BFA5] font-black">Balanced Multi-Layer Model</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {pillars.map((p, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 flex flex-col justify-between space-y-2.5 print:bg-[#F9FCFB] print:border-[#E3ECEA]"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {p.icon}
                  <span className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                    {p.title}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-md border ${p.bgBadge}`}
                >
                  {p.weight}
                </span>
              </div>
              <p className="text-[10.5px] text-[#728B88] dark:text-[#9FB3B0] leading-snug line-clamp-2">
                {p.desc}
              </p>
            </div>

            <div className="space-y-1 pt-1 border-t border-[#E3ECEA]/70 dark:border-white/5">
              <div className="flex items-center justify-between text-[9.5px] font-mono text-[#526866] dark:text-[#9FB3B0]">
                <span>{p.dimensions}</span>
                <span className="font-bold text-[#172B2A] dark:text-white">{p.weight} Model Weight</span>
              </div>
              <div className="w-full bg-[#E3ECEA] dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${p.barColor}`}
                  style={{ width: p.weight }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

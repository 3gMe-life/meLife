"use client";

import React from "react";
import { Compass, Sparkles, Target, Eye, Users, RotateCcw } from "lucide-react";

interface ActionPlan30_60Props {
  primaryInterest?: string;
  practiceArea?: string;
  growthSuggestions?: string[];
  className?: string;
}

export function ActionPlan30_60({
  primaryInterest = "practical and technical projects",
  practiceArea = "spatial and numerical reasoning challenges",
  growthSuggestions = [],
  className = "",
}: ActionPlan30_60Props) {
  const steps = [
    {
      num: "01",
      verb: "Explore",
      title: "Try One Practical Project",
      description: `Engage with one hands-on project aligned with your strongest interest domain in ${primaryInterest}.`,
      icon: <Compass className="w-4 h-4 text-[#008F83] dark:text-[#00BFA5]" />,
      badge: "Week 1–2",
    },
    {
      num: "02",
      verb: "Practice",
      title: "Strengthen Task Evidence",
      description: `Choose one aptitude area (such as ${practiceArea}) and practice puzzle-solving or structured exercises twice a week.`,
      icon: <Target className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />,
      badge: "Week 3–4",
    },
    {
      num: "03",
      verb: "Observe",
      title: "Notice What Energizes You",
      description: "Pay attention to whether you genuinely enjoy the workflow, problem-solving, and teamwork after repeated exposure.",
      icon: <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      badge: "Week 5–6",
    },
    {
      num: "04",
      verb: "Discuss",
      title: "Review with a Mentor",
      description: "Share your project experiences with a parent, educator, or certified career counsellor for personalized subject trajectory advice.",
      icon: <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      badge: "Week 7–8",
    },
    {
      num: "05",
      verb: "Reassess Later",
      title: "Compare Patterns Over Time",
      description: "Retake in 3–6 months to review changes in current task performance, shifting interests, and developmental indicators.",
      icon: <RotateCcw className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
      badge: "Month 3+",
    },
  ];

  return (
    <div
      className={`rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-5 sm:p-7 shadow-sm space-y-5 print:p-5 print:rounded-2xl print:bg-white print:border-[#E3ECEA] print:shadow-none print-break-avoid ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E3ECEA] dark:border-white/10 pb-3 print:border-[#E3ECEA] print:pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center shrink-0 print:border print:border-[#00BFA5]/30 print:text-[#008F83]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight print:text-[#172B2A]">
              Your Next 30–60 Days
            </h3>
            <p className="text-[11px] text-[#728B88] dark:text-[#9FB3B0] print:text-[#526866]">
              Step-by-step constructive exploration plan to build verified capability
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#00BFA5]/10 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/25 self-start sm:self-auto print:border-[#00BFA5] print:text-[#008F83] print:bg-[#F0FDF4]">
          Actionable Pathway
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 flex flex-col justify-between space-y-2.5 print:bg-[#F9FCFB] print:border-[#E3ECEA]"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-lg bg-white dark:bg-white/10 border border-[#E3ECEA] dark:border-white/15 text-[10px] font-mono font-black text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center print:border-[#E3ECEA] print:text-[#008F83]">
                  {s.num}
                </span>
                <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/80 dark:bg-white/10 border border-[#E3ECEA] dark:border-white/10 text-[#728B88] dark:text-[#9FB3B0] print:text-[#526866] print:border-[#E3ECEA]">
                  {s.badge}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  {s.icon}
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] print:text-[#008F83]">
                    {s.verb}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] print:text-[#172B2A]">
                  {s.title}
                </h4>
              </div>

              <p className="text-[10.5px] text-[#526866] dark:text-[#A7C2BF] print:text-[#415654] leading-relaxed">
                {s.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {growthSuggestions.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-[#00BFA5]/5 border border-[#00BFA5]/20 space-y-1.5 text-xs text-[#172B2A] dark:text-[#E0EBE8] print:bg-[#F0FDF4] print:border-[#00BFA5]/30 print:text-[#172B2A]">
          <span className="text-[10.5px] font-bold text-[#008F83] dark:text-[#00BFA5] print:text-[#008F83] block">
            Custom Tailored Suggestions:
          </span>
          <ul className="space-y-1 pl-4 list-disc text-[11px] text-[#526866] dark:text-[#A7C2BF] print:text-[#415654]">
            {growthSuggestions.slice(0, 3).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

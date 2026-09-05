import React from "react";
import { ReportParentGuidanceData } from "../../types/career-report.types";
import { Users, Heart, MessageCircle, AlertTriangle, Lightbulb } from "lucide-react";

interface ParentGuidanceSectionProps {
  data: ReportParentGuidanceData;
}

export const ParentGuidanceSection: React.FC<ParentGuidanceSectionProps> = ({ data }) => {
  return (
    <div id="section-parent-guidance" className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Section 08
          </div>
          <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
            Parent & Guardian Guidance Framework
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Supportive recommendations to nurture your child&apos;s curiosity, resilience, and career exploration
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* Nurturing Mindset Philosophy Banner */}
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-transparent dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-transparent p-5 md:p-6 flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm md:text-base text-emerald-900 dark:text-emerald-300">
              The Nurturing Mindset: Exploration Over Premature Pressure
            </h3>
            <p className="mt-1.5 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {data.nurturingMindset}
            </p>
          </div>
        </div>

        {/* 2-Column: How Parents Can Support vs Things to Avoid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* How Parents Can Support */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-5 md:p-6">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              <Lightbulb className="h-4 w-4" />
              Constructive Ways Parents Can Support
            </h4>
            <ul className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              {(data.howParentsCanSupport || []).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-950 text-[10px] font-bold text-teal-700 dark:text-teal-300 mt-0.5">
                    ✓
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Things to Avoid */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-5 md:p-6">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-4 w-4" />
              Common Pitfalls & Things to Avoid
            </h4>
            <ul className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              {(data.thingsToAvoid || []).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950 text-[10px] font-bold text-rose-700 dark:text-rose-300 mt-0.5">
                    ✕
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommended Family Discussions */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-50/40 dark:bg-amber-950/20 p-5 md:p-6">
          <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            <MessageCircle className="h-4 w-4" />
            Recommended Family Discussion Starters
          </h4>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {(data.recommendedDiscussions || []).map((disc, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-white dark:bg-slate-800 p-4 border border-amber-200/60 dark:border-amber-900/40 text-xs italic text-slate-700 dark:text-slate-300 leading-relaxed shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <span className="not-italic text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
                    Discussion Prompt 0{idx + 1}
                  </span>
                  {disc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

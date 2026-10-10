import React from "react";
import { ReportExecutiveSummaryData } from "../../types/career-report.types";
import { FileText, Sparkles, Brain, Palette, MessageSquare, Sprout } from "lucide-react";

interface ExecutiveSummarySectionProps {
  data: ReportExecutiveSummaryData;
}

export const ExecutiveSummarySection: React.FC<ExecutiveSummarySectionProps> = ({ data }) => {
  return (
    <div id="section-summary" className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm transition-all">
      {/* Section Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Section 02
          </div>
          <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
            Executive Summary &amp; Learning Orientation
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Holistic synthesis of student cognitive tendencies and exploratory approach
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* Core synthesis narrative card */}
        <div className="rounded-2xl border border-teal-100 dark:border-teal-900/40 bg-gradient-to-br from-teal-50/70 via-emerald-50/30 to-transparent dark:from-teal-950/30 dark:via-emerald-950/20 dark:to-transparent p-5 md:p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 mb-2">
            <Sparkles className="h-4 w-4 text-teal-600" />
            Holistic Cognitive &amp; Analytical Synthesis
          </div>
          <p className="text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-200 font-normal">
            {data.summary}
          </p>
        </div>

        {/* 4 Highlight Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Key Strengths */}
          <div className="rounded-2xl border border-teal-200/80 dark:border-teal-800/60 bg-teal-50/30 dark:bg-teal-950/20 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  <Brain className="h-4 w-4 text-teal-600 dark:text-teal-400" /> Analytical Thinking &amp; Key Strengths
                </div>
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/60 px-2 py-0.5 rounded-full">
                  Demonstrated
                </span>
              </div>
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {data.topStrengths.map((str, idx) => (
                  <span
                    key={idx}
                    className="rounded-xl border border-teal-200 dark:border-teal-800/80 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs"
                  >
                    {str}
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
              Demonstrated foundational cognitive competencies powering structured investigation.
            </p>
          </div>

          {/* Card 2: Learning Style */}
          <div className="rounded-2xl border border-sky-200/80 dark:border-sky-800/60 bg-sky-50/30 dark:bg-sky-950/20 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                  <Palette className="h-4 w-4 text-sky-600 dark:text-sky-400" /> Creative Problem Solving &amp; Learning Style
                </div>
                <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/60 px-2 py-0.5 rounded-full">
                  Applied
                </span>
              </div>
              <p className="mt-3 text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                {data.learningStyle}
              </p>
            </div>
            <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
              Optimal absorption through experiential prototyping and interactive problem decomposition.
            </p>
          </div>

          {/* Card 3: Interest Pattern */}
          <div className="rounded-2xl border border-amber-200/80 dark:border-amber-800/60 bg-amber-50/30 dark:bg-amber-950/20 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  <MessageSquare className="h-4 w-4 text-amber-600 dark:text-amber-400" /> Structured Communication &amp; Interest Pattern
                </div>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
                  Multi-Domain
                </span>
              </div>
              <p className="mt-3 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {data.interestPattern}
              </p>
            </div>
            <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
              Strong resonance with analytical tools, human systems, and technological design.
            </p>
          </div>

          {/* Card 4: Exploration Mindset */}
          <div className="rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/20 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  <Sprout className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Adaptable Learning &amp; Exploration Mindset
                </div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                  Growth-First
                </span>
              </div>
              <p className="mt-3 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {data.explorationMindset}
              </p>
            </div>
            <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
              Cultivate multi-disciplinary horizons and resilient adaptation to evolving fields.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

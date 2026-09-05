import React from "react";
import { ReportStrengthItem } from "../../types/career-report.types";
import { Zap, HelpCircle, BookOpen, Briefcase, Award, Sparkles } from "lucide-react";

interface StrengthAnalysisSectionProps {
  strengths: ReportStrengthItem[];
}

export const StrengthAnalysisSection: React.FC<StrengthAnalysisSectionProps> = ({ strengths }) => {
  return (
    <div id="section-strengths" className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400">
          <Zap className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Section 04
          </div>
          <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
            Cognitive & Developmental Strength Analysis
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Mapping student cognitive capabilities directly to learning mastery and career readiness
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        {(strengths || []).map((st, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-5 flex flex-col justify-between transition-all hover:border-teal-500/40 hover:shadow-md"
          >
            <div>
              {/* Header: Rank, Name and Score */}
              <div className="flex items-center justify-between gap-3 border-b border-slate-200/60 dark:border-slate-700/60 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold text-xs">
                    0{idx + 1}
                  </div>
                  <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">
                    {st.name}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-teal-600 dark:text-teal-400">
                    {st.score}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(10, st.score))}%` }}
                />
              </div>

              {/* 3-Way Exploration Impact Cards */}
              <div className="mt-4 space-y-2.5">
                {/* 1. What it means */}
                <div className="rounded-xl bg-white dark:bg-slate-800/80 p-3.5 border border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-700 dark:text-teal-300">
                    <HelpCircle className="h-3.5 w-3.5 text-teal-500" />
                    <span>What this means</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {st.whatItMeans}
                  </p>
                </div>

                {/* 2. How it helps learning */}
                <div className="rounded-xl bg-white dark:bg-slate-800/80 p-3.5 border border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-700 dark:text-sky-300">
                    <BookOpen className="h-3.5 w-3.5 text-sky-500" />
                    <span>How it helps learning</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {st.howItHelpsLearning}
                  </p>
                </div>

                {/* 3. How it connects with careers */}
                <div className="rounded-xl bg-white dark:bg-slate-800/80 p-3.5 border border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                    <Briefcase className="h-3.5 w-3.5 text-amber-500" />
                    <span>Career connection</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {st.howItConnectsWithCareers}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

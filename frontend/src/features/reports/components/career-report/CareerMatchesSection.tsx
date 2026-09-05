import React from "react";
import { ReportCareerMatchItem } from "../../types/career-report.types";
import { Compass, TrendingUp, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface CareerMatchesSectionProps {
  matches: ReportCareerMatchItem[];
}

export const CareerMatchesSection: React.FC<CareerMatchesSectionProps> = ({ matches }) => {
  return (
    <div id="section-matches" className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Section 05
            </div>
            <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
              Recommended Career Exploration Pathways
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ranked pathways mapped to student psychometric profile & demonstrated strengths
            </p>
          </div>
        </div>

        <Link
          href="/participant/careers"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 hover:underline"
        >
          Explore All Pathways <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {(matches || []).map((match, idx) => (
          <div
            key={match.id || idx}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 p-5 md:p-6 transition-all hover:border-teal-500/40 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:shadow-md"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left info */}
              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white font-black text-xs shadow-sm">
                  0{idx + 1}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white">
                      {match.title}
                    </h3>
                    <span className="rounded-full bg-slate-200 dark:bg-slate-700 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      {match.category}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <TrendingUp className="h-3 w-3" /> Growth: {match.futureGrowth}
                    </span>
                  </div>

                  <p className="mt-2 text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                    {match.whyThisMatches?.summary || match.whyThisMatches?.alignmentNote}
                  </p>
                </div>
              </div>

              {/* Right Match % */}
              <div className="flex items-center md:flex-col items-end justify-between shrink-0 pl-12 md:pl-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200 dark:border-slate-700">
                <div className="text-right">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Match Affinity</div>
                  <div className="text-2xl md:text-3xl font-black text-teal-600 dark:text-teal-400">
                    {match.matchPercentage}%
                  </div>
                </div>

                <div className="w-24 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 mt-1 hidden md:block">
                  <div
                    className="h-full rounded-full bg-teal-500"
                    style={{ width: `${Math.min(100, Math.max(10, match.matchPercentage))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Why this matches bullets */}
            {match.whyThisMatches?.topMatchingFactors && match.whyThisMatches.topMatchingFactors.length > 0 && (
              <div className="mt-3.5 pt-3 border-t border-slate-200/60 dark:border-slate-700/50">
                <div className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 mb-1.5">
                  Why this matches you:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                  {match.whyThisMatches.topMatchingFactors.slice(0, 3).map((f, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-1.5">
                      <span className="text-teal-500 font-bold">•</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom tags: required skills */}
            <div className="mt-3.5 pt-3 border-t border-slate-200/60 dark:border-slate-700/50 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[11px]">
                  <CheckCircle className="h-3.5 w-3.5 text-teal-500" /> Key Skills:
                </span>
                {(match.requiredSkills || []).slice(0, 5).map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <Link
                href={`/participant/careers/${match.slug || match.id}`}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                View Pathway Guide <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

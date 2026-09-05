import React from "react";
import { ReportAlternativePathwayItem } from "../../types/career-report.types";
import { Shuffle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface AlternativePathwaysSectionProps {
  pathways: ReportAlternativePathwayItem[];
}

export const AlternativePathwaysSection: React.FC<AlternativePathwaysSectionProps> = ({ pathways }) => {
  return (
    <div id="section-alternatives" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm transition-all">
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
          <Shuffle className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
            6. Alternative & Interdisciplinary Pathways
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Adjacent disciplines that share core cognitive traits and offer flexible future transitions
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {(pathways || []).map((pathway, idx) => (
          <div
            key={pathway.id || idx}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-4 flex flex-col justify-between transition-all hover:border-teal-500/40 hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  {pathway.category}
                </span>
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                  {pathway.matchPercentage}% Alignment
                </span>
              </div>

              <h3 className="mt-2.5 font-bold text-sm md:text-base text-slate-900 dark:text-white">
                {pathway.title}
              </h3>

              <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {pathway.relationNote}
              </p>

              <div className="mt-3 flex flex-wrap gap-1">
                {(pathway.skills || []).slice(0, 3).map((sk, sIdx) => (
                  <span
                    key={sIdx}
                    className="rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-[10px] text-slate-600 dark:text-slate-300"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
              <Link
                href={`/participant/careers/${pathway.slug || pathway.id}`}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center justify-between"
              >
                <span>Explore this Pathway</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

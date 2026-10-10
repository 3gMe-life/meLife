"use client";

import React from "react";
import { ReportCareerMatchItem } from "../../types/career-report.types";
import { Compass, ArrowRight, Info } from "lucide-react";
import Link from "next/link";
import { ExplainableCareerCard } from "../visual/ExplainableCareerCard";

interface CareerMatchesSectionProps {
  matches: ReportCareerMatchItem[];
}

export const CareerMatchesSection: React.FC<CareerMatchesSectionProps> = ({ matches }) => {
  return (
    <div id="section-matches" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
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
              Ranked pathways mapped to student interest profile &amp; demonstrated strengths
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

      {/* Alignment Score Disclaimer Banner */}
      <div className="rounded-2xl border border-teal-200/70 dark:border-teal-900/40 bg-teal-50/40 dark:bg-teal-950/20 p-4 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
        <Info className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold text-slate-900 dark:text-white">Career Alignment Scores: </strong>
          Career Alignment Scores indicate relative alignment between the student&apos;s current assessment profile and ME LIFE career reference profiles. They are exploratory indicators, not probabilities of future success.
        </p>
      </div>

      <div className="space-y-3.5">
        {(matches || []).map((match, idx) => (
          <div key={match.id || idx} className="space-y-1">
            <ExplainableCareerCard
              rank={idx + 1}
              career={{
                id: match.id,
                slug: match.slug,
                title: match.title,
                category: match.category,
                industry: match.industry,
                matchPercentage: match.matchPercentage,
                futureGrowth: match.futureGrowth,
                whyThisMatches: match.whyThisMatches,
                requiredSkills: match.requiredSkills,
              }}
            />
            {match.slug && (
              <div className="flex justify-end pr-2">
                <Link
                  href={`/participant/careers/${match.slug || match.id}`}
                  className="text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-1"
                >
                  Open Full {match.title} Curriculum Guide <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

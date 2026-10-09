"use client";

import React from "react";
import { Target, TrendingUp, ArrowRight } from "lucide-react";
import { DimensionScoreItem } from "../../types/assessment.types";

interface DevelopmentCardProps {
  developmentAreas: DimensionScoreItem[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function DevelopmentCard({
  developmentAreas,
  title = "Developmental Habit Focus Areas",
  subtitle = "Learning behaviours and target areas that can strengthen and expand further through practice and experience.",
  className = "",
}: DevelopmentCardProps) {
  if (!developmentAreas || developmentAreas.length === 0) return null;

  return (
    <div
      className={`rounded-3xl bg-white dark:bg-[#172B2A] border border-amber-500/30 p-6 sm:p-7 shadow-sm space-y-4 print:p-5 print:rounded-2xl print:border-[#E3ECEA] print:shadow-none print-break-avoid ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E3ECEA] dark:border-white/10 pb-3 print:pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
              {title}
            </h3>
            <p className="text-[11px] text-[#728B88] dark:text-[#9FB3B0]">
              {subtitle}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 shrink-0 self-start sm:self-auto print:border-amber-200 print:text-[#92400E]">
          Development Target
        </span>
      </div>

      <div className="space-y-3">
        {developmentAreas.map((item, idx) => {
          const score = Math.round(item.scalePositionPercentage || 0);
          const isHighAbsolute = score >= 75;
          const semanticNote = isHighAbsolute
            ? "Solid existing foundation with high leverage for further refinement."
            : "Active growth frontier that expands rapidly through structured experiential practice.";

          return (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-2 print:bg-[#F9FCFB] print:border-[#E3ECEA] print:p-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] uppercase tracking-wide">
                      {item.name}
                    </h4>
                    <span className="text-[9.5px] font-mono text-amber-700 dark:text-amber-300 block">
                      {isHighAbsolute ? "Strength with Headroom for Growth" : "Developmental Habit Indicator"}
                    </span>
                  </div>
                </div>
                <span className="font-mono font-black text-xs text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  {score} / 100
                </span>
              </div>

              {/* What this means */}
              <div className="pl-6 space-y-1">
                <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                  <strong className="text-[#172B2A] dark:text-[#E0EBE8] font-semibold">Context: </strong>
                  {item.description || semanticNote}
                </p>

                {/* Suggested Development Direction */}
                <div className="pt-0.5 flex items-start gap-1.5 text-[10.5px] text-[#008F83] dark:text-[#00BFA5]">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    <strong className="font-bold">Next Milestone: </strong>
                    Practice milestone goal-setting, collaborative peer review, and iterative trial projects.
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

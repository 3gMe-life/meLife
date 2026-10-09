"use client";

import React from "react";
import { Activity, CheckCircle2 } from "lucide-react";
import { DimensionScoreItem } from "../../types/assessment.types";

interface StrengthCardProps {
  strengths: DimensionScoreItem[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function StrengthCard({
  strengths,
  title = "Strongly Reported Skill Behaviours",
  subtitle = "Patterns in how you describe your usual approach to problem solving, communication, collaboration, and practical tasks.",
  className = "",
}: StrengthCardProps) {
  if (!strengths || strengths.length === 0) return null;

  return (
    <div
      className={`rounded-3xl bg-white dark:bg-[#172B2A] border border-emerald-500/30 p-6 sm:p-7 shadow-sm space-y-4 print:p-5 print:rounded-2xl print:border-[#E3ECEA] print:shadow-none print-break-avoid ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E3ECEA] dark:border-white/10 pb-3 print:pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4" />
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
        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 shrink-0 self-start sm:self-auto print:border-[#00BFA5]/30 print:text-[#065F46]">
          Self-Reported Style
        </span>
      </div>

      <div className="space-y-3">
        {strengths.map((item, idx) => {
          const score = Math.round(item.scalePositionPercentage || 0);
          return (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-1.5 print:bg-[#F9FCFB] print:border-[#E3ECEA] print:p-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] uppercase tracking-wide">
                      {item.name}
                    </h4>
                    <span className="text-[9.5px] font-mono text-[#008F83] dark:text-[#00BFA5] block">
                      Self-Reported Behaviour Indicator
                    </span>
                  </div>
                </div>
                <span className="font-mono font-black text-xs text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  {score} / 100
                </span>
              </div>

              {item.description ? (
                <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0] leading-relaxed pl-6">
                  {item.description}
                </p>
              ) : (
                <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0] leading-relaxed pl-6">
                  Consistently endorsed as a primary working style and problem-solving preference in learning contexts.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

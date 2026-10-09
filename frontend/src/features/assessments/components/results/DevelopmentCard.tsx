"use client";

import React from "react";
import { Target, TrendingUp, Lightbulb } from "lucide-react";
import { DimensionScoreItem } from "../../types/assessment.types";
import { getConstructDevelopmentGuidance } from "../../config/skill-finder-development-guidance.config";
import { EvidenceTypeBadge } from "./skill-finder/EvidenceTypeBadge";

interface DevelopmentCardProps {
  developmentAreas: DimensionScoreItem[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function DevelopmentCard({
  developmentAreas,
  title = "Priority Development Areas",
  subtitle = "Areas where practice, experience, or additional evidence may be useful.",
  className = "",
}: DevelopmentCardProps) {
  if (!developmentAreas || developmentAreas.length === 0) return null;

  return (
    <div
      className={`rounded-3xl bg-white dark:bg-[#172B2A] border border-amber-500/30 p-6 sm:p-7 shadow-sm space-y-4 print:p-5 print:rounded-2xl print:bg-white print:border-[#E3ECEA] print:shadow-none print-break-avoid ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E3ECEA] dark:border-white/10 pb-3 print:border-[#E3ECEA] print:pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 print:border print:border-amber-300 print:text-amber-700">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight print:text-[#172B2A]">
              {title}
            </h3>
            <p className="text-[11px] text-[#728B88] dark:text-[#9FB3B0] print:text-[#526866]">
              {subtitle}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 shrink-0 self-start sm:self-auto print:border-amber-200 print:text-[#92400E] print:bg-amber-50">
          Development Focus
        </span>
      </div>

      <div className="space-y-3.5">
        {developmentAreas.map((item, idx) => {
          const score = Math.round(item.scalePositionPercentage || 0);
          const isHighAbsolute = score >= 70;
          const guidance = getConstructDevelopmentGuidance(item.code, item.name);
          const whyText = isHighAbsolute ? guidance.whyAppearsRelative : guidance.whyAppearsEmerging;

          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-2.5 print:bg-[#F9FCFB] print:border-[#E3ECEA] print:p-3.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 print:text-amber-700" />
                    <h4 className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] uppercase tracking-wide print:text-[#172B2A]">
                      {item.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 pl-6">
                    <EvidenceTypeBadge type={guidance.evidenceSource} size="sm" />
                    <span className="text-[9.5px] font-mono text-amber-700 dark:text-amber-300 font-bold print:text-amber-800">
                      {isHighAbsolute ? "Strength with Further Potential" : "Emerging Focus"}
                    </span>
                  </div>
                </div>

                <div className="text-right self-start sm:self-auto pl-6 sm:pl-0">
                  <span className="font-mono font-black text-xs text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 print:border-amber-200 print:text-amber-900 print:bg-white inline-block">
                    {score} / 100
                  </span>
                </div>
              </div>

              {/* Why This Appears */}
              <div className="pl-6 space-y-1.5 text-[11px] text-[#526866] dark:text-[#9FB3B0] print:text-[#415654] leading-relaxed">
                <p>
                  <strong className="text-[#172B2A] dark:text-[#E0EBE8] print:text-[#172B2A] font-semibold">
                    Why This Appears:{" "}
                  </strong>
                  {whyText}
                </p>

                {/* Construct-Aligned Next Activity */}
                <div className="p-2.5 rounded-xl bg-white/80 dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-[10.5px] text-[#008F83] dark:text-[#00BFA5] print:bg-white print:border-[#E3ECEA] print:text-[#008F83] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                    <span>Construct-Aligned Exploration Activity:</span>
                  </div>
                  <p className="text-[#526866] dark:text-[#A7C2BF] print:text-[#415654] pl-5 leading-snug">
                    {guidance.tryNextActivities[0] || "Practice gradual milestone goal-setting and hands-on trial iterations."}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

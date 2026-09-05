"use client";

import React from "react";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { DimensionScoreItem } from "../../types/assessment.types";

interface StrengthCardProps {
  strengths: DimensionScoreItem[];
  title?: string;
  subtitle?: string;
}

export function StrengthCard({
  strengths,
  title = "Core Strength Indicators",
  subtitle = "High-performing cognitive abilities and self-reported behavioral strengths",
}: StrengthCardProps) {
  if (!strengths || strengths.length === 0) return null;

  return (
    <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-emerald-500/30 p-6 sm:p-7 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-black text-[#172B2A] dark:text-[#F7FAF9]">
            {title}
          </h3>
          <p className="text-[11px] text-[#728B88] dark:text-[#7D9491]">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {strengths.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10"
          >
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                  {item.name}
                </h4>
                {item.description && (
                  <p className="text-[11px] text-[#728B88] dark:text-[#7D9491] line-clamp-1">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                {item.scalePositionPercentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

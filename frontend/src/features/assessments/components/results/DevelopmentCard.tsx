"use client";

import React from "react";
import { Target, TrendingUp } from "lucide-react";
import { DimensionScoreItem } from "../../types/assessment.types";

interface DevelopmentCardProps {
  developmentAreas: DimensionScoreItem[];
  title?: string;
  subtitle?: string;
}

export function DevelopmentCard({
  developmentAreas,
  title = "Development & Growth Targets",
  subtitle = "High-leverage areas for experiential learning and skill expansion",
}: DevelopmentCardProps) {
  if (!developmentAreas || developmentAreas.length === 0) return null;

  return (
    <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-amber-500/30 p-6 sm:p-7 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <Target className="w-4 h-4" />
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
        {developmentAreas.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10"
          >
            <div className="flex items-start gap-2.5">
              <TrendingUp className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
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
              <span className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400">
                {item.scalePositionPercentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

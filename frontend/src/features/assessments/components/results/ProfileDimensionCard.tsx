"use client";

import React from "react";

interface ProfileDimensionCardProps {
  name: string;
  score: number;
  level?: "High" | "Proficient" | "Moderate" | "Emerging";
  layer?: "interest" | "skill" | "aptitude" | "development";
  description?: string;
  icon?: React.ReactNode;
}

export function ProfileDimensionCard({
  name,
  score,
  level,
  layer = "skill",
  description,
  icon,
}: ProfileDimensionCardProps) {
  // Derived level if not provided
  const derivedLevel =
    level ||
    (score >= 75
      ? "High"
      : score >= 50
      ? "Proficient"
      : score >= 25
      ? "Moderate"
      : "Emerging");

  // Layer color accents
  const layerColorStyles = {
    interest: {
      bar: "bg-emerald-500",
      badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    skill: {
      bar: "bg-[#00BFA5]",
      badge: "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border-[#00BFA5]/30",
      iconBg: "bg-[#00BFA5]/10 text-[#008F83] dark:text-[#00BFA5]",
    },
    aptitude: {
      bar: "bg-cyan-500",
      badge: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30",
      iconBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    },
    development: {
      bar: "bg-amber-500",
      badge: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
      iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
  }[layer];

  return (
    <div className="rounded-2xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-4 sm:p-5 shadow-sm hover:border-[#00BFA5]/40 transition-all space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {icon && (
            <div className={`w-8 h-8 rounded-xl ${layerColorStyles.iconBg} flex items-center justify-center shrink-0`}>
              {icon}
            </div>
          )}
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#172B2A] dark:text-[#F7FAF9] leading-tight">
              {name}
            </h4>
            {description && (
              <p className="text-[11px] text-[#728B88] dark:text-[#7D9491] line-clamp-1 mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>

        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${layerColorStyles.badge}`}>
          {derivedLevel}
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] text-[#728B88] dark:text-[#7D9491] font-medium">Profile Score</span>
          <span className="font-mono font-bold text-[#172B2A] dark:text-white">{score}%</span>
        </div>
        <div className="w-full bg-[#E3ECEA] dark:bg-white/10 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${layerColorStyles.bar}`}
            style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
          />
        </div>
      </div>
    </div>
  );
}

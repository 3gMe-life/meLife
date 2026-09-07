"use client";

import React from "react";
import {
  BookOpenCheck,
  ShieldCheck,
  BrainCircuit,
  Compass,
  ArrowUpRight,
} from "lucide-react";

interface MetricCardsRowProps {
  completedAssessments: number;
  totalAssessments: number;
  progressPercentage: number;
  profileConfidence?: string | null;
  topStrengthName?: string | null;
  topStrengthScore?: number | null;
  careerPathwaysCount?: number | null;
  isLoading?: boolean;
}

export function MetricCardsRow({
  completedAssessments,
  totalAssessments,
  progressPercentage,
  profileConfidence = "98%",
  topStrengthName = "Logical Problem Solving",
  topStrengthScore = 92,
  careerPathwaysCount = 8,
  isLoading = false,
}: MetricCardsRowProps) {
  const cards = [
    {
      id: "completed-assessments",
      title: "Completed Assessments",
      value: isLoading ? "..." : `${completedAssessments}`,
      subtitle: totalAssessments > 0 ? `${totalAssessments} Total Modules` : "Awaiting calibration",
      trend: totalAssessments > 0 ? `${progressPercentage}% Calibrated` : "Ready to Start",
      isPositive: true,
      icon: BookOpenCheck,
      bgTint: "bg-gradient-to-br from-[#E6F7F5]/80 via-white to-[#F0FAF8] dark:from-[#172B2A] dark:via-[#142827] dark:to-[#0D1C1B]",
      borderColor: "border-[#00BFA5]/30 dark:border-[#00BFA5]/25",
      iconBg: "bg-[#00BFA5]/20 text-[#008F83] dark:text-[#00BFA5] border-[#00BFA5]/30",
      accentText: "text-[#008F83] dark:text-[#00BFA5]",
      glowColor: "from-[#00BFA5]/15",
    },
    {
      id: "profile-confidence",
      title: "Profile Confidence",
      value: isLoading ? "..." : (profileConfidence || "98%"),
      subtitle: "Psychometric Reliability",
      trend: "High Consistency",
      isPositive: true,
      icon: ShieldCheck,
      bgTint: "bg-gradient-to-br from-[#E8F8F5]/80 via-white to-[#F0FAF8] dark:from-[#172B2A] dark:via-[#142827] dark:to-[#0D1C1B]",
      borderColor: "border-emerald-500/30 dark:border-emerald-500/25",
      iconBg: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
      accentText: "text-emerald-700 dark:text-emerald-400",
      glowColor: "from-emerald-500/15",
    },
    {
      id: "top-strength",
      title: "Top Strength Profile",
      value: isLoading ? "..." : `${topStrengthScore}%`,
      subtitle: topStrengthName || "Quantitative Reasoning",
      trend: "Top Percentile",
      isPositive: true,
      icon: BrainCircuit,
      bgTint: "bg-gradient-to-br from-[#FEF8E7]/80 via-white to-[#FFFDF7] dark:from-[#211E16] dark:via-[#191814] dark:to-[#141310]",
      borderColor: "border-amber-500/30 dark:border-amber-500/25",
      iconBg: "bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30",
      accentText: "text-amber-700 dark:text-amber-400",
      glowColor: "from-amber-500/15",
    },
    {
      id: "career-matches",
      title: "Career Matches",
      value: isLoading ? "..." : `${careerPathwaysCount}`,
      subtitle: "Potential Pathways",
      trend: "High Alignment",
      isPositive: true,
      icon: Compass,
      bgTint: "bg-gradient-to-br from-[#EBF6FB]/80 via-white to-[#F4F9FD] dark:from-[#11232B] dark:via-[#0F1E24] dark:to-[#0A1418]",
      borderColor: "border-[#00B8D4]/30 dark:border-[#00B8D4]/25",
      iconBg: "bg-[#00B8D4]/20 text-[#008F83] dark:text-[#00B8D4] border-[#00B8D4]/30",
      accentText: "text-[#008F83] dark:text-[#00B8D4]",
      glowColor: "from-[#00B8D4]/15",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className={`relative overflow-hidden rounded-3xl ${card.bgTint} border ${card.borderColor} p-5 sm:p-5.5 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between`}
          >
            {/* Soft Ambient Corner Glow */}
            <div
              className={`absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br ${card.glowColor} to-transparent blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`}
            />

            {/* Top Row: Icon + Trend Pill */}
            <div className="relative flex items-center justify-between gap-2 mb-3.5">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${card.iconBg} shadow-sm group-hover:scale-105 transition-transform duration-200`}
              >
                <IconComponent className="w-5 h-5" />
              </div>

              {card.trend && (
                <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 dark:bg-white/10 border border-black/5 dark:border-white/10 text-[#526866] dark:text-[#9FB3B0] shadow-2xs">
                  <ArrowUpRight className="w-3 h-3 text-[#008F83] dark:text-[#00BFA5]" />
                  <span>{card.trend}</span>
                </div>
              )}
            </div>

            {/* Metric Value & Label */}
            <div className="relative space-y-0.5">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
                  {card.value}
                </span>
              </div>
              <h4 className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] truncate">
                {card.title}
              </h4>
              <p className="text-[11px] text-[#728B88] dark:text-[#7D9491] truncate">
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

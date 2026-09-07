import React from "react";
import { DimensionComparisonItem, GrowthInsight } from "../../types/assessment.types";
import { Sparkles, TrendingUp, Lightbulb, Zap, Award, Compass, Brain, Target } from "lucide-react";

interface GrowthInsightsCardProps {
  topGains: DimensionComparisonItem[];
  narrativeInsights: GrowthInsight[];
}

export function GrowthInsightsCard({
  topGains,
  narrativeInsights,
}: GrowthInsightsCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "INTEREST":
        return <Compass className="w-4 h-4 text-[#00BFA5]" />;
      case "SKILL":
        return <Zap className="w-4 h-4 text-[#00B8D4]" />;
      case "APTITUDE":
        return <Brain className="w-4 h-4 text-emerald-500" />;
      case "STRENGTH":
        return <Target className="w-4 h-4 text-teal-400" />;
      default:
        return <Lightbulb className="w-4 h-4 text-[#00BFA5]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Developmental Gains */}
      {topGains && topGains.length > 0 && (
        <div className="rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-[#00BFA5]/30 p-6 sm:p-8 space-y-4 shadow-xs dark:shadow-none">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#00B8D4] via-[#00BFA5] to-[#00C896] text-[#172B2A] shadow-md shadow-[#00BFA5]/20">
              <TrendingUp className="w-4 h-4 stroke-[2.5]" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
                Top Developmental Gains
              </h3>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
                Constructs showing the highest positive evolution between evaluations
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {topGains.map((gain) => (
              <div
                key={gain.dimensionCode}
                className="p-4 rounded-2xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] space-y-2 shadow-xs dark:shadow-none"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#728B88] dark:text-[#7D9491] uppercase tracking-wider">
                    {gain.sectionCode || "Construct"}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-black">
                    +{gain.delta}%
                  </span>
                </div>
                <h4 className="text-sm font-black text-[#172B2A] dark:text-[#F7FAF9] line-clamp-1">
                  {gain.dimensionName}
                </h4>
                <div className="flex items-center justify-between text-xs text-[#526866] dark:text-[#9FB3B0] pt-1.5 border-t border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)]">
                  <span>{gain.oldScore}%</span>
                  <span className="text-[#008F83] dark:text-[#00BFA5] font-bold">→ {gain.newScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Narrative Growth Insights */}
      {narrativeInsights && narrativeInsights.length > 0 && (
        <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-6 sm:p-8 space-y-5 shadow-xs dark:shadow-none">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-[#00B8D4]/15 text-[#008F83] dark:text-[#00B8D4]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
                Developmental Narrative & Counselor Insights
              </h3>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
                Psychometrically grounded interpretations of your longitudinal progress
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {narrativeInsights.map((insight, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-[#F7FAF9] dark:bg-[#0D1C1B]/80 border border-[#E3ECEA] dark:border-white/10 space-y-2"
              >
                <div className="flex items-center gap-2.5">
                  {getCategoryIcon(insight.category)}
                  <h4 className="text-xs sm:text-sm font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                    {insight.title}
                  </h4>
                </div>
                <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed pl-6.5">
                  {insight.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

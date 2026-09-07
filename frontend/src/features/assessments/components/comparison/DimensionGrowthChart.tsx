import React from "react";
import { DimensionComparisonItem } from "../../types/assessment.types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DimensionGrowthChartProps {
  title: string;
  subtitle?: string;
  dimensions: DimensionComparisonItem[];
  scoreTypeLabel?: string;
}

export function DimensionGrowthChart({
  title,
  subtitle,
  dimensions,
  scoreTypeLabel = "Score (%)",
}: DimensionGrowthChartProps) {
  if (!dimensions || dimensions.length === 0) {
    return null;
  }

  return (
    <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-6 sm:p-8 space-y-6 shadow-xs dark:shadow-none">
      <div>
        <h3 className="text-base sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0] mt-1 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs pt-1 border-b border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)] pb-3.5">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-[#526866]/30 dark:bg-white/20 inline-block" />
          <span className="text-[#526866] dark:text-[#9FB3B0] font-semibold">Previous Attempt</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-[#00BFA5] inline-block shadow-xs shadow-[#00BFA5]/30" />
          <span className="text-[#172B2A] dark:text-[#F7FAF9] font-bold">Latest Attempt</span>
        </div>
      </div>

      {/* Dimensions List */}
      <div className="space-y-4">
        {dimensions.map((item) => {
          const isGain = item.delta > 0;
          const isRefocused = item.delta < 0;

          return (
            <div
              key={item.dimensionCode}
              className="p-4 rounded-2xl bg-[#F7FAF9] dark:bg-[#0D1C1B]/80 border border-[#E3ECEA] dark:border-white/10 hover:border-[#00BFA5]/30 transition-colors space-y-3"
            >
              {/* Header: Dimension Name & Delta Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-[#172B2A] dark:text-[#F7FAF9] text-xs sm:text-sm">
                  {item.dimensionName}
                </span>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black ${
                      isGain
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25"
                        : isRefocused
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25"
                        : "bg-[#EBF2F0] dark:bg-white/5 text-[#728B88] dark:text-[#7D9491] border border-[#E3ECEA] dark:border-white/10"
                    }`}
                  >
                    {isGain ? (
                      <>
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                        <span>+{item.delta}%</span>
                      </>
                    ) : isRefocused ? (
                      <>
                        <TrendingDown className="w-3 h-3 text-amber-500" />
                        <span>{item.delta}%</span>
                      </>
                    ) : (
                      <>
                        <Minus className="w-3 h-3" />
                        <span>Stable</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Progress Bars Comparison */}
              <div className="space-y-2.5">
                {/* Old Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-[#728B88] dark:text-[#7D9491]">
                    <span>Previous</span>
                    <span className="font-semibold">{item.oldScore}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#EBF2F0] dark:bg-black/30 overflow-hidden">
                    <div
                      className="h-full bg-[#526866]/30 dark:bg-white/20 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, item.oldScore))}%` }}
                    />
                  </div>
                </div>

                {/* New Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#008F83] dark:text-[#00BFA5]">
                    <span>Current</span>
                    <span>{item.newScore}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#EBF2F0] dark:bg-black/30 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00B8D4] to-[#00BFA5] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, item.newScore))}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

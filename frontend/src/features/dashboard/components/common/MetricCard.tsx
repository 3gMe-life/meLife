import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { DashboardIcon } from "./DashboardIcon";
import type { MetricCardData } from "../../types/dashboard.types";

export function MetricCard({
  title,
  value,
  subtitle,
  iconName,
  trend,
  accentColor = "blue",
}: MetricCardData) {
  const getColorStyles = () => {
    switch (accentColor) {
      case "teal":
        return {
          iconBg: "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border-[#00BFA5]/30",
          glow: "from-[#00BFA5]/15 to-transparent",
        };
      case "emerald":
        return {
          iconBg: "bg-[#00C896]/15 text-[#008F83] dark:text-[#00C896] border-[#00C896]/30",
          glow: "from-[#00C896]/15 to-transparent",
        };
      case "indigo":
        return {
          iconBg: "bg-[#00B8D4]/15 text-[#008F83] dark:text-[#00B8D4] border-[#00B8D4]/30",
          glow: "from-[#00B8D4]/15 to-transparent",
        };
      case "amber":
        return {
          iconBg: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
          glow: "from-amber-500/10 to-transparent",
        };
      case "rose":
        return {
          iconBg: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30",
          glow: "from-rose-500/10 to-transparent",
        };
      case "blue":
      default:
        return {
          iconBg: "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border-[#00BFA5]/30",
          glow: "from-[#00BFA5]/15 to-transparent",
        };
    }
  };

  const { iconBg, glow } = getColorStyles();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#172B2A] backdrop-blur-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-5 hover:border-[#00BFA5]/50 dark:hover:border-[#00BFA5]/40 shadow-xs dark:shadow-none transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group">
      {/* Background Soft Glow Accent */}
      <div
        className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${glow} blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`}
      />

      <div className="relative flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${iconBg} shadow-2xs group-hover:scale-105 transition-transform duration-200`}
        >
          <DashboardIcon name={iconName} className="w-5 h-5" />
        </div>

        {trend && (
          <div
            className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
              trend.isPositive
                ? "bg-[#00C896]/15 text-[#008F83] dark:text-[#00C896] border-[#00C896]/30"
                : "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30"
            }`}
          >
            {trend.isPositive ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            <span>{trend.value}</span>
          </div>
        )}
      </div>

      <div className="relative">
        <h3 className="text-2xl sm:text-3xl font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight leading-none mb-1">
          {value}
        </h3>
        <p className="text-xs font-semibold text-[#526866] dark:text-[#9FB3B0] mb-0.5">{title}</p>
        {subtitle && <p className="text-[11px] text-[#728B88] dark:text-[#7D9491]">{subtitle}</p>}
      </div>
    </div>
  );
}

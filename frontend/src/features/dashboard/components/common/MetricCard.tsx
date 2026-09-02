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
          iconBg: "bg-[#14B8A6]/20 text-[#2DD4BF] border-[#14B8A6]/30",
          glow: "from-[#14B8A6]/10 to-transparent",
        };
      case "emerald":
        return {
          iconBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
          glow: "from-emerald-500/10 to-transparent",
        };
      case "indigo":
        return {
          iconBg: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
          glow: "from-indigo-500/10 to-transparent",
        };
      case "amber":
        return {
          iconBg: "bg-amber-500/20 text-amber-400 border-amber-500/30",
          glow: "from-amber-500/10 to-transparent",
        };
      case "rose":
        return {
          iconBg: "bg-rose-500/20 text-rose-400 border-rose-500/30",
          glow: "from-rose-500/10 to-transparent",
        };
      case "blue":
      default:
        return {
          iconBg: "bg-[#2563EB]/20 text-[#60A5FA] border-[#2563EB]/30",
          glow: "from-[#2563EB]/10 to-transparent",
        };
    }
  };

  const { iconBg, glow } = getColorStyles();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900/70 backdrop-blur-xl border border-white/10 p-5 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 group">
      {/* Background Soft Glow Accent */}
      <div
        className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${glow} blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`}
      />

      <div className="relative flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${iconBg} shadow-sm group-hover:scale-105 transition-transform duration-200`}
        >
          <DashboardIcon name={iconName} className="w-5 h-5" />
        </div>

        {trend && (
          <div
            className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
              trend.isPositive
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                : "bg-rose-500/15 text-rose-400 border-rose-500/30"
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
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none mb-1">
          {value}
        </h3>
        <p className="text-xs font-semibold text-slate-300 mb-0.5">{title}</p>
        {subtitle && <p className="text-[11px] text-slate-500">{subtitle}</p>}
      </div>
    </div>
  );
}

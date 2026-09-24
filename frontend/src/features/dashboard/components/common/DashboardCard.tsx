"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export interface DashboardCardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
  badgeColor?: "primary" | "emerald" | "amber" | "cyan" | "rose" | "purple";
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  isLoading?: boolean;
  hoverEffect?: boolean;
}

export function DashboardCard({
  title,
  subtitle,
  icon,
  badge,
  badgeColor = "primary",
  headerAction,
  footer,
  children,
  className = "",
  bodyClassName = "",
  isLoading = false,
  hoverEffect = true,
}: DashboardCardProps) {
  const getBadgeColorStyles = () => {
    switch (badgeColor) {
      case "emerald":
        return "bg-[#00C896]/15 text-[#008F83] dark:text-[#00C896] border-[#00C896]/30";
      case "amber":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";
      case "cyan":
        return "bg-[#00B8D4]/15 text-[#008F83] dark:text-[#00B8D4] border-[#00B8D4]/30";
      case "rose":
        return "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30";
      case "purple":
        return "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30";
      case "primary":
      default:
        return "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border-[#00BFA5]/30";
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] shadow-xs dark:shadow-none transition-all duration-300 ${
        hoverEffect
          ? "hover:border-[#00BFA5]/40 dark:hover:border-[#00BFA5]/30 hover:shadow-lg hover:shadow-[#172B2A]/5 dark:hover:shadow-black/25 hover:-translate-y-0.5"
          : ""
      } ${className}`}
    >
      {/* Optional Top Glowing Ambient Gradient */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00BFA5]/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Card Header */}
      {(title || headerAction || icon) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 pt-6 pb-4 border-b border-[#E3ECEA]/60 dark:border-[rgba(227,236,234,0.08)]">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="w-9 h-9 rounded-xl bg-[#EBF2F0] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 flex items-center justify-center text-[#008F83] dark:text-[#00BFA5] shrink-0">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {typeof title === "string" ? (
                  <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] tracking-tight truncate">
                    {title}
                  </h3>
                ) : (
                  title
                )}

                {badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getBadgeColorStyles()}`}
                  >
                    {badge}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-0.5 leading-relaxed truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {headerAction && <div className="shrink-0 flex items-center gap-2">{headerAction}</div>}
        </div>
      )}

      {/* Card Body */}
      <div className={`p-6 ${bodyClassName}`}>
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-[#526866] dark:text-[#9FB3B0] space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#00BFA5]" />
            <span className="text-xs font-semibold">Loading content...</span>
          </div>
        ) : (
          children
        )}
      </div>

      {/* Card Footer */}
      {footer && (
        <div className="px-6 py-3.5 bg-[#F4F8F7]/70 dark:bg-black/20 border-t border-[#E3ECEA]/60 dark:border-[rgba(227,236,234,0.08)] text-xs text-[#526866] dark:text-[#9FB3B0]">
          {footer}
        </div>
      )}
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface AdminMetricsCardProps {
  label: string;
  value: number | string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColorClass?: string;
  iconBgClass?: string;
  badge?: {
    text: string;
    variant?: "teal" | "amber" | "indigo" | "rose" | "emerald";
  };
  href?: string;
  className?: string;
}

export const AdminMetricsCard: React.FC<AdminMetricsCardProps> = ({
  label,
  value,
  description,
  icon: Icon,
  iconColorClass = "text-[#008F83] dark:text-[#00BFA5]",
  iconBgClass = "bg-teal-50 dark:bg-teal-950/60",
  badge,
  href,
  className = "",
}) => {
  const CardContent = (
    <div
      className={`relative overflow-hidden rounded-3xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 p-5 shadow-xs transition-all duration-200 hover:border-[#00BFA5]/40 hover:shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0]">
          {label}
        </span>
        <div className={`w-8 h-8 rounded-xl ${iconBgClass} ${iconColorClass} flex items-center justify-center shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
            {badge.text}
          </span>
        )}
      </div>

      <div className="mt-1 flex items-center justify-between">
        <p className="text-[11px] text-[#728B88] dark:text-[#7D9491] truncate">
          {description}
        </p>
        {href && (
          <span className="text-[10px] font-bold text-[#008F83] dark:text-[#00BFA5] inline-flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            View <ArrowUpRight className="w-3 h-3" />
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group block focus:outline-hidden">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
};

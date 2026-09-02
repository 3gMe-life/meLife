import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: "primary" | "emerald" | "amber" | "indigo";
  actionElement?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  badge,
  badgeColor = "primary",
  actionElement,
}: PageHeaderProps) {
  const getBadgeStyles = () => {
    switch (badgeColor) {
      case "emerald":
        return "bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/30";
      case "amber":
        return "bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/30";
      case "indigo":
        return "bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 dark:border-indigo-500/30";
      case "primary":
      default:
        return "bg-[#2563EB]/10 dark:bg-[#2563EB]/15 text-[#2563EB] dark:text-[#60A5FA] border-[#2563EB]/20 dark:border-[#2563EB]/30";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/5 transition-colors duration-200">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          {badge && (
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getBadgeStyles()}`}
            >
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actionElement && <div className="shrink-0">{actionElement}</div>}
    </div>
  );
}

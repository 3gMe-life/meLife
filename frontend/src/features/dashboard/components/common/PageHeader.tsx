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
        return "bg-[#00C896]/15 text-[#008F83] dark:text-[#00C896] border-[#00C896]/30";
      case "amber":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";
      case "indigo":
        return "bg-[#00B8D4]/15 text-[#008F83] dark:text-[#00B8D4] border-[#00B8D4]/30";
      case "primary":
      default:
        return "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border-[#00BFA5]/30";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)] transition-colors duration-200">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#172B2A] dark:text-[#F7FAF9]">
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
          <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0] max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actionElement && <div className="shrink-0">{actionElement}</div>}
    </div>
  );
}

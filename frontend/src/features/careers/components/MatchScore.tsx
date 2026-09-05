import React from "react";
import { Sparkles, TrendingUp } from "lucide-react";

interface MatchScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const MatchScore: React.FC<MatchScoreProps> = ({
  score,
  size = "md",
  showLabel = true,
}) => {
  const isTopMatch = score >= 88;
  const isHighMatch = score >= 75;

  let sizeStyles = "px-3 py-1 text-xs";
  let iconSize = "w-3.5 h-3.5";

  if (size === "sm") {
    sizeStyles = "px-2 py-0.5 text-[10px]";
    iconSize = "w-3 h-3";
  } else if (size === "lg") {
    sizeStyles = "px-4 py-2 text-sm";
    iconSize = "w-4 h-4";
  }

  const badgeTheme = isTopMatch
    ? "bg-gradient-to-r from-[#00B8D4] to-[#00BFA5] text-[#172B2A] font-black shadow-md shadow-[#00BFA5]/20"
    : isHighMatch
    ? "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30 font-bold"
    : "bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 font-semibold";

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full transition-all ${sizeStyles} ${badgeTheme}`}
    >
      {isTopMatch ? (
        <Sparkles className={`${iconSize} shrink-0 text-[#172B2A]`} />
      ) : (
        <TrendingUp className={`${iconSize} shrink-0`} />
      )}
      <span>
        {score}%{showLabel ? " Match" : ""}
      </span>
    </div>
  );
};

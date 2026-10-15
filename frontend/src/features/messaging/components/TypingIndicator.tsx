"use client";

import React from "react";

interface TypingIndicatorProps {
  userName?: string;
  className?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  userName = "Someone",
  className = "",
}) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50 animate-in fade-in slide-in-from-bottom-1 duration-200 ${className}`}
      aria-live="polite"
      aria-label={`${userName} is typing`}
    >
      <span className="text-[11px] font-medium truncate max-w-[140px]">
        {userName} is typing
      </span>
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00BFA5] animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#00BFA5] animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#00BFA5] animate-bounce" />
      </div>
    </div>
  );
};

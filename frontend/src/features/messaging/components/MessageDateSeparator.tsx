"use client";

import React from "react";

interface MessageDateSeparatorProps {
  dateString: string;
}

export const MessageDateSeparator: React.FC<MessageDateSeparatorProps> = ({
  dateString,
}) => {
  const formatLabel = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      const isYesterday =
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();

      if (isToday) return "Today";
      if (isYesterday) return "Yesterday";

      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex items-center justify-center my-4 select-none">
      <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
        {formatLabel(dateString)}
      </div>
    </div>
  );
};

"use client";

import React from "react";

interface UnreadBadgeProps {
  count: number;
  className?: string;
  size?: "sm" | "md";
}

export const UnreadBadge: React.FC<UnreadBadgeProps> = ({
  count,
  className = "",
  size = "md",
}) => {
  if (count <= 0) return null;

  const displayCount = count > 99 ? "99+" : count;
  const sizeClasses =
    size === "sm"
      ? "h-4 min-w-4 text-[10px] px-1"
      : "h-5 min-w-5 text-[11px] px-1.5";

  return (
    <span
      className={`inline-flex items-center justify-center font-extrabold rounded-full bg-[#00BFA5] text-[#172B2A] shadow-xs shadow-[#00BFA5]/30 animate-in fade-in zoom-in duration-150 ${sizeClasses} ${className}`}
      aria-label={`${count} unread messages`}
    >
      {displayCount}
    </span>
  );
};

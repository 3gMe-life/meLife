import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "blue" | "teal" | "emerald" | "dark" | "outline" | "subtle";
  size?: "sm" | "md";
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function Badge({
  variant = "blue",
  size = "md",
  icon,
  className,
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center font-medium rounded-full transition-colors select-none";

  const variants = {
    blue: "bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/25",
    teal: "bg-[#14B8A6]/10 text-[#0F766E] border border-[#14B8A6]/25",
    emerald: "bg-[#22C55E]/10 text-[#15803D] border border-[#22C55E]/30",
    dark: "bg-[#0F172A] text-white border border-[#0F172A]",
    outline: "bg-white/90 text-[#64748B] border border-slate-200",
    subtle: "bg-[#F1F5F9] text-[#2563EB] border border-slate-200",
  };

  const sizes = {
    sm: "text-xs px-2.5 py-0.5 gap-1.5",
    md: "text-xs sm:text-sm px-3.5 py-1 gap-2",
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

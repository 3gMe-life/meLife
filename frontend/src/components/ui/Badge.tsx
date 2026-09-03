import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "blue" | "teal" | "emerald" | "dark" | "outline" | "subtle";
  size?: "sm" | "md";
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function Badge({
  variant = "teal",
  size = "md",
  icon,
  className,
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center font-medium rounded-full transition-colors select-none";

  const variants = {
    blue: "bg-[#00B8D4]/15 text-[#008F83] border border-[#00B8D4]/30",
    teal: "bg-[#00BFA5]/15 text-[#008F83] border border-[#00BFA5]/30",
    emerald: "bg-[#00C896]/15 text-[#008F83] border border-[#00C896]/30",
    dark: "bg-[#172B2A] text-white border border-[#172B2A]",
    outline: "bg-white/90 text-[#526866] border border-[#E3ECEA]",
    subtle: "bg-[#EBF2F0] text-[#008F83] border border-[#E3ECEA]",
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

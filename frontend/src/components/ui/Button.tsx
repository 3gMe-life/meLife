import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "secondary" | "outline" | "ghost" | "glass";
  size?: "sm" | "md" | "lg";
  href?: string;
  isExternal?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  isExternal,
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer";

  const variants = {
    primary:
      "bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] border border-blue-400/20",
    accent:
      "bg-[#14B8A6] text-white hover:bg-[#0D9488] shadow-[0_4px_14px_rgba(20,184,166,0.25)] hover:shadow-[0_6px_20px_rgba(20,184,166,0.35)]",
    secondary:
      "bg-[#0F172A] text-white hover:bg-[#1E293B] shadow-sm hover:shadow-md",
    outline:
      "bg-white text-[#0F172A] border border-slate-200 hover:border-[#2563EB] hover:bg-[#F8FAFC] hover:text-[#2563EB]",
    ghost:
      "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]",
    glass:
      "bg-white/80 backdrop-blur-md text-[#0F172A] border border-white/60 hover:bg-white hover:border-[#2563EB]/40 shadow-sm",
  };

  const sizes = {
    sm: "text-xs px-3.5 py-1.5 gap-1.5",
    md: "text-sm px-5 py-2.5 gap-2",
    lg: "text-base px-6 py-3.5 gap-2.5 font-semibold",
  };

  const combinedClasses = cn(baseStyles, variants[variant], sizes[size], className);

  if (href) {
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClasses}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}

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
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00BFA5]/50 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer";

  const variants = {
    primary:
      "bg-[#00BFA5] text-[#172B2A] hover:bg-[#008F83] hover:text-white shadow-[0_4px_14px_rgba(0,191,165,0.25)] hover:shadow-[0_6px_20px_rgba(0,143,131,0.35)] border border-[#00BFA5]/30",
    accent:
      "bg-[#00B8D4] text-[#172B2A] hover:bg-[#00BFA5] hover:text-[#172B2A] shadow-[0_4px_14px_rgba(0,184,212,0.25)] hover:shadow-[0_6px_20px_rgba(0,191,165,0.35)] border border-[#00B8D4]/30",
    secondary:
      "bg-[#172B2A] text-white hover:bg-[#008F83] shadow-sm hover:shadow-md",
    outline:
      "bg-white text-[#172B2A] border border-[#E3ECEA] hover:border-[#00BFA5] hover:bg-[#F7FAF9] hover:text-[#008F83]",
    ghost:
      "text-[#526866] hover:text-[#172B2A] hover:bg-[#EBF2F0]",
    glass:
      "bg-white/80 backdrop-blur-md text-[#172B2A] border border-[#E3ECEA] hover:bg-white hover:border-[#00BFA5]/40 shadow-sm",
  };

  const sizes = {
    sm: "text-xs px-3.5 py-1.5 gap-1.5",
    md: "text-sm px-5 py-2.5 gap-2",
    lg: "text-base px-6 py-3.5 gap-2.5 font-bold",
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

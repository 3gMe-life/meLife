import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface AuthSubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function AuthSubmitButton({
  isLoading = false,
  loadingText = "Please wait...",
  children,
  className,
  disabled,
  ...props
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading || disabled}
      className={cn(
        "w-full py-3 px-4 rounded-xl text-sm font-bold text-white transition-all duration-200 cursor-pointer select-none",
        "bg-gradient-to-r from-[#2563EB] to-[#14B8A6] hover:from-[#1D4ED8] hover:to-[#0D9488]",
        "shadow-[0_4px_16px_rgba(37,99,235,0.35)] hover:shadow-[0_6px_22px_rgba(20,184,166,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]",
        "focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 focus:ring-offset-2 focus:ring-offset-slate-900",
        "disabled:opacity-60 disabled:pointer-events-none disabled:transform-none flex items-center justify-center gap-2 btn-shimmer",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-white" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

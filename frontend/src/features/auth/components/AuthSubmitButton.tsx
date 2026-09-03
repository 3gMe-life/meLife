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
        "w-full py-3 px-4 rounded-xl text-sm font-bold text-[#172B2A] transition-all duration-200 cursor-pointer select-none",
        "bg-gradient-to-r from-[#00B8D4] via-[#00BFA5] to-[#00C896] hover:from-[#00C896] hover:via-[#00BFA5] hover:to-[#008F83] hover:text-white",
        "shadow-[0_4px_16px_rgba(0,191,165,0.35)] hover:shadow-[0_6px_22px_rgba(0,143,131,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]",
        "focus:outline-none focus:ring-2 focus:ring-[#00BFA5]/50 focus:ring-offset-2 focus:ring-offset-[#172B2A]",
        "disabled:opacity-60 disabled:pointer-events-none disabled:transform-none flex items-center justify-center gap-2 btn-shimmer",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-[#172B2A]" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

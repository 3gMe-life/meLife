"use client";

import React, { useState, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Lock, AlertCircle } from "lucide-react";

export interface PasswordFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  showRequirementsHint?: boolean;
  rightElement?: React.ReactNode;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  (
    {
      id,
      label,
      error,
      helperText,
      showRequirementsHint,
      rightElement,
      className,
      required,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || props.name || "password-input";
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        <div className="flex items-center justify-between">
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-slate-200 tracking-tight"
          >
            {label}
            {required && <span className="text-[#00BFA5] ml-0.5">*</span>}
          </label>
          {rightElement}
        </div>

        <div className="relative flex items-center">
          <div className="absolute left-3.5 pointer-events-none text-slate-400">
            <Lock className="w-4 h-4" />
          </div>

          <input
            ref={ref}
            id={inputId}
            type={showPassword ? "text" : "password"}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              "w-full pl-10 pr-10 py-2.5 rounded-xl text-sm text-white bg-slate-800/60 border border-slate-700/80 transition-all duration-200",
              "placeholder:text-slate-400 placeholder:text-xs sm:placeholder:text-sm",
              "focus:outline-none focus:ring-2 focus:ring-[#00BFA5]/25 focus:border-[#00BFA5] focus:bg-slate-800/90",
              error
                ? "border-red-400 bg-red-950/30 focus:border-red-500 focus:ring-red-500/30"
                : "hover:border-slate-600",
              className
            )}
            {...props}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00BFA5]/40 transition-colors cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>

        {error && (
          <p
            id={errorId}
            className="text-[11px] font-medium text-red-400 flex items-center gap-1 mt-0.5 animate-in fade-in duration-150"
            role="alert"
          >
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{error}</span>
          </p>
        )}

        {!error && helperText && (
          <p id={helperId} className="text-[11px] text-slate-400">
            {helperText}
          </p>
        )}

        {!error && !helperText && showRequirementsHint && (
          <p className="text-[11px] text-slate-400">
            Must be at least 10 characters long.
          </p>
        )}
      </div>
    );
  }
);

PasswordField.displayName = "PasswordField";

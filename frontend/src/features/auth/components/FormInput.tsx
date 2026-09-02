import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      id,
      label,
      error,
      helperText,
      leftIcon,
      rightElement,
      className,
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id || props.name || "input";
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
            {required && <span className="text-[#14B8A6] ml-0.5">*</span>}
          </label>
          {rightElement}
        </div>

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              "w-full px-3.5 py-2.5 rounded-xl text-sm text-white bg-slate-800/60 border border-slate-700/80 transition-all duration-200",
              "placeholder:text-slate-400 placeholder:text-xs sm:placeholder:text-sm",
              "focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/25 focus:border-[#14B8A6] focus:bg-slate-800/90",
              leftIcon ? "pl-10" : "pl-3.5",
              error
                ? "border-red-400 bg-red-950/30 focus:border-red-500 focus:ring-red-500/30"
                : "hover:border-slate-600",
              className
            )}
            {...props}
          />
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
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

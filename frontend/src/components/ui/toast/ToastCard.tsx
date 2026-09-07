"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader2,
  X,
  Sparkles,
} from "lucide-react";
import type { ToastItem, ToastType } from "./toast.types";
import { toastStore } from "./toast.store";
import { cn } from "@/lib/utils";

interface ToastCardProps {
  toast: ToastItem;
}

export function ToastCard({ toast }: ToastCardProps) {
  const {
    id,
    type,
    title,
    description,
    duration = 4000,
    action,
    cancel,
    icon: customIcon,
    dismissible = true,
    visible,
    className,
    style,
  } = toast;

  const [remainingTime, setRemainingTime] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isFinite = duration > 0 && duration !== Infinity;

  // Countdown & auto-dismiss handling
  useEffect(() => {
    if (!isFinite) return;

    if (isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    startTimeRef.current = Date.now();

    timerRef.current = setTimeout(() => {
      toast.onAutoClose?.(id);
      toastStore.dismiss(id);
    }, remainingTime);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [id, isFinite, isPaused, remainingTime, toast]);

  const handleMouseEnter = () => {
    if (!isFinite) return;
    setIsPaused(true);
    toastStore.setPaused(id, true);
    // Calculate remaining time
    const elapsed = Date.now() - startTimeRef.current;
    setRemainingTime((prev) => Math.max(0, prev - elapsed));
  };

  const handleMouseLeave = () => {
    if (!isFinite) return;
    setIsPaused(false);
    toastStore.setPaused(id, false);
    startTimeRef.current = Date.now();
  };

  // Render Icon based on type
  const renderIcon = () => {
    if (customIcon) return customIcon;

    switch (type) {
      case "success":
        return (
          <div className="w-8 h-8 rounded-xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30 flex items-center justify-center shrink-0 shadow-2xs">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case "error":
        return (
          <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0 shadow-2xs">
            <AlertCircle className="w-4 h-4" />
          </div>
        );
      case "warning":
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-2xs">
            <AlertTriangle className="w-4 h-4" />
          </div>
        );
      case "loading":
        return (
          <div className="w-8 h-8 rounded-xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30 flex items-center justify-center shrink-0 shadow-2xs">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        );
      case "info":
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-[#00B8D4]/15 text-[#008F83] dark:text-[#00B8D4] border border-[#00B8D4]/30 flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
        );
    }
  };

  // Progress bar color
  const getProgressBarClass = () => {
    switch (type) {
      case "success":
        return "bg-gradient-to-r from-[#00B8D4] via-[#00BFA5] to-[#00C896]";
      case "error":
        return "bg-gradient-to-r from-rose-500 to-rose-600";
      case "warning":
        return "bg-gradient-to-r from-amber-400 to-amber-500";
      case "loading":
        return "bg-[#00BFA5] animate-pulse";
      case "info":
      default:
        return "bg-gradient-to-r from-[#00B8D4] to-[#00BFA5]";
    }
  };

  return (
    <div
      role={type === "error" || type === "warning" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={cn(
        "group pointer-events-auto relative flex w-full max-w-sm sm:max-w-md flex-col overflow-hidden rounded-2xl",
        "bg-white/95 dark:bg-[#172B2A]/95 backdrop-blur-2xl",
        "border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)]",
        "p-4 shadow-xl shadow-black/8 dark:shadow-2xl dark:shadow-black/50",
        "transition-all duration-300 ease-out select-none",
        visible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-3 opacity-0 scale-95 pointer-events-none",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Semantic Icon Tile */}
        {renderIcon()}

        {/* Content Body */}
        <div className="flex-1 min-w-0 pt-0.5 space-y-1 pr-6">
          {title && (
            <h4 className="text-xs sm:text-sm font-bold text-[#172B2A] dark:text-[#F7FAF9] tracking-tight leading-snug">
              {title}
            </h4>
          )}
          {description && (
            <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
              {description}
            </p>
          )}

          {/* Action Buttons if provided */}
          {(action || cancel) && (
            <div className="flex items-center gap-2 pt-2">
              {action && (
                <button
                  type="button"
                  onClick={(e) => {
                    action.onClick(e);
                    toastStore.dismiss(id);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  {action.label}
                </button>
              )}
              {cancel && (
                <button
                  type="button"
                  onClick={(e) => {
                    cancel.onClick(e);
                    toastStore.dismiss(id);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#EBF2F0] hover:bg-[#E3ECEA] dark:bg-white/10 dark:hover:bg-white/15 text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] text-xs font-semibold transition-all cursor-pointer"
                >
                  {cancel.label}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Dismiss Close Button */}
        {dismissible && (
          <button
            type="button"
            onClick={() => toastStore.dismiss(id)}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-xl text-[#728B88] hover:text-[#172B2A] dark:text-[#9FB3B0] dark:hover:text-[#F7FAF9] hover:bg-[#EBF2F0] dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Animated Lifespan Progress Bar at Bottom */}
      {isFinite && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#EBF2F0] dark:bg-black/30 overflow-hidden">
          <div
            className={cn("h-full transition-all duration-linear", getProgressBarClass())}
            style={{
              width: `${(remainingTime / duration) * 100}%`,
              transitionDuration: isPaused ? "0ms" : "100ms",
            }}
          />
        </div>
      )}
    </div>
  );
}

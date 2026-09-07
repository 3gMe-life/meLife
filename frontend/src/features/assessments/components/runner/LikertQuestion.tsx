"use client";

import React from "react";
import { QuestionOption } from "../../types/assessment.types";

interface LikertQuestionProps {
  options: QuestionOption[];
  selectedValue?: string | null;
  onSelect: (optionKey: string, optionId?: string) => void;
  disabled?: boolean;
}

const DEFAULT_LIKERT_LABELS: Record<string, { label: string; sub: string }> = {
  "1": { label: "Strongly Disagree", sub: "Not like me" },
  "2": { label: "Disagree", sub: "Slightly like me" },
  "3": { label: "Not Sure / Mostly like me", sub: "Neutral or moderate" },
  "4": { label: "Agree", sub: "Frequently like me" },
  "5": { label: "Strongly Agree", sub: "Completely like me" },
};

export function LikertQuestion({
  options,
  selectedValue,
  onSelect,
  disabled = false,
}: LikertQuestionProps) {
  const displayOptions =
    options && options.length > 0
      ? options
      : [
          { id: "1", optionKey: "1", optionText: "Strongly Disagree", displayOrder: 1 },
          { id: "2", optionKey: "2", optionText: "Disagree", displayOrder: 2 },
          { id: "3", optionKey: "3", optionText: "Not Sure", displayOrder: 3 },
          { id: "4", optionKey: "4", optionText: "Agree", displayOrder: 4 },
          { id: "5", optionKey: "5", optionText: "Strongly Agree", displayOrder: 5 },
        ];

  const gridColsClass =
    displayOptions.length === 5
      ? "grid-cols-1 sm:grid-cols-3 md:grid-cols-5"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={`grid ${gridColsClass} gap-3 my-6`}>
      {displayOptions.map((opt) => {
        const isSelected = selectedValue === opt.optionKey;
        const meta = DEFAULT_LIKERT_LABELS[opt.optionKey] || {
          label: opt.optionText,
          sub: "",
        };

        const isTranslated = opt.optionText && !meta.sub;

        return (
          <button
            key={opt.optionKey}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(opt.optionKey, opt.id)}
            className={`group relative flex flex-col items-center justify-center text-center p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer select-none outline-none min-h-[120px] ${
              isSelected
                ? "bg-primary-50/80 dark:bg-primary-950/30 border-primary shadow-md shadow-primary/10 scale-[1.02]"
                : "bg-surface-elevated hover:bg-surface-muted/60 border-border-default hover:border-primary/40 text-text-secondary hover:text-text-primary"
            }`}
          >
            {/* Number Pill */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm mb-2.5 transition-colors shrink-0 ${
                isSelected
                  ? "bg-primary text-slate-900 shadow-sm"
                  : "bg-surface-muted text-text-secondary group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40 group-hover:text-primary"
              }`}
            >
              {opt.optionKey}
            </div>

            {/* Primary Option Text */}
            <div
              className={`font-semibold text-xs sm:text-sm leading-snug ${
                isSelected ? "text-primary dark:text-primary-light font-bold" : "text-text-primary"
              }`}
            >
              {opt.optionText || meta.label}
            </div>

            {/* Optional subtext if defined and distinct */}
            {!isTranslated && meta.sub && meta.label === opt.optionText && (
              <div className="text-[11px] text-text-tertiary group-hover:text-text-secondary transition-colors mt-1 line-clamp-1">
                {meta.sub}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

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
  "1": { label: "Not at all like me", sub: "Completely inaccurate" },
  "2": { label: "A little like me", sub: "Rarely applies" },
  "3": { label: "Mostly like me", sub: "Often applies" },
  "4": { label: "Very much like me", sub: "Completely accurate" },
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
          { id: "1", optionKey: "1", optionText: "Not at all like me", displayOrder: 1 },
          { id: "2", optionKey: "2", optionText: "A little like me", displayOrder: 2 },
          { id: "3", optionKey: "3", optionText: "Mostly like me", displayOrder: 3 },
          { id: "4", optionKey: "4", optionText: "Very much like me", displayOrder: 4 },
        ];

  const formatOptionIndex = (order: number | string) => {
    const num = typeof order === "number" ? order : parseInt(order, 10);
    return isNaN(num) ? String(order) : String(num).padStart(2, "0");
  };

  const isFiveOptions = displayOptions.length === 5;

  return (
    <div
      className={`grid gap-3 sm:gap-3.5 my-6 sm:my-8 ${
        isFiveOptions
          ? "grid-cols-1 sm:grid-cols-3 md:grid-cols-5"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      }`}
      role="radiogroup"
      aria-label="Assessment rating scale"
    >
      {displayOptions.map((opt, idx) => {
        const isSelected = selectedValue === opt.optionKey;
        const meta = DEFAULT_LIKERT_LABELS[opt.optionKey] || {
          label: opt.optionText || `Option ${opt.optionKey}`,
          sub: "",
        };

        const displayLabel = opt.optionText || meta.label;
        const indexStr = formatOptionIndex(opt.displayOrder || idx + 1);

        return (
          <button
            key={opt.optionKey}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => !disabled && onSelect(opt.optionKey, opt.id)}
            className={`group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl border text-left transition-all duration-180 select-none outline-none min-h-[104px] sm:min-h-[120px] cursor-pointer ${
              disabled ? "opacity-60 pointer-events-none cursor-not-allowed" : ""
            } ${
              isSelected
                ? "bg-[#00BFA5]/10 dark:bg-[#00BFA5]/15 border-[#00BFA5] ring-2 ring-[#00BFA5]/40 shadow-sm"
                : "bg-white dark:bg-[#172B2A] border-[#E3ECEA] dark:border-white/10 hover:border-[#00BFA5]/50 hover:bg-[#F7FAF9] dark:hover:bg-white/5"
            }`}
          >
            {/* Top Row: Option Number Anchor & Selection Indicator */}
            <div className="flex items-center justify-between w-full mb-3">
              <span
                className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md transition-colors ${
                  isSelected
                    ? "bg-[#00BFA5] text-[#172B2A] font-black"
                    : "bg-[#EBF2F0] dark:bg-white/10 text-[#526866] dark:text-[#9FB3B0] group-hover:bg-[#00BFA5]/20 group-hover:text-[#008F83] dark:group-hover:text-[#00BFA5]"
                }`}
              >
                {indexStr}
              </span>

              {/* Selection Radio Circle */}
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                  isSelected
                    ? "border-[#00BFA5] bg-[#00BFA5]"
                    : "border-[#E3ECEA] dark:border-white/20 group-hover:border-[#00BFA5]/60"
                }`}
              >
                {isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#172B2A] dark:bg-[#0D1C1B]" />
                )}
              </div>
            </div>

            {/* Option Text */}
            <div className="space-y-0.5">
              <div
                className={`font-semibold text-xs sm:text-sm leading-snug tracking-tight transition-colors ${
                  isSelected
                    ? "text-[#172B2A] dark:text-[#F7FAF9] font-bold"
                    : "text-[#172B2A] dark:text-[#F7FAF9] group-hover:text-[#008F83] dark:group-hover:text-[#00BFA5]"
                }`}
              >
                {displayLabel}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

"use client";

import React from "react";
import { QuestionOption } from "../../types/assessment.types";
import { Check } from "lucide-react";

interface MultipleChoiceQuestionProps {
  options: QuestionOption[];
  selectedValue?: string | null;
  onSelect: (optionKey: string, optionId?: string) => void;
  disabled?: boolean;
}

export function MultipleChoiceQuestion({
  options,
  selectedValue,
  onSelect,
  disabled = false,
}: MultipleChoiceQuestionProps) {
  const displayOptions =
    options && options.length > 0
      ? options
      : [
          { id: "A", optionKey: "A", optionText: "Option A", displayOrder: 1 },
          { id: "B", optionKey: "B", optionText: "Option B", displayOrder: 2 },
          { id: "C", optionKey: "C", optionText: "Option C", displayOrder: 3 },
          { id: "D", optionKey: "D", optionText: "Option D", displayOrder: 4 },
        ];

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 my-6 sm:my-8"
      role="radiogroup"
      aria-label="Multiple choice assessment options"
    >
      {displayOptions.map((opt) => {
        const isSelected = selectedValue?.toUpperCase() === opt.optionKey.toUpperCase();

        return (
          <button
            key={opt.optionKey}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => !disabled && onSelect(opt.optionKey, opt.id)}
            className={`group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl border text-left transition-all duration-180 select-none outline-none cursor-pointer ${
              disabled ? "opacity-60 pointer-events-none cursor-not-allowed" : ""
            } ${
              isSelected
                ? "bg-[#00BFA5]/10 dark:bg-[#00BFA5]/15 border-[#00BFA5] ring-2 ring-[#00BFA5]/40 shadow-sm"
                : "bg-white dark:bg-[#172B2A] border-[#E3ECEA] dark:border-white/10 hover:border-[#00BFA5]/50 hover:bg-[#F7FAF9] dark:hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-3.5 pr-2">
              {/* Letter / Index Badge */}
              <span
                className={`font-mono text-xs font-bold w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? "bg-[#00BFA5] text-[#172B2A] font-black"
                    : "bg-[#EBF2F0] dark:bg-white/10 text-[#526866] dark:text-[#9FB3B0] group-hover:bg-[#00BFA5]/20 group-hover:text-[#008F83] dark:group-hover:text-[#00BFA5]"
                }`}
              >
                {opt.optionKey}
              </span>

              {/* Option Text */}
              <span
                className={`text-xs sm:text-sm font-semibold leading-relaxed tracking-tight ${
                  isSelected
                    ? "text-[#172B2A] dark:text-[#F7FAF9] font-bold"
                    : "text-[#172B2A] dark:text-[#F7FAF9] group-hover:text-[#008F83] dark:group-hover:text-[#00BFA5]"
                }`}
              >
                {opt.optionText}
              </span>
            </div>

            {/* Selection Checkmark */}
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                isSelected
                  ? "border-[#00BFA5] bg-[#00BFA5] text-[#172B2A]"
                  : "border-[#E3ECEA] dark:border-white/20 group-hover:border-[#00BFA5]/60 text-transparent"
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </button>
        );
      })}
    </div>
  );
}

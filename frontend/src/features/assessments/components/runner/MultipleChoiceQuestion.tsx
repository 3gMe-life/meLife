"use client";

import React from "react";
import { QuestionOption } from "../../types/assessment.types";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-6">
      {displayOptions.map((opt) => {
        const isSelected = selectedValue?.toUpperCase() === opt.optionKey.toUpperCase();

        return (
          <button
            key={opt.optionKey}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(opt.optionKey, opt.id)}
            className={`group relative flex items-center p-4 sm:p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer select-none outline-none ${
              isSelected
                ? "bg-primary-50/80 dark:bg-primary-950/30 border-primary shadow-md shadow-primary/10 scale-[1.01]"
                : "bg-surface-elevated hover:bg-surface-muted/60 border-border-default hover:border-primary/40 text-text-secondary hover:text-text-primary"
            }`}
          >
            {/* Letter Badge */}
            <div
              className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center font-bold text-sm mr-4 transition-colors ${
                isSelected
                  ? "bg-primary text-slate-900 shadow-sm"
                  : "bg-surface-muted text-text-secondary group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40 group-hover:text-primary"
              }`}
            >
              {opt.optionKey}
            </div>

            {/* Option Text */}
            <div className="flex-1 font-medium text-sm sm:text-base text-text-primary">
              {opt.optionText}
            </div>

            {/* Selection Checkmark */}
            {isSelected && (
              <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center ml-2 shrink-0">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

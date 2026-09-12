"use client";

import React, { useState } from "react";

interface TextQuestionProps {
  initialValue?: string | null;
  onSave: (value: string) => void;
  disabled?: boolean;
}

export function TextQuestion({
  initialValue,
  onSave,
  disabled = false,
}: TextQuestionProps) {
  const [text, setText] = useState(initialValue || "");

  const handleBlur = () => {
    if (text !== (initialValue || "")) {
      onSave(text.trim());
    }
  };

  const wordsCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="my-6 sm:my-8 space-y-3">
      <div className="relative">
        <textarea
          disabled={disabled}
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          placeholder="Type your response here..."
          className="w-full p-4 sm:p-5 rounded-2xl border border-[#E3ECEA] dark:border-white/10 bg-white dark:bg-[#172B2A] text-[#172B2A] dark:text-[#F7FAF9] placeholder:text-[#728B88] dark:placeholder:text-[#7D9491] focus:border-[#00BFA5] focus:ring-3 focus:ring-[#00BFA5]/15 transition-all outline-none resize-y text-sm sm:text-base font-normal leading-relaxed"
        />
      </div>

      <div className="flex items-center justify-between text-xs text-[#526866] dark:text-[#9FB3B0] px-1">
        <span>Press tab or click outside to save your answer.</span>
        <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
          {wordsCount} {wordsCount === 1 ? "word" : "words"}
        </span>
      </div>
    </div>
  );
}

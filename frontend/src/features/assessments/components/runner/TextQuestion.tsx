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
    <div className="my-6 space-y-3">
      <div className="relative">
        <textarea
          disabled={disabled}
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          placeholder="Type your creative and unique ideas here (e.g., list different uses or inventions)..."
          className="w-full p-4 sm:p-5 rounded-2xl border-2 border-border-default bg-surface-elevated text-text-primary placeholder:text-text-tertiary focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-y text-base font-normal"
        />
      </div>

      <div className="flex items-center justify-between text-xs text-text-secondary px-1">
        <span>💡 Think of as many different and unusual ideas as you can.</span>
        <span className="font-semibold text-text-primary">
          {wordsCount} {wordsCount === 1 ? "word" : "words"}
        </span>
      </div>
    </div>
  );
}

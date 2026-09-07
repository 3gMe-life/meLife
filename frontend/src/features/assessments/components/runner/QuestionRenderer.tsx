"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SanitizedQuestion } from "../../types/assessment.types";
import { LikertQuestion } from "./LikertQuestion";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { TextQuestion } from "./TextQuestion";

interface QuestionRendererProps {
  question: SanitizedQuestion;
  currentResponse?: {
    selectedOptionId?: string | null;
    responseValue?: string | null;
  } | null;
  onAnswer: (responseValue: string, selectedOptionId?: string) => void;
  disabled?: boolean;
}

export function QuestionRenderer({
  question,
  currentResponse,
  onAnswer,
  disabled = false,
}: QuestionRendererProps) {
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Category / Dimension Meta */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-900/40 text-primary border border-primary/20">
          {question.sectionName}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-surface-muted text-text-secondary border border-border-default">
          {question.dimensionName}
        </span>
        {question.imageUrl && (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 border border-cyan-300/30 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Visual Question
          </span>
        )}
      </div>

      {/* Question Prompt */}
      <div className="bg-surface-elevated border border-border-default rounded-3xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary leading-snug">
          {question.questionText}
        </h2>

        {/* Optional Image Section */}
        {question.imageUrl && (
          <div className="mt-6 mb-4">
            <div
              onClick={() => setIsImageZoomed(true)}
              className="relative rounded-2xl overflow-hidden border border-border-default bg-white p-3 sm:p-4 max-w-xl mx-auto shadow-sm cursor-zoom-in group hover:border-primary/50 transition-colors"
            >
              <div className="relative w-full h-56 sm:h-72">
                <Image
                  src={question.imageUrl}
                  alt={`Diagram for Question ${question.questionNumber}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 600px"
                  priority
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-slate-900/70 text-white text-xs px-2.5 py-1 rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                Click to expand
              </div>
            </div>
          </div>
        )}

        {/* Input Delegator */}
        {(question.questionType === "likert_1_4" || question.questionType === "likert_1_5") && (
          <LikertQuestion
            options={question.options}
            selectedValue={currentResponse?.responseValue}
            onSelect={(val, optId) => onAnswer(val, optId)}
            disabled={disabled}
          />
        )}

        {(question.questionType === "mcq_text" ||
          question.questionType === "mcq_image" ||
          question.questionType === "forced_choice_4") && (
          <MultipleChoiceQuestion
            options={question.options}
            selectedValue={currentResponse?.responseValue}
            onSelect={(val, optId) => onAnswer(val, optId)}
            disabled={disabled}
          />
        )}

        {question.questionType === "open_scored" && (
          <TextQuestion
            initialValue={currentResponse?.responseValue}
            onSave={(val) => onAnswer(val)}
            disabled={disabled}
          />
        )}
      </div>

      {/* Image Lightbox Modal */}
      {isImageZoomed && question.imageUrl && (
        <div
          onClick={() => setIsImageZoomed(false)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center">
            <button
              onClick={() => setIsImageZoomed(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative w-full h-[65vh] mt-2">
              <Image
                src={question.imageUrl}
                alt="Enlarged question diagram"
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>
            <p className="mt-4 text-sm text-slate-500 font-medium">Click anywhere to close</p>
          </div>
        </div>
      )}
    </div>
  );
}

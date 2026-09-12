"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SanitizedQuestion } from "../../types/assessment.types";
import { LikertQuestion } from "./LikertQuestion";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { TextQuestion } from "./TextQuestion";
import { Image as ImageIcon, ZoomIn, X } from "lucide-react";

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

  const formattedNumber = String(question.questionNumber).padStart(2, "0");
  const isBilingual =
    Boolean(question.originalQuestionText) &&
    question.originalQuestionText?.trim() !== question.questionText.trim();

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in duration-200">
      {/* Focused Question Workspace Card */}
      <article className="bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-xs transition-shadow">
        {/* 1. Contextual Header & Question Index Anchor */}
        <div className="flex items-center justify-between gap-4 mb-5 pb-4 border-b border-[#E3ECEA]/60 dark:border-white/5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5]">
              {question.sectionName}
            </span>
            <span className="text-[#E3ECEA] dark:text-white/20 text-xs">•</span>
            <span className="text-[11px] font-semibold text-[#728B88] dark:text-[#7D9491]">
              {question.dimensionName}
            </span>
            {question.imageUrl && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#00B8D4]/10 text-[#00B8D4] border border-[#00B8D4]/20 ml-1">
                <ImageIcon className="w-3 h-3" />
                <span>Visual Diagram</span>
              </span>
            )}
          </div>

          {/* Numerical Visual Anchor */}
          <div className="font-mono text-xs sm:text-sm font-bold text-[#728B88] dark:text-[#7D9491] tracking-tight shrink-0 bg-[#EBF2F0] dark:bg-white/5 px-2.5 py-1 rounded-lg border border-[#E3ECEA] dark:border-white/5">
            {formattedNumber}
          </div>
        </div>

        {/* 2. Question Prompt Area */}
        <div className="space-y-4 max-w-[760px]">
          {isBilingual ? (
            <div className="space-y-4">
              {/* English Baseline Reference */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#728B88] dark:text-[#7D9491] block">
                  English Reference
                </span>
                <p className="text-sm sm:text-base font-medium text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                  {question.originalQuestionText}
                </p>
              </div>

              {/* Translated Language Hero Prompt */}
              <div className="pt-3 border-t border-[#E3ECEA]/80 dark:border-white/10">
                <h2 className="text-xl sm:text-2xl font-bold text-[#172B2A] dark:text-[#F7FAF9] leading-snug sm:leading-relaxed tracking-tight">
                  {question.questionText}
                </h2>
              </div>
            </div>
          ) : (
            <h2 className="text-xl sm:text-2xl font-bold text-[#172B2A] dark:text-[#F7FAF9] leading-snug sm:leading-relaxed tracking-tight">
              {question.questionText}
            </h2>
          )}
        </div>

        {/* 3. Optional Question Diagram / Visual Asset */}
        {question.imageUrl && (
          <div className="mt-6 mb-2">
            <div
              onClick={() => setIsImageZoomed(true)}
              className="relative rounded-2xl overflow-hidden border border-[#E3ECEA] dark:border-white/10 bg-[#F7FAF9] dark:bg-[#0D1C1B] p-3 sm:p-4 max-w-xl mx-auto cursor-zoom-in group hover:border-[#00BFA5]/50 transition-colors"
            >
              <div className="relative w-full aspect-4/3 sm:aspect-video min-h-[200px] sm:min-h-[260px]">
                <Image
                  src={question.imageUrl}
                  alt={`Diagram for Question ${question.questionNumber}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 600px"
                  priority
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-[#172B2A]/80 text-white text-[11px] font-medium px-2.5 py-1 rounded-lg backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Click to zoom</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. Answer Choice Delegator */}
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
          question.questionType === "forced_choice_4" ||
          question.questionType === "forced_choice_8") && (
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
      </article>

      {/* Image Lightbox Modal */}
      {isImageZoomed && question.imageUrl && (
        <div
          onClick={() => setIsImageZoomed(false)}
          className="fixed inset-0 z-50 bg-[#0D1C1B]/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-white dark:bg-[#172B2A] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center border border-[#E3ECEA] dark:border-white/10">
            <button
              onClick={() => setIsImageZoomed(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#EBF2F0] hover:bg-[#E3ECEA] dark:bg-white/10 dark:hover:bg-white/20 text-[#172B2A] dark:text-[#F7FAF9] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
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
            <p className="mt-4 text-xs text-[#526866] dark:text-[#9FB3B0] font-medium">
              Click anywhere to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

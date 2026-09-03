"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  AssessmentAttemptQuestionsResponse,
} from "../../types/assessment.types";
import { useSaveAssessmentResponseMutation } from "../../hooks/useSaveAssessmentResponseMutation";
import { useSubmitAssessmentMutation } from "../../hooks/useSubmitAssessmentMutation";
import { QuestionRenderer } from "./QuestionRenderer";

interface AssessmentRunnerProps {
  attemptData: AssessmentAttemptQuestionsResponse;
}

export function AssessmentRunner({ attemptData }: AssessmentRunnerProps) {
  const router = useRouter();
  const { attemptId, questions } = attemptData;

  const [currentIndex, setCurrentIndex] = useState(
    Math.min(
      Math.max(0, attemptData.currentQuestionIndex || 0),
      questions.length - 1
    )
  );
  const [showPalette, setShowPalette] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const saveMutation = useSaveAssessmentResponseMutation(attemptId);
  const submitMutation = useSubmitAssessmentMutation(attemptId);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const currentQuestion = questions[currentIndex];

  // Calculate answered questions
  const answeredIndices = useMemo(() => {
    const set = new Set<number>();
    questions.forEach((q, idx) => {
      const val = q.currentResponse?.responseValue;
      if (val !== undefined && val !== null && val.trim() !== "") {
        set.add(idx);
      }
    });
    return set;
  }, [questions]);

  const answeredCount = answeredIndices.size;
  const totalQuestions = questions.length;
  const progressPercentage = Math.round((answeredCount / totalQuestions) * 100);

  const handleAnswer = (responseValue: string, selectedOptionId?: string) => {
    if (!currentQuestion) return;

    saveMutation.mutate({
      questionId: currentQuestion.id,
      selectedOptionId,
      responseValue,
    });

    // Auto advance to next question after a brief delay for Likert & MCQ
    if (
      currentQuestion.questionType === "likert_1_4" ||
      currentQuestion.questionType === "mcq_text" ||
      currentQuestion.questionType === "mcq_image"
    ) {
      if (currentIndex < totalQuestions - 1) {
        setTimeout(() => {
          setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
        }, 220);
      }
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowSubmitModal(true);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await submitMutation.mutateAsync();
      router.push(`/participant/results/${attemptId}?resultId=${res.resultId}`);
    } catch {
      // Error handled in mutation
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between selection:bg-primary/20">
      {/* 1. TOP RUNNER HEADER */}
      <header className="sticky top-0 z-40 bg-surface-elevated/95 backdrop-blur-md border-b border-border-default shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          {/* Left: Exit & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExitModal(true)}
              className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-muted transition-colors cursor-pointer"
              title="Pause & Return to Dashboard"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-text-primary line-clamp-1">
                {attemptData.assessmentName || "Skill Finder Assessment"}
              </h1>
              <div className="flex items-center gap-2 text-xs text-text-tertiary">
                <span>{currentQuestion?.sectionName}</span>
                <span>•</span>
                <span className="font-medium text-primary">
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Timer, Save Status, Palette Toggle */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Auto-save Pill */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-text-tertiary">
              {saveMutation.isPending ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Saved</span>
                </>
              )}
            </div>

            {/* Timer */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-muted border border-border-default text-xs font-semibold text-text-secondary">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatTimer(secondsElapsed)}</span>
            </div>

            {/* Questions Grid Button */}
            <button
              onClick={() => setShowPalette(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary border border-primary/20 hover:bg-primary-100 transition-colors text-xs font-semibold cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">{answeredCount}/{totalQuestions}</span>
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-border-default h-1.5 relative overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </header>

      {/* 2. MAIN QUESTION CANVAS */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        {currentQuestion && (
          <QuestionRenderer
            question={currentQuestion}
            currentResponse={currentQuestion.currentResponse}
            onAnswer={handleAnswer}
            disabled={submitMutation.isPending}
          />
        )}
      </main>

      {/* 3. BOTTOM ACTION BAR */}
      <footer className="sticky bottom-0 z-30 bg-surface-elevated/95 backdrop-blur-md border-t border-border-default py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0 || submitMutation.isPending}
            className="px-5 py-2.5 rounded-xl border border-border-default text-text-secondary hover:text-text-primary hover:bg-surface-muted disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Previous</span>
          </button>

          {/* Quick Progress Dots (desktop only) */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-text-tertiary">
            <span>Progress:</span>
            <span className="font-bold text-text-primary">{progressPercentage}%</span>
            <span>({answeredCount} of {totalQuestions} answered)</span>
          </div>

          {/* Next / Submit Button */}
          {currentIndex < totalQuestions - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={submitMutation.isPending}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-slate-900 font-bold text-sm shadow-md shadow-primary/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Next</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              disabled={submitMutation.isPending}
              className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-slate-900 font-bold text-sm shadow-md shadow-primary/25 transition-all flex items-center gap-2 cursor-pointer animate-pulse"
            >
              <span>Submit Assessment</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
        </div>
      </footer>

      {/* 4. QUESTION PALETTE MODAL */}
      {showPalette && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative max-w-2xl w-full bg-surface-elevated rounded-3xl border border-border-default p-6 sm:p-8 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-border-default mb-4">
              <div>
                <h3 className="text-lg font-bold text-text-primary">Questions Overview</h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  {answeredCount} of {totalQuestions} answered ({progressPercentage}%)
                </p>
              </div>
              <button
                onClick={() => setShowPalette(false)}
                className="w-9 h-9 rounded-full bg-surface-muted text-text-secondary hover:text-text-primary flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Questions Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
                {questions.map((q, idx) => {
                  const isAnswered = answeredIndices.has(idx);
                  const isCurrent = currentIndex === idx;

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setShowPalette(false);
                      }}
                      className={`h-10 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center ${
                        isCurrent
                          ? "ring-2 ring-primary ring-offset-2 bg-primary text-slate-900 font-extrabold"
                          : isAnswered
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40"
                          : "bg-surface-muted text-text-secondary hover:bg-surface-muted/80 border border-border-default"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions in Palette */}
            <div className="pt-4 border-t border-border-default mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-text-secondary">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block" /> Answered
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-surface-muted border border-border-default inline-block" /> Unanswered
                </span>
              </div>
              <button
                onClick={() => {
                  setShowPalette(false);
                  setShowSubmitModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-primary text-slate-900 font-bold text-xs hover:bg-primary-hover transition-colors"
              >
                Review & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. SUBMIT CONFIRMATION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative max-w-md w-full bg-surface-elevated rounded-3xl border border-border-default p-6 sm:p-8 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-text-primary mb-2">
              Ready to Submit Assessment?
            </h3>

            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              You have answered <strong className="text-text-primary font-bold">{answeredCount}</strong> of{" "}
              <strong className="text-text-primary font-bold">{totalQuestions}</strong> questions.
              {answeredCount < totalQuestions && (
                <span className="block mt-2 text-amber-600 dark:text-amber-400 font-medium">
                  ⚠️ You have {totalQuestions - answeredCount} unanswered questions remaining. We recommend answering all questions for maximum report accuracy.
                </span>
              )}
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                disabled={submitMutation.isPending}
                className="flex-1 py-3 rounded-xl border border-border-default text-text-secondary hover:bg-surface-muted font-semibold text-sm transition-colors"
              >
                Keep Answering
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitMutation.isPending}
                className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-hover text-slate-900 font-bold text-sm shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2"
              >
                {submitMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    <span>Scoring...</span>
                  </>
                ) : (
                  <span>Submit Now</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. EXIT / PAUSE MODAL */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative max-w-md w-full bg-surface-elevated rounded-3xl border border-border-default p-6 sm:p-8 shadow-2xl text-center">
            <h3 className="text-xl font-bold text-text-primary mb-2">
              Pause and Return to Dashboard?
            </h3>
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              Your responses are automatically saved in real time. You can resume this assessment anytime from your dashboard.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-3 rounded-xl border border-border-default text-text-secondary hover:bg-surface-muted font-semibold text-sm transition-colors"
              >
                Continue Test
              </button>
              <button
                type="button"
                onClick={() => router.push("/participant/dashboard")}
                className="flex-1 py-3 rounded-xl bg-surface-muted hover:bg-surface-muted/80 text-text-primary font-bold text-sm transition-colors"
              >
                Exit to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

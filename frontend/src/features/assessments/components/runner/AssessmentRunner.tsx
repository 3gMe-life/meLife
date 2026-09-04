"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  AssessmentAttemptQuestionsResponse,
} from "../../types/assessment.types";
import { useSaveAssessmentResponseMutation } from "../../hooks/useSaveAssessmentResponseMutation";
import { useSubmitAssessmentMutation } from "../../hooks/useSubmitAssessmentMutation";
import { useAssessmentAttemptQuestionsQuery } from "../../hooks/useAssessmentAttemptQuestionsQuery";
import { QuestionRenderer } from "./QuestionRenderer";
import { AssessmentLanguageSwitcher } from "./AssessmentLanguageSwitcher";
import {
  SUPPORTED_LANGUAGES,
  getRunnerTranslation,
} from "../../config/assessment-i18n.config";
import {
  Sparkles,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  LayoutGrid,
  ShieldCheck,
  Send,
  X,
  Play,
} from "lucide-react";

interface AssessmentRunnerProps {
  attemptData: AssessmentAttemptQuestionsResponse;
}

export function AssessmentRunner({ attemptData }: AssessmentRunnerProps) {
  const router = useRouter();
  const attemptId = attemptData.attemptId;

  // Language state (persisted in localStorage)
  const [language, setLanguage] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("preferred_assessment_language");
      if (stored) return stored;
    }
    return attemptData.currentLanguage || "en";
  });

  // Fetch language-specific questions dynamically with React Query cache
  const { data: dynamicQuestionsData } = useAssessmentAttemptQuestionsQuery(
    attemptId,
    language
  );

  const activeAttemptData = dynamicQuestionsData || attemptData;
  const rawQuestions = activeAttemptData.questions;
  const sections = activeAttemptData.sections;

  // Local optimistic response cache to guarantee 100% zero data loss on language switch
  const [localResponses, setLocalResponses] = useState<
    Record<string, { selectedOptionId?: string | null; responseValue: string }>
  >(() => {
    const initialMap: Record<
      string,
      { selectedOptionId?: string | null; responseValue: string }
    > = {};
    attemptData.questions.forEach((q) => {
      if (
        q.currentResponse?.responseValue !== undefined &&
        q.currentResponse?.responseValue !== null
      ) {
        initialMap[q.id] = {
          selectedOptionId: q.currentResponse.selectedOptionId,
          responseValue: q.currentResponse.responseValue,
        };
      }
    });
    return initialMap;
  });

  // Merge local responses with active questions
  const questions = useMemo(() => {
    return rawQuestions.map((q) => {
      const local = localResponses[q.id];
      if (local) {
        return {
          ...q,
          currentResponse: {
            selectedOptionId: local.selectedOptionId,
            responseValue: local.responseValue,
          },
        };
      }
      return q;
    });
  }, [rawQuestions, localResponses]);

  // Introduction screen state: show only if attempt is fresh and user hasn't clicked Begin yet
  const [showIntro, setShowIntro] = useState(
    attemptData.answeredCount === 0 &&
      (attemptData.currentQuestionIndex === 0 || !attemptData.currentQuestionIndex)
  );

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

  // Timer: continuous and unbroken across language changes
  useEffect(() => {
    if (showIntro) return;
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [showIntro]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred_assessment_language", newLang);
    }
  };

  const isRtl = language === "ar";
  const currentQuestion = questions[currentIndex] || questions[0];

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

  // Calculate current section progress
  const currentSectionInfo = useMemo(() => {
    if (!currentQuestion) return null;
    const sectionQuestions = questions.filter(
      (q) => q.sectionCode === currentQuestion.sectionCode
    );
    const sectionAnswered = sectionQuestions.filter((q) => {
      const val = q.currentResponse?.responseValue;
      return val !== undefined && val !== null && val.trim() !== "";
    }).length;

    return {
      name: currentQuestion.sectionName,
      code: currentQuestion.sectionCode,
      total: sectionQuestions.length,
      answered: sectionAnswered,
    };
  }, [currentQuestion, questions]);

  const handleAnswer = (responseValue: string, selectedOptionId?: string) => {
    if (!currentQuestion) return;

    // Optimistically update local state immediately
    setLocalResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        selectedOptionId,
        responseValue,
      },
    }));

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

  // =========================================================================
  // 1. ASSESSMENT INTRODUCTION SCREEN
  // =========================================================================
  if (showIntro) {
    return (
      <div className="min-h-screen bg-[#F7FAF9] dark:bg-[#0D1C1B] flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-[#00BFA5]/20">
        <div className="max-w-2xl w-full bg-white dark:bg-[#172B2A] rounded-3xl border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-10 shadow-xl space-y-8 animate-in fade-in zoom-in-95 duration-200">
          {/* Header Badge & Language Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{attemptData.versionName || "Skill Finder — Student Edition"}</span>
            </span>
            <div className="flex items-center gap-3 text-xs font-semibold text-[#526866] dark:text-[#9FB3B0]">
              <AssessmentLanguageSwitcher
                currentLanguage={language}
                onLanguageChange={handleLanguageChange}
                supportedLanguages={attemptData.supportedLanguages || SUPPORTED_LANGUAGES}
              />
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#00B8D4]" />
                <span>~{attemptData.durationMinutes || 30} mins</span>
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-[#00BFA5]" />
                <span>{totalQuestions} {getRunnerTranslation("question", language)}</span>
              </span>
            </div>
          </div>

          {/* Title & Overview */}
          <div className="space-y-3" dir={isRtl ? "rtl" : "ltr"}>
            <h1 className="text-2xl sm:text-3xl font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
              {getRunnerTranslation("welcomeTitle", language)}
            </h1>
            <p className="text-sm text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
              {getRunnerTranslation("welcomeDesc", language)}
            </p>
          </div>

          {/* Key Guidelines */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2" dir={isRtl ? "rtl" : "ltr"}>
            <div className="p-4 rounded-2xl bg-[#EBF2F0]/60 dark:bg-white/5 border border-[#E3ECEA] dark:border-white/5 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-[#00BFA5]/20 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h4 className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                {getRunnerTranslation("inst1Title", language)}
              </h4>
              <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                {getRunnerTranslation("inst1Desc", language)}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#EBF2F0]/60 dark:bg-white/5 border border-[#E3ECEA] dark:border-white/5 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-[#00B8D4]/20 text-[#00B8D4] flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h4 className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                {getRunnerTranslation("inst2Title", language)}
              </h4>
              <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                {getRunnerTranslation("inst2Desc", language)}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#EBF2F0]/60 dark:bg-white/5 border border-[#E3ECEA] dark:border-white/5 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h4 className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                {getRunnerTranslation("inst3Title", language)}
              </h4>
              <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                {getRunnerTranslation("inst3Desc", language)}
              </p>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E3ECEA] dark:border-white/10">
            <button
              type="button"
              onClick={() => router.push("/participant/assessments")}
              className="text-xs font-semibold text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-white transition-colors cursor-pointer"
            >
              {getRunnerTranslation("backToDashboard", language)}
            </button>
            <button
              type="button"
              onClick={() => setShowIntro(false)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white font-black text-sm transition-all duration-200 shadow-lg shadow-[#00BFA5]/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{getRunnerTranslation("beginAssessment", language)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. ACTIVE ASSESSMENT RUNNER
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F7FAF9] dark:bg-[#0D1C1B] flex flex-col justify-between selection:bg-[#00BFA5]/20">
      {/* 1. TOP RUNNER HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#172B2A]/95 backdrop-blur-md border-b border-[#E3ECEA] dark:border-white/10 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Left: Exit & Section Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExitModal(true)}
              className="p-2 rounded-xl text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-white hover:bg-[#EBF2F0] dark:hover:bg-white/5 transition-colors cursor-pointer"
              title={getRunnerTranslation("exitModalTitle", language)}
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xs sm:text-sm font-black text-[#172B2A] dark:text-[#F7FAF9] line-clamp-1">
                  {attemptData.versionName || attemptData.assessmentName}
                </h1>
                <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5]">
                  {currentSectionInfo?.name}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#526866] dark:text-[#9FB3B0]">
                <span className="font-semibold text-[#008F83] dark:text-[#00BFA5]">
                  {getRunnerTranslation("question", language)} {currentIndex + 1}{" "}
                  {getRunnerTranslation("of", language)} {totalQuestions}
                </span>
                {currentSectionInfo && (
                  <>
                    <span>•</span>
                    <span className="hidden md:inline">
                      {currentSectionInfo.answered}/{currentSectionInfo.total}{" "}
                      {getRunnerTranslation("answered", language)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Language Switcher, Timer, Save Status, Palette Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Language Switcher Dropdown */}
            <AssessmentLanguageSwitcher
              currentLanguage={language}
              onLanguageChange={handleLanguageChange}
              supportedLanguages={
                attemptData.supportedLanguages || SUPPORTED_LANGUAGES
              }
            />

            {/* Auto-save Pill */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#526866] dark:text-[#9FB3B0]">
              {saveMutation.isPending ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span>{getRunnerTranslation("saving", language)}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{getRunnerTranslation("saved", language)}</span>
                </>
              )}
            </div>

            {/* Timer */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EBF2F0] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
              <Clock className="w-3.5 h-3.5 text-[#00B8D4]" />
              <span className="font-mono">{formatTimer(secondsElapsed)}</span>
            </div>

            {/* Question Overview Button */}
            <button
              onClick={() => setShowPalette(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30 hover:bg-[#00BFA5]/25 transition-colors text-xs font-bold cursor-pointer"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">
                {getRunnerTranslation("overview", language)}
              </span>
              <span className="sm:hidden">
                {answeredCount}/{totalQuestions}
              </span>
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-[#E3ECEA] dark:bg-white/10 h-1.5 relative overflow-hidden">
          <div
            className="bg-[#00BFA5] h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </header>

      {/* 2. MAIN QUESTION CANVAS */}
      <main
        className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col justify-center"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {currentQuestion && (
          <QuestionRenderer
            question={currentQuestion}
            currentResponse={currentQuestion.currentResponse}
            onAnswer={handleAnswer}
            disabled={submitMutation.isPending}
          />
        )}
      </main>

      {/* 3. BOTTOM RUNNER FOOTER CONTROLS */}
      <footer className="sticky bottom-0 z-40 bg-white/95 dark:bg-[#172B2A]/95 backdrop-blur-md border-t border-[#E3ECEA] dark:border-white/10 py-3.5 sm:py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0 || submitMutation.isPending}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentIndex === 0
                ? "opacity-30 pointer-events-none text-[#526866] dark:text-[#9FB3B0]"
                : "bg-[#EBF2F0] hover:bg-[#E3ECEA] dark:bg-white/5 dark:hover:bg-white/10 text-[#172B2A] dark:text-[#F7FAF9]"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{getRunnerTranslation("previous", language)}</span>
          </button>

          <div className="text-center">
            <span className="text-xs font-semibold text-[#526866] dark:text-[#9FB3B0]">
              {answeredCount} {getRunnerTranslation("of", language)} {totalQuestions}{" "}
              {getRunnerTranslation("answered", language)} ({progressPercentage}%)
            </span>
          </div>

          {currentIndex === totalQuestions - 1 ? (
            <button
              onClick={() => setShowSubmitModal(true)}
              disabled={submitMutation.isPending}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-md shadow-emerald-600/25 flex items-center gap-1.5 cursor-pointer"
            >
              <span>{getRunnerTranslation("reviewAndSubmit", language)}</span>
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={submitMutation.isPending}
              className="px-5 py-2.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-black transition-all shadow-md shadow-[#00BFA5]/25 flex items-center gap-1.5 cursor-pointer"
            >
              <span>{getRunnerTranslation("next", language)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </footer>

      {/* 4. QUESTION PALETTE OVERVIEW DRAWER */}
      {showPalette && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#172B2A] rounded-3xl border border-[#E3ECEA] dark:border-white/10 max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#E3ECEA] dark:border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                  {getRunnerTranslation("questionPaletteTitle", language)}
                </h3>
                <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
                  {answeredCount} {getRunnerTranslation("of", language)}{" "}
                  {totalQuestions} {getRunnerTranslation("answered", language)} (
                  {progressPercentage}%)
                </p>
              </div>
              <button
                onClick={() => setShowPalette(false)}
                className="p-2 rounded-xl text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-white hover:bg-[#EBF2F0] dark:hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Questions Grid Grouped by Section */}
            <div className="overflow-y-auto flex-1 space-y-6 pr-2">
              {sections.map((sec) => {
                const sectionQs = questions.filter(
                  (q) => q.sectionCode === sec.code
                );
                if (sectionQs.length === 0) return null;

                return (
                  <div key={sec.code} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                        {sec.name}
                      </span>
                      <span className="text-[11px] text-[#526866] dark:text-[#9FB3B0]">
                        {
                          sectionQs.filter((q) =>
                            answeredIndices.has(questions.indexOf(q))
                          ).length
                        }
                        /{sectionQs.length}{" "}
                        {getRunnerTranslation("answered", language)}
                      </span>
                    </div>

                    <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
                      {sectionQs.map((q) => {
                        const globalIdx = questions.indexOf(q);
                        const isAnswered = answeredIndices.has(globalIdx);
                        const isCurrent = globalIdx === currentIndex;

                        return (
                          <button
                            key={q.id}
                            onClick={() => {
                              setCurrentIndex(globalIdx);
                              setShowPalette(false);
                            }}
                            className={`h-9 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                              isCurrent
                                ? "bg-[#172B2A] text-white dark:bg-white dark:text-[#172B2A] ring-2 ring-[#00BFA5]"
                                : isAnswered
                                ? "bg-[#00BFA5] text-[#172B2A] shadow-xs"
                                : "bg-[#EBF2F0] dark:bg-white/5 text-[#526866] dark:text-[#9FB3B0] hover:bg-[#E3ECEA] dark:hover:bg-white/10"
                            }`}
                          >
                            {globalIdx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[#E3ECEA] dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-[#526866] dark:text-[#9FB3B0]">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-md bg-[#00BFA5]" />
                  <span>{getRunnerTranslation("answered", language)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-md bg-[#EBF2F0] dark:bg-white/10" />
                  <span>{getRunnerTranslation("unanswered", language)}</span>
                </div>
              </div>
              <button
                onClick={() => setShowPalette(false)}
                className="px-5 py-2 rounded-xl bg-[#EBF2F0] dark:bg-white/5 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] hover:bg-[#E3ECEA] dark:hover:bg-white/10 cursor-pointer"
              >
                {getRunnerTranslation("close", language)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. PAUSE & EXIT MODAL */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#172B2A] rounded-3xl border border-[#E3ECEA] dark:border-white/10 max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <Clock className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                {getRunnerTranslation("exitModalTitle", language)}
              </h3>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                {getRunnerTranslation("exitModalDesc", language)}
              </p>
            </div>
            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={() => setShowExitModal(false)}
                className="w-full py-3 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white font-bold text-xs transition-colors cursor-pointer"
              >
                {getRunnerTranslation("continueAssessment", language)}
              </button>
              <button
                onClick={() => router.push("/participant/assessments")}
                className="w-full py-3 rounded-xl bg-[#EBF2F0] dark:bg-white/5 hover:bg-[#E3ECEA] dark:hover:bg-white/10 text-[#172B2A] dark:text-[#F7FAF9] font-bold text-xs transition-colors cursor-pointer"
              >
                {getRunnerTranslation("exitToPortal", language)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. SUBMISSION CONFIRMATION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#172B2A] rounded-3xl border border-[#E3ECEA] dark:border-white/10 max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                {getRunnerTranslation("submitModalTitle", language)}
              </h3>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                {getRunnerTranslation("submitModalDesc", language)}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#EBF2F0]/60 dark:bg-white/5 border border-[#E3ECEA] dark:border-white/5 text-xs text-left space-y-1.5">
              <div className="flex justify-between font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                <span>{getRunnerTranslation("answered", language)}:</span>
                <span className="text-[#008F83] dark:text-[#00BFA5]">
                  {answeredCount} / {totalQuestions}
                </span>
              </div>
              <div className="flex justify-between text-[#526866] dark:text-[#9FB3B0]">
                <span>{getRunnerTranslation("unanswered", language)}:</span>
                <span>{totalQuestions - answeredCount}</span>
              </div>
            </div>

            {totalQuestions - answeredCount > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-300 text-xs text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
                <span>{getRunnerTranslation("unansweredNotice", language)}</span>
              </div>
            )}

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={handleSubmit}
                disabled={submitMutation.isPending}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{getRunnerTranslation("submitNow", language)}</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowSubmitModal(false)}
                disabled={submitMutation.isPending}
                className="w-full py-3 rounded-xl bg-[#EBF2F0] dark:bg-white/5 hover:bg-[#E3ECEA] dark:hover:bg-white/10 text-[#172B2A] dark:text-[#F7FAF9] font-bold text-xs transition-colors cursor-pointer"
              >
                {getRunnerTranslation("keepReviewing", language)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

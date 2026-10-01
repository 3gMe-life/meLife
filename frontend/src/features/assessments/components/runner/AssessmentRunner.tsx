"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  AssessmentAttemptQuestionsResponse,
} from "../../types/assessment.types";
import { assessmentApi } from "../../api/assessment.api";
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
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  LayoutGrid,
  Send,
  X,
  Play,
  Check,
} from "lucide-react";

interface AssessmentRunnerProps {
  attemptData: AssessmentAttemptQuestionsResponse;
}

export function AssessmentRunner({ attemptData }: AssessmentRunnerProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
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
  const { data: dynamicQuestionsData, isFetching: isLanguageFetching } =
    useAssessmentAttemptQuestionsQuery(attemptId, language);

  // Prefetch other supported languages in the background for 0ms instant language switching
  useEffect(() => {
    const supportedLangs = attemptData.supportedLanguages || SUPPORTED_LANGUAGES;
    supportedLangs.forEach((l) => {
      if (l.code !== language) {
        queryClient.prefetchQuery({
          queryKey: ["attemptQuestions", attemptId, l.code],
          queryFn: () => assessmentApi.getAttemptQuestions(attemptId, l.code),
          staleTime: 1000 * 60 * 15,
        });
      }
    });
  }, [attemptId, language, queryClient, attemptData.supportedLanguages]);

  // Redirect guard: if attempt is already completed, route immediately to results
  useEffect(() => {
    if (attemptData.status === "COMPLETED" || dynamicQuestionsData?.status === "COMPLETED") {
      router.replace(`/participant/results/${attemptId}`);
    }
  }, [attemptData.status, dynamicQuestionsData?.status, attemptId, router]);

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

  // Authoritative elapsed time calculation from attempt startedAt timestamp
  const calculateElapsedSeconds = useCallback((startedAt?: string | null) => {
    if (!startedAt) return 0;
    const started = new Date(startedAt).getTime();
    if (isNaN(started)) return 0;
    return Math.max(0, Math.floor((Date.now() - started) / 1000));
  }, []);

  const [secondsElapsed, setSecondsElapsed] = useState(() =>
    calculateElapsedSeconds(activeAttemptData.startedAt || attemptData.startedAt)
  );

  const saveMutation = useSaveAssessmentResponseMutation(attemptId);
  const submitMutation = useSubmitAssessmentMutation(attemptId);

  // Timer: synchronized with authoritative backend startedAt, continuous across refresh/language changes
  useEffect(() => {
    if (showIntro) return;

    const authoritativeStartedAt = activeAttemptData.startedAt || attemptData.startedAt;
    const authoritativeElapsed = calculateElapsedSeconds(authoritativeStartedAt);
    if (authoritativeElapsed > 0) {
      setSecondsElapsed((prev) => Math.max(prev, authoritativeElapsed));
    }

    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [showIntro, activeAttemptData.startedAt, attemptData.startedAt, calculateElapsedSeconds]);

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
  const progressPercentage = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const [isAdvancing, setIsAdvancing] = useState(false);
  const isAdvancingRef = useRef(false);
  isAdvancingRef.current = isAdvancing;
  const lastNavigatedAtRef = useRef<number>(0);

  const currentQuestionRef = useRef(currentQuestion);
  currentQuestionRef.current = currentQuestion;
  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;
  const totalQuestionsRef = useRef(totalQuestions);
  totalQuestionsRef.current = totalQuestions;
  const saveMutationRef = useRef(saveMutation);
  saveMutationRef.current = saveMutation;
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, []);

  const handleAnswer = useCallback((responseValue: string, selectedOptionId?: string) => {
    if (isAdvancingRef.current) return;
    if (Date.now() - lastNavigatedAtRef.current < 250) return;

    const q = currentQuestionRef.current;
    if (!q) return;

    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }

    setLocalResponses((prev) => ({
      ...prev,
      [q.id]: {
        selectedOptionId,
        responseValue,
      },
    }));

    saveMutationRef.current.mutate({
      questionId: q.id,
      selectedOptionId,
      responseValue,
    });

    // Auto-advance for choice-based items with smooth confirmation delay
    if (q.questionType !== "open_scored") {
      if (currentIndexRef.current < totalQuestionsRef.current - 1) {
        setIsAdvancing(true);
        isAdvancingRef.current = true;

        autoAdvanceTimerRef.current = setTimeout(() => {
          setCurrentIndex((prev) => Math.min(prev + 1, totalQuestionsRef.current - 1));
          setIsAdvancing(false);
          isAdvancingRef.current = false;
          lastNavigatedAtRef.current = Date.now();
          autoAdvanceTimerRef.current = null;
        }, 280);
      }
    }
  }, []);

  const handlePrev = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    setIsAdvancing(false);
    isAdvancingRef.current = false;
    lastNavigatedAtRef.current = Date.now();
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    setIsAdvancing(false);
    isAdvancingRef.current = false;
    lastNavigatedAtRef.current = Date.now();
    if (currentIndexRef.current < totalQuestionsRef.current - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowSubmitModal(true);
    }
  }, []);

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
        <div className="max-w-2xl w-full bg-white dark:bg-[#172B2A] rounded-3xl border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-10 shadow-xl space-y-8 animate-in fade-in duration-200">
          {/* Header & Language Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5]">
              {attemptData.versionName || attemptData.assessmentName}
            </span>
            <div className="flex items-center gap-3 text-xs font-semibold text-[#526866] dark:text-[#9FB3B0]">
              <AssessmentLanguageSwitcher
                currentLanguage={language}
                onLanguageChange={handleLanguageChange}
                supportedLanguages={attemptData.supportedLanguages || SUPPORTED_LANGUAGES}
                isFetching={isLanguageFetching}
              />
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-[#00B8D4]" />
                <span>~{attemptData.durationMinutes || 30}m</span>
              </span>
              <span className="font-mono">
                {totalQuestions} {getRunnerTranslation("question", language)}
              </span>
            </div>
          </div>

          {/* Title & Overview */}
          <div className="space-y-2.5" dir={isRtl ? "rtl" : "ltr"}>
            <h1 className="text-2xl sm:text-3xl font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
              {getRunnerTranslation("welcomeTitle", language)}
            </h1>
            <p className="text-sm text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
              {getRunnerTranslation("welcomeDesc", language)}
            </p>
          </div>

          {/* Key Guidelines */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1" dir={isRtl ? "rtl" : "ltr"}>
            <div className="p-4 rounded-2xl bg-[#F7FAF9] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/5 space-y-1.5">
              <span className="font-mono text-xs font-bold text-[#008F83] dark:text-[#00BFA5]">
                01
              </span>
              <h4 className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                {getRunnerTranslation("inst1Title", language)}
              </h4>
              <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                {getRunnerTranslation("inst1Desc", language)}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7FAF9] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/5 space-y-1.5">
              <span className="font-mono text-xs font-bold text-[#00B8D4]">
                02
              </span>
              <h4 className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                {getRunnerTranslation("inst2Title", language)}
              </h4>
              <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                {getRunnerTranslation("inst2Desc", language)}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7FAF9] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/5 space-y-1.5">
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                03
              </span>
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
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white font-black text-sm transition-all duration-180 shadow-md shadow-[#00BFA5]/20 flex items-center justify-center gap-2 cursor-pointer"
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
  // 2. ACTIVE FOCUSED ASSESSMENT CANVAS
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F7FAF9] dark:bg-[#0D1C1B] flex flex-col justify-between selection:bg-[#00BFA5]/20">
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#172B2A]/95 backdrop-blur-md border-b border-[#E3ECEA] dark:border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Left: Close Trigger & Clean Typographic Stack */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExitModal(true)}
              className="p-1.5 -ml-1.5 rounded-lg text-[#728B88] dark:text-[#7D9491] hover:text-[#172B2A] dark:hover:text-white hover:bg-[#EBF2F0] dark:hover:bg-white/5 transition-colors cursor-pointer"
              title={getRunnerTranslation("exitModalTitle", language)}
              aria-label="Exit assessment"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h1 className="text-xs sm:text-sm font-bold text-[#172B2A] dark:text-[#F7FAF9] line-clamp-1 tracking-tight">
                  {attemptData.versionName || attemptData.assessmentName}
                </h1>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#728B88] dark:text-[#7D9491]">
                <span className="font-semibold text-[#008F83] dark:text-[#00BFA5]">
                  {getRunnerTranslation("question", language)} {currentIndex + 1}{" "}
                  {getRunnerTranslation("of", language)} {totalQuestions}
                </span>
                <span>•</span>
                <span>{attemptData.versionName ? "Standard Form" : "Psychometric Assessment"}</span>
              </div>
            </div>
          </div>

          {/* Right: Language, Auto-save, Monospace Timer, Overview Drawer */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <AssessmentLanguageSwitcher
              currentLanguage={language}
              onLanguageChange={handleLanguageChange}
              supportedLanguages={
                attemptData.supportedLanguages || SUPPORTED_LANGUAGES
              }
              isFetching={isLanguageFetching}
            />

            {/* Auto-save Status */}
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-[#728B88] dark:text-[#7D9491] pl-1">
              {saveMutation.isPending ? (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>{getRunnerTranslation("saving", language)}</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 text-[#00BFA5]" />
                  <span>{getRunnerTranslation("saved", language)}</span>
                </>
              )}
            </div>

            {/* Timer */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#F7FAF9] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
              <Clock className="w-3.5 h-3.5 text-[#00B8D4]" />
              <span className="font-mono">{formatTimer(secondsElapsed)}</span>
            </div>

            {/* Question Overview Button */}
            <button
              onClick={() => setShowPalette(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white dark:bg-[#172B2A] hover:bg-[#EBF2F0] dark:hover:bg-white/10 border border-[#E3ECEA] dark:border-white/10 text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] transition-colors cursor-pointer"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#008F83] dark:text-[#00BFA5]" />
              <span className="hidden sm:inline">
                {getRunnerTranslation("overview", language)}
              </span>
              <span className="sm:hidden font-mono text-[11px]">
                {answeredCount}/{totalQuestions}
              </span>
            </button>
          </div>
        </div>

        {/* Global Progress Bar: Subtle & Refined */}
        <div className="w-full bg-[#E3ECEA]/80 dark:bg-white/10 h-1 relative overflow-hidden">
          <div
            className="bg-[#00BFA5] h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </header>

      {/* 2. MAIN QUESTION CANVAS */}
      <main
        className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col justify-center"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {currentQuestion && (
          <QuestionRenderer
            key={currentQuestion.id}
            question={currentQuestion}
            currentResponse={currentQuestion.currentResponse}
            onAnswer={handleAnswer}
            disabled={isAdvancing || submitMutation.isPending}
          />
        )}
      </main>

      {/* 3. BOTTOM NAVIGATION BAR */}
      <footer className="sticky bottom-0 z-40 bg-white/95 dark:bg-[#172B2A]/95 backdrop-blur-md border-t border-[#E3ECEA] dark:border-white/10 py-3 sm:py-3.5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Previous Action */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0 || submitMutation.isPending}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentIndex === 0
                ? "opacity-30 pointer-events-none text-[#728B88] dark:text-[#7D9491]"
                : "bg-transparent hover:bg-[#EBF2F0] dark:hover:bg-white/5 text-[#172B2A] dark:text-[#F7FAF9] border border-[#E3ECEA] dark:border-white/10"
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{getRunnerTranslation("previous", language)}</span>
          </button>

          {/* Center Progress Readout */}
          <div className="text-center font-mono text-xs text-[#728B88] dark:text-[#7D9491]">
            <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
              {answeredCount}
            </span>{" "}
            {getRunnerTranslation("of", language)} {totalQuestions}{" "}
            {getRunnerTranslation("answered", language)} ({progressPercentage}%)
          </div>

          {/* Next / Submit Action */}
          {currentIndex === totalQuestions - 1 ? (
            <button
              onClick={() => setShowSubmitModal(true)}
              disabled={submitMutation.isPending}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-sm shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
            >
              <span>{getRunnerTranslation("reviewAndSubmit", language)}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={submitMutation.isPending}
              className="px-5 py-2 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-black transition-all shadow-sm shadow-[#00BFA5]/20 flex items-center gap-1.5 cursor-pointer"
            >
              <span>{getRunnerTranslation("next", language)}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </footer>

      {/* 4. QUESTION PALETTE OVERVIEW DRAWER */}
      {showPalette && (
        <div className="fixed inset-0 z-50 bg-[#0D1C1B]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
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
                      <span className="text-[11px] font-mono text-[#526866] dark:text-[#9FB3B0]">
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
                            className={`h-9 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                              isCurrent
                                ? "bg-[#172B2A] text-white dark:bg-white dark:text-[#172B2A] ring-2 ring-[#00BFA5]"
                                : isAnswered
                                ? "bg-[#00BFA5] text-[#172B2A] shadow-xs"
                                : "bg-[#F7FAF9] dark:bg-white/5 text-[#526866] dark:text-[#9FB3B0] hover:bg-[#E3ECEA] dark:hover:bg-white/10"
                            }`}
                          >
                            {String(globalIdx + 1).padStart(2, "0")}
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
                  <div className="w-3 h-3 rounded-md bg-[#F7FAF9] dark:bg-white/10 border border-[#E3ECEA] dark:border-white/10" />
                  <span>{getRunnerTranslation("unanswered", language)}</span>
                </div>
              </div>
              <button
                onClick={() => setShowPalette(false)}
                className="px-4 py-2 rounded-xl bg-[#EBF2F0] dark:bg-white/5 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] hover:bg-[#E3ECEA] dark:hover:bg-white/10 cursor-pointer"
              >
                {getRunnerTranslation("close", language)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. PAUSE & EXIT MODAL */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-[#0D1C1B]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#172B2A] rounded-3xl border border-[#E3ECEA] dark:border-white/10 max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                {getRunnerTranslation("exitModalTitle", language)}
              </h3>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                {getRunnerTranslation("exitModalDesc", language)}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] hover:bg-[#EBF2F0] dark:hover:bg-white/5 cursor-pointer transition-colors"
              >
                {getRunnerTranslation("continueAssessment", language)}
              </button>
              <button
                type="button"
                onClick={() => router.push("/participant/assessments")}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-md shadow-amber-600/20 cursor-pointer transition-colors"
              >
                {getRunnerTranslation("exitToPortal", language)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. SUBMISSION CONFIRMATION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-[#0D1C1B]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#172B2A] rounded-3xl border border-[#E3ECEA] dark:border-white/10 max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                {getRunnerTranslation("submitModalTitle", language)}
              </h3>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                {answeredCount < totalQuestions
                  ? `${getRunnerTranslation("unansweredNotice", language)} (${answeredCount}/${totalQuestions} answered)`
                  : getRunnerTranslation("allAnsweredReady", language)}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] hover:bg-[#EBF2F0] dark:hover:bg-white/5 cursor-pointer transition-colors"
              >
                {getRunnerTranslation("keepReviewing", language)}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-black shadow-md shadow-[#00BFA5]/25 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                {submitMutation.isPending ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <span>{getRunnerTranslation("submitNow", language)}</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

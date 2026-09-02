"use client";

import React, { useState } from "react";
import { EDUCATION_STAGES } from "../constants/auth.constants";
import { useAuthFlowStore } from "../store/auth-flow.store";
import { educationStepSchema } from "../schemas/onboarding.schema";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export function EducationStep() {
  const educationStage = useAuthFlowStore((s) => s.educationStage);
  const setEducationStage = useAuthFlowStore((s) => s.setEducationStage);
  const setOnboardingStep = useAuthFlowStore((s) => s.setOnboardingStep);

  const [selectedStage, setSelectedStage] = useState<string>(educationStage || "");
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectedStage(id);
    setError(null);
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = educationStepSchema.safeParse({ educationStage: selectedStage });

    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Please select an education stage");
      return;
    }

    setEducationStage(selectedStage);

    // Conditional routing:
    // If Grade 5 through 10, proceed to Guardian step.
    // If Grade 11+, College, or Professional, guardian step is optional/skimmable, but proceed to step 2 for full profile or finish.
    setOnboardingStep(2);
  };

  return (
    <form onSubmit={handleContinue} className="w-full text-left">
      <div className="mb-5">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 1 of 2 • Educational Stage</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight mb-1.5">
          What class or stage are you currently in?
        </h2>
        <p className="text-xs sm:text-sm text-[#64748B]">
          This allows 3G MeLife to calibrate psychometric assessments specifically to your developmental age.
        </p>
      </div>

      {error && (
        <p className="mb-4 text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
          {error}
        </p>
      )}

      {/* Grid of Education Stages */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto pr-1 mb-6 p-1">
        {EDUCATION_STAGES.map((stage) => {
          const isSelected = selectedStage === stage.id;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => handleSelect(stage.id)}
              className={cn(
                "p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between select-none",
                isSelected
                  ? "bg-blue-50/60 border-[#2563EB] shadow-xs text-[#2563EB]"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-[#0F172A]"
              )}
            >
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                {stage.category}
              </span>
              <span className="text-xs sm:text-sm font-bold leading-tight">
                {stage.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="pt-2">
        <AuthSubmitButton>
          Continue to Step 2
        </AuthSubmitButton>
      </div>
    </form>
  );
}

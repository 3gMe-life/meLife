"use client";

import React, { useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { useAuthFlowStore } from "../store/auth-flow.store";
import { EducationStep } from "./EducationStep";
import { GuardianStep } from "./GuardianStep";
import { useRouter } from "next/navigation";

export function StudentOnboardingModal() {
  const router = useRouter();
  const isOpen = useAuthFlowStore((s) => s.isOnboardingModalOpen);
  const step = useAuthFlowStore((s) => s.onboardingStep);
  const setOpen = useAuthFlowStore((s) => s.setOnboardingModalOpen);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setOpen(false);
        router.push("/participant/dashboard");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setOpen, router]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#172B2A]/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-dialog-title"
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(23,43,42,0.25)] border border-[#E3ECEA] animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Modal Top Header Bar with Progress Indicator */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E3ECEA]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#00BFA5] animate-pulse" />
            <span
              id="onboarding-dialog-title"
              className="text-xs font-bold uppercase tracking-wider text-[#172B2A]"
            >
              Complete Your Profile
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Step Pills */}
            <div className="flex items-center gap-1.5">
              <span
                className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center ${
                  step === 1
                    ? "bg-[#00BFA5] text-[#172B2A]"
                    : "bg-[#EBF2F0] text-[#008F83] border border-[#00BFA5]/30"
                }`}
              >
                1
              </span>
              <span className="w-3 h-0.5 bg-[#E3ECEA]" />
              <span
                className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center ${
                  step === 2
                    ? "bg-[#00BFA5] text-[#172B2A]"
                    : "bg-[#EBF2F0] text-[#526866]"
                }`}
              >
                2
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                router.push("/participant/dashboard");
              }}
              className="p-1.5 rounded-full text-[#728B88] hover:text-[#172B2A] hover:bg-[#EBF2F0] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00BFA5]"
              aria-label="Close profile setup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body Step Content */}
        {step === 1 ? <EducationStep /> : <GuardianStep />}

        {/* Footer reassurance */}
        <div className="mt-6 pt-4 border-t border-[#E3ECEA] flex items-center justify-center gap-1.5 text-[11px] text-[#526866]">
          <Sparkles className="w-3.5 h-3.5 text-[#00BFA5]" />
          <span>You can update these details anytime from your profile settings.</span>
        </div>
      </div>
    </div>
  );
}

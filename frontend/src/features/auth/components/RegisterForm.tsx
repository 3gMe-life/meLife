"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, AlertCircle } from "lucide-react";
import { AuthHeader } from "./AuthHeader";
import { AuthTabs } from "./AuthTabs";
import { RegistrationPathSelector } from "./RegistrationPathSelector";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { StudentRegistrationForm } from "./StudentRegistrationForm";
import { ParentRegistrationForm } from "./ParentRegistrationForm";
import { CounsellorRegistrationForm } from "./CounsellorRegistrationForm";
import { InstitutionRegistrationForm } from "./InstitutionRegistrationForm";
import { StudentOnboardingModal } from "./StudentOnboardingModal";
import { useAuthFlowStore } from "../store/auth-flow.store";
import { useGoogleAuthMutation } from "../hooks/useGoogleAuthMutation";
import { resolveDashboardRoute } from "../constants/auth.constants";

export function RegisterForm() {
  const router = useRouter();
  const selectedPath = useAuthFlowStore((s) => s.registrationPath);
  const setRegistrationPath = useAuthFlowStore((s) => s.setRegistrationPath);
  const submissionFeedback = useAuthFlowStore((s) => s.submissionFeedback);
  const setSubmissionFeedback = useAuthFlowStore((s) => s.setSubmissionFeedback);
  const resetFlow = useAuthFlowStore((s) => s.resetFlow);
  const setOnboardingModalOpen = useAuthFlowStore((s) => s.setOnboardingModalOpen);

  const googleMutation = useGoogleAuthMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  const handleGoogleCredential = (credential: string) => {
    setServerError(null);
    googleMutation.mutate(
      {
        credential,
        registrationPath: selectedPath,
      },
      {
        onSuccess: (response) => {
          // If Counsellor / Institution pending review application
          if (response?.data?.applicationType) {
            setSubmissionFeedback({
              type: selectedPath,
              title:
                response.data.applicationType === "COUNSELLOR"
                  ? "Professional Profile Submitted"
                  : "Institution Application Received",
              message:
                response.data.message ||
                "Your application has been received and is pending review by the MeLife team.",
            });
            return;
          }

          const role = response?.data?.user?.role || response?.data?.role;

          if (selectedPath === "STUDENT" || role === "PARTICIPANT") {
            setOnboardingModalOpen(true);
          } else {
            const targetPath = resolveDashboardRoute(role);
            router.push(targetPath);
          }
        },
        onError: (err) => {
          setServerError(
            err.message || "Google registration failed. Please try again."
          );
        },
      }
    );
  };

  return (
    <div className="relative w-full max-w-[450px] mx-auto rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-white/12 p-5 sm:p-7 shadow-[0_25px_60px_-15px_rgba(2,6,23,0.7)] text-white animate-in fade-in zoom-in-95 duration-300">
      {/* Student Onboarding Modal Wizard */}
      <StudentOnboardingModal />

      {/* 1. Official MeLife Brand Header */}
      <AuthHeader />

      {/* 2. Segmented Tabs (Sign In vs Create Account) */}
      <AuthTabs activeTab="register" />

      {/* Submission Feedback Card (For Counsellor/Institution review state) */}
      {submissionFeedback ? (
        <div className="py-4 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-12 h-12 rounded-2xl bg-[#14B8A6] text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-white mb-2">
            {submissionFeedback.title}
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed mb-6">
            {submissionFeedback.message}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Link
              href="/"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-colors"
            >
              Back to Home
            </Link>
            <button
              type="button"
              onClick={resetFlow}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Submit another inquiry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 3. 2x2 Ultra-Compact Registration Journey Selector */}
          <RegistrationPathSelector
            selectedPath={selectedPath}
            onSelect={setRegistrationPath}
          />

          {/* Server Error Banner */}
          {serverError && (
            <div
              className="mb-3 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-start gap-2 animate-in fade-in duration-150"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{serverError}</span>
            </div>
          )}

          {/* 4. Google Social Auth for Individual / Parent */}
          {(selectedPath === "STUDENT" || selectedPath === "PARENT") && (
            <>
              <div className="mb-3">
                <GoogleAuthButton
                  onCredentialReceived={handleGoogleCredential}
                  isLoading={googleMutation.isPending}
                  text={`Sign up as ${selectedPath === "PARENT" ? "Parent" : "Student"} with Google`}
                />
              </div>

              {/* Divider with OR */}
              <div className="relative flex items-center justify-center my-3">
                <div className="w-full border-t border-slate-700/80" />
                <span className="absolute px-3 bg-slate-900/90 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                  OR
                </span>
              </div>
            </>
          )}

          {/* 5. Sub-form for Selected Path */}
          <div className="transition-all duration-200">
            {selectedPath === "STUDENT" && <StudentRegistrationForm />}
            {selectedPath === "PARENT" && <ParentRegistrationForm />}
            {selectedPath === "COUNSELLOR" && <CounsellorRegistrationForm />}
            {selectedPath === "INSTITUTION" && <InstitutionRegistrationForm />}
          </div>
        </>
      )}

      {/* 6. Footer Link */}
      <div className="mt-5 pt-3.5 border-t border-slate-800 text-center text-xs text-slate-300">
        <span>Already have an account? </span>
        <Link
          href="/login"
          className="font-bold text-[#14B8A6] hover:text-[#2DD4BF] hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}

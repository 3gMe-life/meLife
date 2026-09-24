"use client";

import React, { useState } from "react";
import { User, Phone, Mail, ShieldCheck, ArrowLeft } from "lucide-react";
import { FormInput } from "./FormInput";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { guardianStepSchema } from "../schemas/onboarding.schema";
import { useAuthFlowStore } from "../store/auth-flow.store";
import { useStudentOnboardingMutation } from "../hooks/useRegisterMutations";
import { useRouter } from "next/navigation";

export function GuardianStep() {
  const router = useRouter();
  const educationStage = useAuthFlowStore((s) => s.educationStage);
  const guardianDraft = useAuthFlowStore((s) => s.guardianDraft);
  const setGuardianDraft = useAuthFlowStore((s) => s.setGuardianDraft);
  const setOnboardingStep = useAuthFlowStore((s) => s.setOnboardingStep);
  const setOnboardingModalOpen = useAuthFlowStore((s) => s.setOnboardingModalOpen);

  const onboardingMutation = useStudentOnboardingMutation();

  const [formData, setFormData] = useState({
    guardianName: guardianDraft?.name || "",
    guardianPhone: guardianDraft?.phone || "",
    guardianEmail: guardianDraft?.email || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Check if school learner (Grades 5–10) where guardian contact is recommended
  const isSchoolStage =
    educationStage?.startsWith("grade_5") ||
    educationStage?.startsWith("grade_6") ||
    educationStage?.startsWith("grade_7") ||
    educationStage?.startsWith("grade_8") ||
    educationStage?.startsWith("grade_9") ||
    educationStage?.startsWith("grade_10");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (serverError) setServerError(null);
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();

    // If school stage, validate guardian name and phone
    if (isSchoolStage) {
      const validation = guardianStepSchema.safeParse(formData);
      if (!validation.success) {
        const fieldErrors: Record<string, string> = {};
        validation.error.issues.forEach((issue) => {
          const fieldName = issue.path[0] as string;
          if (!fieldErrors[fieldName]) {
            fieldErrors[fieldName] = issue.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }
    }

    setGuardianDraft({
      name: formData.guardianName,
      phone: formData.guardianPhone,
      email: formData.guardianEmail,
    });

    onboardingMutation.mutate(
      {
        educationStage: educationStage || "grade_10",
        guardianName: formData.guardianName,
        guardianPhone: formData.guardianPhone,
        guardianEmail: formData.guardianEmail,
      },
      {
        onSuccess: () => {
          setOnboardingModalOpen(false);
          router.replace("/participant/dashboard");
        },
        onError: (err) => {
          setServerError(err.message || "Failed to complete educational calibration. Please try again.");
        },
      }
    );
  };

  const handleCompleteLater = () => {
    setOnboardingModalOpen(false);
    router.push("/participant/dashboard");
  };

  return (
    <form onSubmit={handleFinish} className="w-full text-left">
      <div className="mb-4">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#008F83] mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00BFA5]" />
          <span>Step 2 of 2 • Family Guardian Link</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#172B2A] tracking-tight mb-1.5">
          Parent / Guardian Details
        </h2>
        <p className="text-xs sm:text-sm text-[#526866] leading-relaxed">
          We&apos;ll use these details to securely connect your guardian to your MeLife profile.
        </p>
      </div>

      {serverError && (
        <p className="mb-4 text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
          {serverError}
        </p>
      )}

      {/* Form Fields */}
      <div className="space-y-3 mb-6">
        <FormInput
          id="guardian-name"
          name="guardianName"
          type="text"
          label={isSchoolStage ? "Parent / Guardian Name" : "Parent / Guardian Name (Optional)"}
          placeholder="Rajesh Sharma"
          required={isSchoolStage}
          value={formData.guardianName}
          onChange={handleChange}
          error={errors.guardianName}
          leftIcon={<User className="w-4 h-4 text-slate-500" />}
          className="bg-slate-50 text-slate-900 border-slate-200"
        />

        <FormInput
          id="guardian-email"
          name="guardianEmail"
          type="email"
          label={isSchoolStage ? "Parent / Guardian Email" : "Parent / Guardian Email (Optional)"}
          placeholder="parent@example.com"
          required={isSchoolStage}
          value={formData.guardianEmail}
          onChange={handleChange}
          error={errors.guardianEmail}
          leftIcon={<Mail className="w-4 h-4 text-slate-500" />}
          className="bg-slate-50 text-slate-900 border-slate-200"
        />

        <FormInput
          id="guardian-phone"
          name="guardianPhone"
          type="tel"
          label="Guardian Phone Number (Optional)"
          placeholder="+91 98765 43210"
          value={formData.guardianPhone}
          onChange={handleChange}
          error={errors.guardianPhone}
          leftIcon={<Phone className="w-4 h-4 text-slate-500" />}
          className="bg-slate-50 text-slate-900 border-slate-200"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => setOnboardingStep(1)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-[#526866] hover:text-[#172B2A] hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Step 1</span>
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleCompleteLater}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#526866] hover:text-[#172B2A] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {isSchoolStage ? "Complete later" : "Skip for now"}
          </button>
          <AuthSubmitButton
            isLoading={onboardingMutation.isPending}
            loadingText="Saving profile..."
            className="w-full sm:w-auto"
          >
            Finish Onboarding
          </AuthSubmitButton>
        </div>
      </div>
    </form>
  );
}

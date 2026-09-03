"use client";

import React, { useState } from "react";
import { Mail, User, AlertCircle, ShieldCheck, Briefcase } from "lucide-react";
import { FormInput } from "./FormInput";
import { PasswordField } from "./PasswordField";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { counsellorRegisterSchema } from "../schemas/register.schema";
import { useApplyCounsellorMutation } from "../hooks/useRegisterMutations";
import { useAuthFlowStore } from "../store/auth-flow.store";
import type { CounsellorApplicationPayload } from "../types/auth.types";

export function CounsellorRegistrationForm() {
  const [formData, setFormData] = useState<CounsellorApplicationPayload & { confirmPassword: string }>({
    firstName: "",
    lastName: "",
    professionalEmail: "",
    password: "",
    confirmPassword: "",
    qualification: "",
    organization: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const applyMutation = useApplyCounsellorMutation();
  const setSubmissionFeedback = useAuthFlowStore((s) => s.setSubmissionFeedback);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    const validation = counsellorRegisterSchema.safeParse(formData);
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

    setErrors({});

    applyMutation.mutate(validation.data, {
      onSuccess: () => {
        setSubmissionFeedback({
          type: "COUNSELLOR",
          title: "Application Received for Review",
          message:
            "Thank you for registering. Our psychometric team reviews professional credentials to protect learner confidentiality. You will receive an email once your workspace is verified.",
        });
      },
      onError: (err) => {
        setServerError(err.message || "Application submission failed. Please try again.");
      },
    });
  };

  return (
    <div className="w-full">
      {/* Verification Notice Card */}
      <div className="mb-3.5 p-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-left">
          <span className="font-bold block text-amber-300 mb-0.5 text-xs">
            Professional Verification Required
          </span>
          <p className="text-amber-200/80 text-[10px] leading-relaxed">
            Counsellor accounts are verified by our team before student dossier and psychometric management tools are activated.
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {serverError && (
        <div
          className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-start gap-2 animate-in fade-in duration-150"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <div className="grid grid-cols-2 gap-2.5">
          <FormInput
            id="counsellor-first-name"
            name="firstName"
            type="text"
            label="First name"
            placeholder="Dr. Rajesh"
            autoComplete="given-name"
            required
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            leftIcon={<User className="w-4 h-4" />}
          />
          <FormInput
            id="counsellor-last-name"
            name="lastName"
            type="text"
            label="Last name"
            placeholder="Verma"
            autoComplete="family-name"
            required
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
        </div>

        <FormInput
          id="counsellor-email"
          name="professionalEmail"
          type="email"
          label="Professional email"
          placeholder="counsellor@institution.edu"
          autoComplete="email"
          required
          value={formData.professionalEmail}
          onChange={handleChange}
          error={errors.professionalEmail}
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <div className="grid grid-cols-2 gap-2.5">
          <FormInput
            id="counsellor-org"
            name="organization"
            type="text"
            label="Organization (Optional)"
            placeholder="Apex Academy"
            value={formData.organization}
            onChange={handleChange}
            leftIcon={<Briefcase className="w-4 h-4" />}
          />
          <FormInput
            id="counsellor-qualification"
            name="qualification"
            type="text"
            label="Qualification (Optional)"
            placeholder="M.Sc. Psychology"
            value={formData.qualification}
            onChange={handleChange}
          />
        </div>

        <PasswordField
          id="counsellor-password"
          name="password"
          label="Password"
          placeholder="At least 10 characters"
          autoComplete="new-password"
          required
          showRequirementsHint
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <PasswordField
          id="counsellor-confirm-password"
          name="confirmPassword"
          label="Confirm password"
          placeholder="Re-enter password"
          autoComplete="new-password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <div className="text-[10px] text-slate-400 text-left pt-1 leading-relaxed">
          By registering, you agree to comply with ethical guidance standards and 3G MeLife&apos;s{" "}
          <span className="text-[#00BFA5] font-medium">Terms of Service</span>.
        </div>

        <div className="pt-2">
          <AuthSubmitButton
            isLoading={applyMutation.isPending}
            loadingText="Submitting application..."
          >
            Submit Counsellor Application
          </AuthSubmitButton>
        </div>
      </form>
    </div>
  );
}

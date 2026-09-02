"use client";

import React, { useState } from "react";
import { Mail, User, AlertCircle, Users } from "lucide-react";
import { FormInput } from "./FormInput";
import { PasswordField } from "./PasswordField";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { parentRegisterSchema } from "../schemas/register.schema";
import { useRegisterParentMutation } from "../hooks/useRegisterMutations";
import { useAuthFlowStore } from "../store/auth-flow.store";
import type { ParentRegistrationPayload } from "../types/auth.types";

export function ParentRegistrationForm() {
  const [formData, setFormData] = useState<ParentRegistrationPayload & { confirmPassword: string }>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const registerMutation = useRegisterParentMutation();
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

    const validation = parentRegisterSchema.safeParse(formData);
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

    registerMutation.mutate(validation.data, {
      onSuccess: () => {
        setSubmissionFeedback({
          type: "PARENT",
          title: "Parent Account Created",
          message:
            "Your Parent portal is ready. You will be able to connect and view your children's assessment profiles from your family dashboard.",
        });
      },
      onError: (err) => {
        setServerError(err.message || "Registration failed. Please try again.");
      },
    });
  };

  return (
    <div className="w-full">
      {/* Notice Pill */}
      <div className="mb-3.5 p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-start gap-2 text-xs text-blue-200">
        <Users className="w-3.5 h-3.5 text-[#14B8A6] shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px]">
          You can link and view your children&apos;s psychometric assessment reports from your family dashboard after signup.
        </p>
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
            id="parent-first-name"
            name="firstName"
            type="text"
            label="First name"
            placeholder="Priya"
            autoComplete="given-name"
            required
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            leftIcon={<User className="w-4 h-4" />}
          />
          <FormInput
            id="parent-last-name"
            name="lastName"
            type="text"
            label="Last name"
            placeholder="Sharma"
            autoComplete="family-name"
            required
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
        </div>

        <FormInput
          id="parent-email"
          name="email"
          type="email"
          label="Email address"
          placeholder="parent@example.com"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <PasswordField
          id="parent-password"
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
          id="parent-confirm-password"
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
          By registering, you agree to 3G MeLife&apos;s{" "}
          <span className="text-[#14B8A6] font-medium">Terms of Service</span> and{" "}
          <span className="text-[#14B8A6] font-medium">Privacy Policy</span>.
        </div>

        <div className="pt-2">
          <AuthSubmitButton
            isLoading={registerMutation.isPending}
            loadingText="Creating account..."
          >
            Create Parent Account
          </AuthSubmitButton>
        </div>
      </form>
    </div>
  );
}

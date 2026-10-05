"use client";

import React, { useState } from "react";
import { Mail, User, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormInput } from "./FormInput";
import { PasswordField } from "./PasswordField";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { studentRegisterSchema } from "../schemas/register.schema";
import { useRegisterStudentMutation } from "../hooks/useRegisterMutations";
import type { StudentRegistrationPayload } from "../types/auth.types";

export function StudentRegistrationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<StudentRegistrationPayload & { confirmPassword: string }>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const registerMutation = useRegisterStudentMutation();

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

    const validation = studentRegisterSchema.safeParse(formData);
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
        router.push("/participant/dashboard");
      },
      onError: (err) => {
        setServerError(err.message || "Registration failed. Please try again.");
      },
    });
  };

  return (
    <div className="w-full">
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
            id="student-first-name"
            name="firstName"
            type="text"
            label="First name"
            placeholder="Aarav"
            autoComplete="given-name"
            required
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            leftIcon={<User className="w-4 h-4" />}
          />
          <FormInput
            id="student-last-name"
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
          id="student-email"
          name="email"
          type="email"
          label="Email address"
          placeholder="student@example.com"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <PasswordField
          id="student-password"
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
          id="student-confirm-password"
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
          <span className="text-[#00BFA5] font-medium">Terms of Service</span> and{" "}
          <span className="text-[#00BFA5] font-medium">Privacy Policy</span>.
        </div>

        <div className="pt-2">
          <AuthSubmitButton
            isLoading={registerMutation.isPending}
            loadingText="Creating account..."
          >
            Create Student Account
          </AuthSubmitButton>
        </div>
      </form>
    </div>
  );
}

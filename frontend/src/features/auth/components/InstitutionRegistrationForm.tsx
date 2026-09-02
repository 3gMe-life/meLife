"use client";

import React, { useState } from "react";
import { Mail, User, AlertCircle, Building2, Phone } from "lucide-react";
import { FormInput } from "./FormInput";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { institutionApplicationSchema } from "../schemas/register.schema";
import { useApplyInstitutionMutation } from "../hooks/useRegisterMutations";
import { useAuthFlowStore } from "../store/auth-flow.store";
import { INSTITUTION_TYPES } from "../constants/auth.constants";
import type { InstitutionApplicationPayload } from "../types/auth.types";

export function InstitutionRegistrationForm() {
  const [formData, setFormData] = useState<InstitutionApplicationPayload>({
    institutionName: "",
    institutionType: "school",
    officialEmail: "",
    contactName: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const applyMutation = useApplyInstitutionMutation();
  const setSubmissionFeedback = useAuthFlowStore((s) => s.setSubmissionFeedback);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

    const validation = institutionApplicationSchema.safeParse(formData);
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
          type: "INSTITUTION",
          title: "Institution Application Submitted",
          message:
            "Thank you for your interest in 3G MeLife institutional licensing. Our educational partnerships team will reach out within 24 hours to configure your cohort licenses.",
        });
      },
      onError: (err) => {
        setServerError(err.message || "Application submission failed. Please try again.");
      },
    });
  };

  return (
    <div className="w-full">
      {/* Notice Card */}
      <div className="mb-3.5 p-3 rounded-2xl bg-teal-950/40 border border-teal-500/40 text-teal-200 text-xs flex items-start gap-2.5">
        <Building2 className="w-4 h-4 text-[#14B8A6] shrink-0 mt-0.5" />
        <div className="text-left">
          <span className="font-bold block text-teal-300 mb-0.5 text-xs">
            Institutional Partner Licensing
          </span>
          <p className="text-teal-200/80 text-[10px] leading-relaxed">
            Apply for batch voucher creation, classroom analytics, and counsellor delegation for your campus.
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
        <FormInput
          id="institution-name"
          name="institutionName"
          type="text"
          label="Institution / School name"
          placeholder="St. Xavier's International School"
          required
          value={formData.institutionName}
          onChange={handleChange}
          error={errors.institutionName}
          leftIcon={<Building2 className="w-4 h-4" />}
        />

        {/* Institution Type Select */}
        <div className="w-full flex flex-col gap-1.5 text-left">
          <label
            htmlFor="institution-type"
            className="text-xs font-semibold text-slate-200 tracking-tight"
          >
            Institution type <span className="text-[#14B8A6]">*</span>
          </label>
          <select
            id="institution-type"
            name="institutionType"
            value={formData.institutionType}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm text-white bg-slate-800/60 border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/25 focus:border-[#14B8A6] cursor-pointer"
          >
            {INSTITUTION_TYPES.map((type) => (
              <option key={type.id} value={type.id} className="bg-slate-900 text-white">
                {type.label}
              </option>
            ))}
          </select>
          {errors.institutionType && (
            <p className="text-[11px] font-medium text-red-400">
              {errors.institutionType}
            </p>
          )}
        </div>

        <FormInput
          id="institution-email"
          name="officialEmail"
          type="email"
          label="Official institutional email"
          placeholder="admin@stxaviers.edu"
          autoComplete="email"
          required
          value={formData.officialEmail}
          onChange={handleChange}
          error={errors.officialEmail}
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <div className="grid grid-cols-2 gap-2.5">
          <FormInput
            id="institution-contact-name"
            name="contactName"
            type="text"
            label="Contact name"
            placeholder="Prof. Ananya Roy"
            autoComplete="name"
            required
            value={formData.contactName}
            onChange={handleChange}
            error={errors.contactName}
            leftIcon={<User className="w-4 h-4" />}
          />
          <FormInput
            id="institution-phone"
            name="phoneNumber"
            type="tel"
            label="Phone number"
            placeholder="+91 98765..."
            autoComplete="tel"
            required
            value={formData.phoneNumber}
            onChange={handleChange}
            error={errors.phoneNumber}
            leftIcon={<Phone className="w-4 h-4" />}
          />
        </div>

        <div className="text-[10px] text-slate-400 text-left pt-1 leading-relaxed">
          By submitting, you agree to 3G MeLife&apos;s{" "}
          <span className="text-[#14B8A6] font-medium">Institutional Terms</span> and{" "}
          <span className="text-[#14B8A6] font-medium">Privacy Policy</span>.
        </div>

        <div className="pt-2">
          <AuthSubmitButton
            isLoading={applyMutation.isPending}
            loadingText="Submitting application..."
          >
            Submit Institutional Application
          </AuthSubmitButton>
        </div>
      </form>
    </div>
  );
}

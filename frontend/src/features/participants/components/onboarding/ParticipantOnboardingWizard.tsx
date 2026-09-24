"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Sparkles,
  Calendar,
  GraduationCap,
  Users,
  Building2,
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  ShieldCheck,
  AlertCircle,
  Briefcase,
  User,
  Phone,
  Mail,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
import { useParticipantProfileQuery } from "../../hooks/useParticipantProfileQuery";
import { useParticipantOnboardingMutation } from "../../hooks/useParticipantOnboardingMutation";
import { isGuardianRequired, calculateAge } from "../../rules/guardian-policy";
import { participantOnboardingFormSchema } from "../../schemas/participant-onboarding.schema";
import type { ParticipantProfile } from "../../types/participant.types";

const EDUCATION_STAGES_CONFIG = [
  {
    id: "SCHOOL",
    title: "School Student",
    subtitle: "Class / Grade 5 through 12",
    description: "Discover learning style, cognitive strengths, and subject streams.",
    icon: GraduationCap,
  },
  {
    id: "COLLEGE_UNIVERSITY",
    title: "College / University",
    subtitle: "Undergraduate or Postgraduate",
    description: "Explore career pathways, specialization choices, and skill alignment.",
    icon: BookOpen,
  },
  {
    id: "WORKING_PROFESSIONAL",
    title: "Working Professional",
    subtitle: "Early Career or Transitioning",
    description: "Evaluate career direction, leadership traits, and industry fit.",
    icon: Briefcase,
  },
  {
    id: "OTHER",
    title: "Lifelong Learner",
    subtitle: "General / Independent",
    description: "Understand psychometric potential and personal strengths.",
    icon: Sparkles,
  },
];

const SCHOOL_GRADES = ["5", "6", "7", "8", "9", "10", "11", "12"];

const CURRICULUM_BOARDS = [
  "CBSE",
  "ICSE / ISC",
  "State Board",
  "IB (International Baccalaureate)",
  "Cambridge (IGCSE / A-Levels)",
  "Other / Independent",
];

const GUARDIAN_RELATIONSHIPS = [
  "Mother",
  "Father",
  "Legal Guardian",
  "Elder Sibling / Mentor",
  "Other",
];

interface WizardFormProps {
  initialProfile?: ParticipantProfile | null;
}

function WizardForm({ initialProfile }: WizardFormProps) {
  const router = useRouter();
  const { data: userData } = useCurrentUserQuery();
  const onboardingMutation = useParticipantOnboardingMutation();
  const user = userData?.data?.user;

  // Step state: 1: Personal & Stage, 2: Academic Details, 3: Guardian Details, 4: Review & Complete
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Form State initialized from initialProfile
  const [formData, setFormData] = useState(() => ({
    dateOfBirth: initialProfile?.dateOfBirth || "",
    educationStage: initialProfile?.educationStage || "SCHOOL",
    gradeLevel: initialProfile?.gradeLevel || "10",
    schoolName: initialProfile?.schoolName || "",
    curriculumOrBoard: initialProfile?.curriculumOrBoard || "CBSE",
    guardianName: initialProfile?.guardianName || "",
    guardianPhone: initialProfile?.guardianPhone || "",
    guardianEmail: initialProfile?.guardianEmail || "",
    guardianRelationship: initialProfile?.guardianRelationship || "Mother",
  }));

  const derivedAge = calculateAge(formData.dateOfBirth);
  const guardianRequired = isGuardianRequired({
    dateOfBirth: formData.dateOfBirth,
    educationStage: formData.educationStage,
    gradeLevel: formData.gradeLevel,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
    setServerError(null);
  };

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.educationStage) {
      errors.educationStage = "Please select an education stage";
    }
    if (formData.dateOfBirth) {
      const age = calculateAge(formData.dateOfBirth);
      if (age === null || age < 5 || age > 120) {
        errors.dateOfBirth = "Age must be between 5 and 120 years.";
      }
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};
    if (formData.educationStage === "SCHOOL" && !formData.gradeLevel) {
      errors.gradeLevel = "Please select your current class / grade.";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step 3 Validation
  const validateStep3 = (): boolean => {
    const errors: Record<string, string> = {};
    if (guardianRequired) {
      if (!formData.guardianName || formData.guardianName.trim().length < 2) {
        errors.guardianName = "Guardian name is required for school students / minors.";
      }
      if (!formData.guardianPhone || formData.guardianPhone.trim().length < 7) {
        errors.guardianPhone = "Valid guardian contact number is required.";
      }
    }
    if (formData.guardianEmail && formData.guardianEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.guardianEmail)) {
        errors.guardianEmail = "Please enter a valid email address.";
      }
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitOnboarding = async () => {
    setServerError(null);

    // Full schema validation
    const result = participantOnboardingFormSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (path) errors[String(path)] = issue.message;
      });
      setValidationErrors(errors);
      setServerError("Please review and fix the highlighted fields.");
      return;
    }

    try {
      await onboardingMutation.mutateAsync(formData);
      router.replace("/participant/dashboard");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to save participant profile";
      setServerError(errorMsg);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-[#FFFFFF] dark:bg-[#172B2A] rounded-3xl shadow-[0_20px_50px_rgba(23,43,42,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-[#E3ECEA] dark:border-white/10 overflow-hidden transition-colors duration-200">
      {/* Wizard Header Bar with 3G MeLife Branding */}
      <div className="px-6 py-5 sm:px-8 border-b border-[#E3ECEA] dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F7FAF9] dark:bg-[#0D1C1B]/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl p-0.5 bg-gradient-to-tr from-[#00B8D4] via-[#00BFA5] to-[#00C896] flex items-center justify-center shadow-md">
            <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center p-1">
              <Image
                src="/melifelogo.png"
                alt="3G ME LIFE"
                width={32}
                height={32}
                priority
                className="object-contain w-full h-full"
              />
            </div>
          </div>
          <div>
            <h1 className="text-base font-extrabold text-[#172B2A] dark:text-white tracking-tight leading-none">
              Participant Calibration
            </h1>
            <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0] mt-1">
              Personalized Psychometric Profile Setup
            </p>
          </div>
        </div>

        {/* Step Indicator Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {[1, 2, 3, 4].map((step) => {
            const isCompleted = currentStep > step;
            const isCurrent = currentStep === step;
            return (
              <div key={step} className="flex items-center gap-1.5">
                <div
                  className={cn(
                    "w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all duration-200",
                    isCompleted
                      ? "bg-[#00BFA5] text-[#172B2A]"
                      : isCurrent
                      ? "bg-[#172B2A] dark:bg-white text-white dark:text-[#172B2A] ring-2 ring-[#00BFA5]"
                      : "bg-[#EBF2F0] dark:bg-white/10 text-[#728B88] dark:text-[#9FB3B0]"
                  )}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : step}
                </div>
                {step < 4 && (
                  <div
                    className={cn(
                      "w-4 sm:w-6 h-0.5 rounded-full transition-colors",
                      isCompleted ? "bg-[#00BFA5]" : "bg-[#E3ECEA] dark:bg-white/10"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Global Alert Banner */}
      {serverError && (
        <div className="mx-6 sm:mx-8 mt-6 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Wizard Step Content Body */}
      <div className="p-6 sm:p-8">
        {/* ============================================================ */}
        {/* STEP 1: Personal Context & Education Stage */}
        {/* ============================================================ */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div>
              <span className="text-xs font-bold text-[#008F83] dark:text-[#00BFA5] uppercase tracking-wider block mb-1">
                Step 1 of 4 • Personal Context
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#172B2A] dark:text-white tracking-tight">
                Welcome, {user?.firstName || "Participant"}! Let&apos;s calibrate your profile.
              </h2>
              <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0] mt-1">
                Your developmental age and learning stage ensure you receive age-appropriate psychometric assessments.
              </p>
            </div>

            {/* Date of Birth Field */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F7FAF9] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#172B2A] dark:text-white flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#00BFA5]" />
                  <span>Date of Birth</span>
                  <span className="text-[#008F83] dark:text-[#00BFA5] font-normal text-[11px]">
                    (Recommended)
                  </span>
                </label>
                {derivedAge !== null && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#00BFA5]/20 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30">
                    Age: {derivedAge} yrs {derivedAge < 18 ? "• School Minor" : "• Adult"}
                  </span>
                )}
              </div>

              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                className={cn(
                  "w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-[#172B2A] border transition-all duration-150 text-[#172B2A] dark:text-white",
                  validationErrors.dateOfBirth
                    ? "border-rose-400 focus:ring-rose-400"
                    : "border-[#E3ECEA] dark:border-white/15 focus:border-[#00BFA5] focus:ring-2 focus:ring-[#00BFA5]/25"
                )}
              />

              {validationErrors.dateOfBirth && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                  {validationErrors.dateOfBirth}
                </p>
              )}

              <p className="text-[11px] text-[#728B88] dark:text-[#9FB3B0]">
                We use exact birthdate to determine eligibility for Skill Finder (Ages 10–14), Stream Finder (Ages 14–16), and Career Pathways (Ages 16+).
              </p>
            </div>

            {/* Educational Stage Selector */}
            <div>
              <label className="text-xs font-bold text-[#172B2A] dark:text-white block mb-2.5">
                Select Your Educational & Career Stage <span className="text-[#00BFA5]">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EDUCATION_STAGES_CONFIG.map((stage) => {
                  const Icon = stage.icon;
                  const isSelected = formData.educationStage === stage.id;
                  return (
                    <button
                      key={stage.id}
                      type="button"
                      onClick={() => handleInputChange("educationStage", stage.id)}
                      className={cn(
                        "p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative select-none",
                        isSelected
                          ? "bg-[#EBF2F0] dark:bg-[#00BFA5]/10 border-[#00BFA5] ring-2 ring-[#00BFA5]/30 shadow-xs"
                          : "bg-white dark:bg-white/5 border-[#E3ECEA] dark:border-white/10 hover:border-[#00BFA5]/40 hover:bg-[#F7FAF9] dark:hover:bg-white/10"
                      )}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                            isSelected
                              ? "bg-[#00BFA5] text-[#172B2A]"
                              : "bg-[#EBF2F0] dark:bg-white/10 text-[#526866] dark:text-[#9FB3B0]"
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#00BFA5] text-[#172B2A] flex items-center justify-center font-bold text-xs">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-sm font-extrabold text-[#172B2A] dark:text-white leading-tight">
                          {stage.title}
                        </h3>
                        <span className="text-[11px] font-bold text-[#008F83] dark:text-[#00BFA5] block mt-0.5">
                          {stage.subtitle}
                        </span>
                        <p className="text-[11px] text-[#728B88] dark:text-[#9FB3B0] mt-1 leading-relaxed">
                          {stage.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {validationErrors.educationStage && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium mt-1.5">
                  {validationErrors.educationStage}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 2: Academic & Institutional Details */}
        {/* ============================================================ */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div>
              <span className="text-xs font-bold text-[#008F83] dark:text-[#00BFA5] uppercase tracking-wider block mb-1">
                Step 2 of 4 • Academic Calibration
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#172B2A] dark:text-white tracking-tight">
                {formData.educationStage === "SCHOOL"
                  ? "Which class or grade are you currently in?"
                  : "Tell us about your learning environment"}
              </h2>
              <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0] mt-1">
                This helps customize report recommendations and curriculum alignment.
              </p>
            </div>

            {/* School Grade Selection */}
            {formData.educationStage === "SCHOOL" && (
              <div>
                <label className="text-xs font-bold text-[#172B2A] dark:text-white block mb-2">
                  Select Grade / Class <span className="text-[#00BFA5]">*</span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {SCHOOL_GRADES.map((grade) => {
                    const isSelected = formData.gradeLevel === grade;
                    return (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => handleInputChange("gradeLevel", grade)}
                        className={cn(
                          "py-3 rounded-xl border text-center font-extrabold text-sm transition-all duration-150 cursor-pointer select-none",
                          isSelected
                            ? "bg-[#00BFA5] text-[#172B2A] border-[#00BFA5] shadow-xs"
                            : "bg-white dark:bg-white/5 border-[#E3ECEA] dark:border-white/10 text-[#172B2A] dark:text-white hover:border-[#00BFA5]/40"
                        )}
                      >
                        Class {grade}
                      </button>
                    );
                  })}
                </div>
                {validationErrors.gradeLevel && (
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium mt-1.5">
                    {validationErrors.gradeLevel}
                  </p>
                )}
              </div>
            )}

            {/* Board / Curriculum Selection */}
            {formData.educationStage === "SCHOOL" && (
              <div>
                <label className="text-xs font-bold text-[#172B2A] dark:text-white block mb-1.5">
                  Curriculum / Educational Board (Optional)
                </label>
                <select
                  value={formData.curriculumOrBoard}
                  onChange={(e) => handleInputChange("curriculumOrBoard", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/15 text-[#172B2A] dark:text-white focus:outline-none focus:border-[#00BFA5] focus:ring-2 focus:ring-[#00BFA5]/25 cursor-pointer"
                >
                  {CURRICULUM_BOARDS.map((board) => (
                    <option key={board} value={board} className="bg-white dark:bg-[#172B2A]">
                      {board}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* School / Institution Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#172B2A] dark:text-white flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#00BFA5]" />
                <span>
                  {formData.educationStage === "SCHOOL"
                    ? "School Name (Optional)"
                    : formData.educationStage === "COLLEGE_UNIVERSITY"
                    ? "College / University Name (Optional)"
                    : "Institution / Organization (Optional)"}
                </span>
              </label>
              <input
                type="text"
                placeholder={
                  formData.educationStage === "SCHOOL"
                    ? "e.g. Delhi Public School, R.K. Puram"
                    : "e.g. St. Xavier's College / B.Tech Computer Science"
                }
                value={formData.schoolName}
                onChange={(e) => handleInputChange("schoolName", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/15 text-[#172B2A] dark:text-white placeholder:text-[#728B88] dark:placeholder:text-[#9FB3B0]/60 focus:outline-none focus:border-[#00BFA5] focus:ring-2 focus:ring-[#00BFA5]/25"
              />
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 3: Parent / Guardian Details (Conditional) */}
        {/* ============================================================ */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div>
              <span className="text-xs font-bold text-[#008F83] dark:text-[#00BFA5] uppercase tracking-wider block mb-1">
                Step 3 of 4 • Family Guardian Link
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#172B2A] dark:text-white tracking-tight">
                {guardianRequired
                  ? "Parent / Guardian Contact Details"
                  : "Parent or Mentor Link (Optional)"}
              </h2>
              <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0] mt-1">
                {guardianRequired
                  ? "Under MeLife safety guidelines, school students and minors require a verified parent or legal guardian link."
                  : "You can optionally connect a parent, guardian, or educational mentor to receive shared report summaries."}
              </p>
            </div>

            {/* Notice Callout */}
            <div
              className={cn(
                "p-3.5 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed",
                guardianRequired
                  ? "bg-teal-50 dark:bg-teal-950/30 border-[#00BFA5]/40 text-[#172B2A] dark:text-teal-200"
                  : "bg-[#F7FAF9] dark:bg-white/5 border-[#E3ECEA] dark:border-white/10 text-[#526866] dark:text-[#9FB3B0]"
              )}
            >
              <Users className="w-4 h-4 text-[#00BFA5] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">
                  {guardianRequired
                    ? "Mandatory Guardian Contact"
                    : "Optional Guardian / Mentor Delegation"}
                </span>
                <span>
                  Entering guardian contact details records a pending relationship. Access is not shared until guardian verification is completed.
                </span>
              </div>
            </div>

            <div className="space-y-3.5">
              {/* Guardian Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#172B2A] dark:text-white flex items-center justify-between">
                  <span>
                    Parent / Guardian Name {guardianRequired && <span className="text-[#00BFA5]">*</span>}
                  </span>
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 absolute left-3.5 text-[#728B88] pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. Rajesh Sharma"
                    value={formData.guardianName}
                    onChange={(e) => handleInputChange("guardianName", e.target.value)}
                    className={cn(
                      "w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-[#172B2A] border text-[#172B2A] dark:text-white placeholder:text-[#728B88]",
                      validationErrors.guardianName
                        ? "border-rose-400 focus:ring-rose-400"
                        : "border-[#E3ECEA] dark:border-white/15 focus:border-[#00BFA5] focus:ring-2 focus:ring-[#00BFA5]/25"
                    )}
                  />
                </div>
                {validationErrors.guardianName && (
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                    {validationErrors.guardianName}
                  </p>
                )}
              </div>

              {/* Relationship & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#172B2A] dark:text-white">
                    Relationship
                  </label>
                  <select
                    value={formData.guardianRelationship}
                    onChange={(e) => handleInputChange("guardianRelationship", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/15 text-[#172B2A] dark:text-white focus:outline-none focus:border-[#00BFA5] focus:ring-2 focus:ring-[#00BFA5]/25"
                  >
                    {GUARDIAN_RELATIONSHIPS.map((rel) => (
                      <option key={rel} value={rel} className="bg-white dark:bg-[#172B2A]">
                        {rel}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#172B2A] dark:text-white">
                    Guardian Phone Number {guardianRequired && <span className="text-[#00BFA5]">*</span>}
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 absolute left-3.5 text-[#728B88] pointer-events-none" />
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.guardianPhone}
                      onChange={(e) => handleInputChange("guardianPhone", e.target.value)}
                      className={cn(
                        "w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-[#172B2A] border text-[#172B2A] dark:text-white placeholder:text-[#728B88]",
                        validationErrors.guardianPhone
                          ? "border-rose-400 focus:ring-rose-400"
                          : "border-[#E3ECEA] dark:border-white/15 focus:border-[#00BFA5] focus:ring-2 focus:ring-[#00BFA5]/25"
                      )}
                    />
                  </div>
                  {validationErrors.guardianPhone && (
                    <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                      {validationErrors.guardianPhone}
                    </p>
                  )}
                </div>
              </div>

              {/* Guardian Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#172B2A] dark:text-white">
                  Guardian Email Address (Optional)
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 absolute left-3.5 text-[#728B88] pointer-events-none" />
                  <input
                    type="email"
                    placeholder="e.g. parent@example.com"
                    value={formData.guardianEmail}
                    onChange={(e) => handleInputChange("guardianEmail", e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/15 text-[#172B2A] dark:text-white placeholder:text-[#728B88] focus:outline-none focus:border-[#00BFA5] focus:ring-2 focus:ring-[#00BFA5]/25"
                  />
                </div>
                {validationErrors.guardianEmail && (
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                    {validationErrors.guardianEmail}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 4: Calibration Review & Final Confirmation */}
        {/* ============================================================ */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div>
              <span className="text-xs font-bold text-[#008F83] dark:text-[#00BFA5] uppercase tracking-wider block mb-1">
                Step 4 of 4 • Final Review
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#172B2A] dark:text-white tracking-tight">
                Confirm your calibration details
              </h2>
              <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0] mt-1">
                Please verify your profile information before entering the 3G MeLife psychometric suite.
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Card 1: Learner Identity */}
              <div className="p-4 rounded-2xl bg-[#F7FAF9] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
                <span className="text-[10px] font-bold text-[#728B88] dark:text-[#9FB3B0] uppercase tracking-wider block mb-2">
                  Learner Identity
                </span>
                <p className="text-sm font-extrabold text-[#172B2A] dark:text-white leading-tight">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-0.5 truncate">
                  {user?.email}
                </p>
                {derivedAge !== null && (
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#EBF2F0] dark:bg-white/10 text-[#008F83] dark:text-[#00BFA5]">
                    Age: {derivedAge} yrs
                  </span>
                )}
              </div>

              {/* Card 2: Academic Stage */}
              <div className="p-4 rounded-2xl bg-[#F7FAF9] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
                <span className="text-[10px] font-bold text-[#728B88] dark:text-[#9FB3B0] uppercase tracking-wider block mb-2">
                  Academic Stage
                </span>
                <p className="text-sm font-extrabold text-[#172B2A] dark:text-white leading-tight">
                  {formData.educationStage === "SCHOOL"
                    ? `Class ${formData.gradeLevel}`
                    : formData.educationStage.replace("_", " ")}
                </p>
                {formData.curriculumOrBoard && (
                  <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-0.5">
                    {formData.curriculumOrBoard}
                  </p>
                )}
                {formData.schoolName && (
                  <p className="text-[11px] text-[#728B88] dark:text-[#9FB3B0] mt-1 truncate">
                    {formData.schoolName}
                  </p>
                )}
              </div>

              {/* Card 3: Guardian Link */}
              <div className="p-4 rounded-2xl bg-[#F7FAF9] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
                <span className="text-[10px] font-bold text-[#728B88] dark:text-[#9FB3B0] uppercase tracking-wider block mb-2">
                  Guardian Contact
                </span>
                {formData.guardianName ? (
                  <>
                    <p className="text-sm font-extrabold text-[#172B2A] dark:text-white leading-tight">
                      {formData.guardianName}
                    </p>
                    <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-0.5">
                      {formData.guardianRelationship} • {formData.guardianPhone}
                    </p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300">
                      Verification Pending
                    </span>
                  </>
                ) : (
                  <p className="text-xs text-[#728B88] dark:text-[#9FB3B0] italic mt-1">
                    Self-managed adult account
                  </p>
                )}
              </div>
            </div>

            {/* Privacy Assurance */}
            <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/20 border border-[#00BFA5]/25 flex items-center gap-3 text-xs text-[#172B2A] dark:text-teal-200">
              <ShieldCheck className="w-5 h-5 text-[#00BFA5] shrink-0" />
              <span>
                Your responses and psychometric profiles are confidential. You can update educational context anytime in Settings.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Wizard Footer Navigation Bar */}
      <div className="px-6 py-4 sm:px-8 border-t border-[#E3ECEA] dark:border-white/10 flex items-center justify-between bg-[#F7FAF9] dark:bg-[#0D1C1B]/60">
        <div>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={onboardingMutation.isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-white hover:bg-[#EBF2F0] dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#00BFA5] text-[#172B2A] hover:bg-[#008F83] hover:text-white shadow-md shadow-[#00BFA5]/20 hover:shadow-lg transition-all duration-150 cursor-pointer"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitOnboarding}
              disabled={onboardingMutation.isPending}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#00B8D4] via-[#00BFA5] to-[#00C896] hover:from-[#00C896] hover:via-[#00BFA5] hover:to-[#008F83] text-[#172B2A] hover:text-white shadow-lg shadow-[#00BFA5]/30 hover:shadow-xl transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
            >
              {onboardingMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#172B2A]" />
                  <span>Calibrating Profile...</span>
                </>
              ) : (
                <>
                  <span>Complete Calibration & Enter Dashboard</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ParticipantOnboardingWizard() {
  const { data: profileData, isLoading } = useParticipantProfileQuery();

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-[#00BFA5] mb-3" />
        <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
          Loading your participant profile...
        </p>
      </div>
    );
  }

  return <WizardForm key={profileData?.data?.id || "new-wizard"} initialProfile={profileData?.data} />;
}

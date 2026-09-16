"use client";

import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  User,
  GraduationCap,
  ShieldCheck,
  Calendar,
  Sparkles,
  Globe,
  KeyRound,
  Copy,
  Check,
  AlertTriangle,
  School,
  BookOpen,
  Info,
  Clock,
  Eye,
  EyeOff,
  Layers,
  Lock,
} from "lucide-react";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
import { useParticipantProfileQuery } from "../../hooks/useParticipantProfileQuery";
import { participantApi } from "../../api/participant.api";
import { authApi } from "@/features/auth/api/auth.api";
import { calculateAge } from "../../rules/guardian-policy";
import { EDUCATION_STAGES } from "@/features/auth/constants/auth.constants";
import { SUPPORTED_LANGUAGES } from "@/features/assessments/config/assessment-i18n.config";
import { toast } from "@/components/ui/toast";

const CURRICULUM_BOARDS = [
  { id: "CBSE", label: "CBSE (Central Board of Secondary Education)" },
  { id: "ICSE", label: "ICSE / ISC (Council for the Indian School Certificate Examinations)" },
  { id: "STATE_BOARD", label: "State Board" },
  { id: "IB", label: "IB (International Baccalaureate)" },
  { id: "CAMBRIDGE", label: "Cambridge (IGCSE / A-Levels)" },
  { id: "OTHER", label: "Other / International Board" },
] as const;

export function StudentProfileSettingsView() {
  const queryClient = useQueryClient();
  const { data: authData, isLoading: isAuthLoading } = useCurrentUserQuery();
  const { data: profileData, isLoading: isProfileLoading } = useParticipantProfileQuery();

  const user = authData?.data?.user;
  const participant = profileData?.data;

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [educationStage, setEducationStage] = useState("grade_10");
  const [curriculumOrBoard, setCurriculumOrBoard] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [guardianRelationship, setGuardianRelationship] = useState("Parent");
  const [preferredLanguage, setPreferredLanguage] = useState("en");
  const [reduceMotion, setReduceMotion] = useState(false);

  // UI States
  const [isSaving, setIsSaving] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [originalStage, setOriginalStage] = useState("");

  // Change Password Modal States
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Initialize form state when queries complete
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }
  }, [user]);

  useEffect(() => {
    if (participant) {
      if (participant.firstName) setFirstName(participant.firstName);
      if (participant.lastName) setLastName(participant.lastName);
      setDateOfBirth(participant.dateOfBirth || "");
      const stage = participant.educationStage || authData?.data?.onboarding?.educationStage || "grade_10";
      setEducationStage(stage);
      setOriginalStage(stage);
      setCurriculumOrBoard(participant.curriculumOrBoard || "");
      setSchoolName(participant.schoolName || "");
      setGuardianName(participant.guardianName || "");
      setGuardianPhone(participant.guardianPhone || "");
      setGuardianEmail(participant.guardianEmail || "");
      setGuardianRelationship(participant.guardianRelationship || "Parent");
    }
  }, [participant, authData]);

  // Read language and reduce motion preferences
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("melife_preferred_language");
      if (savedLang) setPreferredLanguage(savedLang);

      const savedMotion = localStorage.getItem("melife_reduce_motion");
      if (savedMotion === "true") setReduceMotion(true);
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  // Calculate live derived age from DOB
  const derivedAge = calculateAge(dateOfBirth);

  // Derive primary calibrated assessment from class/age
  const getCalibratedAssessment = () => {
    const stage = educationStage.toLowerCase();
    if (["grade_5", "grade_6", "grade_7", "grade_8"].includes(stage)) {
      return {
        code: "SKILL_FINDER",
        name: "Skill Finder",
        description: "Middle School foundational cognitive reasoning & exploratory skills.",
      };
    }
    if (["grade_9", "grade_10"].includes(stage)) {
      return {
        code: "STREAM_FINDER",
        name: "Stream Finder",
        description: "Secondary School subject affinity & academic stream selection.",
      };
    }
    if (["grade_11", "grade_12"].includes(stage)) {
      return {
        code: "STREAM_FINDER",
        name: "Stream Finder / Branch Finder",
        description: "Higher Secondary career specialization & degree alignment.",
      };
    }
    return {
      code: "RIGHT_CAREER_FINDER",
      name: "Right Career Finder",
      description: "Vocational alignment, RIASEC interests & professional career fit.",
    };
  };

  const calibratedAssessment = getCalibratedAssessment();

  // Copy Student ID
  const handleCopyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopiedId(true);
      toast.success("Student ID copied to clipboard");
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // Form Submission Interception (Check for calibration changes)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim()) {
      toast.error("First name is required.");
      return;
    }
    if (!lastName.trim()) {
      toast.error("Last name is required.");
      return;
    }

    // If educational stage has changed, show confirmation dialog to explain safety
    if (originalStage && originalStage !== educationStage) {
      setIsConfirmModalOpen(true);
      return;
    }

    executeProfileUpdate();
  };

  // Execute Save API Call
  const executeProfileUpdate = async () => {
    setIsSaving(true);
    try {
      // Calculate grade level string if applicable
      const gradeMatch = educationStage.match(/grade_(\d+)/i);
      const gradeLevel = gradeMatch ? gradeMatch[1] : null;

      await participantApi.updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dateOfBirth: dateOfBirth || null,
        educationStage,
        gradeLevel,
        schoolName: schoolName.trim() || null,
        curriculumOrBoard: curriculumOrBoard || null,
        guardianName: guardianName.trim() || null,
        guardianPhone: guardianPhone.trim() || null,
        guardianEmail: guardianEmail.trim() || null,
        guardianRelationship: guardianRelationship || null,
      });

      // Save language and accessibility preferences
      try {
        localStorage.setItem("melife_preferred_language", preferredLanguage);
        localStorage.setItem("melife_reduce_motion", String(reduceMotion));
      } catch {
        // Ignore localStorage write errors
      }

      setOriginalStage(educationStage);
      setIsConfirmModalOpen(false);

      // Invalidate relevant React Queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["currentUser"] }),
        queryClient.invalidateQueries({ queryKey: ["participantProfile"] }),
        queryClient.invalidateQueries({ queryKey: ["participantAssessments"] }),
      ]);

      toast.success("Profile & Calibration Updated", {
        description: "Your personal identity and educational calibration settings have been saved.",
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Unable to save profile changes. Please try again.";
      toast.error("Update Failed", { description: errorMsg });
    } finally {
      setIsSaving(false);
    }
  };

  // Execute Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation password do not match.");
      return;
    }

    setIsSubmittingPassword(true);
    try {
      const res = await authApi.changePassword({
        currentPassword,
        newPassword,
      });

      if (res.success) {
        toast.success("Password Updated Successfully", {
          description: "Your account credentials have been securely updated.",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsPasswordModalOpen(false);
      } else {
        setPasswordError(res.error?.message || "Failed to update password.");
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Current password incorrect or update failed.";
      setPasswordError(errorMsg);
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  if (isAuthLoading || isProfileLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-10 h-10 border-3 border-[#00BFA5]/30 border-t-[#00BFA5] rounded-full animate-spin" />
        <p className="text-xs font-semibold text-[#728B88] dark:text-[#9FB3B0]">
          Loading profile & calibration settings...
        </p>
      </div>
    );
  }

  const userInitials =
    `${firstName?.[0] || user?.firstName?.[0] || "U"}${lastName?.[0] || user?.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ============================================================ */}
        {/* 1. PERSONAL IDENTITY MODULE                                 */}
        {/* ============================================================ */}
        <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-6 sm:p-7 space-y-6 shadow-sm shadow-[#172B2A]/5 transition-colors">
          <div className="flex items-center justify-between border-b border-[#E3ECEA] dark:border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#172B2A] dark:text-[#F7FAF9] uppercase tracking-wider">
                  Personal Identity
                </h3>
                <p className="text-xs text-[#728B88] dark:text-[#9FB3B0]">
                  Your authenticated student identity, legal name, and date of birth.
                </p>
              </div>
            </div>

            {/* Profile Avatar Initials */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#00B8D4] via-[#00BFA5] to-[#00C896] flex items-center justify-center font-black text-sm text-[#172B2A] shadow-md shadow-[#00BFA5]/20">
              {userInitials}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* First Name */}
            <div>
              <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                className="w-full px-4 py-2.5 rounded-xl bg-[#F4F8F7] dark:bg-[#0D1C1B] border border-[#E3ECEA] dark:border-white/10 text-[#172B2A] dark:text-[#F7FAF9] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00BFA5]/40 transition-all"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                className="w-full px-4 py-2.5 rounded-xl bg-[#F4F8F7] dark:bg-[#0D1C1B] border border-[#E3ECEA] dark:border-white/10 text-[#172B2A] dark:text-[#F7FAF9] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00BFA5]/40 transition-all"
                required
              />
            </div>
          </div>

          {/* Date of Birth & Derived Age Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#00BFA5]" />
                <span>Date of Birth</span>
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F4F8F7] dark:bg-[#0D1C1B] border border-[#E3ECEA] dark:border-white/10 text-[#172B2A] dark:text-[#F7FAF9] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00BFA5]/40 transition-all"
              />
              <span className="text-[10px] text-[#728B88] dark:text-[#9FB3B0] mt-1 block">
                Used to calibrate psychometric difficulty benchmarks.
              </span>
            </div>

            {/* Automatically Derived Age (Read-Only) */}
            <div>
              <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#00B8D4]" />
                  <span>Current Calibrated Age</span>
                </span>
                <span className="text-[10px] font-bold text-[#008F83] dark:text-[#00BFA5] uppercase">
                  (Derived Automatically)
                </span>
              </label>
              <div className="w-full px-4 py-2.5 rounded-xl bg-[#EBF2F0]/80 dark:bg-[#0D1C1B]/80 border border-[#E3ECEA] dark:border-white/10 text-xs font-extrabold flex items-center justify-between text-[#172B2A] dark:text-[#F7FAF9]">
                <span>
                  {derivedAge !== null ? `${derivedAge} Years Old` : "Not provided"}
                </span>
                {derivedAge !== null && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00BFA5]/20 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30">
                    {derivedAge < 18 ? "Minor / School Age" : "Adult / Higher Ed"}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[#728B88] dark:text-[#9FB3B0] mt-1 block">
                Derived server-side from Date of Birth to prevent manual tampering.
              </span>
            </div>
          </div>

          {/* Email Address & Student UUID Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  value={user?.email || participant?.email || ""}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#EBF2F0]/60 dark:bg-[#0D1C1B]/60 border border-[#E3ECEA] dark:border-white/10 text-[#728B88] dark:text-[#7D9491] text-xs font-semibold cursor-not-allowed pr-10"
                />
                <div
                  className="absolute right-3 top-2.5 flex items-center gap-1 text-[#008F83] dark:text-[#00C896]"
                  title="Account Verified"
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
                MeLife Student Identifier (UUID)
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  disabled
                  value={user?.id || ""}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#EBF2F0]/60 dark:bg-[#0D1C1B]/60 border border-[#E3ECEA] dark:border-white/10 text-[#728B88] dark:text-[#7D9491] font-mono text-[11px] cursor-not-allowed pr-10"
                />
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="absolute right-2 p-1.5 rounded-lg text-[#728B88] hover:text-[#172B2A] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  title="Copy Student ID"
                >
                  {copiedId ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. EDUCATIONAL CALIBRATION MODULE                           */}
        {/* ============================================================ */}
        <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-6 sm:p-7 space-y-6 shadow-sm shadow-[#172B2A]/5 transition-colors">
          <div className="border-b border-[#E3ECEA] dark:border-white/10 pb-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00B8D4]/15 text-[#008F83] dark:text-[#00B8D4] flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#172B2A] dark:text-[#F7FAF9] uppercase tracking-wider">
                Educational Calibration
              </h3>
              <p className="text-xs text-[#728B88] dark:text-[#9FB3B0]">
                Defines your academic stage, syllabus board, and school affiliation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Education Stage Selector */}
            <div>
              <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#00BFA5]" />
                <span>Current Class / Academic Stage</span>
              </label>
              <select
                value={educationStage}
                onChange={(e) => setEducationStage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F4F8F7] dark:bg-[#0D1C1B] border border-[#E3ECEA] dark:border-white/10 text-[#172B2A] dark:text-[#F7FAF9] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00BFA5]/40 cursor-pointer"
              >
                {EDUCATION_STAGES.map((stage) => (
                  <option
                    key={stage.id}
                    value={stage.id}
                    className="bg-white dark:bg-[#172B2A] text-[#172B2A] dark:text-[#F7FAF9]"
                  >
                    {stage.label} — ({stage.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Curriculum / Board Selector */}
            <div>
              <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#00B8D4]" />
                <span>Curriculum / Examination Board</span>
              </label>
              <select
                value={curriculumOrBoard}
                onChange={(e) => setCurriculumOrBoard(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F4F8F7] dark:bg-[#0D1C1B] border border-[#E3ECEA] dark:border-white/10 text-[#172B2A] dark:text-[#F7FAF9] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00BFA5]/40 cursor-pointer"
              >
                <option value="">Select Curriculum / Board...</option>
                {CURRICULUM_BOARDS.map((b) => (
                  <option
                    key={b.id}
                    value={b.id}
                    className="bg-white dark:bg-[#172B2A] text-[#172B2A] dark:text-[#F7FAF9]"
                  >
                    {b.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* School / Institution Name */}
          <div>
            <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-[#00BFA5]" />
              <span>School / Institution Name</span>
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="e.g. Cambridge International School"
              className="w-full px-4 py-2.5 rounded-xl bg-[#F4F8F7] dark:bg-[#0D1C1B] border border-[#E3ECEA] dark:border-white/10 text-[#172B2A] dark:text-[#F7FAF9] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00BFA5]/40 transition-all"
            />
          </div>

          {/* Optional Guardian Contact (for Minors) */}
          <div className="pt-2 border-t border-[#E3ECEA] dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#728B88] dark:text-[#7D9491]">
                Parent / Guardian Contact (Optional)
              </h4>
              <span className="text-[10px] text-[#728B88] dark:text-[#7D9491]">
                For receiving student psychometric reports
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                  Guardian Name
                </label>
                <input
                  type="text"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="Guardian Full Name"
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8F7] dark:bg-[#0D1C1B] border border-[#E3ECEA] dark:border-white/10 text-xs text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:ring-2 focus:ring-[#00BFA5]/40"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                  Guardian Phone
                </label>
                <input
                  type="tel"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8F7] dark:bg-[#0D1C1B] border border-[#E3ECEA] dark:border-white/10 text-xs text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:ring-2 focus:ring-[#00BFA5]/40"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                  Guardian Email
                </label>
                <input
                  type="email"
                  value={guardianEmail}
                  onChange={(e) => setGuardianEmail(e.target.value)}
                  placeholder="guardian@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8F7] dark:bg-[#0D1C1B] border border-[#E3ECEA] dark:border-white/10 text-xs text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:ring-2 focus:ring-[#00BFA5]/40"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. CALIBRATION STATUS & TELEMETRY MODULE                     */}
        {/* ============================================================ */}
        <div className="rounded-3xl bg-gradient-to-br from-[#172B2A] to-[#112423] text-white p-6 sm:p-7 space-y-5 border border-white/10 shadow-lg shadow-black/20 select-none">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00C896] animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-widest text-white">
                Live Calibration Status
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#00BFA5]/20 text-[#00BFA5] border border-[#00BFA5]/30">
              ● Active & Calibrated
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D9491] block">
                Active Profile
              </span>
              <p className="text-xs font-bold text-white">
                {EDUCATION_STAGES.find((s) => s.id === educationStage)?.label || educationStage}
              </p>
              <span className="text-[10px] text-[#00BFA5] font-semibold">
                {derivedAge !== null ? `Calibrated for Age ${derivedAge}` : "Age calibration pending"}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D9491] block">
                Recommended Assessment
              </span>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00BFA5]" />
                <span>{calibratedAssessment.name}</span>
              </p>
              <span className="text-[10px] text-[#7D9491] line-clamp-1">
                {calibratedAssessment.description}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D9491] block">
                Last Calibration Sync
              </span>
              <p className="text-xs font-bold text-white">
                {participant?.updatedAt
                  ? new Date(participant.updatedAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Today"}
              </p>
              <span className="text-[10px] text-emerald-400 font-semibold">
                Historical records verified
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. LANGUAGE & ACCESSIBILITY MODULE                          */}
        {/* ============================================================ */}
        <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-6 sm:p-7 space-y-6 shadow-sm shadow-[#172B2A]/5 transition-colors">
          <div className="border-b border-[#E3ECEA] dark:border-white/10 pb-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#172B2A] dark:text-[#F7FAF9] uppercase tracking-wider">
                Language & Accessibility
              </h3>
              <p className="text-xs text-[#728B88] dark:text-[#9FB3B0]">
                Configure multilingual evaluation preferences and motion accessibility.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Language Selector */}
            <div>
              <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
                Preferred Evaluation Language
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F4F8F7] dark:bg-[#0D1C1B] border border-[#E3ECEA] dark:border-white/10 text-[#172B2A] dark:text-[#F7FAF9] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00BFA5]/40 cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option
                    key={lang.code}
                    value={lang.code}
                    className="bg-white dark:bg-[#172B2A] text-[#172B2A] dark:text-[#F7FAF9]"
                  >
                    {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-[#728B88] dark:text-[#9FB3B0] mt-1 block">
                Applies to assessment questions, career pathways, and report headers.
              </span>
            </div>

            {/* Reduce Motion Toggle */}
            <div>
              <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
                Motion Accessibility
              </label>
              <div className="p-3 rounded-xl bg-[#F4F8F7] dark:bg-[#0D1C1B] border border-[#E3ECEA] dark:border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] block">
                    Reduce Motion
                  </span>
                  <span className="text-[10px] text-[#728B88] dark:text-[#9FB3B0]">
                    Minimize sliding animations and screen transitions
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={reduceMotion}
                  onChange={(e) => setReduceMotion(e.target.checked)}
                  className="w-4 h-4 rounded text-[#00BFA5] focus:ring-[#00BFA5] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 5. ACCOUNT & SECURITY MODULE                                */}
        {/* ============================================================ */}
        <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-6 sm:p-7 space-y-6 shadow-sm shadow-[#172B2A]/5 transition-colors">
          <div className="border-b border-[#E3ECEA] dark:border-white/10 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#172B2A] dark:text-[#F7FAF9] uppercase tracking-wider">
                  Account & Security
                </h3>
                <p className="text-xs text-[#728B88] dark:text-[#9FB3B0]">
                  Manage your credentials, password, and session access.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setPasswordError("");
                setIsPasswordModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#F4F8F7] dark:bg-white/10 hover:bg-[#EBF2F0] dark:hover:bg-white/15 text-[#172B2A] dark:text-white text-xs font-bold transition-all border border-[#E3ECEA] dark:border-white/10 cursor-pointer flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#00BFA5]" />
              <span>Change Password</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-[#0D1C1B] border border-[#E3ECEA] dark:border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-[#728B88] dark:text-[#7D9491] uppercase">
                Email Authentication Status
              </span>
              <p className="font-bold text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#008F83] dark:text-[#00C896]" />
                <span>Primary Email Verified</span>
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-[#0D1C1B] border border-[#E3ECEA] dark:border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-[#728B88] dark:text-[#7D9491] uppercase">
                Session Encryption
              </span>
              <p className="font-bold text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#00BFA5]" />
                <span>Secure HttpOnly JWT with Argon2 Hashing</span>
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 6. PRIVACY & DATA SAFETY NOTICE                             */}
        {/* ============================================================ */}
        <div className="p-4 rounded-2xl bg-[#EBF2F0] dark:bg-[#0D1C1B]/80 border border-[#00BFA5]/30 text-xs flex items-start gap-3 text-[#172B2A] dark:text-[#F7FAF9]">
          <Info className="w-4 h-4 text-[#008F83] dark:text-[#00BFA5] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">
              Assessment Calibration & Historical Data Protection
            </span>
            <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
              When updating your Class or Date of Birth, all past completed assessments, psychometric scores, and generated reports remain permanently preserved and associated with the historical stage under which they were completed.
            </p>
          </div>
        </div>

        {/* Action Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-7 py-3 rounded-2xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-black transition-all shadow-lg shadow-[#00BFA5]/25 active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-[#172B2A] border-t-transparent rounded-full animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Save Profile & Calibration</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* ============================================================ */}
      {/* CALIBRATION CHANGE SAFETY CONFIRMATION MODAL                 */}
      {/* ============================================================ */}
      {isConfirmModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-[#172B2A] text-[#172B2A] dark:text-[#F7FAF9] border border-[#E3ECEA] dark:border-white/15 rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-black">
                Confirm Educational Calibration Change?
              </h3>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                Changing your educational profile may affect the assessments recommended to you and future assessment calibration.
              </p>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold text-left">
                ✓ Your previous completed assessment results and career reports will NOT be deleted or altered.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-[#F4F8F7] dark:bg-white/10 hover:bg-[#EBF2F0] text-xs font-bold text-[#172B2A] dark:text-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeProfileUpdate}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-black transition-all cursor-pointer shadow-md shadow-[#00BFA5]/25"
              >
                {isSaving ? "Updating..." : "Confirm & Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* CHANGE PASSWORD MODAL                                        */}
      {/* ============================================================ */}
      {isPasswordModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-[#172B2A] text-[#172B2A] dark:text-[#F7FAF9] border border-[#E3ECEA] dark:border-white/15 rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E3ECEA] dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#00BFA5]" />
                <h3 className="text-sm font-black uppercase tracking-wider">
                  Change Password
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-[#728B88] hover:text-[#172B2A] dark:hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {passwordError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F4F8F7] dark:bg-[#0D1C1B] border border-[#E3ECEA] dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00BFA5]/40 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    className="absolute right-3 top-2.5 text-[#728B88] hover:text-[#172B2A] dark:hover:text-white cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                  New Password (min. 8 characters)
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new secure password"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F4F8F7] dark:bg-[#0D1C1B] border border-[#E3ECEA] dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00BFA5]/40 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-2.5 text-[#728B88] hover:text-[#172B2A] dark:hover:text-white cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F4F8F7] dark:bg-[#0D1C1B] border border-[#E3ECEA] dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00BFA5]/40"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#F4F8F7] dark:bg-white/10 hover:bg-[#EBF2F0] text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPassword}
                  className="px-5 py-2 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-black transition-all cursor-pointer shadow-md shadow-[#00BFA5]/25"
                >
                  {isSubmittingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

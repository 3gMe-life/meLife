"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { institutionApi } from "@/features/institutions/api/institution.api";
import { StudentInvitationValidationDTO } from "@/features/institutions/types/institution.types";
import { ACCESS_TOKEN_KEY } from "@/services/api/client";
import {
  GraduationCap,
  School,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Clock,
  Ban,
  ArrowRight,
  ShieldCheck,
  User,
  Loader2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function StudentInvitationPage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;

  const [isValidating, setIsValidating] = useState(true);
  const [validation, setValidation] = useState<StudentInvitationValidationDTO | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    async function validate() {
      if (!token) {
        setIsValidating(false);
        return;
      }

      try {
        const res = await institutionApi.validateInvitationToken(token);
        setValidation(res);
        if (res.firstName) setFirstName(res.firstName);
        if (res.lastName) setLastName(res.lastName);
      } catch (err: any) {
        setValidation({
          isValid: false,
          status: "EXPIRED",
          error: err?.message || "Failed to validate invitation.",
        });
      } finally {
        setIsValidating(false);
      }
    }

    validate();
  }, [token]);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validation?.hasExistingAccount) {
      if (!password || password.length < 8) {
        setErrorMessage("Password must be at least 8 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const res = await institutionApi.acceptInvitation({
        token,
        password: !validation?.hasExistingAccount ? password : undefined,
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
      });

      if (res?.data?.accessToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, res.data.accessToken);
      }

      setIsAccepted(true);
      setTimeout(() => {
        router.push("/participant/dashboard");
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to accept invitation. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F8F7] dark:bg-[#0A1A18] p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#00B8D4] via-[#00BFA5] to-[#00C896] flex items-center justify-center mx-auto shadow-lg animate-pulse">
            <GraduationCap className="w-8 h-8 text-[#172B2A]" />
          </div>
          <h2 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9]">
            Validating Invitation...
          </h2>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
            Verifying your institutional onboarding token with 3G MeLife
          </p>
        </div>
      </div>
    );
  }

  // Token Validation Failed States
  if (!validation || !validation.isValid) {
    const isAcceptedStatus = validation?.status === "ACCEPTED";
    const isRevokedStatus = validation?.status === "REVOKED";

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F8F7] dark:bg-[#0A1A18] p-4">
        <div className="max-w-md w-full bg-white dark:bg-[#122423] rounded-3xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-8 text-center shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            {isAcceptedStatus ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            ) : isRevokedStatus ? (
              <Ban className="w-8 h-8" />
            ) : (
              <Clock className="w-8 h-8" />
            )}
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-[#172B2A] dark:text-[#F7FAF9]">
              {isAcceptedStatus
                ? "Invitation Already Accepted"
                : isRevokedStatus
                ? "Invitation Revoked"
                : "Invitation Expired or Invalid"}
            </h1>
            <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
              {validation?.error ||
                (isAcceptedStatus
                  ? "This student onboarding invitation has already been accepted and linked."
                  : "This link is no longer valid. Please contact your school coordinator or teacher to receive a new invitation.")}
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-gradient-to-r from-[#00B8D4] via-[#00BFA5] to-[#00C896] text-xs font-bold text-[#172B2A] shadow-md hover:shadow-lg transition-all"
            >
              <span>Go to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Accepted Success Screen
  if (isAccepted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F8F7] dark:bg-[#0A1A18] p-4">
        <div className="max-w-md w-full bg-white dark:bg-[#122423] rounded-3xl border border-emerald-500/20 p-8 text-center shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-[#172B2A] dark:text-[#F7FAF9]">
              Welcome to {validation.institutionName}! 🎉
            </h1>
            <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
              Your student account has been successfully linked to your academic cohort. Redirecting you to your psychometric dashboard...
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#00BFA5]">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading Student Portal...</span>
          </div>
        </div>
      </div>
    );
  }

  // Active Onboarding Form
  const cohortDisplay =
    validation.className ||
    (validation.gradeLevel
      ? `Grade ${validation.gradeLevel}${validation.division ? `-${validation.division}` : ""}`
      : "Academic Cohort");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F8F7] dark:bg-[#0A1A18] p-4 py-12">
      <div className="w-full max-w-lg bg-white dark:bg-[#122423] rounded-3xl shadow-2xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] overflow-hidden">
        {/* Header Branding */}
        <div className="p-8 border-b border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)] bg-gradient-to-br from-[#172B2A] to-[#0D3834] text-white">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2.5 py-1 rounded-lg bg-[#00BFA5] text-[#172B2A] font-black text-xs tracking-wider">
              3G MeLife
            </span>
            <span className="text-[11px] font-semibold text-[#9FB3B0]">
              Student Onboarding
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-2">
            You're Invited to Join Your School
          </h1>
          <p className="text-xs text-[#9FB3B0] leading-relaxed">
            {validation.institutionName} has invited you to complete your psychometric career assessments on 3G MeLife.
          </p>

          {/* Institution & Cohort Badge Card */}
          <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <School className="w-4 h-4 text-[#00BFA5]" />
              <span>{validation.institutionName}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#9FB3B0] pt-1 border-t border-white/10">
              <span>Cohort: <strong>{cohortDisplay}</strong></span>
              <span>Academic Year: <strong>{validation.academicYear || "2026-2027"}</strong></span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleAccept} className="p-8 space-y-5">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3.5 text-xs font-medium text-rose-700 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Invited Email Readonly Field */}
          <div>
            <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
              Invited Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#728B88]" />
              <input
                type="email"
                value={validation.email || ""}
                disabled
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)] bg-[#F7FAF9]/80 dark:bg-[#172B2A]/50 text-xs font-semibold text-[#526866] dark:text-[#9FB3B0] cursor-not-allowed"
              />
            </div>
          </div>

          {validation.hasExistingAccount ? (
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-300">
                <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Existing MeLife Account Detected</span>
              </div>
              <p className="text-xs text-indigo-800 dark:text-indigo-300/80 leading-relaxed">
                An account is already registered under <strong>{validation.email}</strong>. Accepting this invitation will safely link your existing student profile to {validation.institutionName} without creating a duplicate account.
              </p>
            </div>
          ) : (
            <>
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#728B88]" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      placeholder="First Name"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] bg-[#F7FAF9] dark:bg-[#172B2A] text-sm text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder="Last Name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] bg-[#F7FAF9] dark:bg-[#172B2A] text-sm text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div>
                <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
                  Create Student Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#728B88]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                    minLength={8}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] bg-[#F7FAF9] dark:bg-[#172B2A] text-sm text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#728B88] hover:text-[#172B2A] dark:hover:text-[#F7FAF9]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#728B88]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    required
                    minLength={8}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] bg-[#F7FAF9] dark:bg-[#172B2A] text-sm text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F7FAF9] dark:bg-[#172B2A] text-[11px] text-[#728B88] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00BFA5] shrink-0" />
                <span>Your password is encrypted and never visible to school administrators.</span>
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#00B8D4] via-[#00BFA5] to-[#00C896] text-sm font-bold text-[#172B2A] shadow-md hover:shadow-lg hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting Student Profile...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {validation.hasExistingAccount
                      ? "Accept & Link Existing Account"
                      : "Activate Account & Join Cohort"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

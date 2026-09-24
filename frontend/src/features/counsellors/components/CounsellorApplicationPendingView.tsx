"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ArrowLeft,
  Mail,
  FileText,
  UserCheck,
  Building,
  GraduationCap,
  Sparkles,
  Loader2,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { authApi } from "@/features/auth/api/auth.api";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";

export const CounsellorApplicationPendingView: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useCurrentUserQuery();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const user = data?.data?.user;
  const counsellorApplication = data?.data?.counsellorApplication;
  const isRejected = counsellorApplication?.status === "REJECTED";

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authApi.logout();
      queryClient.clear();
      router.push("/login");
    } catch {
      queryClient.clear();
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const formattedDate = counsellorApplication?.submittedAt
    ? new Date(counsellorApplication.submittedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently Submitted";

  const applicationId = counsellorApplication?.id
    ? `APP-${counsellorApplication.id.substring(0, 8).toUpperCase()}`
    : "APP-PENDING";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7FAF9] dark:bg-[#0D1C1B] flex flex-col items-center justify-center text-[#172B2A] dark:text-[#F7FAF9] select-none">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00B8D4] via-[#00BFA5] to-[#00C896] flex items-center justify-center shadow-xl shadow-[#00BFA5]/25 mb-4 animate-pulse">
          <span className="text-lg font-black tracking-wider text-[#172B2A]">3G</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-[#526866] dark:text-[#9FB3B0]">
          <Loader2 className="w-4 h-4 animate-spin text-[#00BFA5]" />
          <span>Loading application status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAF9] dark:bg-[#0D1C1B] text-[#172B2A] dark:text-[#F7FAF9] transition-colors duration-200 flex flex-col justify-between p-4 sm:p-6 lg:p-10 selection:bg-[#00BFA5]/20">
      {/* Top Header / Brand Nav */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-2">
        <Link href="/" className="flex items-center gap-3 group focus:outline-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00B8D4] via-[#00BFA5] to-[#00C896] flex items-center justify-center shadow-lg shadow-[#00BFA5]/20 group-hover:scale-105 transition-transform duration-200">
            <span className="text-base font-black tracking-wider text-[#172B2A]">3G</span>
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-[#172B2A] dark:text-white group-hover:text-[#00BFA5] transition-colors">
              MeLife
            </span>
            <span className="block text-[10px] uppercase font-bold tracking-widest text-[#00BFA5]">
              Counsellor Portal
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all duration-200 cursor-pointer disabled:opacity-60"
        >
          {isLoggingOut ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <LogOut className="w-3.5 h-3.5" />
          )}
          <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
        </button>
      </header>

      {/* Main Review Card Container */}
      <main className="max-w-3xl w-full mx-auto my-8">
        <div className="relative rounded-3xl bg-white dark:bg-[#172B2A]/80 border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-6 sm:p-10 shadow-[0_20px_50px_rgba(23,43,42,0.08)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
          {/* Status Header Badge & Icon */}
          <div className="flex flex-col items-center text-center mb-8">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${
                isRejected
                  ? "bg-rose-500/15 text-rose-500 border border-rose-500/30"
                  : "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30 animate-pulse"
              }`}
            >
              {isRejected ? (
                <XCircle className="w-8 h-8" />
              ) : (
                <Clock className="w-8 h-8" />
              )}
            </div>

            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase mb-3 ${
                isRejected
                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isRejected ? "bg-rose-500" : "bg-amber-500 animate-ping"
                }`}
              />
              <span>{isRejected ? "Application Not Approved" : "Under Admin Review"}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172B2A] dark:text-white mb-2">
              {isRejected
                ? "Counsellor Application Not Approved"
                : "Your counsellor application is under review."}
            </h1>

            <p className="text-sm text-[#526866] dark:text-[#9FB3B0] max-w-xl leading-relaxed">
              {isRejected
                ? "Thank you for your interest in joining 3G MeLife. After evaluating your profile credentials against our accreditation guidelines, we are unable to approve your counsellor profile at this time."
                : "Thank you for applying to join the 3G MeLife certified career counselling network. Our administrative team is actively reviewing your qualifications and professional details."}
            </p>
          </div>

          {/* Key Application Meta Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8 p-4 rounded-2xl bg-[#F7FAF9] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#00BFA5]/10 flex items-center justify-center text-[#008F83] dark:text-[#00BFA5] shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#728B88] dark:text-[#9FB3B0] block">
                  Application ID
                </span>
                <span className="text-xs font-mono font-bold text-[#172B2A] dark:text-white truncate block">
                  {applicationId}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#00B8D4]/10 flex items-center justify-center text-[#008F83] dark:text-[#00B8D4] shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#728B88] dark:text-[#9FB3B0] block">
                  Submitted Date
                </span>
                <span className="text-xs font-bold text-[#172B2A] dark:text-white truncate block">
                  {formattedDate}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isRejected
                    ? "bg-rose-500/10 text-rose-500"
                    : "bg-amber-500/10 text-amber-500"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#728B88] dark:text-[#9FB3B0] block">
                  Verification Status
                </span>
                <span
                  className={`text-xs font-bold truncate block ${
                    isRejected
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {isRejected ? "REJECTED" : "PENDING REVIEW"}
                </span>
              </div>
            </div>
          </div>

          {/* Applicant Profile Summary if Available */}
          {(counsellorApplication?.qualification || counsellorApplication?.organization) && (
            <div className="mb-8 p-4 rounded-2xl bg-white dark:bg-[#122322] border border-[#E3ECEA] dark:border-white/5 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#728B88] dark:text-[#9FB3B0] mb-2">
                Submitted Profile Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {counsellorApplication.qualification && (
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#00BFA5] shrink-0" />
                    <span className="text-[#526866] dark:text-[#9FB3B0]">Qualification:</span>
                    <span className="font-semibold text-[#172B2A] dark:text-white">
                      {counsellorApplication.qualification}
                    </span>
                  </div>
                )}
                {counsellorApplication.organization && (
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#00B8D4] shrink-0" />
                    <span className="text-[#526866] dark:text-[#9FB3B0]">Organization:</span>
                    <span className="font-semibold text-[#172B2A] dark:text-white">
                      {counsellorApplication.organization}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* What Happens Next Roadmap (Only for pending state) */}
          {!isRejected && (
            <div className="mb-8">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#172B2A] dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00BFA5]" />
                <span>What happens next?</span>
              </h2>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#F7FAF9] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/5">
                  <div className="w-7 h-7 rounded-lg bg-[#00BFA5] text-[#172B2A] flex items-center justify-center font-extrabold text-xs shrink-0 shadow-xs">
                    1
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#172B2A] dark:text-white mb-0.5">
                      Credential & Qualification Review
                    </h3>
                    <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                      Our academic and verification panel verifies educational degrees, psychometric certifications, and counselling experience (typically 24–48 hours).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#F7FAF9] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/5">
                  <div className="w-7 h-7 rounded-lg bg-[#00B8D4] text-[#172B2A] flex items-center justify-center font-extrabold text-xs shrink-0 shadow-xs">
                    2
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#172B2A] dark:text-white mb-0.5">
                      Email Notification
                    </h3>
                    <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                      As soon as your application is approved, we will send an activation email to{" "}
                      <strong className="text-[#172B2A] dark:text-white">{user?.email}</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#F7FAF9] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/5">
                  <div className="w-7 h-7 rounded-lg bg-[#00C896] text-[#172B2A] flex items-center justify-center font-extrabold text-xs shrink-0 shadow-xs">
                    3
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#172B2A] dark:text-white mb-0.5">
                      Full Portal Access Unlocked
                    </h3>
                    <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                      Your role will automatically update to <strong>CAREER_COUNSELLOR</strong>, granting immediate access to the Counsellor Dashboard, student appointment queue, and calendar settings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-6 border-t border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] flex flex-col sm:flex-row items-center justify-between gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#EBF2F0] dark:bg-white/10 hover:bg-[#DEE8E5] dark:hover:bg-white/15 text-xs font-bold text-[#172B2A] dark:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href="mailto:support@3gmelife.com?subject=Counsellor%20Application%20Inquiry"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-white/10 hover:bg-[#F7FAF9] dark:hover:bg-white/5 text-xs font-semibold text-[#526866] dark:text-[#9FB3B0] transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Support</span>
              </a>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00B8D4] via-[#00BFA5] to-[#00C896] hover:opacity-95 text-xs font-bold text-[#172B2A] shadow-md shadow-[#00BFA5]/20 transition-all cursor-pointer disabled:opacity-60"
              >
                {isLoggingOut ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="max-w-4xl w-full mx-auto text-center py-4 text-xs text-[#728B88] dark:text-[#9FB3B0]">
        <p>
          Need urgent assistance with your application? Reach out to{" "}
          <a
            href="mailto:support@3gmelife.com"
            className="text-[#008F83] dark:text-[#00BFA5] font-semibold hover:underline"
          >
            support@3gmelife.com
          </a>
        </p>
      </footer>
    </div>
  );
};

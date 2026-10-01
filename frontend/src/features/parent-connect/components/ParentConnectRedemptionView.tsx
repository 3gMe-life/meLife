"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  GraduationCap,
  School,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Users,
  KeyRound,
  RefreshCw,
  Sparkles,
  HeartHandshake,
} from "lucide-react";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
import {
  useVerifyInvitationMutation,
  useRedeemInvitationMutation,
} from "../hooks/useParentConnectMutations";
import type { InvitationSafeVerification } from "../types/parent-connect.types";

export function ParentConnectRedemptionView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";

  const [inviteCode, setInviteCode] = useState(initialCode);
  const [studentEmail, setStudentEmail] = useState("");
  const [relationshipType, setRelationshipType] = useState("PARENT");
  const [verifiedData, setVerifiedData] = useState<InvitationSafeVerification | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: userData } = useCurrentUserQuery();
  const user = userData?.data?.user;
  const userRole = userData?.data?.role || (user as any)?.role;

  const verifyMutation = useVerifyInvitationMutation();
  const redeemMutation = useRedeemInvitationMutation();

  // Auto-verify if code passed in URL query
  useEffect(() => {
    if (initialCode && initialCode.trim()) {
      handleVerify(initialCode.trim());
    }
  }, [initialCode]);

  const formatCodeInput = (val: string) => {
    let raw = val.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (raw.startsWith("MLP")) {
      raw = raw.slice(3);
    }
    raw = raw.slice(0, 8);

    if (raw.length > 4) {
      return `MLP-${raw.slice(0, 4)}-${raw.slice(4)}`;
    } else if (raw.length > 0) {
      return `MLP-${raw}`;
    }
    return "";
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCodeInput(e.target.value);
    setInviteCode(formatted);
    setErrorMessage(null);
    setVerifiedData(null);
  };

  const handleVerify = async (codeToVerify?: string) => {
    const targetCode = codeToVerify || inviteCode;
    if (!targetCode || !targetCode.trim()) {
      setErrorMessage("Please enter an invitation code.");
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await verifyMutation.mutateAsync(targetCode.trim());
      if (res.data && res.data.valid) {
        setVerifiedData(res.data);
      }
    } catch (err: any) {
      setVerifiedData(null);
      setErrorMessage(err.message || "Invalid or expired invitation code.");
    }
  };

  const handleRedeem = async () => {
    if (!verifiedData) return;
    if (!studentEmail || !studentEmail.trim()) {
      setErrorMessage("Please enter the student's registered email address to verify connection.");
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await redeemMutation.mutateAsync({
        inviteCode: verifiedData.inviteCode,
        studentEmail: studentEmail.trim(),
        relationshipType,
      });

      setSuccessMessage(`Successfully connected with ${verifiedData.student.firstName}!`);
      setTimeout(() => {
        router.push("/parent/dashboard");
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to link account.");
    }
  };

  const isParentLoggedIn = user && userRole === "PARENT_GUARDIAN";

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 py-12">
      <div className="w-full max-w-xl space-y-8">
        {/* Card Container */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#132826] border border-[#E5ECEB] dark:border-[#1E3B38] shadow-xl space-y-7">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0F5B54] to-[#106F63] mx-auto flex items-center justify-center text-emerald-200 shadow-lg shadow-[#0F5B54]/20">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Connect With Your Child
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                Enter the 12-character invitation code and your student's registered email to link accounts.
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3 text-rose-800 dark:text-rose-300 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-3 text-emerald-800 dark:text-emerald-300 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              <span>{successMessage} Redirecting to Parent Dashboard...</span>
            </div>
          )}

          {/* Step 1: Enter Invitation Code */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Invitation Code
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inviteCode}
                  onChange={handleCodeChange}
                  placeholder="MLP-XXXX-XXXX"
                  maxLength={13}
                  className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-[#0E201E] border border-gray-300 dark:border-[#1E3B38] font-mono text-lg font-bold text-center tracking-widest text-[#0F5B54] dark:text-teal-300 uppercase focus:ring-2 focus:ring-[#0F5B54] focus:outline-none transition-all placeholder:text-gray-400"
                />
              </div>
              <button
                onClick={() => handleVerify()}
                disabled={verifyMutation.isPending || !inviteCode.trim()}
                className="px-5 py-3.5 rounded-2xl text-xs font-bold bg-[#0F5B54] hover:bg-[#0A413C] text-white transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5 shrink-0"
              >
                {verifyMutation.isPending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    Verify
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Step 2: Verified Student Preview & Student Email Verification */}
          {verifiedData && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-50/70 to-emerald-50/40 dark:from-[#0E201E] dark:to-[#132826] border border-teal-200 dark:border-teal-800/60 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Valid Student Invitation
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0F5B54] text-white flex items-center justify-center font-bold text-lg">
                  {verifiedData.student.firstName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    {verifiedData.student.firstName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                    {verifiedData.student.gradeLevel && (
                      <span className="inline-flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        {verifiedData.student.gradeLevel}
                      </span>
                    )}
                    {verifiedData.student.schoolName && (
                      <span className="inline-flex items-center gap-1">
                        <School className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        {verifiedData.student.schoolName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Student Registered Email Verification Input */}
              <div className="space-y-1.5 pt-2 border-t border-teal-100 dark:border-teal-900/40">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Student's Registered Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => {
                    setStudentEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="student@example.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#0E201E] border border-gray-300 dark:border-[#1E3B38] text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F5B54] focus:outline-none transition-all placeholder:text-gray-400"
                />
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Enter the email your student used to register on 3G MeLife for verification.
                </p>
              </div>

              {/* Relationship Selector */}
              <div className="space-y-2 pt-2 border-t border-teal-100 dark:border-teal-900/40">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Select Your Relationship
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["FATHER", "MOTHER", "GUARDIAN", "OTHER"].map((rel) => (
                    <button
                      key={rel}
                      type="button"
                      onClick={() => setRelationshipType(rel)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                        relationshipType === rel
                          ? "bg-[#0F5B54] text-white shadow-md shadow-[#0F5B54]/20"
                          : "bg-white dark:bg-[#0E201E] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#1E3B38] hover:border-teal-400"
                      }`}
                    >
                      {rel === "GUARDIAN" ? "Guardian" : rel.charAt(0) + rel.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Redemption Action */}
              <div className="pt-2">
                {isParentLoggedIn ? (
                  <button
                    onClick={handleRedeem}
                    disabled={redeemMutation.isPending}
                    className="w-full py-3.5 rounded-2xl text-sm font-bold bg-[#0F5B54] hover:bg-[#0A413C] text-white shadow-lg shadow-[#0F5B54]/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {redeemMutation.isPending ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Verifying & Connecting...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Verify Email & Connect with {verifiedData.student.firstName}
                      </>
                    )}
                  </button>
                ) : user ? (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 space-y-2">
                    <p className="font-semibold">
                      You are currently logged in as a {userRole}.
                    </p>
                    <p>
                      To link as a parent or guardian, please log in with a Parent account.
                    </p>
                    <Link
                      href={`/login?redirect=/parent/connect?code=${verifiedData.inviteCode}`}
                      className="inline-flex items-center gap-1 font-bold text-teal-700 dark:text-teal-400 underline"
                    >
                      Switch to Parent Account <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                      Sign in or create a Parent account to complete the connection:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        href={`/register?role=PARENT_GUARDIAN&redirect=/parent/connect?code=${verifiedData.inviteCode}`}
                        className="py-3 px-4 rounded-2xl text-xs font-bold text-center bg-[#0F5B54] hover:bg-[#0A413C] text-white shadow-md shadow-[#0F5B54]/20 transition-all active:scale-95"
                      >
                        Create Parent Account
                      </Link>
                      <Link
                        href={`/login?redirect=/parent/connect?code=${verifiedData.inviteCode}`}
                        className="py-3 px-4 rounded-2xl text-xs font-bold text-center bg-white dark:bg-[#0E201E] border border-gray-200 dark:border-[#1E3B38] text-gray-800 dark:text-gray-200 hover:border-teal-400 transition-all active:scale-95"
                      >
                        Log In
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

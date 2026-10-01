"use client";

import React, { useState } from "react";
import {
  X,
  KeyRound,
  ShieldCheck,
  GraduationCap,
  School,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  useVerifyInvitationMutation,
  useRedeemInvitationMutation,
} from "../hooks/useParentConnectMutations";
import type { InvitationSafeVerification } from "../types/parent-connect.types";

interface ConnectAnotherChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ConnectAnotherChildModal({
  isOpen,
  onClose,
  onSuccess,
}: ConnectAnotherChildModalProps) {
  const [inviteCode, setInviteCode] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [relationshipType, setRelationshipType] = useState("PARENT");
  const [verifiedData, setVerifiedData] = useState<InvitationSafeVerification | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const verifyMutation = useVerifyInvitationMutation();
  const redeemMutation = useRedeemInvitationMutation();

  if (!isOpen) return null;

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

  const handleVerify = async () => {
    if (!inviteCode.trim()) {
      setErrorMessage("Please enter an invitation code.");
      return;
    }
    setErrorMessage(null);
    try {
      const res = await verifyMutation.mutateAsync(inviteCode.trim());
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
      setErrorMessage("Please enter the student's registered email address.");
      return;
    }
    setErrorMessage(null);
    try {
      await redeemMutation.mutateAsync({
        inviteCode: verifiedData.inviteCode,
        studentEmail: studentEmail.trim(),
        relationshipType,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to link account.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#132826] border border-[#E5ECEB] dark:border-[#1E3B38] p-6 sm:p-8 shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-teal-950/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/60 flex items-center justify-center text-teal-700 dark:text-teal-300">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Connect Another Student
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enter the student's 12-character invitation code and registered email
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-rose-800 dark:text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Invitation Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inviteCode}
              onChange={handleCodeChange}
              placeholder="MLP-XXXX-XXXX"
              maxLength={13}
              className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#0E201E] border border-gray-300 dark:border-[#1E3B38] font-mono text-base font-bold text-center tracking-widest text-[#0F5B54] dark:text-teal-300 uppercase focus:ring-2 focus:ring-[#0F5B54] focus:outline-none"
            />
            <button
              onClick={handleVerify}
              disabled={verifyMutation.isPending || !inviteCode.trim()}
              className="px-4 py-3 rounded-xl text-xs font-bold bg-[#0F5B54] hover:bg-[#0A413C] text-white transition-all disabled:opacity-50 flex items-center gap-1 shrink-0"
            >
              {verifyMutation.isPending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                "Verify"
              )}
            </button>
          </div>
        </div>

        {verifiedData && (
          <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-[#0E201E] border border-teal-200 dark:border-teal-800/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0F5B54] text-white flex items-center justify-center font-bold">
                {verifiedData.student.firstName.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  {verifiedData.student.firstName}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                  {verifiedData.student.gradeLevel && <span>{verifiedData.student.gradeLevel}</span>}
                  {verifiedData.student.schoolName && <span>• {verifiedData.student.schoolName}</span>}
                </div>
              </div>
            </div>

            {/* Student Registered Email Input */}
            <div className="space-y-1.5 pt-2 border-t border-teal-100 dark:border-teal-900/40">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                Student's Registered Email <span className="text-rose-500">*</span>
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#132826] border border-gray-300 dark:border-[#1E3B38] text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F5B54] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 pt-2 border-t border-teal-100 dark:border-teal-900/40">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                Relationship
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {["FATHER", "MOTHER", "GUARDIAN", "OTHER"].map((rel) => (
                  <button
                    key={rel}
                    type="button"
                    onClick={() => setRelationshipType(rel)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold ${
                      relationshipType === rel
                        ? "bg-[#0F5B54] text-white"
                        : "bg-white dark:bg-[#132826] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#1E3B38]"
                    }`}
                  >
                    {rel === "GUARDIAN" ? "Guardian" : rel.charAt(0) + rel.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleRedeem}
              disabled={redeemMutation.isPending}
              className="w-full py-3 rounded-xl text-xs font-bold bg-[#0F5B54] hover:bg-[#0A413C] text-white shadow-md shadow-[#0F5B54]/20 transition-all flex items-center justify-center gap-2"
            >
              {redeemMutation.isPending ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verify Email & Link Student
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

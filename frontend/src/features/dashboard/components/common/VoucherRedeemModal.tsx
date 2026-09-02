"use client";

import React, { useState } from "react";
import { KeyRound, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface VoucherRedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoucherRedeemModal({ isOpen, onClose }: VoucherRedeemModalProps) {
  const [code, setCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setErrorMessage("Please enter an assessment access code.");
      return;
    }

    setIsRedeeming(true);

    // Simulate validation
    setTimeout(() => {
      setIsRedeeming(false);
      if (trimmed.startsWith("MELIFE-") || trimmed.length >= 6) {
        setSuccessMessage(`Assessment voucher "${trimmed}" verified and unlocked successfully!`);
        setCode("");
      } else {
        setErrorMessage("Invalid or expired assessment code. Please check with your institution.");
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-white/15 p-6 shadow-2xl text-slate-900 dark:text-white animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#14B8A6] flex items-center justify-center text-white shadow-md">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Redeem Assessment Code</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Unlock sponsored school or counsellor psychometrics.
            </p>
          </div>
        </div>

        {/* Feedback Alerts */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-500/40 text-red-800 dark:text-red-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Voucher / Access Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. MELIFE-SCH-2026"
              className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB] uppercase"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isRedeeming}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white text-xs font-bold transition-all shadow-md shadow-[#2563EB]/25 cursor-pointer disabled:opacity-60 flex items-center gap-2"
            >
              {isRedeeming ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Unlock Assessment</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

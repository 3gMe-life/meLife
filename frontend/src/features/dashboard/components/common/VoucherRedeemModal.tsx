import React, { useState } from "react";
import { KeyRound, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/toast";

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
      const msg = "Please enter an assessment access code.";
      setErrorMessage(msg);
      toast.warning("Access Code Required", { description: msg });
      return;
    }

    setIsRedeeming(true);

    // Simulate validation
    setTimeout(() => {
      setIsRedeeming(false);
      if (trimmed.startsWith("MELIFE-") || trimmed.length >= 6) {
        const msg = `Assessment voucher "${trimmed}" verified and unlocked successfully!`;
        setSuccessMessage(msg);
        toast.success("Voucher Unlocked!", {
          description: `Assessment module "${trimmed}" has been credited to your student dashboard.`,
        });
        setCode("");
      } else {
        const msg = "Invalid or expired assessment code. Please check with your institution.";
        setErrorMessage(msg);
        toast.error("Voucher Verification Failed", {
          description: msg,
        });
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172B2A]/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] p-6 shadow-2xl text-[#172B2A] dark:text-[#F7FAF9] animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#728B88] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] hover:bg-[#EBF2F0] dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00B8D4] via-[#00BFA5] to-[#00C896] flex items-center justify-center text-[#172B2A] shadow-md">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9]">Redeem Assessment Code</h3>
            <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
              Unlock sponsored school or counsellor psychometrics.
            </p>
          </div>
        </div>

        {/* Feedback Alerts */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-[#00C896]/40 text-[#008F83] dark:text-emerald-300 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00C896] shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-500/40 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
              Voucher / Access Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. MELIFE-SCH-2026"
              className="w-full px-4 py-3 rounded-xl bg-[#EBF2F0] dark:bg-[#0D1C1B] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] text-[#172B2A] dark:text-[#F7FAF9] placeholder-[#728B88] text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#00BFA5]/40 focus:border-[#00BFA5] uppercase"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-white hover:bg-[#EBF2F0] dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isRedeeming}
              className="px-5 py-2.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all shadow-md shadow-[#00BFA5]/25 cursor-pointer disabled:opacity-60 flex items-center gap-2"
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

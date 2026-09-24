"use client";

import React, { useEffect } from "react";
import {
  X,
  Ban,
  RotateCcw,
  Trash2,
  Loader2,
  ShieldAlert,
} from "lucide-react";

export type CounsellorConfirmActionType = "SUSPEND" | "REACTIVATE" | "DELETE";

interface AdminCounsellorConfirmDialogProps {
  isOpen: boolean;
  actionType: CounsellorConfirmActionType;
  counsellorName: string;
  counsellorEmail?: string;
  isApproved?: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const AdminCounsellorConfirmDialog: React.FC<AdminCounsellorConfirmDialogProps> = ({
  isOpen,
  actionType,
  counsellorName,
  counsellorEmail,
  isApproved = false,
  isLoading,
  onConfirm,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const getDialogConfig = () => {
    switch (actionType) {
      case "SUSPEND":
        return {
          title: "Suspend Counsellor Account",
          description: `Are you sure you want to suspend access for ${counsellorName}?`,
          details:
            "The counsellor will be immediately logged out, active sessions will be revoked, and their profile will no longer accept new bookings.",
          confirmText: "Suspend Account",
          confirmColor: "bg-amber-600 hover:bg-amber-700 text-white",
          icon: Ban,
          iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
        };
      case "REACTIVATE":
        return {
          title: "Reactivate Counsellor Account",
          description: `Reactivate access privileges for ${counsellorName}?`,
          details:
            "The account status will be restored to ACTIVE. The counsellor will regain dashboard and booking access.",
          confirmText: "Reactivate Account",
          confirmColor: "bg-emerald-600 hover:bg-emerald-700 text-white",
          icon: RotateCcw,
          iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        };
      case "DELETE":
      default:
        return {
          title: isApproved ? "Deactivate / Delete Counsellor" : "Delete Application",
          description: `Permanently remove or deactivate records for ${counsellorName}?`,
          details: isApproved
            ? "If this counsellor has historical counselling sessions, notes, or student consents, the system will safely SOFT-DEACTIVATE the account to protect audit and student integrity. If zero historical records exist, it will be permanently deleted."
            : "This pending or rejected application record will be permanently deleted from the database.",
          confirmText: isApproved ? "Proceed with Deactivation" : "Permanently Delete",
          confirmColor: "bg-rose-600 hover:bg-rose-700 text-white",
          icon: isApproved ? ShieldAlert : Trash2,
          iconBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
        };
    }
  };

  const config = getDialogConfig();
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#172B2A]/60 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (!isLoading) onClose();
        }}
      />

      {/* Dialog Box */}
      <div className="relative max-h-[90vh] w-full max-w-md overflow-hidden rounded-3xl border border-[#E3ECEA] bg-white p-6 shadow-2xl transition-all dark:border-white/10 dark:bg-[#112423] md:p-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-4">
          <div className={`p-3 rounded-2xl border ${config.iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="p-2 rounded-xl text-[#728B88] dark:text-[#7D9491] hover:bg-[#F4F8F7] dark:hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-black text-[#172B2A] dark:text-[#F7FAF9]">
            {config.title}
          </h3>
          <p className="text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
            {config.description}
          </p>
          {counsellorEmail && (
            <p className="text-xs font-mono text-[#728B88] dark:text-[#7D9491]">
              {counsellorEmail}
            </p>
          )}

          <div className="p-3.5 mt-3 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
            {config.details}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-[#E3ECEA] dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:bg-[#F4F8F7] dark:hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2 rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 ${config.confirmColor}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{config.confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

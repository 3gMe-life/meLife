"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  UserCheck,
  Mail,
  Shield,
  Save,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useUpdateUserProfile } from "../hooks/useAdminQueries";
import type { AdminUserListItemDTO } from "../types/admin.types";

interface AdminUserEditProfileModalProps {
  user: AdminUserListItemDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

export const AdminUserEditProfileModal: React.FC<AdminUserEditProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSuccess,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <div
        className="fixed inset-0 bg-[#172B2A]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[#E3ECEA] bg-white p-6 shadow-2xl transition-all dark:border-white/10 dark:bg-[#112423] md:p-7">
        <EditProfileContent
          key={user.id}
          user={user}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
};

interface EditProfileContentProps {
  user: AdminUserListItemDTO;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

const EditProfileContent: React.FC<EditProfileContentProps> = ({
  user,
  onClose,
  onSuccess,
}) => {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const updateProfileMutation = useUpdateUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!firstName.trim()) {
      setErrorMsg("First name cannot be blank.");
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        userId: user.id,
        dto: {
          firstName: firstName.trim(),
          lastName: lastName.trim() || undefined,
        },
      });

      if (onSuccess) {
        onSuccess(`Profile for ${firstName.trim()} updated successfully.`);
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile.";
      setErrorMsg(msg);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/15 text-[#008F83] dark:text-teal-300 flex items-center justify-center border border-teal-500/30">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9]">
              Edit User Profile
            </h2>
            <p className="text-xs text-[#728B88] dark:text-[#7D9491]">
              Update identity record and names
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-xl border border-[#E3ECEA] dark:border-white/10 text-[#728B88] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Account Info summary banner */}
      <div className="p-3 rounded-2xl bg-[#F4F8F7]/70 dark:bg-white/5 border border-[#E3ECEA]/60 dark:border-white/5 flex flex-col gap-1.5 text-xs">
        <div className="flex items-center gap-2 text-[#526866] dark:text-[#9FB3B0]">
          <Mail className="w-3.5 h-3.5 text-[#00BFA5]" />
          <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">Email:</span>
          <span>{user.email}</span>
        </div>
        <div className="flex items-center gap-2 text-[#526866] dark:text-[#9FB3B0]">
          <Shield className="w-3.5 h-3.5 text-[#00BFA5]" />
          <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">Current Role:</span>
          <span className="font-bold text-[#008F83] dark:text-[#00BFA5]">{user.role}</span>
        </div>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
            First Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F4F8F7] dark:bg-[#0B1716] border border-[#E3ECEA] dark:border-white/10 text-xs text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:border-[#00BFA5] transition-colors"
            placeholder="e.g. Alexander"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F4F8F7] dark:bg-[#0B1716] border border-[#E3ECEA] dark:border-white/10 text-xs text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:border-[#00BFA5] transition-colors"
            placeholder="e.g. Vance"
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex items-center justify-end gap-3 pt-4 border-t border-[#E3ECEA]/60 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={updateProfileMutation.isPending}
            className="px-4 py-2 rounded-xl border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] text-xs font-bold transition-all shadow-md shadow-[#00BFA5]/20 cursor-pointer disabled:opacity-50"
          >
            {updateProfileMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

"use client";

import React, { useState } from "react";
import { X, UserPlus, AlertCircle, CheckCircle2, School, Mail, Hash, Calendar, Loader2 } from "lucide-react";
import { useInviteStudent, useInstitutionClasses } from "../../hooks/useInstitutionQueries";

interface InviteStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultClassId?: string;
}

export const InviteStudentModal: React.FC<InviteStudentModalProps> = ({
  isOpen,
  onClose,
  defaultClassId,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [classId, setClassId] = useState(defaultClassId || "");
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: classes = [] } = useInstitutionClasses();
  const inviteMutation = useInviteStudent();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setErrorMessage("Please provide the student's first name, last name, and email address.");
      return;
    }

    try {
      await inviteMutation.mutateAsync({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        rollNumber: rollNumber.trim() || null,
        classId: classId || null,
        academicYear: academicYear.trim(),
      });

      setSuccessMessage(`Invitation email sent successfully to ${email.trim()}!`);
      setTimeout(() => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setRollNumber("");
        setErrorMessage(null);
        setSuccessMessage(null);
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Failed to send student invitation. Please check the email and try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#122423] rounded-3xl shadow-2xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)] bg-gradient-to-r from-[#00BFA5]/10 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                Invite Individual Student
              </h2>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
                Send a secure institutional onboarding link via email
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#728B88] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 text-xs font-medium text-rose-700 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2 p-3 text-xs font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
                First Name *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Rahul"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] bg-[#F7FAF9] dark:bg-[#172B2A] text-sm text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
                Last Name *
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Kumar"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] bg-[#F7FAF9] dark:bg-[#172B2A] text-sm text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
              Student Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#728B88]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] bg-[#F7FAF9] dark:bg-[#172B2A] text-sm text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
                required
              />
            </div>
            <p className="mt-1 text-[11px] text-[#728B88]">
              The secure single-use invitation link will be dispatched to this email address.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
                Cohort / Class
              </label>
              <div className="relative">
                <School className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#728B88]" />
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] bg-[#F7FAF9] dark:bg-[#172B2A] text-sm text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
                >
                  <option value="">Select Cohort (Optional)</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
                Roll Number / ID
              </label>
              <div className="relative">
                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#728B88]" />
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="e.g. ST-104"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] bg-[#F7FAF9] dark:bg-[#172B2A] text-sm text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
              Academic Year
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#728B88]" />
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] bg-[#F7FAF9] dark:bg-[#172B2A] text-sm text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
              >
                <option value="2026-2027">2026-2027</option>
                <option value="2025-2026">2025-2026</option>
                <option value="2027-2028">2027-2028</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={inviteMutation.isPending || !!successMessage}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-[#172B2A] bg-gradient-to-r from-[#00B8D4] via-[#00BFA5] to-[#00C896] hover:opacity-95 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer"
            >
              {inviteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Invitation...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Send Student Invitation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

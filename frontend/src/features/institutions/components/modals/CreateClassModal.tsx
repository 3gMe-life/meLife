"use client";

import React, { useState } from "react";
import { X, School, Check, AlertCircle } from "lucide-react";
import { useCreateInstitutionClass } from "../../hooks/useInstitutionQueries";

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateClassModal: React.FC<CreateClassModalProps> = ({ isOpen, onClose }) => {
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [gradeLevel, setGradeLevel] = useState("Grade 10");
  const [division, setDivision] = useState("Section A");
  const [name, setName] = useState("");
  const [coordinatorName, setCoordinatorName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createClassMutation = useCreateInstitutionClass();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!academicYear.trim() || !gradeLevel.trim() || !division.trim()) {
      setErrorMessage("Please complete Academic Year, Grade Level, and Division.");
      return;
    }

    const calculatedName =
      name.trim() || `${gradeLevel} - ${division} (${academicYear})`;

    try {
      await createClassMutation.mutateAsync({
        academicYear: academicYear.trim(),
        gradeLevel: gradeLevel.trim(),
        division: division.trim(),
        name: calculatedName,
        coordinatorName: coordinatorName.trim() || undefined,
      });

      // Reset form
      setName("");
      setCoordinatorName("");
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to create class cohort. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#122423] rounded-3xl shadow-2xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)] bg-gradient-to-r from-[#00BFA5]/10 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30 flex items-center justify-center">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                Create New Class / Cohort
              </h2>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
                Add a new student cohort for psychometric tracking & assessments
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
                Academic Year *
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] bg-[#F7FAF9] dark:bg-[#172B2A] text-sm text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
                required
              >
                <option value="2026-2027">2026-2027</option>
                <option value="2027-2028">2027-2028</option>
                <option value="2025-2026">2025-2026</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
                Grade / Class Level *
              </label>
              <input
                type="text"
                placeholder="e.g. Grade 10, Grade 12"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] bg-[#F7FAF9] dark:bg-[#172B2A] text-sm text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
                Section / Division *
              </label>
              <input
                type="text"
                placeholder="e.g. Section A, Science, Commerce"
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] bg-[#F7FAF9] dark:bg-[#172B2A] text-sm text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
                Class Coordinator / Teacher
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Verma, Mrs. Sharma"
                value={coordinatorName}
                onChange={(e) => setCoordinatorName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] bg-[#F7FAF9] dark:bg-[#172B2A] text-sm text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
              Cohort Display Name (Optional)
            </label>
            <input
              type="text"
              placeholder={`e.g. ${gradeLevel} - ${division} (${academicYear})`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] bg-[#F7FAF9] dark:bg-[#172B2A] text-sm text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
            />
            <p className="mt-1 text-[11px] text-[#728B88]">
              Leave blank to automatically generate standard cohort naming.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createClassMutation.isPending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00BFA5] to-[#00C896] hover:from-[#00A892] hover:to-[#00B285] text-[#0A1A18] font-bold text-sm shadow-md transition-all disabled:opacity-50"
            >
              {createClassMutation.isPending ? (
                <span>Creating...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Create Cohort</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

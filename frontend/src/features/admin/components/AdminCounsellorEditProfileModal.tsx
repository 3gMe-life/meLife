/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  UserCheck,
  Building,
  GraduationCap,
  FileText,
  Clock,
  Sparkles,
  Languages,
  Compass,
  Save,
  Loader2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { useAdminCounsellorAccess, useUpdateCounsellorProfile } from "../hooks/useAdminQueries";
import type { CounsellorApplicationItemDTO } from "../types/admin.types";

interface AdminCounsellorEditProfileModalProps {
  application: CounsellorApplicationItemDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

export const AdminCounsellorEditProfileModal: React.FC<AdminCounsellorEditProfileModalProps> = ({
  application,
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

  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <div
        className="fixed inset-0 bg-[#172B2A]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-[#E3ECEA] bg-white p-6 shadow-2xl transition-all dark:border-white/10 dark:bg-[#112423] md:p-8">
        <EditProfileModalContent
          key={application.id}
          application={application}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
};

interface EditProfileModalContentProps {
  application: CounsellorApplicationItemDTO;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

function EditProfileModalContent({
  application,
  onClose,
  onSuccess,
}: EditProfileModalContentProps) {
  const { data: accessData, isLoading } = useAdminCounsellorAccess(
    application.id || application.userId
  );
  const updateProfileMutation = useUpdateCounsellorProfile();

  const nameParts = (application.applicantName || "").split(" ");
  const [firstName, setFirstName] = useState(nameParts[0] || "");
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" ") || "");
  const [qualification, setQualification] = useState(application.qualification || "");
  const [organization, setOrganization] = useState(application.organization || "");
  const [bio, setBio] = useState("");
  const [experienceYears, setExperienceYears] = useState<number>(5);
  const [specialisations, setSpecialisations] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>(["English"]);
  const [guidanceAreas, setGuidanceAreas] = useState<string[]>([]);

  // Input states for chip additions
  const [newSpec, setNewSpec] = useState("");
  const [newLang, setNewLang] = useState("");
  const [newArea, setNewArea] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (accessData) {
      setFirstName(accessData.user.firstName || "");
      setLastName(accessData.user.lastName || "");
      if (accessData.counsellor) {
        setQualification(accessData.counsellor.qualification || "");
        setBio(accessData.counsellor.bio || "");
        setExperienceYears(accessData.counsellor.experienceYears || 0);
        setSpecialisations(accessData.counsellor.specialisations || []);
        setLanguages(accessData.counsellor.languages || ["English"]);
        setGuidanceAreas(accessData.counsellor.guidanceAreas || []);
      } else if (accessData.application) {
        setQualification(accessData.application.qualification || "");
        setOrganization(accessData.application.organization || "");
      }
    }
  }, [accessData]);

  const addChip = (
    type: "spec" | "lang" | "area",
    val: string,
    setVal: (v: string) => void,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const trimmed = val.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
      setVal("");
    }
  };

  const removeChip = (
    item: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList(list.filter((x) => x !== item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      await updateProfileMutation.mutateAsync({
        counsellorId: application.id || application.userId,
        dto: {
          firstName,
          lastName,
          qualification,
          organization,
          bio,
          experienceYears: Number(experienceYears) || 0,
          specialisations,
          languages,
          guidanceAreas,
        },
      });

      if (onSuccess) {
        onSuccess("Practitioner profile updated successfully.");
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile.";
      setErrorMessage(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <Loader2 className="w-8 h-8 text-[#00BFA5] animate-spin" />
        <p className="text-sm font-semibold text-[#526866] dark:text-[#9FB3B0]">
          Loading counsellor profile...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E3ECEA] dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#00BFA5]/15 border border-[#00BFA5]/30 text-[#00BFA5]">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#172B2A] dark:text-[#F7FAF9]">
              Edit Counsellor Profile
            </h2>
            <p className="text-xs text-[#728B88] dark:text-[#7D9491]">
              Manage professional credentials, guidance areas, and practitioner bio.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl text-[#728B88] dark:text-[#7D9491] hover:bg-[#F4F8F7] dark:hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
            First Name
          </label>
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs font-medium text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:border-[#00BFA5]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
            Last Name
          </label>
          <input
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs font-medium text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:border-[#00BFA5]"
          />
        </div>
      </div>

      {/* Qualification & Organization */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-[#00BFA5]" />
            <span>Highest Qualification / Certifications</span>
          </label>
          <input
            type="text"
            required
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            placeholder="e.g. M.Sc Counselling Psychology, Global Career Counsellor"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs font-medium text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:border-[#00BFA5]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#00BFA5]" />
            <span>Experience (Years)</span>
          </label>
          <input
            type="number"
            min={0}
            max={50}
            value={experienceYears}
            onChange={(e) => setExperienceYears(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs font-medium text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:border-[#00BFA5]"
          />
        </div>
      </div>

      {/* Organization */}
      <div>
        <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5 flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5 text-[#00BFA5]" />
          <span>Affiliated Organization / Institution</span>
        </label>
        <input
          type="text"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          placeholder="e.g. Apex International Institute / Independent Practitioner"
          className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs font-medium text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:border-[#00BFA5]"
        />
      </div>

      {/* Practitioner Bio */}
      <div>
        <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#00BFA5]" />
          <span>Professional Biography & Therapeutic Approach</span>
        </label>
        <textarea
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Describe counselling background, methodologies, and coaching philosophy..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs font-medium text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:border-[#00BFA5] resize-none"
        />
      </div>

      {/* Specialisations Chips */}
      <div>
        <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#00BFA5]" />
          <span>Specialisations & Expertise</span>
        </label>
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          {specialisations.map((spec) => (
            <span
              key={spec}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#00BFA5]/15 text-[#00897B] dark:text-[#00BFA5] border border-[#00BFA5]/30"
            >
              <span>{spec}</span>
              <button
                type="button"
                onClick={() => removeChip(spec, specialisations, setSpecialisations)}
                className="hover:text-rose-500 cursor-pointer"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSpec}
            onChange={(e) => setNewSpec(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addChip("spec", newSpec, setNewSpec, specialisations, setSpecialisations);
              }
            }}
            placeholder="Add specialisation (press Enter)..."
            className="flex-1 px-3 py-1.5 rounded-xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:border-[#00BFA5]"
          />
          <button
            type="button"
            onClick={() => addChip("spec", newSpec, setNewSpec, specialisations, setSpecialisations)}
            className="px-3 py-1.5 rounded-xl bg-[#F4F8F7] dark:bg-white/10 border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] hover:bg-[#00BFA5]/20 cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Languages & Guidance Areas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Languages */}
        <div>
          <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5 flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-[#00BFA5]" />
            <span>Languages Spoken</span>
          </label>
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {languages.map((lang) => (
              <span
                key={lang}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#F4F8F7] dark:bg-white/10 text-[#172B2A] dark:text-[#F7FAF9] border border-[#E3ECEA] dark:border-white/10"
              >
                <span>{lang}</span>
                <button
                  type="button"
                  onClick={() => removeChip(lang, languages, setLanguages)}
                  className="hover:text-rose-500 cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newLang}
              onChange={(e) => setNewLang(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addChip("lang", newLang, setNewLang, languages, setLanguages);
                }
              }}
              placeholder="Add language..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:border-[#00BFA5]"
            />
            <button
              type="button"
              onClick={() => addChip("lang", newLang, setNewLang, languages, setLanguages)}
              className="px-3 py-1.5 rounded-xl bg-[#F4F8F7] dark:bg-white/10 border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] hover:bg-[#00BFA5]/20 cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Guidance Areas */}
        <div>
          <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#00BFA5]" />
            <span>Target Guidance Cohorts</span>
          </label>
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {guidanceAreas.map((area) => (
              <span
                key={area}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#F4F8F7] dark:bg-white/10 text-[#172B2A] dark:text-[#F7FAF9] border border-[#E3ECEA] dark:border-white/10"
              >
                <span>{area}</span>
                <button
                  type="button"
                  onClick={() => removeChip(area, guidanceAreas, setGuidanceAreas)}
                  className="hover:text-rose-500 cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addChip("area", newArea, setNewArea, guidanceAreas, setGuidanceAreas);
                }
              }}
              placeholder="Add guidance area..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:border-[#00BFA5]"
            />
            <button
              type="button"
              onClick={() => addChip("area", newArea, setNewArea, guidanceAreas, setGuidanceAreas)}
              className="px-3 py-1.5 rounded-xl bg-[#F4F8F7] dark:bg-white/10 border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] hover:bg-[#00BFA5]/20 cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E3ECEA] dark:border-white/10">
        <button
          type="button"
          onClick={onClose}
          disabled={updateProfileMutation.isPending}
          className="px-4 py-2 rounded-xl border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:bg-[#F4F8F7] dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={updateProfileMutation.isPending}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00B8D4] to-[#00BFA5] text-[#172B2A] text-xs font-black shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
        >
          {updateProfileMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Profile...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Profile</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

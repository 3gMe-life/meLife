"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Save,
  Award,
  AlertCircle,
  Globe,
  Briefcase,
} from "lucide-react";
import {
  useCounsellorOverview,
  useCounsellorAvailability,
  useUpdateCounsellorProfile,
  useUpdateCounsellorAvailability,
} from "../hooks/useCounsellorQueries";
import { CounsellorAvailability } from "../types/counsellor.types";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DEFAULT_INITIAL_SLOTS: CounsellorAvailability[] = [
  { day: "Monday", startTime: "09:00", endTime: "17:00", isActive: true },
  { day: "Tuesday", startTime: "09:00", endTime: "17:00", isActive: true },
  { day: "Wednesday", startTime: "09:00", endTime: "17:00", isActive: true },
  { day: "Thursday", startTime: "09:00", endTime: "17:00", isActive: true },
  { day: "Friday", startTime: "09:00", endTime: "16:00", isActive: true },
];

export const CounsellorProfileSettingsView: React.FC = () => {
  const { data: overview } = useCounsellorOverview();
  const { data: rawAvailability } = useCounsellorAvailability();

  const updateProfileMutation = useUpdateCounsellorProfile();
  const updateAvailabilityMutation = useUpdateCounsellorAvailability();

  // Profile Form State
  const [bio, setBio] = useState("");
  const [qualification, setQualification] = useState("");
  const [experienceYears, setExperienceYears] = useState(5);
  const [specialisationsText, setSpecialisationsText] = useState("");
  const [languagesText, setLanguagesText] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Availability Slots State
  const [slots, setSlots] = useState<CounsellorAvailability[]>(DEFAULT_INITIAL_SLOTS);
  const [availSuccess, setAvailSuccess] = useState(false);

  // Sync profile data
  useEffect(() => {
    if (overview?.counsellorProfile) {
      const p = overview.counsellorProfile;
      setBio(p.bio || "");
      setQualification(p.qualification || "");
      setExperienceYears(p.experienceYears || 5);
      setSpecialisationsText((p.specialisations || []).join(", "));
      setLanguagesText((p.languages || []).join(", "));
    }
  }, [overview?.counsellorProfile]);

  // Sync availability data
  useEffect(() => {
    if (rawAvailability && Array.isArray(rawAvailability) && rawAvailability.length > 0) {
      setSlots(rawAvailability);
    } else if (
      overview?.counsellorProfile?.availability &&
      Array.isArray(overview.counsellorProfile.availability) &&
      overview.counsellorProfile.availability.length > 0
    ) {
      setSlots(overview.counsellorProfile.availability);
    }
  }, [rawAvailability, overview?.counsellorProfile?.availability]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);

    const specialisations = specialisationsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const languages = languagesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    await updateProfileMutation.mutateAsync({
      bio,
      qualification,
      experienceYears: Number(experienceYears),
      specialisations,
      languages,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const handleAddSlot = () => {
    setSlots((prev) => [
      ...prev,
      { day: "Monday", startTime: "09:00", endTime: "12:00", isActive: true },
    ]);
  };

  const handleRemoveSlot = (index: number) => {
    setSlots((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSlotChange = (
    index: number,
    field: keyof CounsellorAvailability,
    value: string | boolean
  ) => {
    setSlots((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSaveAvailability = async () => {
    setAvailSuccess(false);
    await updateAvailabilityMutation.mutateAsync(slots);
    setAvailSuccess(true);
    setTimeout(() => setAvailSuccess(false), 4000);
  };

  const profile = overview?.counsellorProfile;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Bar */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-500" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Counsellor Profile & Practice Availability
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Manage your credentials, specialisations, languages, and recurring consultation schedule.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Personal Card & Verification Status */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 text-2xl font-black text-white shadow-lg shadow-indigo-600/30">
              {profile?.name ? profile.name.charAt(0) : "C"}
            </div>

            <h2 className="mt-4 text-base font-extrabold text-slate-900 dark:text-white">
              {profile?.name || "Career Counsellor"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{profile?.email}</p>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Verified Certified Psychologist</span>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4 text-left text-xs space-y-2 dark:border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-500">Hourly Rate:</span>
                <span className="font-bold text-slate-900 dark:text-white">Free / Covered</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Experience:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {experienceYears}+ Years
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rating:</span>
                <span className="font-bold text-amber-500">
                  ★ {Number(profile?.rating || 4.9).toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-indigo-100 bg-indigo-50/40 p-5 dark:border-indigo-950 dark:bg-indigo-950/20 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2 font-bold text-indigo-700 dark:text-indigo-300">
              <Award className="h-4 w-4" />
              <span>Admin Verification</span>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed">
              Your credentials and psychological advisory license are verified by MeLife Platform Administration. To update your legal name or license number, contact administration support.
            </p>
          </div>
        </div>

        {/* Right Column: Profile Edit & Availability Schedules */}
        <div className="space-y-8 lg:col-span-2">
          {/* Section 1: Professional Information Form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 md:p-8">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Professional Credentials & Bio
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              This information is displayed to students and used by the AI matching engine.
            </p>

            {saveSuccess && (
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                <span>Profile details saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="mt-6 space-y-4 text-xs">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    Qualification / Degree
                  </label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="e.g. M.Sc. Applied Psychology"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    min={1}
                    max={50}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Specialisations (comma separated)
                </label>
                <input
                  type="text"
                  value={specialisationsText}
                  onChange={(e) => setSpecialisationsText(e.target.value)}
                  placeholder="e.g. STEM Careers, AI Pathways, Higher Education, Psychology"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Languages (comma separated)
                </label>
                <input
                  type="text"
                  value={languagesText}
                  onChange={(e) => setLanguagesText(e.target.value)}
                  placeholder="e.g. English, Hindi, Spanish"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Professional Biography
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a brief overview of your background, counselling approach, and areas of expertise..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-500 disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{updateProfileMutation.isPending ? "Saving..." : "Save Profile Details"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Weekly Availability Schedule */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 md:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Weekly Consultation Availability
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Define recurring day and time windows for student appointments.
                </p>
              </div>

              <button
                onClick={handleAddSlot}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-400"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Time Slot</span>
              </button>
            </div>

            {availSuccess && (
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                <span>Availability schedule updated successfully!</span>
              </div>
            )}

            {/* Slots List */}
            <div className="mt-6 space-y-3">
              {slots.map((slot, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-850 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={slot.day}
                      onChange={(e) => handleSlotChange(index, "day", e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      {DAYS_OF_WEEK.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-1.5 text-xs">
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => handleSlotChange(index, "startTime", e.target.value)}
                        className="rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                      <span className="text-slate-400">to</span>
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => handleSlotChange(index, "endTime", e.target.value)}
                        className="rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSlotChange(index, "isActive", !slot.isActive)}
                      className={`rounded-xl px-2.5 py-1 text-[11px] font-bold ${
                        slot.isActive !== false
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {slot.isActive !== false ? "Active" : "Disabled"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveSlot(index)}
                      className="rounded-xl p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSaveAvailability}
                disabled={updateAvailabilityMutation.isPending}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-500 disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" />
                <span>
                  {updateAvailabilityMutation.isPending
                    ? "Updating Schedule..."
                    : "Save Availability Schedule"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

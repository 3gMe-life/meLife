"use client";

import React, { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  ShieldCheck,
  Sparkles,
  Check,
  AlertCircle,
  Video,
  FileText,
} from "lucide-react";
import {
  CounsellorCardDTO,
  CounsellorDetailDTO,
  SessionType,
} from "../types/counsellor.types";
import {
  useRequestBooking,
  useCounsellorDateAvailability,
} from "../hooks/useCounsellorQueries";

interface CounsellorBookingModalProps {
  counsellor: CounsellorCardDTO | CounsellorDetailDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const SESSION_TYPES: Array<{
  type: SessionType;
  title: string;
  duration: string;
  badge?: string;
  description: string;
  recommendedFor: string;
}> = [
  {
    type: "CAREER_GUIDANCE",
    title: "Career Pathway Guidance",
    duration: "45 mins",
    badge: "Most Popular",
    description:
      "Targeted session exploring recommended careers, stream selection, and college roadmaps aligned to your psychometric profile.",
    recommendedFor: "High school students exploring stream or degree options",
  },
  {
    type: "DETAILED_PROFILE",
    title: "Comprehensive Psychometric Review",
    duration: "60 mins",
    description:
      "In-depth analysis of your cognitive aptitudes, RIASEC interest patterns, behavioural traits, and personalized career strategy.",
    recommendedFor: "Students wanting deep multidimensional exploration",
  },
  {
    type: "FREE_INTRO",
    title: "Introductory Discovery Call",
    duration: "15 mins",
    description:
      "Quick 15-minute introduction to meet your certified counsellor and understand how counselling can support your goals.",
    recommendedFor: "First-time consultations & quick guidance",
  },
];

const TIME_SLOTS = [
  "09:30 AM",
  "11:00 AM",
  "02:00 PM",
  "03:30 PM",
  "05:00 PM",
  "06:30 PM",
];

export const CounsellorBookingModal: React.FC<CounsellorBookingModalProps> = ({
  counsellor,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedType, setSelectedType] = useState<SessionType>("CAREER_GUIDANCE");
  const [sessionDate, setSessionDate] = useState<string>(() => {
    // Default to tomorrow in YYYY-MM-DD
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [sessionTime, setSessionTime] = useState<string>("11:00 AM");
  const [studentNotes, setStudentNotes] = useState<string>("");
  const [grantConsent, setGrantConsent] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const requestBookingMutation = useRequestBooking();
  const { data: dateAvailability, isLoading: isLoadingSlots } = useCounsellorDateAvailability(
    counsellor?.id || "",
    sessionDate
  );

  const bookedSlots = dateAvailability?.bookedSlots || [];

  if (!isOpen || !counsellor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!sessionDate || !sessionTime) {
      setErrorMessage("Please select a valid date and time slot.");
      return;
    }

    if (bookedSlots.some((s) => s.toLowerCase().trim() === sessionTime.toLowerCase().trim())) {
      setErrorMessage(
        `The ${sessionTime} slot is already booked on ${sessionDate}. Please select another time.`
      );
      return;
    }

    try {
      await requestBookingMutation.mutateAsync({
        counsellorId: counsellor.id,
        sessionType: selectedType,
        sessionDate,
        sessionTime,
        studentNotes: studentNotes.trim() || undefined,
        grantConsent,
      });

      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Failed to book session. Please try again."
      );
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900 md:p-8">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Appointment Requested!
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300">
              Your session request with{" "}
              <strong className="text-slate-900 dark:text-white">{counsellor.name}</strong> has
              been submitted for{" "}
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {sessionDate} at {sessionTime}
              </span>
              . You will receive an instant notification once confirmed with your meeting link.
            </p>

            <div className="mt-8 flex justify-center gap-3">
              <button
                onClick={handleClose}
                className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500"
              >
                View My Sessions
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Counsellor Mini Header */}
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-base font-bold text-white shadow-md shadow-indigo-600/20">
                  {counsellor.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Book Session with {counsellor.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {counsellor.qualification} • {counsellor.experienceYears}+ years experience
                  </p>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1. Session Type Selector */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                1. Select Consultation Format
              </label>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {SESSION_TYPES.map((st) => {
                  const isSelected = selectedType === st.type;
                  return (
                    <button
                      key={st.type}
                      type="button"
                      onClick={() => setSelectedType(st.type)}
                      className={`relative flex flex-col justify-between rounded-2xl border p-3.5 text-left transition-all ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/50 shadow-sm ring-2 ring-indigo-600/20 dark:border-indigo-500 dark:bg-indigo-950/40"
                          : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-850 dark:hover:border-slate-700"
                      }`}
                    >
                      {st.badge && (
                        <span className="absolute -top-2 right-3 rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                          {st.badge}
                        </span>
                      )}
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            {st.title}
                          </h4>
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                          {st.description}
                        </p>
                      </div>
                      <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-300">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-indigo-500" />
                          {st.duration}
                        </span>
                        {isSelected && (
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-white">
                            <Check className="h-2.5 w-2.5" />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Date & Time Selection */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  2. Choose Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 shadow-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                {dateAvailability && !dateAvailability.isAvailableDay && (
                  <p className="mt-1.5 text-[11px] text-amber-600 dark:text-amber-400">
                    ℹ️ Special request day (outside regular weekly schedule)
                  </p>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    3. Select Time Slot
                  </label>
                  {isLoadingSlots && (
                    <span className="text-[10px] text-slate-400">Checking slots...</span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {TIME_SLOTS.map((slot) => {
                    const isSlotBooked = bookedSlots.some(
                      (s) => s.toLowerCase().trim() === slot.toLowerCase().trim()
                    );
                    const isSlotSelected = sessionTime === slot && !isSlotBooked;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isSlotBooked}
                        onClick={() => setSessionTime(slot)}
                        title={isSlotBooked ? "Slot already booked or pending" : undefined}
                        className={`relative rounded-lg border px-2 py-1.5 text-center text-xs font-medium transition ${
                          isSlotBooked
                            ? "cursor-not-allowed border-dashed border-slate-200 bg-slate-100 text-slate-400 line-through opacity-60 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-500"
                            : isSlotSelected
                            ? "border-indigo-600 bg-indigo-600 text-white shadow-xs"
                            : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600"
                        }`}
                      >
                        {slot}
                        {isSlotBooked && (
                          <span className="block text-[9px] font-normal not-italic no-underline">
                            Booked
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Student Notes */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                4. Guidance Topics & Questions (Optional)
              </label>
              <textarea
                value={studentNotes}
                onChange={(e) => setStudentNotes(e.target.value)}
                placeholder="E.g., I'm trying to decide between Computer Science and Data Engineering after Grade 12..."
                rows={2}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* 4. Privacy Consent Opt-In */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-950/60 dark:bg-indigo-950/30">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={grantConsent}
                  onChange={(e) => setGrantConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Share Safe Psychometric Summary with Counsellor
                  </span>
                  <p className="mt-0.5 text-slate-600 dark:text-slate-300">
                    Allows {counsellor.name} to view your learning archetype, RIASEC codes, and top career matches to prepare tailored advice.{" "}
                    <strong className="text-slate-800 dark:text-slate-200">
                      Raw question answers and scoring weights are strictly protected and never shared.
                    </strong>
                  </p>
                </div>
              </label>
            </div>

            {/* Submit CTA */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={requestBookingMutation.isPending}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition hover:bg-indigo-500 disabled:opacity-50"
              >
                {requestBookingMutation.isPending ? (
                  <span>Submitting Request...</span>
                ) : (
                  <>
                    <Video className="h-4 w-4" />
                    <span>Confirm & Request Appointment</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

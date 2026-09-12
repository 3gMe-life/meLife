"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Sparkles,
  Clock,
  Languages,
  Award,
  CheckCircle2,
  Calendar,
  MessageSquare,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import { useCounsellorDetail } from "../hooks/useCounsellorQueries";
import { CounsellorBookingModal } from "./CounsellorBookingModal";

interface CounsellorProfileViewProps {
  counsellorId: string;
}

export const CounsellorProfileView: React.FC<CounsellorProfileViewProps> = ({
  counsellorId,
}) => {
  const { data: counsellor, isLoading, error } = useCounsellorDetail(counsellorId);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="h-64 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-850" />
      </div>
    );
  }

  if (error || !counsellor) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Counsellor Profile Not Found
        </h2>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          The requested counsellor profile does not exist or is no longer available.
        </p>
        <Link
          href="/participant/counsellors"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Directory</span>
        </Link>
      </div>
    );
  }

  const initials = counsellor.name
    ? counsellor.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "CC";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Link */}
      <Link
        href="/participant/counsellors"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to All Counsellors</span>
      </Link>

      {/* Main Profile Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-3xl font-extrabold text-white shadow-xl shadow-indigo-500/20 ring-4 ring-white dark:ring-slate-800">
              {counsellor.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={counsellor.profileImage}
                  alt={counsellor.name}
                  className="h-full w-full rounded-3xl object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
              <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white ring-4 ring-white dark:ring-slate-900">
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {counsellor.name}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Certified Mentor
                </span>
              </div>

              <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                {counsellor.qualification}
              </p>

              <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="h-4 w-4 fill-amber-400" />
                  <strong className="text-slate-900 dark:text-white">
                    {counsellor.rating.toFixed(1)}
                  </strong>{" "}
                  ({counsellor.reviewCount} reviews)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {counsellor.experienceYears}+ years experience
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Languages className="h-3.5 w-3.5 text-slate-400" />
                  {counsellor.languages.join(", ")}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Book CTA Button */}
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <div className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{counsellor.matchPercentage || 94}% AI Match Affinity</span>
            </div>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-600/30 transition hover:bg-indigo-500 sm:w-auto"
            >
              <Calendar className="h-4 w-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid Content: Bio, Guidance Areas, Availability, Reviews */}
      <div className="mt-8 grid gap-8 md:grid-cols-3">
        {/* Left 2 Columns: Bio, Guidance Areas, Reviews */}
        <div className="space-y-8 md:col-span-2">
          {/* About Counsellor */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 md:p-7">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              About {counsellor.name}
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {counsellor.bio}
            </p>

            {/* Specialisations */}
            <div className="mt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Primary Domains & Specialisations
              </h4>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {counsellor.specialisations.map((spec, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-xl bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Guidance Areas */}
          {counsellor.guidanceAreas && counsellor.guidanceAreas.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 md:p-7">
              <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span>Areas of Advisory & Guidance</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {counsellor.guidanceAreas.map((area, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-xs font-medium text-slate-800 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-200"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Student Reviews */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 md:p-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Verified Student Reviews ({counsellor.reviews.length})
                </h3>
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-amber-400" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {counsellor.rating.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="mt-5 divide-y divide-slate-100 dark:divide-slate-800">
              {counsellor.reviews.map((rev) => (
                <div key={rev.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {rev.studentName}
                    </span>
                    <span className="text-[11px] text-slate-400">{rev.date}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(rev.rating)
                            ? "fill-amber-400"
                            : "fill-slate-200 text-slate-200 dark:fill-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    &quot;{rev.comment}&quot;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Weekly Availability Schedule & Sticky Booking */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Weekly Consultation Hours</span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Standard appointment availability
            </p>

            <div className="mt-4 space-y-2">
              {counsellor.availability?.map((slot, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-2.5 text-xs dark:border-slate-800 dark:bg-slate-850"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {slot?.day}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {slot?.startTime} - {slot?.endTime}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsBookingOpen(true)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition hover:bg-indigo-500"
            >
              <Calendar className="h-4 w-4" />
              <span>Schedule Session Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <CounsellorBookingModal
        counsellor={counsellor}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
};

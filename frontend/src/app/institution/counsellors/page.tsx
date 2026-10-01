"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { useCounsellors } from "@/features/counsellors/hooks/useCounsellorQueries";
import { LoadingState, ErrorState } from "@/features/dashboard/components/common/LoadingState";
import {
  Users,
  ShieldCheck,
  Star,
  Calendar,
  Clock,
  Languages,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
  RefreshCw,
} from "lucide-react";
import { CounsellorCardDTO, CounsellorFilterParams } from "@/features/counsellors/types/counsellor.types";
import { CounsellorBookingModal } from "@/features/counsellors/components/CounsellorBookingModal";
import Link from "next/link";

const SPECIALISATIONS = [
  { value: "ALL", label: "All Specialisations" },
  { value: "School Career Guidance", label: "School Career Guidance" },
  { value: "STEM & Technology Careers", label: "STEM & Technology Careers" },
  { value: "Business & Financial Technology", label: "Business & FinTech" },
  { value: "UX & Creative Technology", label: "UX & Creative Technology" },
  { value: "Healthcare & Medicine", label: "Healthcare & Medicine" },
  { value: "Higher Education Advisory", label: "Higher Education Advisory" },
  { value: "Psychometrics & Cognitive Growth", label: "Psychometrics & Cognitive Growth" },
];

const LANGUAGES_LIST = [
  { value: "ALL", label: "All Languages" },
  { value: "English", label: "English" },
  { value: "Hindi", label: "Hindi" },
  { value: "Malayalam", label: "Malayalam" },
  { value: "Tamil", label: "Tamil" },
  { value: "Kannada", label: "Kannada" },
  { value: "Arabic", label: "Arabic" },
];

export default function InstitutionCounsellorsPage() {
  const [filters, setFilters] = useState<CounsellorFilterParams>({
    search: "",
    specialisation: "ALL",
    language: "ALL",
    experience: "ALL",
    day: "ALL",
  });

  const [bookingCounsellor, setBookingCounsellor] = useState<CounsellorCardDTO | null>(null);

  const {
    data: counsellorsData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useCounsellors(filters);

  const counsellors = counsellorsData?.counsellors || [];

  const handleResetFilters = () => {
    setFilters({
      search: "",
      specialisation: "ALL",
      language: "ALL",
      experience: "ALL",
      day: "ALL",
    });
  };

  const hasActiveFilters =
    Boolean(filters.search) ||
    filters.specialisation !== "ALL" ||
    filters.language !== "ALL" ||
    filters.experience !== "ALL" ||
    filters.day !== "ALL";

  return (
    <DashboardShell allowedRoles={["INSTITUTION_ADMIN", "SUPER_ADMIN", "PLATFORM_ADMIN", "COMPANY_ADMIN"]}>
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00BFA5]/20 text-[#00BFA5] border border-[#00BFA5]/30 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
                Counsellor Connect & Guidance Network
              </h1>
              <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0]">
                Connect your student cohorts with verified, certified career counsellors for personalized guidance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/institution/sessions"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] bg-white dark:bg-[#122423] text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] hover:border-[#00BFA5] transition-colors shadow-xs"
            >
              <Calendar className="w-4 h-4 text-[#00BFA5]" />
              <span>View Booked Sessions</span>
            </Link>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="rounded-3xl bg-white dark:bg-[#122423] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-4 sm:p-5 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#728B88]" />
              <input
                type="text"
                placeholder="Search by counsellor name, qualification, or bio..."
                value={filters.search || ""}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                className="w-full rounded-2xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] bg-[#F7FAF9] dark:bg-[#0A1A18] py-2.5 pl-10 pr-4 text-xs font-medium text-[#172B2A] dark:text-[#F7FAF9] placeholder:text-[#728B88] focus:border-[#00BFA5] focus:outline-none focus:ring-1 focus:ring-[#00BFA5]"
              />
            </div>

            {/* Specialisation Select */}
            <div className="md:col-span-3">
              <select
                value={filters.specialisation || "ALL"}
                onChange={(e) => setFilters((prev) => ({ ...prev, specialisation: e.target.value }))}
                className="w-full rounded-2xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] bg-[#F7FAF9] dark:bg-[#0A1A18] py-2.5 px-3.5 text-xs font-medium text-[#172B2A] dark:text-[#F7FAF9] focus:border-[#00BFA5] focus:outline-none focus:ring-1 focus:ring-[#00BFA5]"
              >
                {SPECIALISATIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Select */}
            <div className="md:col-span-2">
              <select
                value={filters.language || "ALL"}
                onChange={(e) => setFilters((prev) => ({ ...prev, language: e.target.value }))}
                className="w-full rounded-2xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] bg-[#F7FAF9] dark:bg-[#0A1A18] py-2.5 px-3.5 text-xs font-medium text-[#172B2A] dark:text-[#F7FAF9] focus:border-[#00BFA5] focus:outline-none focus:ring-1 focus:ring-[#00BFA5]"
              >
                {LANGUAGES_LIST.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Action / Reset */}
            <div className="md:col-span-2 flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="w-full py-2.5 px-3 rounded-2xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] text-[#526866] dark:text-[#9FB3B0] text-xs font-bold hover:bg-[#E3ECEA]/30 dark:hover:bg-[rgba(227,236,234,0.05)] transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Counsellor Grid */}
        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState message="Unable to load verified counsellors from the network." onRetry={() => refetch()} />
        ) : counsellors.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-[#122423] rounded-3xl border border-dashed border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] p-8">
            <Users className="w-12 h-12 text-[#728B88] mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
              {hasActiveFilters
                ? "No verified counsellors found matching your criteria"
                : "No verified counsellors are currently available."}
            </h3>
            <p className="text-xs text-[#526866] dark:text-[#9FB3B0] max-w-sm mx-auto mb-4">
              {hasActiveFilters
                ? "Try adjusting your search terms or clearing your domain filters."
                : "Certified career counsellors approved by the platform administration will appear here."}
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-[#00BFA5] text-[#0A1A18] font-bold text-xs hover:bg-[#00A892] transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {counsellors.map((c: CounsellorCardDTO) => {
              const initials = c.name
                ? c.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "CC";

              return (
                <div
                  key={c.id}
                  className="rounded-3xl bg-white dark:bg-[#122423] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Avatar & Name */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00B8D4] via-[#00BFA5] to-[#00C896] flex items-center justify-center font-black text-sm text-[#0A1A18] shrink-0 overflow-hidden shadow-sm">
                        {c.profileImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={c.profileImage}
                            alt={c.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{initials}</span>
                        )}
                        <span
                          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white dark:ring-[#122423]"
                          title="Verified Career Counsellor"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] truncate group-hover:text-[#00BFA5] transition-colors">
                            {c.name}
                          </h3>
                        </div>
                        <p className="text-xs font-semibold text-[#008F83] dark:text-[#00BFA5] truncate">
                          {c.qualification || "Certified Career Guidance Counsellor"}
                        </p>

                        <div className="flex items-center gap-3 text-xs font-semibold text-[#728B88] mt-1.5">
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                            <span>{c.rating ? c.rating.toFixed(1) : "5.0"}</span>
                            {c.reviewCount > 0 && (
                              <span className="text-[#728B88] font-normal">({c.reviewCount})</span>
                            )}
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{c.experienceYears || 1}+ yrs</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-[#526866] dark:text-[#9FB3B0] line-clamp-3 mb-4 leading-relaxed">
                      {c.bio || "Certified psychometric career counsellor helping students discover optimal pathways."}
                    </p>

                    {/* Specialisations */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(c.specialisations || []).slice(0, 3).map((spec, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center rounded-xl bg-[#E3ECEA]/40 dark:bg-[rgba(227,236,234,0.08)] px-2.5 py-1 text-[11px] font-semibold text-[#172B2A] dark:text-[#E3ECEA]"
                        >
                          {spec}
                        </span>
                      ))}
                      {(c.specialisations || []).length > 3 && (
                        <span className="inline-flex items-center rounded-xl bg-[#E3ECEA]/30 dark:bg-[rgba(227,236,234,0.05)] px-2 py-1 text-[11px] font-medium text-[#728B88]">
                          +{(c.specialisations || []).length - 3}
                        </span>
                      )}
                    </div>

                    {/* Languages */}
                    {c.languages && c.languages.length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-[#728B88] mb-4">
                        <Languages className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{c.languages.join(", ")}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-4 border-t border-[#E3ECEA] dark:border-[rgba(227,236,234,0.08)] flex items-center justify-between gap-3">
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Available for Bookings
                    </span>
                    <button
                      onClick={() => setBookingCounsellor(c)}
                      className="px-4 py-2 rounded-xl bg-[#00BFA5] text-[#0A1A18] font-bold text-xs hover:bg-[#00A892] transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Schedule Session</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Counsellor Booking Modal */}
        {bookingCounsellor && (
          <CounsellorBookingModal
            counsellor={bookingCounsellor}
            isOpen={Boolean(bookingCounsellor)}
            onClose={() => setBookingCounsellor(null)}
            onSuccess={() => {
              setBookingCounsellor(null);
              refetch();
            }}
          />
        )}
      </div>
    </DashboardShell>
  );
}


"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Calendar,
  Clock,
  Video,
  FileText,
  ShieldCheck,
  Search,
  Filter,
  Users,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import {
  CounsellorCardDTO,
  CounsellingSessionDTO,
  CounsellorFilterParams,
  ConsentPermission,
} from "../types/counsellor.types";
import {
  useCounsellors,
  useStudentSessions,
  useUpdateConsent,
} from "../hooks/useCounsellorQueries";
import { CounsellorCard } from "./CounsellorCard";
import { CounsellorFilterBar } from "./CounsellorFilterBar";
import { CounsellorBookingModal } from "./CounsellorBookingModal";
import { SessionNotesModal } from "./SessionNotesModal";

export const CounsellorListView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"explore" | "my-sessions">("explore");
  const [filters, setFilters] = useState<CounsellorFilterParams>({
    search: "",
    specialisation: "ALL",
    language: "ALL",
  });
  const [selectedCounsellorForBooking, setSelectedCounsellorForBooking] =
    useState<CounsellorCardDTO | null>(null);
  const [selectedSessionForNotes, setSelectedSessionForNotes] =
    useState<CounsellingSessionDTO | null>(null);

  const { data: counsellorsData, isLoading: isLoadingCounsellors } =
    useCounsellors(filters);
  const { data: sessions = [], isLoading: isLoadingSessions } =
    useStudentSessions();
  const updateConsentMutation = useUpdateConsent();

  const counsellors = counsellorsData?.counsellors || [];
  const isAssessed = counsellorsData?.isAssessed ?? true;

  const handleToggleConsent = async (counsellorId: string, currentHasConsent: boolean) => {
    const nextPermission: ConsentPermission = currentHasConsent
      ? "REVOKED"
      : "VIEW_ASSESSMENT_SUMMARY";
    await updateConsentMutation.mutateAsync({
      counsellorId,
      permission: nextPermission,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-850 to-slate-900 p-8 text-white shadow-xl dark:from-slate-900 dark:via-indigo-950 dark:to-slate-950">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-purple-500/10 blur-2xl" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 ring-1 ring-inset ring-indigo-500/30">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>AI-Guided Human Career Advisory</span>
          </div>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl">
            Connect with Certified Career Counsellors
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-indigo-100/90 sm:text-base">
            Discuss your Skill Finder psychometric results, explore recommended career pathways, and design an actionable academic roadmap with verified guidance experts.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-indigo-200">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Certified Psychologists & Mentors</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Zero Raw Data Exposure</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>AI Affinity Match Scoring</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab("explore")}
            className={`relative pb-2.5 text-sm font-bold transition-colors ${
              activeTab === "explore"
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <span>Explore Counsellors</span>
            {activeTab === "explore" && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-indigo-600 dark:bg-indigo-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("my-sessions")}
            className={`relative flex items-center gap-2 pb-2.5 text-sm font-bold transition-colors ${
              activeTab === "my-sessions"
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <span>My Booked Sessions</span>
            {sessions.length > 0 && (
              <span className="flex h-5 items-center justify-center rounded-full bg-indigo-100 px-2 text-[11px] font-extrabold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {sessions.length}
              </span>
            )}
            {activeTab === "my-sessions" && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-indigo-600 dark:bg-indigo-400" />
            )}
          </button>
        </div>
      </div>

      {/* Tab 1: Explore Counsellors */}
      {activeTab === "explore" && (
        <div className="space-y-6">
          <CounsellorFilterBar
            filters={filters}
            onChange={setFilters}
            isAssessed={isAssessed}
          />

          {isLoadingCounsellors ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-850"
                />
              ))}
            </div>
          ) : counsellors.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <Users className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
              <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                No counsellors found
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Try adjusting your search criteria, language, or specialisation filters.
              </p>
              <button
                onClick={() =>
                  setFilters({ search: "", specialisation: "ALL", language: "ALL" })
                }
                className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {counsellors.map((c) => (
                <CounsellorCard
                  key={c.id}
                  counsellor={c}
                  onBookClick={(item) => setSelectedCounsellorForBooking(item)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Booked Sessions */}
      {activeTab === "my-sessions" && (
        <div className="space-y-4">
          {isLoadingSessions ? (
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-850"
                />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <Calendar className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
              <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                No sessions booked yet
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Connect with an accredited career guide to discuss your strengths and target career pathways.
              </p>
              <button
                onClick={() => setActiveTab("explore")}
                className="mt-4 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500"
              >
                Explore Counsellors
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {sessions.map((session) => {
                const isPending = session.status === "PENDING";
                const isConfirmed = session.status === "CONFIRMED";
                const isCompleted = session.status === "COMPLETED";
                const isRejected = session.status === "REJECTED";

                return (
                  <div
                    key={session.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div>
                      {/* Status Header */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            isConfirmed
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/60 dark:text-emerald-400"
                              : isPending
                              ? "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 dark:bg-amber-950/60 dark:text-amber-400"
                              : isCompleted
                              ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                              : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                          }`}
                        >
                          {session.status}
                        </span>

                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {session.sessionType.replace("_", " ")} ({session.durationMinutes}m)
                        </span>
                      </div>

                      {/* Counsellor Profile Info */}
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-xs">
                          {session.counsellorName ? session.counsellorName.slice(0, 2).toUpperCase() : "CC"}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">
                            {session.counsellorName || "Certified Counsellor"}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {session.counsellorQualification}
                          </p>
                        </div>
                      </div>

                      {/* Time & Date */}
                      <div className="mt-4 flex items-center gap-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-700 dark:bg-slate-850 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-indigo-500" />
                          <span className="font-semibold">{session.sessionDate}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-indigo-500" />
                          <span className="font-semibold">{session.sessionTime}</span>
                        </div>
                      </div>

                      {/* Student Notes */}
                      {session.studentNotes && (
                        <p className="mt-3 text-xs italic text-slate-500 dark:text-slate-400">
                          &quot;{session.studentNotes}&quot;
                        </p>
                      )}
                    </div>

                    {/* Action Footers */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3.5 dark:border-slate-800">
                      {/* Privacy Consent Control */}
                      <button
                        onClick={() => handleToggleConsent(session.counsellorId, session.hasConsent)}
                        className={`inline-flex items-center gap-1 text-[11px] font-medium transition ${
                          session.hasConsent
                            ? "text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                            : "text-amber-600 hover:text-amber-700 dark:text-amber-400"
                        }`}
                        title="Click to toggle profile summary sharing with this counsellor"
                      >
                        {session.hasConsent ? (
                          <>
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>Profile Sharing Active</span>
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="h-3.5 w-3.5" />
                            <span>Consent Revoked (Click to Enable)</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        {isConfirmed && session.meetingLink && (
                          <a
                            href={session.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500"
                          >
                            <Video className="h-3.5 w-3.5" />
                            <span>Join Call</span>
                          </a>
                        )}

                        <button
                          onClick={() => setSelectedSessionForNotes(session)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750"
                        >
                          <FileText className="h-3.5 w-3.5 text-slate-500" />
                          <span>Guidance Notes</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Booking Modal */}
      <CounsellorBookingModal
        counsellor={selectedCounsellorForBooking}
        isOpen={Boolean(selectedCounsellorForBooking)}
        onClose={() => setSelectedCounsellorForBooking(null)}
        onSuccess={() => setActiveTab("my-sessions")}
      />

      {/* Session Notes Modal */}
      <SessionNotesModal
        session={selectedSessionForNotes}
        isOpen={Boolean(selectedSessionForNotes)}
        onClose={() => setSelectedSessionForNotes(null)}
        isCounsellorView={false}
      />
    </div>
  );
};

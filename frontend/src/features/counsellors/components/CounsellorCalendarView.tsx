"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
  FileText,
  Brain,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Filter,
} from "lucide-react";
import {
  useCounsellorSessions,
  useCounsellorAvailability,
  useUpdateSessionStatus,
} from "../hooks/useCounsellorQueries";
import { CounsellingSessionDTO, SessionStatus } from "../types/counsellor.types";
import { StudentPsychometricSummaryModal } from "./StudentPsychometricSummaryModal";
import { SessionNotesModal } from "./SessionNotesModal";

type CalendarViewMode = "month" | "week" | "day";

export const CounsellorCalendarView: React.FC = () => {
  const [viewMode, setViewMode] = useState<CalendarViewMode>("week");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedStudentForSummary, setSelectedStudentForSummary] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedSessionForNotes, setSelectedSessionForNotes] =
    useState<CounsellingSessionDTO | null>(null);

  const { data: sessions = [], isLoading: isLoadingSessions } = useCounsellorSessions();
  const { data: availability = [] } = useCounsellorAvailability();
  const updateStatusMutation = useUpdateSessionStatus();

  // Navigation handlers
  const handlePrev = () => {
    const nextDate = new Date(currentDate);
    if (viewMode === "month") {
      nextDate.setMonth(nextDate.getMonth() - 1);
    } else if (viewMode === "week") {
      nextDate.setDate(nextDate.getDate() - 7);
    } else {
      nextDate.setDate(nextDate.getDate() - 1);
    }
    setCurrentDate(nextDate);
  };

  const handleNext = () => {
    const nextDate = new Date(currentDate);
    if (viewMode === "month") {
      nextDate.setMonth(nextDate.getMonth() + 1);
    } else if (viewMode === "week") {
      nextDate.setDate(nextDate.getDate() + 7);
    } else {
      nextDate.setDate(nextDate.getDate() + 1);
    }
    setCurrentDate(nextDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Filtered sessions
  const filteredSessions = useMemo(() => {
    if (statusFilter === "ALL") return sessions;
    return sessions.filter((s) => s.status === statusFilter);
  }, [sessions, statusFilter]);

  // Format month and year
  const monthYearLabel = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Week days calculation
  const weekDays = useMemo(() => {
    const curr = new Date(currentDate);
    const firstDayOfWeek = curr.getDate() - curr.getDay() + 1; // Start with Monday
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(curr.setDate(firstDayOfWeek + i));
      days.push(d);
    }
    return days;
  }, [currentDate]);

  const getSessionsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return filteredSessions.filter((s) => s.sessionDate === dateStr);
  };

  const getStatusBadgeClass = (status: SessionStatus) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-indigo-600 text-white border-indigo-700";
      case "PENDING":
        return "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300";
      case "COMPLETED":
        return "bg-emerald-600 text-white border-emerald-700";
      case "CANCELLED":
      case "REJECTED":
        return "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950 dark:text-rose-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Bar */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-indigo-500" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Counsellor Guidance Calendar
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            View scheduled appointments, pending booking requests, and recurring consultation availability.
          </p>
        </div>

        {/* View Mode Switcher & Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setViewMode("month")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                viewMode === "month"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                viewMode === "week"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode("day")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                viewMode === "day"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Day
            </button>
          </div>

          <a
            href="/counsellor/profile"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <Clock className="h-3.5 w-3.5 text-indigo-500" />
            <span>Manage Slots</span>
          </a>
        </div>
      </div>

      {/* Date Navigation & Status Filter */}
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleToday}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            Today
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <span className="text-sm font-extrabold text-slate-900 dark:text-white">
            {monthYearLabel}
          </span>
        </div>

        {/* Status Legend & Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Filter:</span>
          {["ALL", "CONFIRMED", "PENDING", "COMPLETED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                statusFilter === st
                  ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500/30 dark:bg-indigo-950 dark:text-indigo-300"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Week View */}
      {viewMode === "week" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-7">
          {weekDays.map((d, index) => {
            const dateStr = d.toISOString().split("T")[0];
            const isToday = new Date().toISOString().split("T")[0] === dateStr;
            const daySessions = getSessionsForDate(d);
            const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
            const dayNum = d.getDate();

            return (
              <div
                key={index}
                className={`flex flex-col rounded-2xl border p-3.5 transition ${
                  isToday
                    ? "border-indigo-500 bg-indigo-50/20 dark:border-indigo-500/60 dark:bg-indigo-950/20"
                    : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {dayName}
                  </span>
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-extrabold ${
                      isToday
                        ? "bg-indigo-600 text-white"
                        : "text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {dayNum}
                  </span>
                </div>

                {/* Day Sessions List */}
                <div className="mt-3 space-y-2">
                  {daySessions.length === 0 ? (
                    <div className="py-6 text-center text-[11px] text-slate-400">
                      No sessions
                    </div>
                  ) : (
                    daySessions.map((s) => (
                      <div
                        key={s.id}
                        className={`rounded-xl border p-2.5 text-xs shadow-xs transition hover:shadow-md ${getStatusBadgeClass(
                          s.status
                        )}`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold opacity-90">
                          <span>{s.sessionTime}</span>
                          <span>{s.status}</span>
                        </div>
                        <div className="mt-1 font-extrabold line-clamp-1">
                          {s.studentName || "Student"}
                        </div>
                        <div className="mt-0.5 text-[10px] opacity-80 line-clamp-1">
                          {s.sessionType.replace("_", " ")}
                        </div>

                        {/* Card action controls */}
                        <div className="mt-2.5 flex items-center gap-1.5 border-t border-white/20 pt-2">
                          <button
                            onClick={() =>
                              setSelectedStudentForSummary({
                                id: s.studentId,
                                name: s.studentName || "Student",
                              })
                            }
                            title="Preview Psychometric Profile"
                            className="rounded-lg bg-black/20 p-1 hover:bg-black/30"
                          >
                            <Brain className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => setSelectedSessionForNotes(s)}
                            title="Session Notes"
                            className="rounded-lg bg-black/20 p-1 hover:bg-black/30"
                          >
                            <FileText className="h-3 w-3" />
                          </button>
                          {s.status === "CONFIRMED" && s.meetingLink && (
                            <a
                              href={s.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Join Meeting"
                              className="rounded-lg bg-white p-1 text-indigo-700 hover:bg-slate-100"
                            >
                              <Video className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Day / Month Views Placeholder Cards */}
      {viewMode === "day" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Schedule for {currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </h2>
          <div className="mt-4 space-y-3">
            {getSessionsForDate(currentDate).length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No appointments scheduled for this date.
              </div>
            ) : (
              getSessionsForDate(currentDate).map((s) => (
                <div
                  key={s.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-850 sm:flex-row sm:items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${getStatusBadgeClass(s.status)}`}>
                        {s.status}
                      </span>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {s.sessionTime} ({s.durationMinutes} mins)
                      </span>
                    </div>
                    <h3 className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">
                      {s.studentName || "Student"}
                    </h3>
                  </div>

                  <div className="mt-3 flex items-center gap-2 sm:mt-0">
                    <button
                      onClick={() =>
                        setSelectedStudentForSummary({
                          id: s.studentId,
                          name: s.studentName || "Student",
                        })
                      }
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-400"
                    >
                      Summary
                    </button>
                    <button
                      onClick={() => setSelectedSessionForNotes(s)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      Notes
                    </button>
                    {s.status === "CONFIRMED" && s.meetingLink && (
                      <a
                        href={s.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                      >
                        Join Call
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Month View */}
      {viewMode === "month" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, idx) => {
              const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), idx - 3);
              const daySessions = getSessionsForDate(dayDate);
              const isCurrentMonth = dayDate.getMonth() === currentDate.getMonth();

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setCurrentDate(dayDate);
                    setViewMode("day");
                  }}
                  className={`min-h-[75px] cursor-pointer rounded-xl border p-2 transition hover:border-indigo-400 ${
                    isCurrentMonth
                      ? "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-850"
                      : "border-slate-100 bg-slate-50/50 opacity-40 dark:border-slate-800/40 dark:bg-slate-900/40"
                  }`}
                >
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {dayDate.getDate()}
                  </span>
                  <div className="mt-1 space-y-1">
                    {daySessions.slice(0, 2).map((s) => (
                      <div
                        key={s.id}
                        className="truncate rounded-md bg-indigo-600/90 px-1 py-0.5 text-[9px] font-semibold text-white"
                      >
                        {s.sessionTime} - {s.studentName || "Student"}
                      </div>
                    ))}
                    {daySessions.length > 2 && (
                      <div className="text-[9px] font-bold text-indigo-500">
                        +{daySessions.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Safe Psychometrics Summary Modal */}
      <StudentPsychometricSummaryModal
        studentId={selectedStudentForSummary?.id || null}
        studentName={selectedStudentForSummary?.name}
        isOpen={Boolean(selectedStudentForSummary)}
        onClose={() => setSelectedStudentForSummary(null)}
      />

      {/* Session Notes Modal */}
      <SessionNotesModal
        session={selectedSessionForNotes}
        isOpen={Boolean(selectedSessionForNotes)}
        onClose={() => setSelectedSessionForNotes(null)}
        isCounsellorView={true}
      />
    </div>
  );
};

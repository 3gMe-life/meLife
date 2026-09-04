"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  FileText,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Users,
  Brain,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import {
  CounsellingSessionDTO,
  SessionStatus,
} from "../types/counsellor.types";
import {
  useCounsellorOverview,
  useCounsellorSessions,
  useAssignedStudents,
  useUpdateSessionStatus,
} from "../hooks/useCounsellorQueries";
import { StudentPsychometricSummaryModal } from "./StudentPsychometricSummaryModal";
import { SessionNotesModal } from "./SessionNotesModal";

export const CounsellorDashboardView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"pending" | "upcoming" | "students">(
    "pending"
  );
  const [selectedStudentForSummary, setSelectedStudentForSummary] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedSessionForNotes, setSelectedSessionForNotes] =
    useState<CounsellingSessionDTO | null>(null);

  const { data: overview, isLoading: isLoadingOverview } = useCounsellorOverview();
  const { data: allSessions = [], isLoading: isLoadingSessions } = useCounsellorSessions();
  const { data: assignedStudents = [], isLoading: isLoadingStudents } = useAssignedStudents();
  const updateStatusMutation = useUpdateSessionStatus();

  const stats = overview?.stats || {
    upcomingSessionsCount: 0,
    pendingRequestsCount: 0,
    completedSessionsCount: 0,
    totalAssignedStudentsCount: 0,
  };

  const pendingSessions = allSessions.filter((s) => s.status === "PENDING");
  const upcomingSessions = allSessions.filter(
    (s) => s.status === "CONFIRMED" || s.status === "COMPLETED"
  );

  const handleUpdateStatus = async (
    sessionId: string,
    status: SessionStatus,
    meetingLink?: string
  ) => {
    await updateStatusMutation.mutateAsync({
      sessionId,
      status,
      meetingLink,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="mb-8 rounded-3xl bg-slate-900 p-6 text-white shadow-xl dark:bg-slate-950 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 ring-1 ring-inset ring-indigo-500/30">
              <Award className="h-3.5 w-3.5 text-indigo-400" />
              <span>Counsellor Guidance Portal</span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">
              Welcome, {overview?.counsellorProfile?.name || "Career Counsellor"}
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Review session requests, access safe student psychometric summaries, and manage guidance roadmaps.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-medium text-slate-300">
              {overview?.counsellorProfile?.qualification || "Certified Psychologist"}
            </span>
          </div>
        </div>

        {/* 4 Metric Stats Cards */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
            <span className="text-xs font-medium text-slate-400">Pending Requests</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-amber-400">
                {stats.pendingRequestsCount}
              </span>
              <span className="text-[11px] text-slate-500">Need Review</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
            <span className="text-xs font-medium text-slate-400">Upcoming Confirmed</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-indigo-400">
                {stats.upcomingSessionsCount}
              </span>
              <span className="text-[11px] text-slate-500">Sessions</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
            <span className="text-xs font-medium text-slate-400">Completed Sessions</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-emerald-400">
                {stats.completedSessionsCount}
              </span>
              <span className="text-[11px] text-slate-500">Concluded</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
            <span className="text-xs font-medium text-slate-400">Assigned Students</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-purple-400">
                {stats.totalAssignedStudentsCount}
              </span>
              <span className="text-[11px] text-slate-500">Total Mentored</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab("pending")}
            className={`relative flex items-center gap-2 pb-2.5 text-sm font-bold transition ${
              activeTab === "pending"
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <span>Pending Requests</span>
            {pendingSessions.length > 0 && (
              <span className="flex h-5 items-center justify-center rounded-full bg-amber-100 px-2 text-[11px] font-extrabold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                {pendingSessions.length}
              </span>
            )}
            {activeTab === "pending" && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-indigo-600 dark:bg-indigo-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("upcoming")}
            className={`relative pb-2.5 text-sm font-bold transition ${
              activeTab === "upcoming"
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <span>Confirmed & Past Sessions</span>
            {activeTab === "upcoming" && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-indigo-600 dark:bg-indigo-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("students")}
            className={`relative pb-2.5 text-sm font-bold transition ${
              activeTab === "students"
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <span>Assigned Students Directory</span>
            {activeTab === "students" && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-indigo-600 dark:bg-indigo-400" />
            )}
          </button>
        </div>
      </div>

      {/* Tab 1: Pending Requests */}
      {activeTab === "pending" && (
        <div className="space-y-4">
          {isLoadingSessions ? (
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className="h-28 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-850"
                />
              ))}
            </div>
          ) : pendingSessions.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
              <CheckCircle2 className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
              <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                No pending requests
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                You have reviewed and responded to all incoming student session requests.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col justify-between rounded-3xl border border-amber-200/70 bg-amber-50/20 p-5 shadow-xs transition hover:shadow-md dark:border-amber-900/40 dark:bg-amber-950/10 md:flex-row md:items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        PENDING APPROVAL
                      </span>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {session.sessionType.replace("_", " ")} ({session.durationMinutes} mins)
                      </span>
                    </div>

                    <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                      {session.studentName || "Student"}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                        <span>{session.sessionDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-indigo-500" />
                        <span>{session.sessionTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Profile Sharing Consent Active</span>
                      </div>
                    </div>

                    {session.studentNotes && (
                      <p className="mt-2.5 text-xs italic text-slate-600 dark:text-slate-300">
                        &quot;{session.studentNotes}&quot;
                      </p>
                    )}
                  </div>

                  {/* Accept / Decline CTA Buttons */}
                  <div className="mt-4 flex items-center gap-2.5 md:mt-0">
                    <button
                      onClick={() =>
                        setSelectedStudentForSummary({
                          id: session.studentId,
                          name: session.studentName || "Student",
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <Brain className="h-3.5 w-3.5 text-indigo-500" />
                      <span>Preview Psychometrics</span>
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(session.id, "REJECTED")}
                      className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:bg-slate-800 dark:text-rose-400"
                    >
                      Decline
                    </button>

                    <button
                      onClick={() =>
                        handleUpdateStatus(
                          session.id,
                          "CONFIRMED",
                          `https://meet.3gmelife.com/session-${session.id.slice(0, 8)}`
                        )
                      }
                      className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500"
                    >
                      Accept & Confirm
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Confirmed & Past Sessions */}
      {activeTab === "upcoming" && (
        <div className="space-y-4">
          {isLoadingSessions ? (
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className="h-28 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-850"
                />
              ))}
            </div>
          ) : upcomingSessions.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
              <Calendar className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
              <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                No active or concluded sessions
              </h3>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {upcomingSessions.map((session) => {
                const isConfirmed = session.status === "CONFIRMED";
                const isCompleted = session.status === "COMPLETED";

                return (
                  <div
                    key={session.id}
                    className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            isConfirmed
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {session.status}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                          {session.sessionType.replace("_", " ")}
                        </span>
                      </div>

                      <h3 className="mt-2.5 text-base font-bold text-slate-900 dark:text-white">
                        {session.studentName || "Student"}
                      </h3>

                      <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span>📅 {session.sessionDate}</span>
                        <span>•</span>
                        <span>⏰ {session.sessionTime}</span>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3.5 dark:border-slate-800">
                      <button
                        onClick={() =>
                          setSelectedStudentForSummary({
                            id: session.studentId,
                            name: session.studentName || "Student",
                          })
                        }
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                      >
                        <Brain className="h-3.5 w-3.5" />
                        <span>View Safe Summary</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {isConfirmed && session.meetingLink && (
                          <a
                            href={session.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                          >
                            <Video className="h-3.5 w-3.5" />
                            <span>Start Call</span>
                          </a>
                        )}

                        <button
                          onClick={() => setSelectedSessionForNotes(session)}
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span>{session.notesAdded ? "Edit Notes" : "Add Notes"}</span>
                        </button>

                        {isConfirmed && (
                          <button
                            onClick={() => handleUpdateStatus(session.id, "COMPLETED")}
                            className="rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Assigned Students Directory */}
      {activeTab === "students" && (
        <div className="space-y-4">
          {isLoadingStudents ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-850"
                />
              ))}
            </div>
          ) : assignedStudents.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
              <Users className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
              <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                No assigned students yet
              </h3>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-3.5">Student Name</th>
                    <th className="px-5 py-3.5">Grade / School</th>
                    <th className="px-5 py-3.5">Assessment Status</th>
                    <th className="px-5 py-3.5">Consent Status</th>
                    <th className="px-5 py-3.5">Sessions</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {assignedStudents.map((stu) => (
                    <tr key={stu.student_id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
                      <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                        {stu.student_name}
                      </td>
                      <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                        {stu.grade_level ? `Grade ${stu.grade_level}` : "N/A"} •{" "}
                        {stu.school_name || "School"}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            stu.is_assessed
                              ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {stu.is_assessed ? "Assessed" : "Pending"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            stu.has_consent
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                              : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                          }`}
                        >
                          {stu.has_consent ? "Active" : "Revoked"}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-700 dark:text-slate-300">
                        {stu.session_count} session(s)
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() =>
                            setSelectedStudentForSummary({
                              id: stu.student_id,
                              name: stu.student_name,
                            })
                          }
                          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-400"
                        >
                          View Summary
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Safe Psychometrics Drawer Modal */}
      <StudentPsychometricSummaryModal
        studentId={selectedStudentForSummary?.id || null}
        studentName={selectedStudentForSummary?.name}
        isOpen={Boolean(selectedStudentForSummary)}
        onClose={() => setSelectedStudentForSummary(null)}
      />

      {/* Guidance Notes Modal */}
      <SessionNotesModal
        session={selectedSessionForNotes}
        isOpen={Boolean(selectedSessionForNotes)}
        onClose={() => setSelectedSessionForNotes(null)}
        isCounsellorView={true}
      />
    </div>
  );
};

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Video,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Users,
  Brain,
  Star,
  UserCheck,
  ArrowRight,
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
import { PageHeader } from "@/features/dashboard/components/common/PageHeader";
import { MetricCard } from "@/features/dashboard/components/common/MetricCard";
import { DashboardCard } from "@/features/dashboard/components/common/DashboardCard";
import { EmptyState } from "@/features/dashboard/components/common/EmptyState";
import { LoadingState, ErrorState } from "@/features/dashboard/components/common/LoadingState";

export const CounsellorDashboardView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"pending" | "today" | "upcoming" | "students">(
    "pending"
  );
  const [selectedStudentForSummary, setSelectedStudentForSummary] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedSessionForNotes, setSelectedSessionForNotes] =
    useState<CounsellingSessionDTO | null>(null);

  const {
    data: overview,
    isLoading: isLoadingOverview,
    isError: isErrorOverview,
    refetch: refetchOverview,
  } = useCounsellorOverview();

  const {
    data: allSessions = [],
    isLoading: isLoadingSessions,
    isError: isErrorSessions,
    refetch: refetchSessions,
  } = useCounsellorSessions();

  const {
    data: assignedStudents = [],
    isLoading: isLoadingStudents,
    isError: isErrorStudents,
    refetch: refetchStudents,
  } = useAssignedStudents();

  const updateStatusMutation = useUpdateSessionStatus();

  if (isLoadingOverview && isLoadingSessions) {
    return <LoadingState />;
  }

  if ((isErrorOverview && isErrorSessions) || (isErrorSessions && isErrorStudents)) {
    return (
      <ErrorState
        message="Unable to load counsellor dashboard data. Please verify your connection."
        onRetry={() => {
          refetchOverview();
          refetchSessions();
          refetchStudents();
        }}
      />
    );
  }

  const stats = overview?.stats || {
    todaySessionsCount: 0,
    upcomingSessionsCount: 0,
    pendingRequestsCount: 0,
    completedSessionsCount: 0,
    availableSlotsCount: 0,
    totalAssignedStudentsCount: 0,
  };

  const counsellorProfile = overview?.counsellorProfile;
  const todaySessions = overview?.todaySessions || allSessions.filter(
    (s) => s.sessionDate === new Date().toISOString().split("T")[0] && s.status !== "CANCELLED" && s.status !== "REJECTED"
  );
  const pendingSessions = overview?.pendingRequests || allSessions.filter((s) => s.status === "PENDING");
  const upcomingSessions = overview?.upcomingSessions || allSessions.filter(
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
    refetchOverview();
    refetchSessions();
  };

  return (
    <div className="space-y-6 select-none">
      {/* 1. Page Header */}
      <PageHeader
        title={`Welcome, ${counsellorProfile?.name || "Career Counsellor"}`}
        subtitle="Manage guidance sessions, review student psychometric summaries, and coordinate scheduled mentorship."
        badge={counsellorProfile?.qualification || "Certified Counsellor"}
        badgeColor="emerald"
        actionElement={
          <div className="flex items-center gap-2.5">
            <Link
              href="/counsellor/calendar"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all shadow-md shadow-[#00BFA5]/20 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Manage Availability</span>
            </Link>
          </div>
        }
      />

      {/* 2. Real-Time Metrics Grid (6 Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <MetricCard
          id="metric-today"
          title="Today's Sessions"
          value={stats.todaySessionsCount ?? stats.todaySessions ?? 0}
          subtitle="Scheduled today"
          iconName="Clock"
          accentColor="indigo"
        />
        <MetricCard
          id="metric-upcoming"
          title="Upcoming"
          value={stats.upcomingSessionsCount ?? stats.upcomingSessions ?? 0}
          subtitle="Confirmed upcoming"
          iconName="Calendar"
          accentColor="teal"
        />
        <MetricCard
          id="metric-pending"
          title="Pending Requests"
          value={stats.pendingRequestsCount ?? stats.pendingRequests ?? 0}
          subtitle="Awaiting response"
          iconName="Users"
          accentColor={(stats.pendingRequestsCount || 0) > 0 ? "amber" : "blue"}
        />
        <MetricCard
          id="metric-completed"
          title="Completed"
          value={stats.completedSessionsCount ?? stats.completedSessions ?? 0}
          subtitle="Guidance sessions"
          iconName="CheckSquare"
          accentColor="emerald"
        />
        <MetricCard
          id="metric-slots"
          title="Available Slots"
          value={stats.availableSlotsCount ?? stats.availableSlots ?? 0}
          subtitle="Weekly remaining"
          iconName="Layers"
          accentColor="indigo"
        />
        <MetricCard
          id="metric-students"
          title="Student Count"
          value={stats.totalAssignedStudentsCount ?? stats.studentCount ?? 0}
          subtitle="Associated students"
          iconName="GraduationCap"
          accentColor="teal"
        />
      </div>

      {/* 3. Main Tabs & Interactive Workspace */}
      <DashboardCard
        title="Guidance Operations"
        subtitle="Review incoming consultation requests, manage active bookings, and access student dossiers"
        headerAction={
          <div className="flex items-center p-1 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs font-bold overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("pending")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "pending"
                  ? "bg-white dark:bg-[#172B2A] text-[#172B2A] dark:text-[#F7FAF9] shadow-xs"
                  : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-white"
              }`}
            >
              <span>Pending Requests</span>
              {pendingSessions.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-black border border-amber-500/30">
                  {pendingSessions.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("today")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "today"
                  ? "bg-white dark:bg-[#172B2A] text-[#172B2A] dark:text-[#F7FAF9] shadow-xs"
                  : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-white"
              }`}
            >
              <span>Today&apos;s Schedule</span>
              {todaySessions.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#00BFA5]/20 text-[#008F83] dark:text-[#00BFA5] text-[10px] font-black border border-[#00BFA5]/30">
                  {todaySessions.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "upcoming"
                  ? "bg-white dark:bg-[#172B2A] text-[#172B2A] dark:text-[#F7FAF9] shadow-xs"
                  : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-white"
              }`}
            >
              <span>Upcoming</span>
              <span className="text-[10px] text-[#7D9491] font-normal">
                ({upcomingSessions.length})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("students")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "students"
                  ? "bg-white dark:bg-[#172B2A] text-[#172B2A] dark:text-[#F7FAF9] shadow-xs"
                  : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-white"
              }`}
            >
              <span>Students</span>
              <span className="text-[10px] text-[#7D9491] font-normal">
                ({assignedStudents.length})
              </span>
            </button>
          </div>
        }
      >
        {/* TAB 1: PENDING SESSIONS */}
        {activeTab === "pending" && (
          <div className="space-y-4">
            {isLoadingSessions ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-28 rounded-2xl bg-[#EBF2F0] dark:bg-white/5 animate-pulse"
                  />
                ))}
              </div>
            ) : pendingSessions.length === 0 ? (
              <EmptyState
                title="No Pending Session Requests"
                description="All student appointment requests have been processed. New session requests will appear here in real-time."
                actionText="View Confirmed Sessions"
                onActionClick={() => setActiveTab("upcoming")}
                icon={<CheckCircle2 className="w-6 h-6 text-[#00BFA5]" />}
              />
            ) : (
              <div className="space-y-3">
                {pendingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-5 rounded-2xl bg-[#F7FAF9] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 hover:border-[#00BFA5]/50 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                          Pending Approval
                        </span>
                        <span className="text-xs font-semibold text-[#526866] dark:text-[#9FB3B0]">
                          {session.sessionType.replace("_", " ")} • {session.durationMinutes} mins
                        </span>
                      </div>

                      <h4 className="text-base font-black text-[#172B2A] dark:text-[#F7FAF9]">
                        {session.studentName || "Student Applicant"}
                      </h4>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#526866] dark:text-[#9FB3B0]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#00BFA5]" />
                          <span>{session.sessionDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#00B8D4]" />
                          <span>{session.sessionTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#008F83] dark:text-[#00C896]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Profile Sharing Consent Active</span>
                        </div>
                      </div>

                      {session.studentNotes && (
                        <p className="text-xs text-[#526866] dark:text-[#9FB3B0] italic bg-white/70 dark:bg-black/20 p-2.5 rounded-xl border border-[#E3ECEA] dark:border-white/5 max-w-xl">
                          &quot;{session.studentNotes}&quot;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedStudentForSummary({
                            id: session.studentId,
                            name: session.studentName || "Student",
                          })
                        }
                        className="px-3 py-2 rounded-xl bg-white dark:bg-white/10 hover:bg-[#EBF2F0] dark:hover:bg-white/20 border border-[#E3ECEA] dark:border-white/10 text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Brain className="w-3.5 h-3.5 text-[#00BFA5]" />
                        <span>View Dossier</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(session.id, "REJECTED")}
                        className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Decline
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateStatus(
                            session.id,
                            "CONFIRMED",
                            `https://meet.3gmelife.com/session-${session.id.slice(0, 8)}`
                          )
                        }
                        className="px-4 py-2 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all shadow-md shadow-[#00BFA5]/25 cursor-pointer"
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

        {/* TAB 2: TODAY'S SCHEDULE */}
        {activeTab === "today" && (
          <div className="space-y-4">
            {isLoadingSessions ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-36 rounded-2xl bg-[#EBF2F0] dark:bg-white/5 animate-pulse"
                  />
                ))}
              </div>
            ) : todaySessions.length === 0 ? (
              <EmptyState
                title="No Sessions Scheduled Today"
                description="You have no appointments booked for today. Review upcoming sessions or adjust your availability schedule."
                actionText="View Upcoming Sessions"
                onActionClick={() => setActiveTab("upcoming")}
                icon={<Clock className="w-6 h-6 text-[#00BFA5]" />}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {todaySessions.map((session) => {
                  const isConfirmed = session.status === "CONFIRMED";
                  const isPending = session.status === "PENDING";
                  return (
                    <div
                      key={session.id}
                      className="p-5 rounded-2xl bg-[#F7FAF9] dark:bg-white/5 border border-[#00BFA5]/30 dark:border-[#00BFA5]/30 shadow-xs flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                              isConfirmed
                                ? "bg-[#00C896]/15 text-[#008F83] dark:text-[#00C896] border-[#00C896]/30"
                                : isPending
                                ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30"
                                : "bg-[#526866]/15 text-[#526866] dark:text-[#9FB3B0] border-[#526866]/30"
                            }`}
                          >
                            {session.status} • Today
                          </span>
                          <span className="text-xs font-semibold text-[#526866] dark:text-[#9FB3B0]">
                            {session.sessionType.replace("_", " ")}
                          </span>
                        </div>

                        <h4 className="text-base font-black text-[#172B2A] dark:text-[#F7FAF9]">
                          {session.studentName || "Student"}
                        </h4>

                        <div className="flex items-center gap-3 text-xs text-[#526866] dark:text-[#9FB3B0]">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#00B8D4]" />
                            <span className="font-bold text-[#172B2A] dark:text-[#F7FAF9]">{session.sessionTime}</span>
                          </div>
                          <span>•</span>
                          <span>{session.durationMinutes} mins</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#E3ECEA] dark:border-white/10 flex-wrap">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedStudentForSummary({
                              id: session.studentId,
                              name: session.studentName || "Student",
                            })
                          }
                          className="text-xs font-bold text-[#008F83] dark:text-[#00BFA5] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Brain className="w-3.5 h-3.5" />
                          <span>Student Summary</span>
                        </button>

                        <div className="flex items-center gap-2">
                          {isConfirmed && session.meetingLink && (
                            <a
                              href={session.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Join Meet</span>
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedSessionForNotes(session)}
                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 hover:bg-[#EBF2F0] dark:hover:bg-white/20 border border-[#E3ECEA] dark:border-white/10 text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#728B88]" />
                            <span>{session.notesAdded ? "Edit Notes" : "Add Notes"}</span>
                          </button>

                          {isConfirmed && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(session.id, "COMPLETED")}
                              className="px-3 py-1.5 rounded-xl bg-[#00C896]/15 hover:bg-[#00C896]/25 border border-[#00C896]/30 text-[#008F83] dark:text-[#00C896] text-xs font-bold transition-colors cursor-pointer"
                            >
                              Conclude
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

        {/* TAB 3: CONFIRMED & UPCOMING SESSIONS */}
        {activeTab === "upcoming" && (
          <div className="space-y-4">
            {isLoadingSessions ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-36 rounded-2xl bg-[#EBF2F0] dark:bg-white/5 animate-pulse"
                  />
                ))}
              </div>
            ) : upcomingSessions.length === 0 ? (
              <EmptyState
                title="No Confirmed Sessions"
                description="You currently have no scheduled appointments. Once you accept a pending request, meeting links and notes will appear here."
                actionText="Check Pending Requests"
                onActionClick={() => setActiveTab("pending")}
                icon={<Calendar className="w-6 h-6 text-[#00BFA5]" />}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingSessions.map((session) => {
                  const isConfirmed = session.status === "CONFIRMED";
                  return (
                    <div
                      key={session.id}
                      className="p-5 rounded-2xl bg-[#F7FAF9] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 flex flex-col justify-between space-y-4 hover:border-[#00BFA5]/40 transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                              isConfirmed
                                ? "bg-[#00C896]/15 text-[#008F83] dark:text-[#00C896] border-[#00C896]/30"
                                : "bg-[#526866]/15 text-[#526866] dark:text-[#9FB3B0] border-[#526866]/30"
                            }`}
                          >
                            {session.status}
                          </span>
                          <span className="text-xs text-[#526866] dark:text-[#9FB3B0]">
                            {session.sessionType.replace("_", " ")}
                          </span>
                        </div>

                        <h4 className="text-base font-black text-[#172B2A] dark:text-[#F7FAF9]">
                          {session.studentName || "Student"}
                        </h4>

                        <div className="flex items-center gap-3 text-xs text-[#526866] dark:text-[#9FB3B0]">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#00BFA5]" />
                            <span>{session.sessionDate}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#00B8D4]" />
                            <span>{session.sessionTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#E3ECEA] dark:border-white/10 flex-wrap">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedStudentForSummary({
                              id: session.studentId,
                              name: session.studentName || "Student",
                            })
                          }
                          className="text-xs font-bold text-[#008F83] dark:text-[#00BFA5] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Brain className="w-3.5 h-3.5" />
                          <span>Student Summary</span>
                        </button>

                        <div className="flex items-center gap-2">
                          {isConfirmed && session.meetingLink && (
                            <a
                              href={session.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Join Meet</span>
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedSessionForNotes(session)}
                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 hover:bg-[#EBF2F0] dark:hover:bg-white/20 border border-[#E3ECEA] dark:border-white/10 text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#728B88]" />
                            <span>{session.notesAdded ? "Edit Notes" : "Add Notes"}</span>
                          </button>

                          {isConfirmed && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(session.id, "COMPLETED")}
                              className="px-3 py-1.5 rounded-xl bg-[#00C896]/15 hover:bg-[#00C896]/25 border border-[#00C896]/30 text-[#008F83] dark:text-[#00C896] text-xs font-bold transition-colors cursor-pointer"
                            >
                              Conclude
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

        {/* TAB 3: ASSIGNED STUDENTS DIRECTORY */}
        {activeTab === "students" && (
          <div className="space-y-4">
            {isLoadingStudents ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 rounded-2xl bg-[#EBF2F0] dark:bg-white/5 animate-pulse"
                  />
                ))}
              </div>
            ) : assignedStudents.length === 0 ? (
              <EmptyState
                title="No Assigned Students"
                description="Students who book appointments with you will automatically appear in your active mentorship roster."
                icon={<Users className="w-6 h-6 text-[#00BFA5]" />}
              />
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-[#E3ECEA] dark:border-white/10">
                <table className="w-full text-left text-xs text-[#172B2A] dark:text-[#F7FAF9]">
                  <thead className="bg-[#F4F8F7] dark:bg-white/5 text-[11px] font-bold uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0] border-b border-[#E3ECEA] dark:border-white/10">
                    <tr>
                      <th className="px-5 py-3.5">Student Name</th>
                      <th className="px-5 py-3.5">Grade / Institution</th>
                      <th className="px-5 py-3.5">Assessment</th>
                      <th className="px-5 py-3.5">Consent</th>
                      <th className="px-5 py-3.5">Total Sessions</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3ECEA]/60 dark:divide-white/5">
                    {assignedStudents.map((stu) => (
                      <tr
                        key={stu.student_id}
                        className="hover:bg-[#F4F8F7]/50 dark:hover:bg-white/5 transition-colors"
                      >
                        <td className="px-5 py-4 font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                          {stu.student_name}
                        </td>
                        <td className="px-5 py-4 text-[#526866] dark:text-[#9FB3B0]">
                          {stu.grade_level ? `Grade ${stu.grade_level}` : "Grade N/A"} •{" "}
                          {stu.school_name || "Enrolled Institution"}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              stu.is_assessed
                                ? "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border-[#00BFA5]/30"
                                : "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30"
                            }`}
                          >
                            {stu.is_assessed ? "Completed" : "Pending"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              stu.has_consent
                                ? "bg-[#00C896]/15 text-[#008F83] dark:text-[#00C896] border-[#00C896]/30"
                                : "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30"
                            }`}
                          >
                            {stu.has_consent ? "Active" : "Revoked"}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-semibold text-[#526866] dark:text-[#9FB3B0]">
                          {stu.session_count} session(s)
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedStudentForSummary({
                                id: stu.student_id,
                                name: stu.student_name,
                              })
                            }
                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 hover:bg-[#EBF2F0] dark:hover:bg-white/20 border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#008F83] dark:text-[#00BFA5] transition-colors cursor-pointer"
                          >
                            Dossier
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
      </DashboardCard>

      {/* 4. Quick Actions & Management Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Link
          href="/counsellor/calendar"
          className="p-4 rounded-2xl bg-[#F7FAF9] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 hover:border-[#00BFA5]/50 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                Manage Schedule
              </h4>
              <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0]">
                Set weekly availability slots
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#7D9491] group-hover:text-[#00BFA5] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/counsellor/sessions"
          className="p-4 rounded-2xl bg-[#F7FAF9] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 hover:border-[#00BFA5]/50 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#00B8D4]/15 text-[#00B8D4] group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                Session History
              </h4>
              <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0]">
                Past notes and records
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#7D9491] group-hover:text-[#00B8D4] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/counsellor/reviews"
          className="p-4 rounded-2xl bg-[#F7FAF9] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 hover:border-[#00BFA5]/50 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                Student Reviews
              </h4>
              <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0]">
                Mentorship ratings & feedback
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#7D9491] group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/counsellor/profile"
          className="p-4 rounded-2xl bg-[#F7FAF9] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 hover:border-[#00BFA5]/50 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                Profile & Bio
              </h4>
              <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0]">
                Credentials & specialisations
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#7D9491] group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>

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

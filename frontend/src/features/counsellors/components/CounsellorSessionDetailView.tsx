"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Video,
  FileText,
  ShieldCheck,
  Brain,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  Plus,
  Trash2,
  Save,
  User,
  Sparkles,
  Info,
  ShieldAlert,
  MessageSquare,
} from "lucide-react";
import {
  useSessionDetail,
  useUpdateSessionStatus,
  useSaveSessionNotes,
  useStudentSummary,
} from "../hooks/useCounsellorQueries";
import {
  SessionStatus,
  AssessmentStatus,
  ReportStatus,
} from "../types/counsellor.types";

interface CounsellorSessionDetailViewProps {
  sessionId: string;
}

export const CounsellorSessionDetailView: React.FC<CounsellorSessionDetailViewProps> = ({
  sessionId,
}) => {
  const router = useRouter();

  const {
    data: session,
    isLoading,
    isError,
    error,
    refetch,
  } = useSessionDetail(sessionId);

  const updateStatusMutation = useUpdateSessionStatus();
  const saveNotesMutation = useSaveSessionNotes();

  // Student summary query (conditional on studentId and consent)
  const { data: psychometrics, isLoading: isLoadingSummary } = useStudentSummary(
    session?.studentId || "",
    Boolean(session?.studentId && session?.hasConsent)
  );

  // Form states for notes
  const [summary, setSummary] = useState("");
  const [observations, setObservations] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [actionPlan, setActionPlan] = useState<string[]>([]);
  const [newActionItem, setNewActionItem] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [notesSaveSuccess, setNotesSaveSuccess] = useState(false);
  const [notesError, setNotesError] = useState<string | null>(null);

  // Meeting link editing state
  const [meetingUrlInput, setMeetingUrlInput] = useState("");
  const [isEditingMeetingLink, setIsEditingMeetingLink] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Populate notes when session data arrives
  useEffect(() => {
    if (session?.notes) {
      setSummary(session.notes.summary || "");
      setObservations(session.notes.observations || "");
      setRecommendations(session.notes.recommendations || "");
      setActionPlan(session.notes.actionPlan || []);
      setFollowUpDate(session.notes.followUpDate || "");
    }
    if (session?.meetingLink) {
      setMeetingUrlInput(session.meetingLink);
    }
  }, [session]);

  const handleUpdateStatus = async (
    status: SessionStatus,
    customMeetingLink?: string
  ) => {
    if (!session) return;
    try {
      await updateStatusMutation.mutateAsync({
        sessionId: session.id,
        status,
        meetingLink: customMeetingLink !== undefined ? customMeetingLink : session.meetingLink || undefined,
      });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleSaveMeetingLink = async () => {
    if (!session) return;
    try {
      await updateStatusMutation.mutateAsync({
        sessionId: session.id,
        status: session.status,
        meetingLink: meetingUrlInput.trim() || undefined,
      });
      setIsEditingMeetingLink(false);
    } catch (err) {
      console.error("Failed to update meeting link:", err);
    }
  };

  const handleAddActionItem = () => {
    if (newActionItem.trim()) {
      setActionPlan([...actionPlan, newActionItem.trim()]);
      setNewActionItem("");
    }
  };

  const handleRemoveActionItem = (index: number) => {
    setActionPlan(actionPlan.filter((_, i) => i !== index));
  };

  const handleSaveNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setNotesError(null);
    setNotesSaveSuccess(false);

    if (!summary.trim() || !recommendations.trim()) {
      setNotesError("Session Summary and Recommendations are required.");
      return;
    }

    try {
      await saveNotesMutation.mutateAsync({
        sessionId: session.id,
        dto: {
          summary: summary.trim(),
          observations: observations.trim() || undefined,
          recommendations: recommendations.trim(),
          actionPlan,
          followUpDate: followUpDate || undefined,
        },
      });
      setNotesSaveSuccess(true);
      setTimeout(() => setNotesSaveSuccess(false), 3500);
    } catch (err) {
      setNotesError((err as Error)?.message || "Failed to save session notes.");
    }
  };

  const handleCopyMeetingLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const renderAssessmentBadge = (status?: AssessmentStatus) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> Assessment Completed
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" /> Assessment In Progress
          </span>
        );
      case "NOT_STARTED":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            ○ Assessment Not Started
          </span>
        );
    }
  };

  const renderReportBadge = (status?: ReportStatus) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            <FileText className="h-3.5 w-3.5" /> Career Report Ready
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
            <Clock className="h-3.5 w-3.5" /> Report Generating
          </span>
        );
      case "NOT_AVAILABLE":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            — No Report Generated
          </span>
        );
    }
  };

  const renderSessionStatusBadge = (status: SessionStatus) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
            CONFIRMED
          </span>
        );
      case "PENDING":
        return (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            PENDING APPROVAL
          </span>
        );
      case "COMPLETED":
        return (
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-extrabold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
            COMPLETED
          </span>
        );
      case "REJECTED":
      case "CANCELLED":
        return (
          <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-extrabold text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
            {status}
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {status}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="h-6 w-32 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="h-44 w-full animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-850" />
        <div className="h-64 w-full animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-850" />
      </div>
    );
  }

  if (isError || !session) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          Session Access Restricted or Not Found
        </h2>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {(error as Error)?.message ||
            "You do not have authorization to view this session, or the requested session does not exist."}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/counsellor/sessions"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-500"
          >
            <ArrowLeft className="h-4 w-4" /> Back to My Sessions
          </Link>
          <button
            onClick={() => refetch()}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const isPending = session.status === "PENDING";
  const isConfirmed = session.status === "CONFIRMED";
  const isCompleted = session.status === "COMPLETED";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/counsellor/sessions"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          <ArrowLeft className="h-4 w-4" /> Back to All Sessions
        </Link>

        {/* Quick Status Modifiers */}
        <div className="flex items-center gap-2">
          {isPending && (
            <>
              <button
                onClick={() => handleUpdateStatus("REJECTED")}
                className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:bg-slate-900 dark:text-rose-400"
              >
                Decline Request
              </button>
              <button
                onClick={() =>
                  handleUpdateStatus(
                    "CONFIRMED",
                    `https://meet.3gmelife.com/session-${session.id.slice(0, 8)}`
                  )
                }
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-500"
              >
                Accept & Confirm Session
              </button>
            </>
          )}

          {isConfirmed && (
            <>
              <button
                onClick={() => handleUpdateStatus("CANCELLED")}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              >
                Cancel Session
              </button>
              <button
                onClick={() => handleUpdateStatus("COMPLETED")}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-500"
              >
                Mark as Completed
              </button>
            </>
          )}
        </div>
      </div>

      {/* Hero Session Info Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-lg font-bold text-white shadow-md">
              {(session.studentName || "S").charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {renderSessionStatusBadge(session.status)}
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {session.sessionType.replace(/_/g, " ")} ({session.durationMinutes} minutes)
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {session.studentName || "Student Candidate"}
              </h1>
              <div className="text-xs text-slate-400 dark:text-slate-500">
                {session.studentEmail || "Student Candidate"}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {renderAssessmentBadge(session.assessmentStatus)}
                {renderReportBadge(session.reportStatus)}
                {session.hasConsent && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                    <ShieldCheck className="h-3 w-3" /> Profile Sharing Consent Active
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Schedule Info Box */}
          <div className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-850/60">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <Calendar className="h-4 w-4 text-indigo-500" />
              <span>{session.sessionDate}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <Clock className="h-4 w-4 text-indigo-500" />
              <span>{session.sessionTime}</span>
            </div>
            <Link
              href={`/counsellor/messages?studentId=${session.studentId}`}
              className="mt-2 flex items-center justify-center gap-1.5 rounded-xl bg-[#00BFA5] px-3 py-1.5 text-xs font-bold text-[#172B2A] shadow-xs hover:bg-[#00BFA5]/90 transition"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Message Student</span>
            </Link>
          </div>
        </div>

        {/* Student Notes & Goals */}
        {session.studentNotes && (
          <div className="mt-6 rounded-2xl bg-indigo-50/60 p-4 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-300">
              <Info className="h-3.5 w-3.5" />
              <span>Student&apos;s Stated Objective / Questions:</span>
            </div>
            <p className="mt-1 text-xs italic text-indigo-950 dark:text-indigo-200">
              &quot;{session.studentNotes}&quot;
            </p>
          </div>
        )}
      </div>

      {/* Video Call & Meeting Access */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Online Video Consultation Room
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct secure link for the live 1-on-1 career counselling session.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditingMeetingLink(!isEditingMeetingLink)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            {isEditingMeetingLink ? "Cancel Edit" : "Change Meeting Link"}
          </button>
        </div>

        {isEditingMeetingLink ? (
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={meetingUrlInput}
              onChange={(e) => setMeetingUrlInput(e.target.value)}
              placeholder="https://meet.google.com/... or https://meet.3gmelife.com/..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <button
              onClick={handleSaveMeetingLink}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500"
            >
              Save Link
            </button>
          </div>
        ) : session.meetingLink ? (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-850/60">
            <div className="truncate text-xs font-mono text-slate-700 dark:text-slate-300">
              {session.meetingLink}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopyMeetingLink(session.meetingLink || "")}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {copiedLink ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
              <a
                href={session.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-500"
              >
                <Video className="h-3.5 w-3.5" />
                <span>Join Call</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-xs font-medium text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            No meeting link generated yet. Click &quot;Change Meeting Link&quot; to assign a Google Meet, Zoom, or Teams URL.
          </div>
        )}
      </div>

      {/* Psychometrics Snapshot (If consented) */}
      {session.hasConsent && psychometrics && psychometrics.isAssessed && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Student Psychometrics & Talent Signature
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authorized assessment results to guide your advisory conversation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {psychometrics.archetype && (
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-850/60">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Primary Archetype</span>
                <div className="mt-1 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {psychometrics.archetype}
                </div>
              </div>
            )}
            {psychometrics.riasecCode && (
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-850/60">
                <span className="text-[11px] font-bold text-slate-400 uppercase">RIASEC Profile</span>
                <div className="mt-1 text-sm font-bold text-purple-600 dark:text-purple-400">
                  {psychometrics.riasecCode}
                </div>
              </div>
            )}
            {psychometrics.gradeLevel && (
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-850/60">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Grade / Stage</span>
                <div className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                  {psychometrics.gradeLevel} ({psychometrics.educationStage || "General"})
                </div>
              </div>
            )}
          </div>

          {/* Top Career Pathways */}
          {psychometrics.topCareerPathways && psychometrics.topCareerPathways.length > 0 && (
            <div className="mt-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Top Matched Career Pathways:
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {psychometrics.topCareerPathways.map((pathway, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>{pathway.title}</span>
                    <span className="font-bold">({pathway.matchPercentage}%)</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Guidance Notes & Action Plan Editor */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Counsellor Guidance Notes & Action Plan
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Record structured session takeaways, observations, and milestone action steps for the student.
              </p>
            </div>
          </div>
        </div>

        {notesSaveSuccess && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            <Check className="h-4 w-4" /> Guidance notes saved successfully!
          </div>
        )}

        {notesError && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-rose-50 p-3 text-xs font-bold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
            <AlertTriangle className="h-4 w-4" /> {notesError}
          </div>
        )}

        <form onSubmit={handleSaveNotes} className="mt-6 space-y-5">
          {/* Summary */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Session Summary <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="High-level overview of what was discussed during the advisory appointment..."
              className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Observations */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Key Observations & Behavioral Insights
            </label>
            <textarea
              rows={2}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="E.g., Strong logical reasoning, prefers hands-on problem solving, expressed uncertainty about engineering vs. design..."
              className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Recommendations */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Strategic Recommendations <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              placeholder="Direct guidance and career pathways recommended to the student..."
              className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Action Plan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Student Action Items
            </label>
            <div className="mt-2 space-y-2">
              {actionPlan.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs dark:bg-slate-850"
                >
                  <span className="text-slate-700 dark:text-slate-300">
                    {idx + 1}. {item}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveActionItem(idx)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newActionItem}
                  onChange={(e) => setNewActionItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddActionItem();
                    }
                  }}
                  placeholder="Add a milestone action item (e.g. Complete Portfolio by Friday)..."
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddActionItem}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
            </div>
          </div>

          {/* Follow-up Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Suggested Follow-up Date (Optional)
            </label>
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="mt-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={saveNotesMutation.isPending}
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-500 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saveNotesMutation.isPending ? "Saving..." : "Save Guidance Notes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

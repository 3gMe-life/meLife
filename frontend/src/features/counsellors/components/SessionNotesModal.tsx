"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  Plus,
  Trash2,
  Calendar,
  CheckCircle,
  Lightbulb,
  Save,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  CounsellingSessionDTO,
  CounsellingNoteDTO,
  SaveCounsellingNoteDTO,
} from "../types/counsellor.types";
import { useSessionNotes, useSaveSessionNotes } from "../hooks/useCounsellorQueries";

interface SessionNotesModalProps {
  session: CounsellingSessionDTO | null;
  isOpen: boolean;
  onClose: () => void;
  isCounsellorView?: boolean;
}

export const SessionNotesModal: React.FC<SessionNotesModalProps> = ({
  session,
  isOpen,
  onClose,
  isCounsellorView = false,
}) => {
  const { data: note, isLoading } = useSessionNotes(session?.id || "", isOpen);
  const saveNotesMutation = useSaveSessionNotes();

  const [summary, setSummary] = useState<string>("");
  const [observations, setObservations] = useState<string>("");
  const [recommendations, setRecommendations] = useState<string>("");
  const [actionPlan, setActionPlan] = useState<string[]>([]);
  const [newActionItem, setNewActionItem] = useState<string>("");
  const [followUpDate, setFollowUpDate] = useState<string>("");
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (note) {
      setSummary(note.summary || "");
      setObservations(note.observations || "");
      setRecommendations(note.recommendations || "");
      setActionPlan(note.actionPlan || []);
      setFollowUpDate(note.followUpDate || "");
    } else {
      setSummary("");
      setObservations("");
      setRecommendations("");
      setActionPlan([]);
      setFollowUpDate("");
    }
  }, [note]);

  if (!isOpen || !session) return null;

  const handleAddActionItem = () => {
    if (newActionItem.trim()) {
      setActionPlan([...actionPlan, newActionItem.trim()]);
      setNewActionItem("");
    }
  };

  const handleRemoveActionItem = (index: number) => {
    setActionPlan(actionPlan.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSavedSuccess(false);

    if (!summary.trim() || !recommendations.trim()) {
      setErrorMessage("Summary and Recommendations are required.");
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

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to save session notes.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900 md:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <FileText className="h-4 w-4" />
            <span>Session Guidance Notes & Action Plan</span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            {isCounsellorView
              ? `Guidance Notes for ${session.studentName || "Student"}`
              : `Counsellor Feedback & Action Roadmap`}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Session on {session.sessionDate} at {session.sessionTime} ({session.sessionType.replace("_", " ")})
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            <p className="mt-3 text-xs text-slate-500">Loading session notes...</p>
          </div>
        ) : isCounsellorView ? (
          // Counsellor Edit / Save Form
          <form onSubmit={handleSave} className="mt-6 space-y-5">
            {errorMessage && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {savedSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                <Check className="h-4 w-4 shrink-0" />
                <span>Guidance notes and action plan saved successfully!</span>
              </div>
            )}

            {/* Discussion Summary */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                1. Session Discussion Summary *
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
                rows={3}
                placeholder="Key topics discussed, student concerns, aspirations..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 shadow-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Observations */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                2. Cognitive & Behavioural Observations (Optional)
              </label>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                rows={2}
                placeholder="Demonstrated aptitudes, communication style, clarity of thought..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 shadow-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Recommendations */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                3. Counsellor Strategic Recommendations *
              </label>
              <textarea
                value={recommendations}
                onChange={(e) => setRecommendations(e.target.value)}
                required
                rows={3}
                placeholder="Recommended academic streams, degrees, competitive exams, or skill development areas..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 shadow-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Student Action Plan Steps */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                4. Student Action Plan (Milestones & Next Steps)
              </label>
              <div className="space-y-2">
                {actionPlan.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-850"
                  >
                    <span className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
                      <CheckCircle className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                      {item}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveActionItem(index)}
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
                    placeholder="Add an actionable milestone..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddActionItem();
                      }
                    }}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddActionItem}
                    className="flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Follow-up Date */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                5. Follow-Up Target Date (Optional)
              </label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 shadow-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-800 dark:bg-slate-800 dark:text-white sm:w-1/2"
              />
            </div>

            {/* Form Submit CTA */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={saveNotesMutation.isPending}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{saveNotesMutation.isPending ? "Saving..." : "Save Guidance Notes"}</span>
              </button>
            </div>
          </form>
        ) : (
          // Student Read-Only View
          <div className="mt-6 space-y-6">
            {!note ? (
              <div className="py-8 text-center">
                <FileText className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" />
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Your counsellor is compiling the guidance notes and personalized action plan for this session. Please check back soon.
                </p>
              </div>
            ) : (
              <>
                {/* Summary */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-850">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Discussion Summary
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    {note.summary}
                  </p>
                </div>

                {/* Recommendations */}
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-950/50 dark:bg-indigo-950/30">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                    <Lightbulb className="h-4 w-4" />
                    <span>Key Guidance & Recommendations</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    {note.recommendations}
                  </p>
                </div>

                {/* Action Plan */}
                {note.actionPlan && note.actionPlan.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Your Action Plan & Milestones
                    </h4>
                    <div className="space-y-2">
                      {note.actionPlan.map((step, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-850"
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                            {i + 1}
                          </span>
                          <span className="text-xs text-slate-800 dark:text-slate-200">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow-up target */}
                {note.followUpDate && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Calendar className="h-4 w-4 text-indigo-500" />
                    <span>
                      Suggested Follow-Up Date:{" "}
                      <strong className="text-slate-800 dark:text-slate-200">
                        {note.followUpDate}
                      </strong>
                    </span>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                className="rounded-xl bg-slate-100 px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Building,
  GraduationCap,
  Mail,
  Calendar,
  FileText,
  AlertCircle,
  Loader2,
  AlertTriangle,
  Globe,
} from "lucide-react";
import type { CounsellorApplicationItemDTO } from "../types/admin.types";
import {
  useApproveCounsellorApplication,
  useRejectCounsellorApplication,
} from "../hooks/useAdminQueries";

interface CounsellorApplicationReviewModalProps {
  application: CounsellorApplicationItemDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

function formatDate(dateString?: string | null): string {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "N/A";
  }
}

export const CounsellorApplicationReviewModal: React.FC<
  CounsellorApplicationReviewModalProps
> = ({ application, isOpen, onClose, onSuccess }) => {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#172B2A]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#E3ECEA] bg-white p-6 shadow-2xl transition-all dark:border-white/10 dark:bg-[#112423] md:p-8">
        <CounsellorApplicationReviewModalContent
          key={application.id}
          application={application}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
};

interface CounsellorApplicationReviewModalContentProps {
  application: CounsellorApplicationItemDTO;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

function CounsellorApplicationReviewModalContent({
  application,
  onClose,
  onSuccess,
}: CounsellorApplicationReviewModalContentProps) {
  const approveMutation = useApproveCounsellorApplication();
  const rejectMutation = useRejectCounsellorApplication();

  const [activeTab, setActiveTab] = useState<"approve" | "reject">("approve");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Approve form state initialized directly from application prop
  const [qualification, setQualification] = useState(
    application.qualification || "Certified Career Guidance Counsellor"
  );
  const [bio, setBio] = useState(
    `Certified Career and Education Guidance Counsellor at ${
      application.organization || "MeLife"
    }.`
  );
  const [experienceYears, setExperienceYears] = useState(2);
  const [specialisations, setSpecialisations] = useState<string[]>([
    "School Career Guidance",
    "Higher Education Advisory",
    "Cognitive Aptitude Alignment",
  ]);
  const [newSpecialisation, setNewSpecialisation] = useState("");
  const [languages, setLanguages] = useState<string[]>(["English"]);
  const [newLanguage, setNewLanguage] = useState("");
  const [guidanceAreas, setGuidanceAreas] = useState<string[]>([
    "Stream Selection",
    "Psychometric Assessment Debriefing",
    "Career Roadmaps",
  ]);
  const [newGuidanceArea, setNewGuidanceArea] = useState("");
  const [approveReviewNotes, setApproveReviewNotes] = useState(
    "Credentials and educational background verified."
  );

  // Reject form state
  const [rejectionReason, setRejectionReason] = useState("");

  const isPending = application.status === "PENDING";
  const isApproved = application.status === "APPROVED";
  const isRejected = application.status === "REJECTED";

  const handleAddTag = (
    value: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    clearInput: () => void
  ) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
      clearInput();
    }
  };

  const handleRemoveTag = (
    index: number,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const res = await approveMutation.mutateAsync({
        applicationId: application.id,
        dto: {
          qualification: qualification.trim() || undefined,
          bio: bio.trim() || undefined,
          experienceYears: Number(experienceYears) || 1,
          specialisations: specialisations.length ? specialisations : undefined,
          languages: languages.length ? languages : undefined,
          guidanceAreas: guidanceAreas.length ? guidanceAreas : undefined,
          reviewNotes: approveReviewNotes.trim() || undefined,
        },
      });

      onSuccess?.(
        res.message ||
          "Counsellor application approved successfully. User activated as CAREER_COUNSELLOR."
      );
      onClose();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to approve counsellor application.";
      setErrorMessage(errorMsg);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!rejectionReason.trim()) {
      setErrorMessage("Please enter a clear audit reason or review note for rejection.");
      return;
    }

    try {
      const res = await rejectMutation.mutateAsync({
        applicationId: application.id,
        dto: {
          reason: rejectionReason.trim(),
          reviewNotes: rejectionReason.trim(),
        },
      });

      onSuccess?.(res.message || "Counsellor application rejected.");
      onClose();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to reject counsellor application.";
      setErrorMessage(errorMsg);
    }
  };

  return (
    <>
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute right-5 top-5 rounded-full p-2 text-[#728B88] hover:bg-[#F4F8F7] hover:text-[#172B2A] dark:text-[#9FB3B0] dark:hover:bg-white/10 dark:hover:text-white transition-colors cursor-pointer"
        aria-label="Close modal"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Modal Header */}
      <div className="border-b border-[#E3ECEA]/70 pb-4 dark:border-white/10">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5]">
          <ShieldCheck className="h-4 w-4" />
          <span>Counsellor Verification & Credentials Audit</span>
        </div>
        <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
            {application.applicantName || "Counsellor Applicant"}
          </h2>
          <div className="flex items-center gap-2">
            {isPending && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                <Clock className="w-3.5 h-3.5" />
                <span>Pending Review</span>
              </span>
            )}
            {isApproved && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approved Practitioner</span>
              </span>
            )}
            {isRejected && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                <XCircle className="w-3.5 h-3.5" />
                <span>Application Rejected</span>
              </span>
            )}
          </div>
        </div>
        <p className="mt-1 text-xs text-[#526866] dark:text-[#9FB3B0]">
          Submitted on {formatDate(application.createdAt)} • Application UUID:{" "}
          <span className="font-mono text-[11px]">{application.id.slice(0, 8)}...</span>
        </p>
      </div>

      {/* Applicant Submitted Data Summary Card */}
      <div className="mt-5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 p-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] mb-3">
          Applicant Submitted Credentials
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div className="flex items-start gap-2.5">
            <Mail className="w-4 h-4 text-[#00BFA5] shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] block">
                Email Address
              </span>
              <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
                {application.applicantEmail}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <GraduationCap className="w-4 h-4 text-[#00BFA5] shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] block">
                Submitted Qualification
              </span>
              <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
                {application.qualification || "Credentials Uploaded"}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Building className="w-4 h-4 text-[#00BFA5] shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] block">
                Institution / Organization
              </span>
              <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
                {application.organization || "Independent Practitioner"}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-[#00BFA5] shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] block">
                Submission Date
              </span>
              <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
                {formatDate(application.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert Display */}
      {errorMessage && (
        <div className="mt-4 flex items-center gap-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 p-3.5 text-xs text-rose-700 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Conditional Content: Pending Form vs Processed Audit */}
      {isPending ? (
        <div className="mt-6">
          {/* Action Mode Switcher */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#EBF2F0] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 mb-5">
            <button
              type="button"
              onClick={() => setActiveTab("approve")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "approve"
                  ? "bg-white dark:bg-[#112423] text-[#008F83] dark:text-[#00BFA5] shadow-xs"
                  : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9]"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Approve & Grant Practitioner Role</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reject")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "reject"
                  ? "bg-white dark:bg-[#112423] text-rose-600 dark:text-rose-400 shadow-xs"
                  : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9]"
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject Application</span>
            </button>
          </div>

          {/* TAB 1: APPROVE FORM */}
          {activeTab === "approve" && (
            <form onSubmit={handleApprove} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0] mb-1">
                    Professional Qualification / Degree *
                  </label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    required
                    placeholder="e.g. M.Sc. Psychology & Career Counselling"
                    className="w-full rounded-xl border border-[#E3ECEA] dark:border-white/10 bg-white dark:bg-[#172B2A] px-3.5 py-2.5 text-xs text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:border-[#00BFA5]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0] mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#E3ECEA] dark:border-white/10 bg-white dark:bg-[#172B2A] px-3.5 py-2.5 text-xs text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:border-[#00BFA5]"
                  />
                </div>
              </div>

              {/* Specialisations Tags */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0] mb-1">
                  Specialisations
                </label>
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {specialisations.map((spec, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/25"
                    >
                      <span>{spec}</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveTag(i, specialisations, setSpecialisations)
                        }
                        className="text-[#728B88] hover:text-rose-500 ml-0.5 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSpecialisation}
                    onChange={(e) => setNewSpecialisation(e.target.value)}
                    placeholder="Add specialisation (e.g. STEM Advisory)..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag(
                          newSpecialisation,
                          specialisations,
                          setSpecialisations,
                          () => setNewSpecialisation("")
                        );
                      }
                    }}
                    className="flex-1 rounded-xl border border-[#E3ECEA] dark:border-white/10 bg-white dark:bg-[#172B2A] px-3 py-2 text-xs text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:border-[#00BFA5]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleAddTag(
                        newSpecialisation,
                        specialisations,
                        setSpecialisations,
                        () => setNewSpecialisation("")
                      )
                    }
                    className="px-3.5 py-2 rounded-xl bg-[#EBF2F0] dark:bg-white/10 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] hover:bg-[#E3ECEA] dark:hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Guidance Areas Tags */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0] mb-1">
                  Guidance Focus Areas
                </label>
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {guidanceAreas.map((area, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/25"
                    >
                      <span>{area}</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveTag(i, guidanceAreas, setGuidanceAreas)
                        }
                        className="text-[#728B88] hover:text-rose-500 ml-0.5 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newGuidanceArea}
                    onChange={(e) => setNewGuidanceArea(e.target.value)}
                    placeholder="Add guidance area (e.g. Study Abroad Planning)..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag(
                          newGuidanceArea,
                          guidanceAreas,
                          setGuidanceAreas,
                          () => setNewGuidanceArea("")
                        );
                      }
                    }}
                    className="flex-1 rounded-xl border border-[#E3ECEA] dark:border-white/10 bg-white dark:bg-[#172B2A] px-3 py-2 text-xs text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:border-[#00BFA5]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleAddTag(
                        newGuidanceArea,
                        guidanceAreas,
                        setGuidanceAreas,
                        () => setNewGuidanceArea("")
                      )
                    }
                    className="px-3.5 py-2 rounded-xl bg-[#EBF2F0] dark:bg-white/10 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] hover:bg-[#E3ECEA] dark:hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Languages Tags */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0] mb-1">
                  Counselling Languages
                </label>
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {languages.map((lang, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/25"
                    >
                      <Globe className="w-3 h-3" />
                      <span>{lang}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(i, languages, setLanguages)}
                        className="text-[#728B88] hover:text-rose-500 ml-0.5 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="Add language (e.g. Hindi, Spanish)..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag(newLanguage, languages, setLanguages, () =>
                          setNewLanguage("")
                        );
                      }
                    }}
                    className="flex-1 rounded-xl border border-[#E3ECEA] dark:border-white/10 bg-white dark:bg-[#172B2A] px-3 py-2 text-xs text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:border-[#00BFA5]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleAddTag(newLanguage, languages, setLanguages, () =>
                        setNewLanguage("")
                      )
                    }
                    className="px-3.5 py-2 rounded-xl bg-[#EBF2F0] dark:bg-white/10 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] hover:bg-[#E3ECEA] dark:hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Professional Bio */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0] mb-1">
                  Public Directory Bio
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-xl border border-[#E3ECEA] dark:border-white/10 bg-white dark:bg-[#172B2A] p-3 text-xs text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:border-[#00BFA5]"
                />
              </div>

              {/* Review Notes / Audit Log */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0] mb-1">
                  Administrative Audit Notes
                </label>
                <input
                  type="text"
                  value={approveReviewNotes}
                  onChange={(e) => setApproveReviewNotes(e.target.value)}
                  placeholder="e.g. Certified credentials verified with state registration board."
                  className="w-full rounded-xl border border-[#E3ECEA] dark:border-white/10 bg-white dark:bg-[#172B2A] px-3.5 py-2.5 text-xs text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:border-[#00BFA5]"
                />
              </div>

              {/* Action CTA */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E3ECEA]/60 dark:border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={approveMutation.isPending}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00B8D4] to-[#00BFA5] text-[#172B2A] text-xs font-black shadow-md shadow-[#00BFA5]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                >
                  {approveMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserCheck className="w-4 h-4" />
                  )}
                  <span>
                    {approveMutation.isPending
                      ? "Executing Transaction..."
                      : "Approve & Activate Counsellor"}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: REJECT FORM */}
          {activeTab === "reject" && (
            <form onSubmit={handleReject} className="space-y-4 text-xs">
              <div className="rounded-2xl bg-rose-500/10 border border-rose-500/25 p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-rose-700 dark:text-rose-300">
                    Application Rejection Notice
                  </h4>
                  <p className="mt-1 text-[11px] text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                    Rejecting will mark this application as REJECTED in the audit log and send a notification update to the applicant. The candidate will not be granted the CAREER_COUNSELLOR role.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0] mb-1">
                  Rejection Audit Reason / Feedback *
                </label>
                <textarea
                  rows={4}
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide clear reasons for rejection (e.g., Incomplete documentation, accredited credentials could not be validated, or institutional mismatch)..."
                  className="w-full rounded-xl border border-[#E3ECEA] dark:border-white/10 bg-white dark:bg-[#172B2A] p-3 text-xs text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E3ECEA]/60 dark:border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rejectMutation.isPending}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                >
                  {rejectMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  <span>
                    {rejectMutation.isPending
                      ? "Rejecting Application..."
                      : "Confirm Application Rejection"}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* Processed Application Read-Only Audit */
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] mb-3">
              <FileText className="w-4 h-4 text-[#00BFA5]" />
              <span>Administrative Decision Audit Record</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] block">
                  Reviewed By
                </span>
                <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
                  {application.reviewerName || "Platform Administrator"}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] block">
                  Decision Timestamp
                </span>
                <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
                  {formatDate(application.reviewedAt || application.updatedAt)}
                </span>
              </div>
            </div>

            {application.reviewNotes && (
              <div className="mt-3.5 pt-3 border-t border-[#E3ECEA]/60 dark:border-white/10">
                <span className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] block mb-1">
                  Review Notes / Audit Remarks
                </span>
                <p className="text-xs text-[#172B2A] dark:text-[#F7FAF9] leading-relaxed">
                  {application.reviewNotes}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              Close Audit Record
            </button>
          </div>
        </div>
      )}
    </>
  );
}

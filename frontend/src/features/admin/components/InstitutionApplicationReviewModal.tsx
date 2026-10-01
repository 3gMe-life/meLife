"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  School,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Building,
  Mail,
  Calendar,
  FileText,
  AlertCircle,
  Loader2,
  AlertTriangle,
  Globe,
  MapPin,
  Phone,
  User,
  Hash,
  Award,
  Layers,
  ExternalLink,
} from "lucide-react";
import type { InstitutionApplicationItemDTO } from "../types/admin.types";
import {
  useApproveInstitutionApplication,
  useRejectInstitutionApplication,
} from "../hooks/useAdminQueries";

interface InstitutionApplicationReviewModalProps {
  application: InstitutionApplicationItemDTO | null;
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

export const InstitutionApplicationReviewModal: React.FC<
  InstitutionApplicationReviewModalProps
> = ({ application, isOpen, onClose, onSuccess }) => {
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
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-[#E3ECEA] bg-white p-6 shadow-2xl transition-all dark:border-white/10 dark:bg-[#112423] md:p-8">
        <InstitutionApplicationReviewModalContent
          key={application.id}
          application={application}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
};

interface InstitutionApplicationReviewModalContentProps {
  application: InstitutionApplicationItemDTO;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

function InstitutionApplicationReviewModalContent({
  application,
  onClose,
  onSuccess,
}: InstitutionApplicationReviewModalContentProps) {
  const approveMutation = useApproveInstitutionApplication();
  const rejectMutation = useRejectInstitutionApplication();

  const [activeTab, setActiveTab] = useState<"approve" | "reject">("approve");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Suggested code based on name
  const suggestedCode = application.institutionName
    ? application.institutionName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "-")
        .slice(0, 16) + "-2026"
    : "INST-2026";

  // Form states
  const [institutionCode, setInstitutionCode] = useState(suggestedCode);
  const [institutionType, setInstitutionType] = useState(
    application.institutionType || "SCHOOL"
  );
  const [studentCapacity, setStudentCapacity] = useState<number>(
    application.studentCapacity || 500
  );
  const [city, setCity] = useState(application.district || "");
  const [state, setState] = useState(application.state || "");
  const [country, setCountry] = useState(application.country || "India");
  const [approveNotes, setApproveNotes] = useState(
    "Accreditation and registration documents verified."
  );

  // Reject form state
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectNotes, setRejectNotes] = useState("");

  const isPending =
    application.status === "PENDING" || application.status === "UNDER_REVIEW";
  const isApproved = application.status === "APPROVED";
  const isRejected = application.status === "REJECTED";

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const res = await approveMutation.mutateAsync({
        id: application.id,
        dto: {
          institutionCode: institutionCode.trim() || undefined,
          type: institutionType,
          studentCapacity: Number(studentCapacity) || 500,
          city: city.trim() || undefined,
          state: state.trim() || undefined,
          country: country.trim() || "India",
          reviewNotes: approveNotes.trim() || undefined,
        },
      });

      onSuccess?.(
        res.message ||
          "Institution application approved successfully. Institutional portal account & initial cohorts provisioned."
      );
      onClose();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Failed to approve institution application.";
      setErrorMessage(errorMsg);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!rejectionReason.trim()) {
      setErrorMessage("Please enter an official reason for rejection.");
      return;
    }

    try {
      const res = await rejectMutation.mutateAsync({
        id: application.id,
        dto: {
          reason: rejectionReason.trim(),
          reviewNotes: (rejectNotes || rejectionReason).trim(),
        },
      });

      onSuccess?.(res.message || "Institution application rejected.");
      onClose();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Failed to reject institution application.";
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
          <span>Institution Verification & Accreditation Audit</span>
        </div>
        <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-xl font-black text-[#172B2A] dark:text-[#F7FAF9]">
            {application.institutionName}
          </h2>
          <div className="flex items-center gap-2">
            {isPending && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                <Clock className="w-3.5 h-3.5" />
                <span>Pending Verification</span>
              </span>
            )}
            {isApproved && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approved Institution</span>
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
          Submitted on {formatDate(application.createdAt)} • Type:{" "}
          <strong className="text-[#172B2A] dark:text-[#F7FAF9]">
            {application.institutionType}
          </strong>{" "}
          • ID:{" "}
          <span className="font-mono text-[11px]">{application.id.slice(0, 8)}...</span>
        </p>
      </div>

      {/* Submitted Institution Data Details */}
      <div className="mt-5 space-y-4">
        {/* Card 1: Educational & Affiliation Details */}
        <div className="rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 p-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] mb-3 flex items-center gap-1.5">
            <School className="w-3.5 h-3.5 text-[#00BFA5]" />
            <span>Academic & Institutional Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            <div>
              <span className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] block">
                Registration / Trust No.
              </span>
              <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
                {application.registrationNumber || "REG-PENDING"}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] block">
                Affiliation Board
              </span>
              <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
                {application.affiliationBoard || "CBSE / State Board"}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] block">
                Established Year
              </span>
              <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
                {application.establishedYear || "N/A"}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] block">
                Student Capacity
              </span>
              <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
                {application.studentCapacity || 500} Students
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] block">
                Official Website
              </span>
              {application.website ? (
                <a
                  href={
                    application.website.startsWith("http")
                      ? application.website
                      : `https://${application.website}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#008F83] dark:text-[#00BFA5] hover:underline flex items-center gap-1"
                >
                  <span>{application.website}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-[#728B88] dark:text-[#7D9491]">Not provided</span>
              )}
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] block">
                Principal / Dean
              </span>
              <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
                {application.principalName || "Not provided"}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Contact & Location */}
        <div className="rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 p-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] mb-3 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#00BFA5]" />
            <span>Designated Contact & Location</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="flex items-start gap-2.5">
              <User className="w-4 h-4 text-[#00BFA5] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] block">
                  Coordinator / Contact Person
                </span>
                <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
                  {application.contactName}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-[#00BFA5] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] block">
                  Official Email Address
                </span>
                <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
                  {application.officialEmail}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-[#00BFA5] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] block">
                  Phone Number
                </span>
                <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
                  {application.phoneNumber}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#00BFA5] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-[#728B88] dark:text-[#7D9491] block">
                  Location & Address
                </span>
                <span className="font-semibold text-[#172B2A] dark:text-[#F7FAF9]">
                  {[application.address, application.district, application.state, application.country]
                    .filter(Boolean)
                    .join(", ") || "Location details submitted"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Verification Documents */}
        <div className="rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 p-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#00BFA5]" />
            <span>Accreditation Documents & Legal Certificates</span>
          </h3>

          {application.documents && application.documents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {application.documents.map((doc, idx) => (
                <a
                  key={idx}
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 hover:border-[#00BFA5] text-xs font-medium text-[#172B2A] dark:text-[#F7FAF9] transition-all"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-[#00BFA5] shrink-0" />
                    <span className="truncate">{doc.title || `Document ${idx + 1}`}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#728B88] shrink-0" />
                </a>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#728B88] dark:text-[#7D9491] italic">
              Registration certificate & affiliation verification submitted via portal.
            </p>
          )}
        </div>
      </div>

      {/* Review Decision / Audit Logs */}
      {isPending ? (
        <div className="mt-6 border-t border-[#E3ECEA]/70 pt-5 dark:border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#172B2A] dark:text-[#F7FAF9]">
              Administrative Review Decision
            </h3>

            {/* Decision Tabs */}
            <div className="inline-flex rounded-xl bg-[#EBF2F0] p-1 dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("approve");
                  setErrorMessage(null);
                }}
                className={`rounded-lg px-3 py-1 font-bold transition-all cursor-pointer ${
                  activeTab === "approve"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-[#526866] hover:text-[#172B2A] dark:text-[#9FB3B0] dark:hover:text-white"
                }`}
              >
                Approve & Provision
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("reject");
                  setErrorMessage(null);
                }}
                className={`rounded-lg px-3 py-1 font-bold transition-all cursor-pointer ${
                  activeTab === "reject"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "text-[#526866] hover:text-[#172B2A] dark:text-[#9FB3B0] dark:hover:text-white"
                }`}
              >
                Reject Application
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 rounded-xl bg-rose-500/15 border border-rose-500/30 p-3 text-xs font-bold text-rose-800 dark:text-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {activeTab === "approve" ? (
            <form onSubmit={handleApprove} className="space-y-4">
              <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-xs text-emerald-900 dark:text-emerald-200">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Automatic Provisioning Pipeline</span>
                </p>
                <p className="mt-1 text-[11px] opacity-90">
                  Approving will create the institutional account for{" "}
                  <strong>{application.officialEmail}</strong> with the{" "}
                  <strong>INSTITUTION_ADMIN</strong> role, establish the institution record with code{" "}
                  <strong>{institutionCode}</strong>, and provision default student cohorts (Grades 9, 10, 11, 12).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                    Institution Identifier Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={institutionCode}
                    onChange={(e) => setInstitutionCode(e.target.value.toUpperCase())}
                    placeholder="e.g. DPS-DELHI-2026"
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs text-[#172B2A] dark:text-[#F7FAF9] font-mono focus:outline-none focus:border-[#00BFA5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                    Institution Type
                  </label>
                  <select
                    value={institutionType}
                    onChange={(e) => setInstitutionType(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:border-[#00BFA5]"
                  >
                    <option value="SCHOOL">School (K-12)</option>
                    <option value="JUNIOR_COLLEGE">Junior College / 11-12th</option>
                    <option value="COLLEGE">Undergraduate College</option>
                    <option value="UNIVERSITY">University / Higher Ed</option>
                    <option value="COACHING_INSTITUTE">Coaching / Academy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                    Licensed Student Capacity
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={100000}
                    value={studentCapacity}
                    onChange={(e) => setStudentCapacity(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:border-[#00BFA5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                    City / District
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. New Delhi"
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:border-[#00BFA5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                  Audit Notes / Internal Verification Comments
                </label>
                <textarea
                  rows={2}
                  value={approveNotes}
                  onChange={(e) => setApproveNotes(e.target.value)}
                  placeholder="e.g. Registration certificates and CBSE affiliation verified with state board."
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:border-[#00BFA5]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={approveMutation.isPending}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                >
                  {approveMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Provisioning Institution...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Grant Full Portal Access</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleReject} className="space-y-4">
              <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs text-rose-900 dark:text-rose-200">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Rejection Audit Notification</span>
                </p>
                <p className="mt-1 text-[11px] opacity-90">
                  Document the rationale for refusing accreditation or institutional partnership. This will be recorded in the audit history.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                  Primary Rejection Reason *
                </label>
                <input
                  type="text"
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Incomplete accreditation documents or unverified school board affiliation"
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
                  Detailed Audit Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  placeholder="Additional context regarding why this institutional application was declined."
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:bg-[#F4F8F7] dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rejectMutation.isPending}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-black shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                >
                  {rejectMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Rejecting Application...</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      <span>Confirm Rejection</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="mt-6 border-t border-[#E3ECEA]/70 pt-5 dark:border-white/10">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] mb-2">
            Audit Trail & Review History
          </h3>
          <div className="p-4 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#728B88] dark:text-[#7D9491]">Reviewed By:</span>
              <span className="font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                {application.reviewerName || "Super Administrator"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#728B88] dark:text-[#7D9491]">Review Date:</span>
              <span className="font-medium text-[#172B2A] dark:text-[#F7FAF9]">
                {formatDate(application.reviewedAt)}
              </span>
            </div>
            {application.reviewNotes && (
              <div className="pt-2 border-t border-[#E3ECEA]/50 dark:border-white/5 mt-2">
                <span className="text-[#728B88] dark:text-[#7D9491] block mb-0.5">
                  Reviewer Notes:
                </span>
                <p className="font-medium text-[#172B2A] dark:text-[#F7FAF9]">
                  {application.reviewNotes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

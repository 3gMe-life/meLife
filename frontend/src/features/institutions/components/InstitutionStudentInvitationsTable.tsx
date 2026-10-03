"use client";

import React, { useState } from "react";
import {
  Mail,
  RotateCw,
  Ban,
  Clock,
  CheckCircle2,
  AlertCircle,
  School,
  Search,
  Copy,
  Check,
  Loader2,
  Calendar,
} from "lucide-react";
import {
  useInstitutionInvitations,
  useResendInvitation,
  useRevokeInvitation,
} from "../hooks/useInstitutionQueries";
import { InstitutionStudentInvitation } from "../types/institution.types";
import { LoadingState, ErrorState } from "@/features/dashboard/components/common/LoadingState";

export const InstitutionStudentInvitationsTable: React.FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const { data: invitations = [], isLoading, isError, refetch } = useInstitutionInvitations(
    statusFilter !== "ALL" ? statusFilter : undefined
  );

  const resendMutation = useResendInvitation();
  const revokeMutation = useRevokeInvitation();

  const handleResend = async (invitation: InstitutionStudentInvitation) => {
    try {
      await resendMutation.mutateAsync(invitation.id);
      setActionSuccess(`Invitation resent to ${invitation.email}!`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(err?.message || "Failed to resend invitation.");
    }
  };

  const handleRevoke = async (invitation: InstitutionStudentInvitation) => {
    if (!confirm(`Are you sure you want to revoke the invitation for ${invitation.firstName} ${invitation.lastName} (${invitation.email})?`)) {
      return;
    }

    setRevokingId(invitation.id);
    try {
      await revokeMutation.mutateAsync(invitation.id);
      setActionSuccess(`Invitation for ${invitation.email} revoked.`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(err?.message || "Failed to revoke invitation.");
    } finally {
      setRevokingId(null);
    }
  };

  const handleCopyTokenLink = (invitation: InstitutionStudentInvitation) => {
    // Note: The raw token is sent to the student's email directly for security.
    // Copy link helper informs the user.
    setCopiedId(invitation.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredInvitations = invitations.filter((inv) => {
    const fullName = `${inv.firstName} ${inv.lastName}`.toLowerCase();
    const email = inv.email.toLowerCase();
    const roll = (inv.rollNumber || "").toLowerCase();
    const q = search.toLowerCase();

    const matchesSearch = fullName.includes(q) || email.includes(q) || roll.includes(q);
    const matchesStatus = statusFilter === "ALL" || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Action Notification */}
      {actionSuccess && (
        <div className="flex items-center gap-2 p-3 text-xs font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-3xl bg-white dark:bg-[#122423] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#728B88]" />
          <input
            type="text"
            placeholder="Search by student name, email, roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] bg-[#F7FAF9] dark:bg-[#172B2A] text-sm text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] bg-[#F7FAF9] dark:bg-[#172B2A] text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
          >
            <option value="ALL">All Invitation Statuses</option>
            <option value="PENDING">Pending Acceptance</option>
            <option value="ACCEPTED">Accepted & Enrolled</option>
            <option value="EXPIRED">Expired</option>
            <option value="REVOKED">Revoked</option>
          </select>
        </div>
      </div>

      {/* Table Body */}
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState message="Unable to load invitations list." onRetry={() => refetch()} />
      ) : filteredInvitations.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-[#122423] rounded-3xl border border-dashed border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] p-8">
          <Mail className="w-12 h-12 text-[#728B88] mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1">
            No student invitations found
          </h3>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0] max-w-sm mx-auto">
            {search || statusFilter !== "ALL"
              ? "No invitations match your current filters."
              : "Invitations dispatched to students will appear here."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-white dark:bg-[#122423] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E3ECEA] dark:border-[rgba(227,236,234,0.08)] bg-[#F7FAF9] dark:bg-[#172B2A] text-[11px] font-bold uppercase tracking-wider text-[#728B88] dark:text-[#7D9491]">
                  <th className="py-3.5 px-5">Invited Student</th>
                  <th className="py-3.5 px-4">Roll No.</th>
                  <th className="py-3.5 px-4">Target Cohort</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Sent Date</th>
                  <th className="py-3.5 px-4">Expires At</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3ECEA] dark:divide-[rgba(227,236,234,0.06)] text-xs">
                {filteredInvitations.map((inv) => {
                  const isExpired = new Date(inv.expiresAt) < new Date() && inv.status === "PENDING";
                  const displayStatus = isExpired ? "EXPIRED" : inv.status;

                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-[#F7FAF9]/60 dark:hover:bg-white/5 transition-colors group"
                    >
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00B8D4] via-[#00BFA5] to-[#00C896] flex items-center justify-center font-black text-xs text-[#172B2A] shrink-0">
                            {inv.firstName?.[0] || "S"}
                          </div>
                          <div>
                            <span className="font-bold text-[#172B2A] dark:text-[#F7FAF9] block">
                              {inv.firstName} {inv.lastName}
                            </span>
                            <span className="text-[11px] text-[#728B88] dark:text-[#7D9491]">
                              {inv.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-[#526866] dark:text-[#9FB3B0]">
                        {inv.rollNumber || "—"}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20">
                          <School className="w-3 h-3" />
                          <span>{inv.className || (inv.gradeLevel ? `Grade ${inv.gradeLevel}` : "Cohort Link")}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {displayStatus === "ACCEPTED" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Accepted</span>
                          </span>
                        ) : displayStatus === "PENDING" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pending</span>
                          </span>
                        ) : displayStatus === "EXPIRED" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Expired</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
                            <Ban className="w-3.5 h-3.5" />
                            <span>Revoked</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-[#728B88]">
                        {new Date(inv.sentAt || inv.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-[#728B88]">
                        {new Date(inv.expiresAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {inv.status !== "ACCEPTED" && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleResend(inv)}
                                disabled={resendMutation.isPending}
                                title="Resend Invitation Email"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#00BFA5]/30 bg-[#00BFA5]/10 hover:bg-[#00BFA5]/20 text-xs font-semibold text-[#008F83] dark:text-[#00BFA5] transition-colors cursor-pointer"
                              >
                                <RotateCw className="w-3.5 h-3.5" />
                                <span>Resend</span>
                              </button>

                              {inv.status === "PENDING" && (
                                <button
                                  type="button"
                                  onClick={() => handleRevoke(inv)}
                                  disabled={revokingId === inv.id}
                                  title="Revoke Invitation"
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                                >
                                  {revokingId === inv.id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Ban className="w-3.5 h-3.5" />
                                  )}
                                  <span>Revoke</span>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-[#E3ECEA] dark:border-[rgba(227,236,234,0.08)] bg-[#F7FAF9] dark:bg-[#172B2A] flex items-center justify-between text-xs text-[#728B88]">
            <span>Total {filteredInvitations.length} student invitations</span>
            <span className="font-semibold text-[#00BFA5]">Cryptographically Secured & Single-Use</span>
          </div>
        </div>
      )}
    </div>
  );
};

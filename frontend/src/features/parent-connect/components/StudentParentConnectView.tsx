"use client";

import React, { useState } from "react";
import {
  Users,
  ShieldCheck,
  Copy,
  Check,
  Share2,
  Clock,
  RefreshCw,
  Trash2,
  KeyRound,
  Lock,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  useActiveInvitationQuery,
  useLinkedParentsQuery,
} from "../hooks/useParentConnectQueries";
import {
  useCreateInvitationMutation,
  useRevokeInvitationMutation,
  useRevokeLinkMutation,
} from "../hooks/useParentConnectMutations";

export function StudentParentConnectView() {
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    data: activeInvData,
    isLoading: isLoadingActiveInv,
    refetch: refetchActiveInv,
  } = useActiveInvitationQuery();

  const {
    data: linkedParentsData,
    isLoading: isLoadingLinkedParents,
    refetch: refetchLinkedParents,
  } = useLinkedParentsQuery();

  const createMutation = useCreateInvitationMutation();
  const revokeInvMutation = useRevokeInvitationMutation();
  const revokeLinkMutation = useRevokeLinkMutation();

  const activeInvitation = activeInvData?.data;
  const linkedParents = linkedParentsData?.data || [];

  const inviteCode =
    activeInvitation?.inviteCode || (activeInvitation as any)?.invite_code || "";
  const expiresAt =
    activeInvitation?.expiresAt || (activeInvitation as any)?.expires_at || "";
  const isExpired = expiresAt ? new Date(expiresAt).getTime() <= Date.now() : false;
  const hasActiveInvitation = Boolean(
    activeInvitation &&
    inviteCode &&
    (activeInvitation.status === "ACTIVE" || !activeInvitation.status) &&
    !isExpired
  );

  const handleCopyCode = async (code: string) => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleGenerate = async () => {
    setErrorMessage(null);
    try {
      await createMutation.mutateAsync();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to generate invitation code.");
    }
  };

  const handleRevokeInvitation = async (code: string) => {
    if (!code) return;
    if (!confirm("Are you sure you want to revoke this invitation code?")) return;
    try {
      await revokeInvMutation.mutateAsync(code);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to revoke invitation.");
    }
  };

  const handleRevokeLink = async (linkId: string, parentName: string) => {
    if (
      !confirm(
        `Are you sure you want to disconnect ${parentName} from your account? They will lose access to your reports and assessment updates.`
      )
    ) {
      return;
    }
    try {
      await revokeLinkMutation.mutateAsync(linkId);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to disconnect parent.");
    }
  };

  const calculateDaysRemaining = (expiresAtStr?: string | Date) => {
    if (!expiresAtStr) return "Expired";
    const expTime = new Date(expiresAtStr).getTime();
    if (isNaN(expTime)) return "Expires soon";
    const diff = expTime - Date.now();
    if (diff <= 0) return "Expired";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F5B54] via-[#106F63] to-[#0A413C] p-6 sm:p-8 text-white shadow-xl shadow-[#0F5B54]/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-emerald-200 border border-white/15">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              Verified Family Link
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Parent & Guardian Connect
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              Generate a secure 7-day invitation code so your parents or guardians can connect with your account, view your psychometric reports, and support your career exploration journey.
            </p>
          </div>

          <div className="flex shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-200">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Decorative ambient blurs */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-teal-300/15 blur-3xl pointer-events-none" />
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3 text-rose-800 dark:text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid: Invitation Card + Connected Guardians Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Generate / Active Code (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#132826] border border-[#E5ECEB] dark:border-[#1E3B38] shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/60 flex items-center justify-center text-teal-700 dark:text-teal-300">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Invite Parent / Guardian
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Generate a single-use secure code
                  </p>
                </div>
              </div>

              <button
                onClick={() => refetchActiveInv()}
                className="p-2 rounded-xl text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-100 dark:hover:bg-teal-950/40 transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingActiveInv ? "animate-spin" : ""}`} />
              </button>
            </div>

            {isLoadingActiveInv ? (
              <div className="py-12 px-4 text-center space-y-3">
                <RefreshCw className="w-6 h-6 animate-spin text-teal-600 dark:text-teal-400 mx-auto" />
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Loading invitation status...
                </p>
              </div>
            ) : hasActiveInvitation ? (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-gradient-to-b from-[#F2F8F7] to-white dark:from-[#0E201E] dark:to-[#132826] border border-teal-200 dark:border-teal-900/60 shadow-inner">
                  <div className="flex items-center justify-between text-xs font-semibold text-teal-800 dark:text-teal-300 mb-2">
                    <span className="flex items-center gap-1.5 uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Active Invitation Code
                    </span>
                    <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400 font-medium">
                      <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      {calculateDaysRemaining(expiresAt)}
                    </span>
                  </div>

                  {/* Big Monospace Code Display */}
                  <div className="py-4 px-3 flex items-center justify-center">
                    <span className="font-mono text-2xl sm:text-3xl font-extrabold tracking-widest text-[#0F5B54] dark:text-teal-300 select-all">
                      {inviteCode}
                    </span>
                  </div>

                  {/* Actions Row */}
                  <div className="mt-3 pt-3 border-t border-teal-100 dark:border-teal-900/40 flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={() => handleCopyCode(inviteCode)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#0F5B54] hover:bg-[#0A413C] text-white shadow-md shadow-[#0F5B54]/15 transition-all active:scale-95"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          Code Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Invitation Code
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleRevokeInvitation(inviteCode)}
                      disabled={revokeInvMutation.isPending}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {revokeInvMutation.isPending ? "Revoking..." : "Revoke Code"}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200">
                  <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <span>
                    Share this code with your parent or guardian. They can redeem it by visiting{" "}
                    <strong className="underline select-all">/parent/connect</strong> after registering.
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-8 px-4 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/50 mx-auto flex items-center justify-center text-teal-700 dark:text-teal-300">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="max-w-sm mx-auto space-y-1">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    No active invitation code
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Click below to generate a new 7-day secure connection code for your parent.
                  </p>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={createMutation.isPending}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold bg-[#0F5B54] hover:bg-[#0A413C] text-white shadow-lg shadow-[#0F5B54]/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {createMutation.isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Generating Code...
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      Generate Invitation Code
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Privacy & Safety Promise Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#132826] border border-[#E5ECEB] dark:border-[#1E3B38] space-y-3">
            <div className="flex items-center gap-2.5 text-sm font-bold text-gray-900 dark:text-white">
              <Lock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              What can your parents see?
            </div>
            <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Overall psychometric assessment scores & career recommendations</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Generated Psychometric and Stream Selection PDF reports</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Counselling session booking status & guidance milestones</span>
              </li>
              <li className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Your private session notes and account passwords are NEVER visible</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Connected Guardians Roster (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#132826] border border-[#E5ECEB] dark:border-[#1E3B38] shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Linked Guardians
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {linkedParents.length} connected {linkedParents.length === 1 ? "parent" : "parents"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => refetchLinkedParents()}
                className="p-2 rounded-xl text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-emerald-950/40 transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingLinkedParents ? "animate-spin" : ""}`} />
              </button>
            </div>

            {linkedParents.length > 0 ? (
              <div className="space-y-3">
                {linkedParents.map((parent) => (
                  <div
                    key={parent.linkId}
                    className="p-4 rounded-2xl bg-gray-50/80 dark:bg-[#0E201E]/60 border border-gray-200/80 dark:border-[#1E3B38] flex items-center justify-between gap-3 group transition-all"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900 dark:text-white truncate">
                          {parent.firstName} {parent.lastName}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200">
                          {parent.relationshipType}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {parent.email || "Verified account"}
                      </p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500">
                        Connected: {new Date(parent.connectedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        handleRevokeLink(parent.linkId, `${parent.firstName} ${parent.lastName}`)
                      }
                      disabled={revokeLinkMutation.isPending}
                      className="p-2 rounded-xl text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0"
                      title="Disconnect Parent"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 px-4 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-[#0E201E] mx-auto flex items-center justify-center text-gray-400">
                  <Users className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    No parents linked yet
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Generate an invitation code on the left and share it with your guardian.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

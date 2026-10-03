"use client";

import React from "react";
import {
  X,
  Mail,
  Send,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Clock,
  User,
  ShieldCheck,
  Ban,
  Activity,
} from "lucide-react";
import {
  useInstitutionCampaignDetails,
  useRetryFailedCampaign,
} from "../../hooks/useInstitutionQueries";
import { InstitutionStudentCampaign } from "../../types/institution.types";

interface CampaignDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: InstitutionStudentCampaign | null;
}

export const CampaignDetailModal: React.FC<CampaignDetailModalProps> = ({
  isOpen,
  onClose,
  campaign: initialCampaign,
}) => {
  const { data, isLoading } = useInstitutionCampaignDetails(initialCampaign?.id || null);
  const retryMutation = useRetryFailedCampaign();

  if (!isOpen || !initialCampaign) return null;

  const campaign = data?.campaign || initialCampaign;
  const invitations = data?.invitations || [];

  const completedPct =
    campaign.totalCount > 0
      ? Math.round(
          ((campaign.sentCount + campaign.failedCount + campaign.bouncedCount) /
            campaign.totalCount) *
            100
        )
      : 0;

  const handleRetryFailed = async () => {
    try {
      await retryMutation.mutateAsync(campaign.id);
    } catch (err) {
      console.error("Failed to retry campaign:", err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Activity className="w-3.5 h-3.5 animate-spin" /> Processing ({completedPct}%)
          </span>
        );
      case "QUEUED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> Queued
          </span>
        );
      case "PARTIALLY_FAILED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-3.5 h-3.5" /> Partially Failed
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Ban className="w-3.5 h-3.5" /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400">
            {status}
          </span>
        );
    }
  };

  const getDeliveryBadge = (deliveryStatus?: string, invStatus?: string) => {
    if (invStatus === "ACCEPTED") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-3 h-3" /> Accepted
        </span>
      );
    }
    if (deliveryStatus === "DELIVERED") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-teal-500/10 text-teal-400 border border-teal-500/20">
          <CheckCircle2 className="w-3 h-3" /> Delivered
        </span>
      );
    }
    if (deliveryStatus === "SENT") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Send className="w-3 h-3" /> Sent
        </span>
      );
    }
    if (deliveryStatus === "BOUNCED") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <AlertTriangle className="w-3 h-3" /> Bounced
        </span>
      );
    }
    if (deliveryStatus === "FAILED") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <Ban className="w-3 h-3" /> Failed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-400">
        <Clock className="w-3 h-3" /> Queued
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white tracking-tight">{campaign.name}</h2>
                {getStatusBadge(campaign.status)}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Created on {new Date(campaign.createdAt).toLocaleString()} by{" "}
                {campaign.createdByName || "Institution Admin"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress & Metrics Bar */}
        <div className="p-6 bg-slate-950/40 border-b border-slate-800/80 space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">Dispatch Progress</span>
              <span className="text-indigo-400 font-semibold">{completedPct}% Complete</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div
                className="bg-teal-500 transition-all duration-500"
                style={{
                  width: `${(campaign.deliveredCount / (campaign.totalCount || 1)) * 100}%`,
                }}
                title={`Delivered: ${campaign.deliveredCount}`}
              />
              <div
                className="bg-blue-500 transition-all duration-500"
                style={{
                  width: `${
                    ((campaign.sentCount - campaign.deliveredCount) / (campaign.totalCount || 1)) *
                    100
                  }%`,
                }}
                title={`Sent: ${campaign.sentCount}`}
              />
              <div
                className="bg-amber-500 transition-all duration-500"
                style={{
                  width: `${(campaign.bouncedCount / (campaign.totalCount || 1)) * 100}%`,
                }}
                title={`Bounced: ${campaign.bouncedCount}`}
              />
              <div
                className="bg-rose-500 transition-all duration-500"
                style={{
                  width: `${(campaign.failedCount / (campaign.totalCount || 1)) * 100}%`,
                }}
                title={`Failed: ${campaign.failedCount}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 pt-1">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] uppercase tracking-wider text-slate-400">Total</div>
              <div className="text-lg font-bold text-white mt-0.5">{campaign.totalCount}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] uppercase tracking-wider text-amber-400">Queued</div>
              <div className="text-lg font-bold text-amber-400 mt-0.5">{campaign.queuedCount}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] uppercase tracking-wider text-blue-400">Sent</div>
              <div className="text-lg font-bold text-blue-400 mt-0.5">{campaign.sentCount}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] uppercase tracking-wider text-teal-400">Delivered</div>
              <div className="text-lg font-bold text-teal-400 mt-0.5">
                {campaign.deliveredCount}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] uppercase tracking-wider text-rose-400">Failed</div>
              <div className="text-lg font-bold text-rose-400 mt-0.5">{campaign.failedCount}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] uppercase tracking-wider text-orange-400">Bounced</div>
              <div className="text-lg font-bold text-orange-400 mt-0.5">
                {campaign.bouncedCount}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] uppercase tracking-wider text-emerald-400">Accepted</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">
                {campaign.acceptedCount}
              </div>
            </div>
          </div>
        </div>

        {/* Action bar if failures exist */}
        {campaign.failedCount > 0 && (
          <div className="px-6 py-3 bg-rose-500/10 border-b border-rose-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-300 text-sm font-medium">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              {campaign.failedCount} invitations failed delivery. You can re-queue them safely.
            </div>
            <button
              onClick={handleRetryFailed}
              disabled={retryMutation.isPending}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow transition-all disabled:opacity-50"
            >
              <RotateCw
                className={`w-3.5 h-3.5 ${retryMutation.isPending ? "animate-spin" : ""}`}
              />
              {retryMutation.isPending ? "Re-queueing..." : "Retry Failed Deliveries"}
            </button>
          </div>
        )}

        {/* Student Invitations Table */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              Students in Campaign ({invitations.length})
            </h3>
            {isLoading && (
              <span className="text-xs text-indigo-400 flex items-center gap-1">
                <RotateCw className="w-3 h-3 animate-spin" /> Live syncing...
              </span>
            )}
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/30">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">Student</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Cohort / Roll No.</th>
                  <th className="px-4 py-3 font-semibold">Delivery Status</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {invitations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      No invitations recorded for this campaign.
                    </td>
                  </tr>
                ) : (
                  invitations.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-semibold">
                            {inv.firstName?.[0]}
                            {inv.lastName?.[0]}
                          </div>
                          <span className="font-medium text-white">
                            {inv.firstName} {inv.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs font-mono">{inv.email}</td>
                      <td className="px-4 py-3 text-xs">
                        <div>{inv.className || "General Cohort"}</div>
                        {inv.rollNumber && (
                          <div className="text-[11px] text-slate-500">Roll: {inv.rollNumber}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {getDeliveryBadge(inv.deliveryStatus, inv.status)}
                        {inv.failureReason && (
                          <p
                            className="text-[11px] text-rose-400 mt-0.5 truncate max-w-[200px]"
                            title={inv.failureReason}
                          >
                            {inv.failureReason}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

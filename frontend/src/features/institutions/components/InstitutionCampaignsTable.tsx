"use client";

import React, { useState } from "react";
import {
  Mail,
  Send,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Clock,
  Eye,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  useInstitutionCampaigns,
  useRetryFailedCampaign,
} from "../hooks/useInstitutionQueries";
import { InstitutionStudentCampaign } from "../types/institution.types";
import { CampaignDetailModal } from "./modals/CampaignDetailModal";

interface InstitutionCampaignsTableProps {
  onNewCampaignClick?: () => void;
}

export const InstitutionCampaignsTable: React.FC<InstitutionCampaignsTableProps> = ({
  onNewCampaignClick,
}) => {
  const { data: campaigns, isLoading, error } = useInstitutionCampaigns();
  const retryMutation = useRetryFailedCampaign();
  const [selectedCampaign, setSelectedCampaign] = useState<InstitutionStudentCampaign | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleViewDetails = (camp: InstitutionStudentCampaign) => {
    setSelectedCampaign(camp);
    setIsDetailModalOpen(true);
  };

  const handleRetryFailed = async (e: React.MouseEvent, campaignId: string) => {
    e.stopPropagation();
    try {
      await retryMutation.mutateAsync(campaignId);
    } catch (err) {
      console.error("Failed to retry campaign:", err);
    }
  };

  const getStatusBadge = (status: string, completionPct: number) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Activity className="w-3.5 h-3.5 animate-spin" /> Processing ({completionPct}%)
          </span>
        );
      case "QUEUED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> Queued
          </span>
        );
      case "PARTIALLY_FAILED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-3.5 h-3.5" /> Partially Failed
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-3.5 h-3.5" /> Failed
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-900/60 rounded-2xl border border-slate-800">
        <RotateCw className="w-8 h-8 text-indigo-400 animate-spin mb-3" />
        <p className="text-sm text-slate-400 font-medium">Loading invitation campaigns...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-center">
        <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-rose-300">
          Failed to load invitation campaigns. Please try refreshing.
        </p>
      </div>
    );
  }

  const campaignList = campaigns || [];

  return (
    <div className="space-y-4">
      {/* Campaign List Header / Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-indigo-950/30 border border-slate-800 backdrop-blur-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Student Invitation Campaigns</h3>
            <p className="text-xs text-slate-400">
              High-volume background email dispatch with rate-limiting, delivery tracking, and automatic retries.
            </p>
          </div>
        </div>
        {onNewCampaignClick && (
          <button
            onClick={onNewCampaignClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4" />
            New Bulk Invitation
          </button>
        )}
      </div>

      {campaignList.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-900/40 rounded-2xl border border-slate-800 text-center">
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-400 mb-3">
            <Mail className="w-6 h-6" />
          </div>
          <h4 className="text-base font-semibold text-white">No invitation campaigns yet</h4>
          <p className="text-xs text-slate-400 max-w-md mt-1 mb-4">
            Upload an Excel or CSV file in Bulk Import to send hundreds or thousands of student invitations asynchronously.
          </p>
          {onNewCampaignClick && (
            <button
              onClick={onNewCampaignClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all"
            >
              Start Bulk Import
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {campaignList.map((camp) => {
            const completionPct =
              camp.totalCount > 0
                ? Math.round(
                    ((camp.sentCount + camp.failedCount + camp.bouncedCount) / camp.totalCount) *
                      100
                  )
                : 0;

            return (
              <div
                key={camp.id}
                onClick={() => handleViewDetails(camp)}
                className="group relative flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer shadow-lg hover:shadow-indigo-500/5"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-indigo-400 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-colors">
                    <Send className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {camp.name}
                      </span>
                      {getStatusBadge(camp.status, completionPct)}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span>Created {new Date(camp.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>By {camp.createdByName || "Institution Admin"}</span>
                      {camp.className && (
                        <>
                          <span>•</span>
                          <span className="text-indigo-400">{camp.className}</span>
                        </>
                      )}
                    </div>

                    {/* Progress mini bar */}
                    <div className="pt-2 max-w-md space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                        <span>
                          {camp.deliveredCount} Delivered / {camp.sentCount} Sent of{" "}
                          {camp.totalCount} Total
                        </span>
                        <span>{completionPct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                        <div
                          className="bg-teal-500 transition-all duration-300"
                          style={{
                            width: `${(camp.deliveredCount / (camp.totalCount || 1)) * 100}%`,
                          }}
                        />
                        <div
                          className="bg-blue-500 transition-all duration-300"
                          style={{
                            width: `${
                              ((camp.sentCount - camp.deliveredCount) / (camp.totalCount || 1)) *
                              100
                            }%`,
                          }}
                        />
                        <div
                          className="bg-rose-500 transition-all duration-300"
                          style={{
                            width: `${(camp.failedCount / (camp.totalCount || 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right metrics and actions */}
                <div className="flex items-center gap-4 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                  <div className="flex items-center gap-3 text-center">
                    <div className="px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500">
                        Accepted
                      </div>
                      <div className="text-sm font-bold text-emerald-400">
                        {camp.acceptedCount}
                      </div>
                    </div>
                    {camp.failedCount > 0 && (
                      <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                        <div className="text-[10px] uppercase tracking-wider text-rose-400">
                          Failed
                        </div>
                        <div className="text-sm font-bold text-rose-400">{camp.failedCount}</div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {camp.failedCount > 0 && (
                      <button
                        onClick={(e) => handleRetryFailed(e, camp.id)}
                        disabled={retryMutation.isPending}
                        title="Retry Failed Deliveries"
                        className="p-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 transition-all"
                      >
                        <RotateCw
                          className={`w-4 h-4 ${retryMutation.isPending ? "animate-spin" : ""}`}
                        />
                      </button>
                    )}
                    <button
                      onClick={() => handleViewDetails(camp)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Campaign Detail Modal */}
      <CampaignDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedCampaign(null);
        }}
        campaign={selectedCampaign}
      />
    </div>
  );
};

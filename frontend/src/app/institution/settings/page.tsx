"use client";

import React, { useState, useEffect } from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { useInstitutionProfile, useUpdateInstitutionProfile } from "@/features/institutions/hooks/useInstitutionQueries";
import { LoadingState, ErrorState } from "@/features/dashboard/components/common/LoadingState";
import { Settings, Building2, Mail, Phone, MapPin, Save, CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/toast";

export default function InstitutionSettingsPage() {
  const { data: profile, isLoading, isError, refetch } = useInstitutionProfile();
  const updateMutation = useUpdateInstitutionProfile();

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setType(profile.type || "");
      setContactEmail(profile.contactEmail || "");
      setPhone(profile.phone || "");
      setAddress(profile.address || "");
      setCity(profile.city || "");
      setState(profile.state || "");
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(
      {
        name,
        type,
        contactEmail,
        phone,
        address,
        city,
        state,
      },
      {
        onSuccess: () => {
          toast.success("Profile updated", {
            description: "Institutional settings saved successfully.",
          });
        },
        onError: () => {
          toast.error("Failed to update profile");
        },
      }
    );
  };

  return (
    <DashboardShell allowedRoles={["INSTITUTION_ADMIN", "SUPER_ADMIN", "PLATFORM_ADMIN", "COMPANY_ADMIN"]}>
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00BFA5]/20 text-[#00BFA5] border border-[#00BFA5]/30 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
                Institutional Profile & Settings
              </h1>
              <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0]">
                Update institution identity, administrative contact points, and campus locations
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : isError || !profile ? (
          <ErrorState message="Unable to load institutional settings." onRetry={() => refetch()} />
        ) : (
          <div className="max-w-2xl rounded-3xl bg-white dark:bg-[#122423] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-6 sm:p-8 shadow-xs">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#526866] dark:text-[#9FB3B0] mb-1.5">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] bg-[#F7FAF9] dark:bg-[#172B2A] text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#526866] dark:text-[#9FB3B0] mb-1.5">
                    Institution Code
                  </label>
                  <input
                    type="text"
                    value={profile.code}
                    disabled
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] bg-[#EBF2F0] dark:bg-black/30 text-xs font-semibold text-[#728B88] cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#526866] dark:text-[#9FB3B0] mb-1.5">
                    Institution Type
                  </label>
                  <input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] bg-[#F7FAF9] dark:bg-[#172B2A] text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#526866] dark:text-[#9FB3B0] mb-1.5">
                    Official Contact Email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] bg-[#F7FAF9] dark:bg-[#172B2A] text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#526866] dark:text-[#9FB3B0] mb-1.5">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] bg-[#F7FAF9] dark:bg-[#172B2A] text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#526866] dark:text-[#9FB3B0] mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] bg-[#F7FAF9] dark:bg-[#172B2A] text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#526866] dark:text-[#9FB3B0] mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] bg-[#F7FAF9] dark:bg-[#172B2A] text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] focus:outline-hidden focus:ring-2 focus:ring-[#00BFA5]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00BFA5] text-[#0A1A18] font-bold text-xs hover:bg-[#00A892] transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{updateMutation.isPending ? "Saving..." : "Save Settings"}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

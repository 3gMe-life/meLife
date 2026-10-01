"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Eye,
  School,
  CheckCircle2,
  Ban,
  RotateCcw,
  Trash2,
  ExternalLink,
} from "lucide-react";
import type { InstitutionApplicationItemDTO, AdminInstitutionListItemDTO } from "../types/admin.types";

interface AdminInstitutionActionMenuProps {
  application?: InstitutionApplicationItemDTO | null;
  institution?: AdminInstitutionListItemDTO | null;
  onView?: () => void;
  onReview?: () => void;
  onViewDetails?: () => void;
  onToggleStatus?: () => void;
  onDelete?: () => void;
}

export const AdminInstitutionActionMenu: React.FC<AdminInstitutionActionMenuProps> = ({
  application,
  institution,
  onView,
  onReview,
  onViewDetails,
  onToggleStatus,
  onDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const status = application?.status?.toUpperCase() || (institution ? (institution.isActive ? "ACTIVE" : "SUSPENDED") : "PENDING");
  const isPending = status === "PENDING" || status === "UNDER_REVIEW";
  const isApproved = status === "APPROVED" || Boolean(institution);
  const isActive = institution ? institution.isActive : status === "APPROVED";

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Three-dot Trigger Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
          isOpen
            ? "bg-[#00BFA5]/15 border-[#00BFA5]/40 text-[#00BFA5] shadow-xs"
            : "bg-white dark:bg-white/5 border-[#E3ECEA] dark:border-white/10 text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] hover:bg-[#F4F8F7] dark:hover:bg-white/10 hover:border-[#00BFA5]/30"
        }`}
        aria-label="Institution Actions Menu"
        aria-expanded={isOpen}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-52 rounded-2xl bg-white dark:bg-[#112423] border border-[#E3ECEA] dark:border-white/10 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 divide-y divide-[#E3ECEA]/40 dark:divide-white/5 select-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Section 1: Standard & Review Actions */}
          <div className="py-1">
            {onView && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onView();
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] hover:bg-[#F4F8F7] dark:hover:bg-white/5 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#00BFA5] shrink-0" />
                <span>View Application</span>
              </button>
            )}

            {isPending && onReview && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onReview();
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-bold text-[#00897B] dark:text-[#00BFA5] hover:bg-[#00BFA5]/10 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-[#00BFA5] shrink-0" />
                <span>Review & Approve</span>
              </button>
            )}

            {onViewDetails && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onViewDetails();
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] hover:bg-[#F4F8F7] dark:hover:bg-white/5 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <School className="w-4 h-4 text-[#00BFA5] shrink-0" />
                <span>Institution Profile</span>
              </button>
            )}
          </div>

          {/* Section 2: Active / Suspended Management Actions */}
          {isApproved && onToggleStatus && (
            <div className="py-1">
              {isActive ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onToggleStatus();
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Ban className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Suspend Institution</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onToggleStatus();
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Activate Institution</span>
                </button>
              )}
            </div>
          )}

          {/* Section 3: Destructive Actions */}
          {onDelete && (
            <div className="py-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onDelete();
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Delete Application</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

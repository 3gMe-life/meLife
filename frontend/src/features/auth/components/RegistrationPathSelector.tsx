"use client";

import React from "react";
import { GraduationCap, Users, Compass, Building2, Check } from "lucide-react";
import type { RegistrationPath } from "../types/auth.types";
import { cn } from "@/lib/utils";

interface PathOption {
  id: RegistrationPath;
  title: string;
  description: string;
  icon: typeof GraduationCap;
}

const PATHS: PathOption[] = [
  {
    id: "STUDENT",
    title: "Student / Individual",
    description: "Discover your strengths",
    icon: GraduationCap,
  },
  {
    id: "PARENT",
    title: "Parent / Guardian",
    description: "Support your child",
    icon: Users,
  },
  {
    id: "COUNSELLOR",
    title: "Career Counsellor",
    description: "Guide participants",
    icon: Compass,
  },
  {
    id: "INSTITUTION",
    title: "School / Institution",
    description: "Assess learners at scale",
    icon: Building2,
  },
];

interface RegistrationPathSelectorProps {
  selectedPath: RegistrationPath;
  onSelect: (path: RegistrationPath) => void;
}

export function RegistrationPathSelector({
  selectedPath,
  onSelect,
}: RegistrationPathSelectorProps) {
  return (
    <div className="w-full mb-3.5">
      <div className="flex items-center justify-between mb-1.5 px-0.5">
        <label className="text-[11px] font-semibold text-slate-300">
          Registration path:
        </label>
        <span className="text-[10px] text-[#00BFA5] font-medium">
          Personalized Journey
        </span>
      </div>

      {/* Ultra-Compact 2x2 Grid */}
      <div
        className="grid grid-cols-2 gap-1.5"
        role="radiogroup"
        aria-label="Account registration journey"
      >
        {PATHS.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedPath === item.id;

          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(item.id)}
              className={cn(
                "py-2 px-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer flex items-center gap-2 group relative select-none",
                isSelected
                  ? "bg-slate-800/90 border-[#00BFA5] shadow-[0_2px_10px_rgba(0,191,165,0.2)] ring-1 ring-[#00BFA5]/40"
                  : "bg-slate-800/40 border-slate-700/60 hover:border-slate-600 hover:bg-slate-800/70 text-slate-300"
              )}
            >
              {/* Compact Icon */}
              <div
                className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0",
                  isSelected
                    ? "bg-[#00BFA5] text-[#172B2A] shadow-2xs font-bold"
                    : "bg-slate-700/50 text-slate-300 group-hover:text-white"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              {/* Text Area */}
              <div className="min-w-0 flex-1">
                <h3
                  className={cn(
                    "text-[11px] sm:text-xs font-bold tracking-tight leading-none truncate mb-0.5",
                    isSelected ? "text-white" : "text-slate-200"
                  )}
                >
                  {item.title}
                </h3>
                <p className="text-[9.5px] text-slate-400 leading-none truncate">
                  {item.description}
                </p>
              </div>

              {/* Checkmark */}
              {isSelected && (
                <span className="w-3.5 h-3.5 rounded-full bg-[#00BFA5] text-[#172B2A] flex items-center justify-center shrink-0 font-bold">
                  <Check className="w-2 h-2" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

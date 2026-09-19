"use client";

import React from "react";
import Link from "next/link";
import { Printer, RotateCcw, ArrowRight, Compass, ShieldCheck } from "lucide-react";
import { StreamFinderResult } from "../../../types/assessment.types";

interface StreamFinderHeaderProps {
  result: StreamFinderResult;
  onOpenRetakeModal?: () => void;
  onLanguageChange?: (lang: string) => void;
  currentLanguage?: string;
}

export const StreamFinderHeader: React.FC<StreamFinderHeaderProps> = ({
  result,
  onOpenRetakeModal,
  onLanguageChange,
  currentLanguage = "en",
}) => {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0B1B19] border border-[#00BFA5]/30 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden print:hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#00BFA5]/15 blur-3xl" />

      <div className="space-y-1.5 relative z-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase bg-[#00BFA5]/20 text-[#00C896] border border-[#00BFA5]/30 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>ME LIFE • STREAM FINDER</span>
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white/90 border border-white/15">
            Class 9–10 Secondary Exploration
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="w-3 h-3 inline mr-1" />
            Verified Assessment
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
          Academic Stream Alignment Report
        </h1>
        <p className="text-xs text-[#9FB3B0] max-w-xl leading-relaxed">
          An exploratory evaluation of your natural interests, thinking styles, and learning inclinations for Senior Secondary (Class 11–12) academic decision-making.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 shrink-0 relative z-10">
        {onOpenRetakeModal && (
          <button
            type="button"
            onClick={onOpenRetakeModal}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white/80 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            title="Retake evaluation for milestone comparison"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#00BFA5]" />
            <span>Retake</span>
          </button>
        )}

        <button
          type="button"
          onClick={handlePrint}
          className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white/80 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          title="Print or Save PDF"
        >
          <Printer className="w-3.5 h-3.5 text-[#00BFA5]" />
          <span>Print PDF</span>
        </button>

        <Link
          href="/participant/counsellors"
          className="px-4 py-2 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#0B1B19] text-xs font-black transition-all shadow-md shadow-[#00BFA5]/25 flex items-center gap-1.5 cursor-pointer"
        >
          <span>Book Counsellor</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

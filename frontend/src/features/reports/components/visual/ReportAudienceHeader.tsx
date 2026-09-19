"use client";

import React, { useState } from "react";
import { User, Users, Briefcase, Globe, Printer, Download, Share2, Compass, Check, ChevronDown } from "lucide-react";
import { ReportAudienceView } from "../../types/report.types";

interface ReportAudienceHeaderProps {
  currentAudience: ReportAudienceView;
  onAudienceChange: (audience: ReportAudienceView) => void;
  currentLanguage: string;
  onLanguageChange?: (lang: string) => void;
  onDownloadPdf?: () => void;
  isDownloadingPdf?: boolean;
  studentName?: string;
  archetypeTitle?: string;
  navAnchors?: Array<{ id: string; label: string }>;
}

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ml", label: "മലയാളം (Malayalam)" },
  { code: "hi", label: "हिन्दी (Hindi)" },
  { code: "ta", label: "தமிழ் (Tamil)" },
  { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
  { code: "ar", label: "العربية (Arabic)" },
];

export const ReportAudienceHeader: React.FC<ReportAudienceHeaderProps> = ({
  currentAudience,
  onAudienceChange,
  currentLanguage,
  onLanguageChange,
  onDownloadPdf,
  isDownloadingPdf = false,
  studentName = "Student",
  archetypeTitle = "Psychometric Discovery Report",
  navAnchors = [],
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0B1B19]/80 border-b border-[#00BFA5]/20 shadow-lg print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Branding & Student Archetype Badge */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00BFA5] to-[#00B8D4] flex items-center justify-center text-[#0B1B19] font-black shadow-md shadow-[#00BFA5]/20 shrink-0">
            <Compass className="w-4 h-4 text-[#0B1B19]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white tracking-tight">{studentName}</span>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-[#00BFA5]/20 text-[#00C896] border border-[#00BFA5]/30">
                {archetypeTitle}
              </span>
            </div>
            <span className="text-[10px] text-white/50 uppercase font-mono tracking-wider">
              MeLife Psychometric Discovery
            </span>
          </div>
        </div>

        {/* Center: Audience Mode Segmented Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-white/5 border border-white/10 self-start sm:self-center">
          <button
            onClick={() => onAudienceChange("STUDENT")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentAudience === "STUDENT"
                ? "bg-[#00BFA5] text-[#0B1B19] shadow-md shadow-[#00BFA5]/20"
                : "text-white/70 hover:text-white"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Student View</span>
          </button>
          <button
            onClick={() => onAudienceChange("PARENT")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentAudience === "PARENT"
                ? "bg-[#00BFA5] text-[#0B1B19] shadow-md shadow-[#00BFA5]/20"
                : "text-white/70 hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Parent View</span>
          </button>
          <button
            onClick={() => onAudienceChange("COUNSELLOR")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentAudience === "COUNSELLOR"
                ? "bg-[#00BFA5] text-[#0B1B19] shadow-md shadow-[#00BFA5]/20"
                : "text-white/70 hover:text-white"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Counsellor View</span>
          </button>
        </div>

        {/* Right: Actions (Language, Print, PDF) */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Language Selector */}
          {onLanguageChange && (
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-[#00BFA5]" />
                <span className="uppercase font-mono">{currentLanguage}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#0F2624] border border-[#00BFA5]/30 shadow-2xl p-1.5 z-50">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                        currentLanguage === lang.code
                          ? "bg-[#00BFA5]/20 text-[#00C896]"
                          : "text-white/80 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>{lang.label}</span>
                      {currentLanguage === lang.code && <Check className="w-3.5 h-3.5 text-[#00BFA5]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Print Button */}
          <button
            onClick={handlePrint}
            aria-label="Print Report"
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Print Clean Report"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Download PDF Button */}
          {onDownloadPdf && (
            <button
              onClick={onDownloadPdf}
              disabled={isDownloadingPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#0B1B19] text-xs font-black transition-all shadow-md shadow-[#00BFA5]/25 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloadingPdf ? "Generating..." : "Download PDF"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Optional In-Page Quick Navigation Bar */}
      {navAnchors.length > 0 && (
        <div className="border-t border-white/5 bg-black/20 overflow-x-auto no-scrollbar py-1.5 px-4 sm:px-8">
          <div className="flex items-center gap-4 text-[11px] font-bold text-white/60 whitespace-nowrap">
            <span className="text-white/30 uppercase text-[9px] font-mono">Jump to:</span>
            {navAnchors.map((anchor) => (
              <a
                key={anchor.id}
                href={`#${anchor.id}`}
                className="hover:text-[#00BFA5] transition-colors"
              >
                {anchor.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { SupportedLanguage } from "../../types/assessment.types";
import { SUPPORTED_LANGUAGES } from "../../config/assessment-i18n.config";

interface AssessmentLanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange: (languageCode: string) => void;
  supportedLanguages?: SupportedLanguage[];
  disabled?: boolean;
}

export function AssessmentLanguageSwitcher({
  currentLanguage,
  onLanguageChange,
  supportedLanguages = SUPPORTED_LANGUAGES,
  disabled = false,
}: AssessmentLanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLang =
    supportedLanguages.find((l) => l.code === currentLanguage) ||
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) ||
    SUPPORTED_LANGUAGES[0];

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
          isOpen
            ? "bg-[#00BFA5]/15 border-[#00BFA5] text-[#008F83] dark:text-[#00BFA5] ring-2 ring-[#00BFA5]/20"
            : "bg-[#EBF2F0] hover:bg-[#E3ECEA] dark:bg-white/5 dark:hover:bg-white/10 border-[#E3ECEA] dark:border-white/10 text-[#172B2A] dark:text-[#F7FAF9]"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-[#00BFA5] shrink-0" />
        <span className="font-bold">{activeLang.nativeName}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#728B88] dark:text-[#7D9491] transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#00BFA5]" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 shadow-xl shadow-black/10 py-1.5 z-50 focus:outline-none animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 border-b border-[#E3ECEA] dark:border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#728B88] dark:text-[#7D9491]">
              Assessment Language
            </span>
          </div>
          <div className="p-1 space-y-0.5">
            {supportedLanguages.map((lang) => {
              const isSelected = lang.code === currentLanguage;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                    isSelected
                      ? "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] font-bold"
                      : "text-[#172B2A] dark:text-[#F7FAF9] hover:bg-[#EBF2F0] dark:hover:bg-white/5 font-medium"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-bold">{lang.nativeName}</span>
                    <span className="text-[10px] text-[#728B88] dark:text-[#7D9491]">
                      {lang.name}
                    </span>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-[#00BFA5] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

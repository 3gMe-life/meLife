"use client";

import React, { useSyncExternalStore, useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop, ChevronDown } from "lucide-react";

const emptySubscribe = () => () => {};
const useMounted = () => {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
};

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isMounted = useMounted();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hydration safety: render non-interactive placeholder before mount
  if (!isMounted) {
    return (
      <div
        className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  const handleQuickToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 select-none group"
        aria-label={`Current theme: ${theme}. Click to change theme.`}
        aria-expanded={isOpen}
      >
        <span onClick={handleQuickToggle} className="p-0.5">
          {isDark ? (
            <Moon className="w-4 h-4 text-[#60A5FA] group-hover:scale-110 transition-transform" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          )}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Theme Selector Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-white/15 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-800 dark:text-white">
          <button
            type="button"
            onClick={() => {
              setTheme("light");
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              theme === "light"
                ? "bg-[#2563EB]/10 text-[#2563EB] dark:bg-[#2563EB]/20 dark:text-[#60A5FA]"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Light</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTheme("dark");
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              theme === "dark"
                ? "bg-[#2563EB]/10 text-[#2563EB] dark:bg-[#2563EB]/20 dark:text-[#60A5FA]"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
            }`}
          >
            <Moon className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
            <span>Dark</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTheme("system");
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              theme === "system"
                ? "bg-[#2563EB]/10 text-[#2563EB] dark:bg-[#2563EB]/20 dark:text-[#60A5FA]"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
            }`}
          >
            <Laptop className="w-4 h-4 text-[#14B8A6]" />
            <span>System</span>
          </button>
        </div>
      )}
    </div>
  );
}

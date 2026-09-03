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
        className="w-9 h-9 rounded-2xl bg-[#EBF2F0] dark:bg-white/5 border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)]"
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
        className="flex items-center gap-1.5 p-2 rounded-2xl bg-[#EBF2F0] hover:bg-[#E3ECEA] dark:bg-white/5 dark:hover:bg-white/10 border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)] text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00BFA5]/40 select-none group"
        aria-label={`Current theme: ${theme}. Click to change theme.`}
        aria-expanded={isOpen}
      >
        <span onClick={handleQuickToggle} className="p-0.5">
          {isDark ? (
            <Moon className="w-4 h-4 text-[#00BFA5] group-hover:scale-110 transition-transform" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          )}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-[#728B88] group-hover:text-[#172B2A] dark:group-hover:text-[#F7FAF9] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Theme Selector Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white dark:bg-[#172B2A] backdrop-blur-2xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-[#172B2A] dark:text-[#F7FAF9]">
          <button
            type="button"
            onClick={() => {
              setTheme("light");
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              theme === "light"
                ? "bg-[#00BFA5]/15 text-[#008F83] dark:bg-[#00BFA5]/20 dark:text-[#00BFA5]"
                : "text-[#526866] dark:text-[#9FB3B0] hover:bg-[#EBF2F0] dark:hover:bg-white/10"
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
                ? "bg-[#00BFA5]/15 text-[#008F83] dark:bg-[#00BFA5]/20 dark:text-[#00BFA5]"
                : "text-[#526866] dark:text-[#9FB3B0] hover:bg-[#EBF2F0] dark:hover:bg-white/10"
            }`}
          >
            <Moon className="w-4 h-4 text-[#00BFA5]" />
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
                ? "bg-[#00BFA5]/15 text-[#008F83] dark:bg-[#00BFA5]/20 dark:text-[#00BFA5]"
                : "text-[#526866] dark:text-[#9FB3B0] hover:bg-[#EBF2F0] dark:hover:bg-white/10"
            }`}
          >
            <Laptop className="w-4 h-4 text-[#00B8D4]" />
            <span>System</span>
          </button>
        </div>
      )}
    </div>
  );
}

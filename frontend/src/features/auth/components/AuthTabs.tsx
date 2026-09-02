"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface AuthTabsProps {
  activeTab: "login" | "register";
  onChange?: (tab: "login" | "register") => void;
}

export function AuthTabs({ activeTab, onChange }: AuthTabsProps) {
  const router = useRouter();

  const handleTabClick = (tab: "login" | "register") => {
    if (onChange) {
      onChange(tab);
    } else {
      router.push(tab === "login" ? "/login" : "/register");
    }
  };

  return (
    <div
      className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-slate-800/80 border border-slate-700/70 mb-5"
      role="tablist"
      aria-label="Authentication Options"
    >
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === "login"}
        onClick={() => handleTabClick("login")}
        className={cn(
          "py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 select-none",
          activeTab === "login"
            ? "bg-slate-700/90 text-white shadow-xs border border-white/10"
            : "text-slate-400 hover:text-white hover:bg-slate-700/40"
        )}
      >
        Sign In
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={activeTab === "register"}
        onClick={() => handleTabClick("register")}
        className={cn(
          "py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 select-none",
          activeTab === "register"
            ? "bg-slate-700/90 text-white shadow-xs border border-white/10"
            : "text-slate-400 hover:text-white hover:bg-slate-700/40"
        )}
      >
        Create Account
      </button>
    </div>
  );
}

import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#172B2A] text-white select-none">
      {/* Ambient Lighting */}
      <div className="absolute w-80 h-80 rounded-full bg-[#00BFA5]/15 blur-3xl pointer-events-none" />
      <div className="absolute w-60 h-60 rounded-full bg-[#00B8D4]/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-xs text-center px-6">
        {/* Orbital Emblem */}
        <div className="relative w-24 h-24 flex items-center justify-center mb-6">
          {/* Rotating Ring */}
          <div
            className="absolute inset-0 rounded-full border border-slate-700/60 border-t-[#00B8D4] border-r-[#00BFA5] animate-spin"
            style={{ animationDuration: "2s" }}
          />

          {/* Glowing Orbit Nodes */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_8px_#00B8D4] border border-[#00B8D4]" />
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_8px_#00BFA5] border border-[#00BFA5]" />

          {/* Logo Card */}
          <div className="relative w-14 h-14 rounded-2xl p-0.5 bg-gradient-to-tr from-[#00B8D4] via-[#00BFA5] to-[#00C896] shadow-md flex items-center justify-center">
            <div className="w-full h-full rounded-xl bg-white flex items-center justify-center p-1 overflow-hidden">
              <Image
                src="/melifelogo.png"
                alt="3G ME LIFE"
                width={52}
                height={52}
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        </div>

        <h3 className="text-base font-bold text-white tracking-tight mb-1">
          3G ME LIFE
        </h3>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#00BFA5] uppercase tracking-wider mb-5">
          <Sparkles className="w-3 h-3 text-[#00BFA5] animate-pulse" />
          <span>Calibrating Psychometric Space...</span>
        </div>

        {/* Minimal Progress Line */}
        <div className="w-40 h-1 rounded-full bg-slate-800 overflow-hidden relative border border-slate-700/50 shadow-inner">
          <div className="h-full rounded-full bg-gradient-to-r from-[#00B8D4] via-[#00BFA5] to-[#00C896] w-1/2 animate-[shimmerSweep_1.5s_infinite_linear]" />
        </div>
      </div>
    </div>
  );
}

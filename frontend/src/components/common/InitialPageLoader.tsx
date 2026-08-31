"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, BrainCircuit, ShieldCheck, Compass } from "lucide-react";

const CALIBRATION_STEPS = [
  { label: "Calibrating Cognitive Aptitude...", icon: BrainCircuit, color: "#2563EB" },
  { label: "Synthesizing Curiosity & Interests...", icon: Sparkles, color: "#14B8A6" },
  { label: "Mapping Execution Strengths...", icon: ShieldCheck, color: "#22C55E" },
  { label: "Aligning Career Directions...", icon: Compass, color: "#3B82F6" },
];

export function InitialPageLoader() {
  const [progress, setProgress] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1100; // 1.1s smooth calibration experience

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.floor((elapsed / duration) * 100), 100);
      setProgress(pct);

      // Cycle status step based on progress
      const stepIdx = Math.min(
        Math.floor((pct / 100) * CALIBRATION_STEPS.length),
        CALIBRATION_STEPS.length - 1
      );
      setCurrentStepIdx(stepIdx);

      if (elapsed >= duration) {
        clearInterval(interval);
        setTimeout(() => setIsDone(true), 200);
        setTimeout(() => setShouldRender(false), 900);
      }
    }, 16);

    return () => clearInterval(interval);
  }, []);

  if (!shouldRender) return null;

  const ActiveIcon = CALIBRATION_STEPS[currentStepIdx].icon;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0F172A] transition-all duration-700 ease-out select-none overflow-hidden ${
        isDone ? "opacity-0 scale-105 pointer-events-none blur-sm" : "opacity-100 scale-100"
      }`}
      aria-hidden={isDone}
    >
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute w-96 h-96 rounded-full bg-[#2563EB]/15 blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute w-80 h-80 rounded-full bg-[#14B8A6]/12 blur-3xl pointer-events-none -top-10 -right-10" />
      <div className="absolute w-72 h-72 rounded-full bg-[#22C55E]/10 blur-3xl pointer-events-none -bottom-10 -left-10" />

      {/* Subtle Background Polar Grid Lines */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[320px] h-[320px] rounded-full border border-blue-400/20 animate-spin" style={{ animationDuration: "20s" }} />
        <div className="w-[440px] h-[440px] rounded-full border border-teal-400/15 animate-spin" style={{ animationDuration: "35s", animationDirection: "reverse" }} />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm text-center px-6">
        {/* Central Cognitive Orbit System */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-8">
          {/* Rotating Outer Radar Sweep Ring */}
          <div
            className="absolute inset-0 rounded-full border border-slate-700/60 border-t-[#2563EB] border-r-[#14B8A6] animate-spin"
            style={{ animationDuration: "3s" }}
          />

          {/* Glowing 4-Dimension Satellite Nodes */}
          {/* Top Node - Aptitude */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_12px_#2563EB] border-2 border-[#2563EB] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
          </div>
          {/* Right Node - Interests */}
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_12px_#14B8A6] border-2 border-[#14B8A6] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]" />
          </div>
          {/* Bottom Node - Strengths */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_12px_#22C55E] border-2 border-[#22C55E] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
          </div>
          {/* Left Node - Direction */}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_12px_#3B82F6] border-2 border-[#3B82F6] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
          </div>

          {/* Center Glass Logo Card */}
          <div className="relative w-20 h-20 rounded-2xl p-1 bg-gradient-to-tr from-[#2563EB] via-[#3B82F6] to-[#14B8A6] shadow-[0_12px_36px_rgba(37,99,235,0.4)] flex items-center justify-center">
            <div className="w-full h-full rounded-xl bg-white flex items-center justify-center p-1.5 overflow-hidden">
              <Image
                src="/melifelogo.png"
                alt="3G ME LIFE"
                width={72}
                height={72}
                priority
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Brand Title */}
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-none mb-1">
          3G ME LIFE
        </h1>
        <span className="text-[10px] font-bold text-[#14B8A6] uppercase tracking-widest mb-6">
          Psychometric Diagnostic Engine
        </span>

        {/* Dynamic Calibrating Step Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-slate-700/80 mb-5 min-h-[34px] transition-all duration-300">
          <ActiveIcon
            className="w-3.5 h-3.5 animate-pulse"
            style={{ color: CALIBRATION_STEPS[currentStepIdx].color }}
          />
          <span className="text-xs font-medium text-slate-300 transition-all duration-200">
            {CALIBRATION_STEPS[currentStepIdx].label}
          </span>
        </div>

        {/* Multi-tier Neon Progress Bar */}
        <div className="w-56 h-1.5 rounded-full bg-slate-800/90 overflow-hidden relative border border-slate-700/60 mb-3 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#2563EB] via-[#14B8A6] to-[#22C55E] transition-all duration-150 ease-out shadow-[0_0_10px_#14B8A6]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Calibration Stats */}
        <div className="flex items-center justify-between w-56 text-[10px] font-semibold text-slate-400">
          <span>8-DIMENSION SYNTHESIS</span>
          <span className="font-mono text-teal-300">{progress}%</span>
        </div>
      </div>
    </div>
  );
}

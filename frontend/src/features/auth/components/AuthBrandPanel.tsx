import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, BrainCircuit, ShieldCheck, Compass, ArrowLeft } from "lucide-react";

export function AuthBrandPanel() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between p-10 xl:p-14 bg-[#0F172A] text-white overflow-hidden select-none">
      {/* Dynamic Ambient Background Illumination */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-[#2563EB]/20 blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#14B8A6]/15 blur-3xl pointer-events-none" />

      {/* Decorative Network Grid & Connecting Lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="20%" y1="35%" x2="50%" y2="50%" stroke="#2563EB" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="50%" y1="50%" x2="80%" y2="40%" stroke="#14B8A6" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="50%" y1="50%" x2="35%" y2="75%" stroke="#3B82F6" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="50%" y1="50%" x2="70%" y2="70%" stroke="#22C55E" strokeWidth="1" strokeDasharray="4 4" />
      </svg>

      {/* Top Header: Brand Identity & Back to Home Link */}
      <div className="relative z-10 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 rounded-xl"
        >
          <div className="relative w-9 h-9 rounded-xl p-0.5 bg-gradient-to-tr from-[#2563EB] via-[#3B82F6] to-[#14B8A6] shadow-md flex items-center justify-center overflow-hidden transition-transform duration-200 group-hover:scale-105">
            <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center p-0.5 overflow-hidden">
              <Image
                src="/melifelogo.png"
                alt="3G ME LIFE"
                width={36}
                height={36}
                priority
                className="object-contain w-full h-full"
              />
            </div>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-extrabold tracking-tight text-white leading-none">
              3G ME LIFE
            </span>
            <span className="text-[10px] font-semibold text-[#14B8A6] tracking-wider uppercase mt-0.5">
              Psychometrics
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Central Visual: "Pathways of Potential" Abstract Node Ecosystem */}
      <div className="relative z-10 my-auto py-8">
        <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center mb-8">
          {/* Orbital Radar Rings */}
          <div className="absolute inset-4 rounded-full border border-blue-400/20 animate-spin" style={{ animationDuration: "25s" }} />
          <div className="absolute inset-16 rounded-full border border-teal-400/15 animate-spin" style={{ animationDuration: "35s", animationDirection: "reverse" }} />

          {/* Central Logo Emblem */}
          <div className="relative z-20 w-24 h-24 rounded-3xl p-1 bg-gradient-to-tr from-[#2563EB] to-[#14B8A6] shadow-[0_12px_40px_rgba(37,99,235,0.4)] flex items-center justify-center">
            <div className="w-full h-full rounded-[22px] bg-white flex items-center justify-center p-2">
              <Image
                src="/melifelogo.png"
                alt="3G ME LIFE Emblem"
                width={80}
                height={80}
                priority
                className="object-contain w-full h-full"
              />
            </div>
          </div>

          {/* Floating Dimension Nodes with Organic Motion */}
          {/* Node 1: Cognitive Aptitude */}
          <div className="absolute top-4 left-6 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-md flex items-center gap-2 text-xs font-semibold text-white animate-float-slow">
            <BrainCircuit className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Aptitude</span>
          </div>

          {/* Node 2: Curiosity & Interests */}
          <div className="absolute top-8 right-4 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-md flex items-center gap-2 text-xs font-semibold text-white animate-float-delayed">
            <Sparkles className="w-3.5 h-3.5 text-[#14B8A6]" />
            <span>Interests</span>
          </div>

          {/* Node 3: Execution Strengths */}
          <div className="absolute bottom-8 left-8 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-md flex items-center gap-2 text-xs font-semibold text-white animate-float-delayed">
            <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>Strengths</span>
          </div>

          {/* Node 4: Career Direction */}
          <div className="absolute bottom-6 right-8 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-md flex items-center gap-2 text-xs font-semibold text-white animate-float-slow">
            <Compass className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Direction</span>
          </div>
        </div>

        {/* Narrative Heading & Subtitle */}
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-white mb-3 leading-tight">
            Understand your strengths. <br />
            <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Shape what comes next.
            </span>
          </h2>
          <p className="text-xs xl:text-sm text-slate-300 leading-relaxed font-normal">
            Discover clarity across educational and career transitions through evidence-informed psychometric insights.
          </p>
        </div>
      </div>

      {/* Bottom Footer Indicators */}
      <div className="relative z-10 pt-6 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#14B8A6]" />
          <span>Evidence-Informed Psychometrics</span>
        </div>
        <span>Confidential & Secure</span>
      </div>
    </div>
  );
}

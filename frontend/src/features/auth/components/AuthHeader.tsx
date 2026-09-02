import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export function AuthHeader() {
  return (
    <div className="text-center mb-6">
      {/* Brand Logo & Name */}
      <Link
        href="/"
        className="inline-flex items-center justify-center gap-2.5 mb-2 group focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 rounded-2xl"
      >
        <div className="w-9 h-9 rounded-xl p-0.5 bg-gradient-to-tr from-[#2563EB] via-[#14B8A6] to-[#10B981] flex items-center justify-center shadow-[0_2px_12px_rgba(20,184,166,0.3)] group-hover:scale-105 transition-transform">
          <div className="w-full h-full rounded-[9px] bg-white flex items-center justify-center p-1">
            <Image
              src="/melifelogo.png"
              alt="3G ME LIFE"
              width={28}
              height={28}
              priority
              className="object-contain w-full h-full"
            />
          </div>
        </div>
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-[#14B8A6] transition-colors">
              3G ME LIFE
            </span>
          </div>
          <span className="text-[9px] font-bold tracking-widest text-[#14B8A6] uppercase block -mt-0.5">
            Psychometrics
          </span>
        </div>
      </Link>

      {/* Subtitle */}
      <p className="text-xs text-slate-300 font-medium flex items-center justify-center gap-1.5">
        <Sparkles className="w-3 h-3 text-[#14B8A6] animate-pulse" />
        <span>Discover strengths. Shape possibilities.</span>
      </p>
    </div>
  );
}

import React from "react";
import Image from "next/image";

export function AuthBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0 bg-[#070D1E]"
      aria-hidden="true"
    >
      {/* 1. High-Definition MeLife "Pathways of Potential" Artwork (/registerpage.png) */}
      <Image
        src="/registerpage.png"
        alt="3G MeLife Psychometric Assessment & Career Pathways"
        fill
        priority
        quality={100}
        sizes="100vw"
        className="object-cover object-center scale-[1.01]"
      />

      {/* 2. Soft Dynamic Ambient Color Highlights */}
      <div className="absolute -top-[15%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#2563EB]/20 via-[#14B8A6]/10 to-transparent blur-[120px] animate-pulse-glow" />
      <div className="absolute -bottom-[15%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-[#14B8A6]/20 via-[#2563EB]/10 to-transparent blur-[130px] animate-pulse-glow [animation-delay:-3s]" />

      {/* 3. Controlled Vignette Overlay (Ensures both artwork visibility & 100% card readability) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070D1E]/40 via-transparent to-[#070D1E]/60" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#070D1E]/20 to-[#070D1E]/70" />
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthBackground } from "./AuthBackground";

export interface AuthShellProps {
  children: React.ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden select-none bg-[#070D1E]">
      {/* 1. Original 3G MeLife Ambient Background (/registerpage.png) in z-0 */}
      <AuthBackground />

      {/* 2. Top Navigation Bar in z-10 */}
      <header className="relative z-10 w-full max-w-7xl mx-auto p-4 sm:p-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white bg-slate-950/60 hover:bg-slate-900/80 border border-white/20 backdrop-blur-md transition-all duration-200 hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#00BFA5]/50"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#00BFA5]" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* 3. Centered Floating Auth Card in z-10 */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-3 sm:p-6 py-6 sm:py-10">
        {children}
      </main>

      {/* 4. Sub-footer Trust Line in z-10 */}
      <footer className="relative z-10 w-full py-4 px-6 text-center text-xs text-white/60">
        <p>© {new Date().getFullYear()} 3G ME LIFE. Psychometric Assessment & Career Guidance Platform.</p>
      </footer>
    </div>
  );
}

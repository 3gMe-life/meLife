"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Compass,
  BookOpen,
  Building2,
  Phone,
  Layers,
  HelpCircle,
  LogIn,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { NAV_LINKS, type NavItem } from "@/data/landing";
import { cn } from "@/lib/utils";

const navIcons: Record<string, React.ReactNode> = {
  Home: <Sparkles className="w-4 h-4 text-[#00BFA5]" />,
  About: <HelpCircle className="w-4 h-4 text-[#00BFA5]" />,
  Assessments: <BookOpen className="w-4 h-4 text-[#00BFA5]" />,
  "How It Works": <Compass className="w-4 h-4 text-[#00BFA5]" />,
  Dimensions: <Layers className="w-4 h-4 text-[#00BFA5]" />,
  "For Institutions": <Building2 className="w-4 h-4 text-[#00BFA5]" />,
  Contact: <Phone className="w-4 h-4 text-[#00BFA5]" />,
};

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("#hero");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Section tracking for active pill indicator
      const sections = NAV_LINKS.map((link) => link.href.replace("#", "")).filter(Boolean);
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(`#${section}`);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 pt-3 sm:pt-4 px-3 sm:px-6 lg:px-8 transition-all duration-300 pointer-events-none">
      <Container size="default" className="pointer-events-auto max-w-6xl mx-auto">
        {/* Desktop & Mobile Dynamic Liquid Glass Island */}
        <div
          className={cn(
            "flex items-center justify-between px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-300",
            isScrolled ? "liquid-glass-dock-scrolled" : "liquid-glass-dock"
          )}
        >
          {/* Left: Brand Logo Capsule */}
          <Link
            href="/"
            className="flex items-center gap-2.5 pr-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFA5] rounded-full group select-none"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full p-0.5 bg-gradient-to-tr from-[#00B8D4] via-[#00BFA5] to-[#00C896] shadow-[0_2px_10px_rgba(0,191,165,0.25)] flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <Image
                  src="/melifelogo.png"
                  alt="3G ME LIFE"
                  width={36}
                  height={36}
                  priority
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs sm:text-sm font-extrabold tracking-tight text-[#172B2A] leading-none group-hover:text-[#008F83] transition-colors">
                3G ME LIFE
              </span>
              <span className="text-[9px] font-semibold text-[#008F83] tracking-wider uppercase mt-0.5">
                Psychometrics
              </span>
            </div>
          </Link>

          {/* Center: Desktop Fluid Glass Navigation Pills */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-1 bg-black/[0.03] p-1 rounded-full border border-white/60 shadow-inner"
          >
            {NAV_LINKS.map((link: NavItem) => {
              const isActive = activeSection === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all duration-200",
                    isActive
                      ? "bg-white text-[#008F83] shadow-[0_2px_8px_rgba(0,191,165,0.2)] border border-[#00BFA5]/30 font-bold"
                      : "text-[#526866] hover:text-[#172B2A] hover:bg-white/60"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Desktop Action Pod */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/login"
              className="text-xs font-semibold text-[#172B2A] hover:text-[#008F83] px-3.5 py-1.5 rounded-full border border-[#E3ECEA] bg-white/70 hover:bg-white shadow-2xs transition-all duration-200 flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-[#008F83]" />
              <span>Sign In</span>
            </Link>
            <Link
              href="#assessments"
              className="liquid-pill-btn text-[#172B2A] font-bold text-xs px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 group select-none btn-shimmer shadow-md"
            >
              <span>Explore Assessments</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile Right: Phone Dynamic Capsule Toggle */}
          <div className="lg:hidden flex items-center gap-1.5">
            <Link
              href="/login"
              className="text-[11px] font-semibold text-[#008F83] px-3 py-1 rounded-full bg-white/80 border border-[#E3ECEA] shadow-2xs"
            >
              Sign In
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-full bg-white/80 hover:bg-white text-[#172B2A] border border-[#E3ECEA] shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#00BFA5]"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#172B2A]" />
              ) : (
                <Menu className="w-5 h-5 text-[#172B2A]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Phone Liquid Glass Action Sheet / Island Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 p-4 sm:p-5 liquid-glass-sheet rounded-[28px] animate-in fade-in slide-in-from-top-3 duration-200">
            {/* Top Sheet Header Pill */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E3ECEA]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00BFA5] animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#008F83]">
                  MeLife Navigation Island
                </span>
              </div>
              <span className="text-[10px] text-[#526866] bg-white/90 px-2 py-0.5 rounded-full border border-[#E3ECEA]">
                v1.0
              </span>
            </div>

            {/* Mobile Nav Links Grid */}
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2" aria-label="Mobile Navigation">
              {NAV_LINKS.map((link: NavItem) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 p-2.5 rounded-2xl border transition-all text-xs font-semibold",
                    activeSection === link.href
                      ? "bg-[#EBF2F0] border-[#00BFA5]/30 text-[#008F83] shadow-2xs"
                      : "bg-white/70 hover:bg-white border-[#E3ECEA] text-[#172B2A]"
                  )}
                >
                  <div className="w-7 h-7 rounded-xl bg-white border border-[#00BFA5]/20 flex items-center justify-center shrink-0 shadow-2xs">
                    {navIcons[link.label] || <Sparkles className="w-3.5 h-3.5 text-[#00BFA5]" />}
                  </div>
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>

            {/* Bottom Actions Capsule */}
            <div className="mt-4 pt-3 border-t border-[#E3ECEA] flex flex-col gap-2">
              <Link
                href="#assessments"
                onClick={() => setMobileMenuOpen(false)}
                className="liquid-pill-btn text-[#172B2A] font-bold text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md btn-shimmer"
              >
                <span>Explore Assessments</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-[#526866]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00BFA5]" />
                <span>Evidence-informed psychometric platform</span>
              </div>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}

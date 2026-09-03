import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/ui/Logo";
import { FOOTER_DATA } from "@/data/landing";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#172B2A] text-white pt-16 pb-12 border-t border-[#0D1C1B]">
      <Container size="default">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Brand Info & Mission (Col 1 & 2) */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <div className="bg-white p-2.5 rounded-2xl mb-5 shadow-2xs">
              <Logo size="sm" showText={true} />
            </div>

            <p className="text-xs sm:text-sm text-[#9FB3B0] leading-relaxed max-w-sm mb-6">
              3G MeLife is an objective, multi-dimensional psychometric assessment and career-guidance platform empowering students to discover their authentic strengths and navigate educational choices.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#00BFA5]">
              <ShieldCheck className="w-4 h-4 text-[#00BFA5]" />
              <span>Evidence-Informed Guidance Framework</span>
            </div>
          </div>

          {/* Navigation Columns */}
          {FOOTER_DATA.columns.map((col) => (
            <div key={col.title} className="flex flex-col">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#00BFA5] mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-[#9FB3B0] hover:text-[#00BFA5] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9FB3B0]">
          <p>© {currentYear} 3G ME LIFE. All rights reserved.</p>
          <p className="text-[#9FB3B0]">
            Psychometric Assessment & Career Guidance Platform
          </p>
        </div>
      </Container>
    </footer>
  );
}

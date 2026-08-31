import React from "react";
import {
  Building2,
  Users,
  Award,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/common/Reveal";

export function InstitutionsSection() {
  return (
    <section id="institutions" className="py-20 sm:py-28 bg-white relative">
      <Container size="default">
        <Reveal animation="fade-up">
          <SectionHeading
            badge="Institutional & B2B Solutions"
            badgeVariant="blue"
            title="Built for Individual Guidance and Institutional Scale"
            subtitle="Whether guiding one student or managing assessments across multiple school campuses, MeLife provides the infrastructure you need."
          />
        </Reveal>

        {/* Dual Split: For Counsellors vs For Schools & Universities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left: For Private & School Counsellors */}
          <Reveal animation="fade-right" delay={100}>
            <div className="flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-[#F8FAFC] border border-slate-200/90 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.05)] interactive-card h-full">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] shadow-xs">
                    <Users className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] block">
                      For Guidance Counsellors
                    </span>
                    <h3 className="text-xl font-bold text-[#0F172A]">
                      Evidence-Based Guidance Toolkit
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6">
                  Equip your career guidance practice with standardized psychometric insights that transform intuition into structured, defensible advice.
                </p>

                <ul className="space-y-3 text-xs sm:text-sm text-[#64748B]">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#14B8A6] shrink-0 mt-0.5" />
                    <span>Structured student dossier with longitudinal dimension tracking.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#14B8A6] shrink-0 mt-0.5" />
                    <span>Evidence-informed discussion frameworks for parental consultations.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#14B8A6] shrink-0 mt-0.5" />
                    <span>Confidential session notes and milestone progress management.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#14B8A6] shrink-0 mt-0.5" />
                    <span>Exportable, white-labeled PDF summary sheets for families.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#2563EB]">
                  Individual & Group Practice Ready
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  href="/counsellor/dashboard"
                  className="bg-white hover:bg-[#F1F5F9]"
                >
                  <span>Counsellor Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </Reveal>

          {/* Right: For Schools, Colleges & Educational Groups */}
          <Reveal animation="fade-left" delay={200}>
            <div className="flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-[#0F172A] text-white border border-slate-800 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.3)] interactive-card h-full">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-xs">
                    <Building2 className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#14B8A6] block">
                      For Schools & Higher Ed
                    </span>
                    <h3 className="text-xl font-bold text-white">
                      Scalable Institutional Platform
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  Deploy cohort-level psychometric assessments across entire grades with centralized administration, voucher management, and analytics.
                </p>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#14B8A6] shrink-0 mt-0.5" />
                    <span>Batch cohort voucher creation, code assignment, and tracking.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#14B8A6] shrink-0 mt-0.5" />
                    <span>Classroom and grade-level aggregate analytics dashboards.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#14B8A6] shrink-0 mt-0.5" />
                    <span>Sub-counsellor account delegation with role-based permissions.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#14B8A6] shrink-0 mt-0.5" />
                    <span>Enterprise data security and student privacy compliance.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#14B8A6]">
                  Scales to 10,000+ Students
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  href="/institution/dashboard"
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white border-0 btn-shimmer"
                >
                  <span>Institution Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Institutional Partnership CTA Banner */}
        <Reveal animation="zoom-in" delay={250}>
          <div className="p-6 sm:p-8 rounded-2xl bg-[#F1F5F9] border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] shrink-0">
                <Award className="w-6 h-6 text-[#2563EB]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#0F172A]">
                  Partner with 3G MeLife for Your School or Institution
                </h4>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Explore institutional pilot programmes, cohort voucher packs, and customized guidance workflows.
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="md"
              href="#contact"
              className="shrink-0 btn-shimmer bg-[#2563EB] hover:bg-[#1D4ED8]"
            >
              <span>Talk to MeLife</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

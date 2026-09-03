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
            badgeVariant="teal"
            title="Built for Individual Guidance and Institutional Scale"
            subtitle="Whether guiding one student or managing assessments across multiple school campuses, MeLife provides the infrastructure you need."
          />
        </Reveal>

        {/* Dual Split: For Counsellors vs For Schools & Universities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left: For Private & School Counsellors */}
          <Reveal animation="fade-right" delay={100}>
            <div className="flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-[#F7FAF9] border border-[#E3ECEA] shadow-[0_10px_30px_-10px_rgba(23,43,42,0.05)] interactive-card h-full">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#00BFA5]/25 flex items-center justify-center text-[#008F83] shadow-xs">
                    <Users className="w-6 h-6 text-[#00BFA5]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#008F83] block">
                      For Guidance Counsellors
                    </span>
                    <h3 className="text-xl font-bold text-[#172B2A]">
                      Evidence-Based Guidance Toolkit
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#526866] leading-relaxed mb-6">
                  Equip your career guidance practice with standardized psychometric insights that transform intuition into structured, defensible advice.
                </p>

                <ul className="space-y-3 text-xs sm:text-sm text-[#526866]">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00BFA5] shrink-0 mt-0.5" />
                    <span>Structured student dossier with longitudinal dimension tracking.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00BFA5] shrink-0 mt-0.5" />
                    <span>Evidence-informed discussion frameworks for parental consultations.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00BFA5] shrink-0 mt-0.5" />
                    <span>Confidential session notes and milestone progress management.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00BFA5] shrink-0 mt-0.5" />
                    <span>Exportable, white-labeled PDF summary sheets for families.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 mt-6 border-t border-[#E3ECEA] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#008F83]">
                  Individual & Group Practice Ready
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  href="/login"
                  className="bg-white hover:bg-[#EBF2F0]"
                >
                  <span>Counsellor Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </Reveal>

          {/* Right: For Schools, Colleges & Educational Groups */}
          <Reveal animation="fade-left" delay={200}>
            <div className="flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-[#172B2A] text-white border border-[#0D1C1B] shadow-[0_20px_50px_-15px_rgba(23,43,42,0.3)] interactive-card h-full">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-teal-400/30 flex items-center justify-center text-[#00B8D4] shadow-xs">
                    <Building2 className="w-6 h-6 text-[#00B8D4]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#00BFA5] block">
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
                    <CheckCircle2 className="w-4 h-4 text-[#00BFA5] shrink-0 mt-0.5" />
                    <span>Batch cohort voucher creation, code assignment, and tracking.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00BFA5] shrink-0 mt-0.5" />
                    <span>Classroom and grade-level aggregate analytics dashboards.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00BFA5] shrink-0 mt-0.5" />
                    <span>Sub-counsellor account delegation with role-based permissions.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00BFA5] shrink-0 mt-0.5" />
                    <span>Enterprise data security and student privacy compliance.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8 mt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#00BFA5]">
                  Scales to 10,000+ Students
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  href="/login"
                  className="bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white border-0 btn-shimmer font-bold"
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
          <div className="p-6 sm:p-8 rounded-2xl bg-[#F7FAF9] border border-[#E3ECEA] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#00BFA5]/25 flex items-center justify-center text-[#008F83] shrink-0">
                <Award className="w-6 h-6 text-[#00BFA5]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#172B2A]">
                  Partner with 3G MeLife for Your School or Institution
                </h4>
                <p className="text-xs text-[#526866] mt-0.5">
                  Explore institutional pilot programmes, cohort voucher packs, and customized guidance workflows.
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="md"
              href="/register"
              className="shrink-0 btn-shimmer bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white font-bold"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

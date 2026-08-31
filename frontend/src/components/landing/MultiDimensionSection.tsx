import React from "react";
import { Sparkles, Check, X, ShieldAlert, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/common/Reveal";

export function MultiDimensionSection() {
  return (
    <section className="py-20 sm:py-28 bg-white relative">
      <Container size="default">
        <Reveal animation="fade-up">
          <SectionHeading
            badge="The Multi-Dimensional Principle"
            badgeVariant="blue"
            title="Beyond Single-Score Decisions"
            subtitle="Educational and career choices should never rely on single exam percentages, isolated test scores, or arbitrary stereotypes."
          />
        </Reveal>

        {/* The Multi-Dimensional Formula Visual Banner */}
        <Reveal animation="zoom-in" delay={100}>
          <div className="rounded-3xl p-6 sm:p-10 bg-[#F1F5F9] border border-slate-200/80 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.04)] mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-4 inline-block bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
              The 3G MeLife Diagnostic Formula
            </span>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-6">
              {/* Box 1 */}
              <div className="px-4 py-3 sm:px-6 sm:py-4 rounded-2xl bg-white border border-slate-200 shadow-2xs interactive-card">
                <span className="text-xs font-semibold text-[#2563EB] uppercase block">Dimension 1</span>
                <span className="text-sm sm:text-base font-bold text-[#0F172A]">Cognitive Aptitude</span>
              </div>

              <span className="text-xl font-extrabold text-[#2563EB]">+</span>

              {/* Box 2 */}
              <div className="px-4 py-3 sm:px-6 sm:py-4 rounded-2xl bg-white border border-slate-200 shadow-2xs interactive-card">
                <span className="text-xs font-semibold text-[#2563EB] uppercase block">Dimension 2</span>
                <span className="text-sm sm:text-base font-bold text-[#0F172A]">Curiosity & Interests</span>
              </div>

              <span className="text-xl font-extrabold text-[#2563EB]">+</span>

              {/* Box 3 */}
              <div className="px-4 py-3 sm:px-6 sm:py-4 rounded-2xl bg-white border border-slate-200 shadow-2xs interactive-card">
                <span className="text-xs font-semibold text-[#2563EB] uppercase block">Dimension 3</span>
                <span className="text-sm sm:text-base font-bold text-[#0F172A]">Execution Strengths</span>
              </div>

              <span className="text-xl font-extrabold text-[#2563EB]">+</span>

              {/* Box 4 */}
              <div className="px-4 py-3 sm:px-6 sm:py-4 rounded-2xl bg-white border border-slate-200 shadow-2xs interactive-card">
                <span className="text-xs font-semibold text-[#2563EB] uppercase block">Dimension 4</span>
                <span className="text-sm sm:text-base font-bold text-[#0F172A]">Ecosystem Reality</span>
              </div>

              <span className="text-xl font-extrabold text-[#14B8A6]">=</span>

              {/* Result Pill */}
              <div className="px-5 py-3 sm:px-7 sm:py-4 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#14B8A6] text-white shadow-md">
                <span className="text-xs font-semibold text-blue-100 uppercase block">Guidance Result</span>
                <span className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Confident, Defensible Direction</span>
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl mx-auto leading-relaxed">
              When interest is validated by cognitive velocity and grounded in personal execution habits, students make decisions they are excited to pursue and sustain.
            </p>
          </div>
        </Reveal>

        {/* Comparison Grid: Traditional Guesswork vs. MeLife Multi-Dimensional Approach */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional Pitfalls */}
          <Reveal animation="fade-right" delay={150}>
            <div className="p-7 sm:p-8 rounded-3xl bg-[#FFF9F8] border border-red-200/80 shadow-2xs h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 text-red-700">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-bold text-[#0F172A]">
                    Traditional Decision Pressures
                  </h3>
                </div>
                <ul className="space-y-3.5 text-xs sm:text-sm text-[#64748B]">
                  <li className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>Relying exclusively on raw board exam marks for career suitability.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>Following peer trends without understanding personal cognitive style.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>Boxed in by superficial 4-letter personality labels.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>One-time unscientific quiz results that leave parents anxious.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-red-200/60 text-xs font-semibold text-red-800">
                Outcome: High branch-switching regret and career dissatisfaction.
              </div>
            </div>
          </Reveal>

          {/* The MeLife Multi-Dimensional Advantage */}
          <Reveal animation="fade-left" delay={200}>
            <div className="p-7 sm:p-8 rounded-3xl bg-[#F8FAFC] border border-[#2563EB]/25 shadow-2xs h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 text-[#2563EB]">
                  <ShieldCheck className="w-5 h-5 text-[#14B8A6]" />
                  <h3 className="text-lg font-bold text-[#0F172A]">
                    The MeLife Multi-Dimensional Approach
                  </h3>
                </div>
                <ul className="space-y-3.5 text-xs sm:text-sm text-[#64748B]">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#14B8A6] shrink-0 mt-0.5" />
                    <span>Evaluates cognitive reasoning, interests, and execution readiness together.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#14B8A6] shrink-0 mt-0.5" />
                    <span>Developmental continuum that evolves with the student across years.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#14B8A6] shrink-0 mt-0.5" />
                    <span>Non-judgmental profiling with actionable counselling frameworks.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#14B8A6] shrink-0 mt-0.5" />
                    <span>Clear reports that parents, students, and counsellors can discuss constructively.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 text-xs font-semibold text-[#2563EB]">
                Outcome: Scientific clarity and confidence across critical transition milestones.
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

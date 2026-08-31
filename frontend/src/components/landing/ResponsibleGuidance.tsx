import React from "react";
import { HeartHandshake, Sparkles, Compass } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/common/Reveal";

export function ResponsibleGuidance() {
  return (
    <section id="ethics" className="py-20 sm:py-28 bg-[#F8FAFC] relative">
      <Container size="default">
        <Reveal animation="fade-up">
          <SectionHeading
            badge="Psychometric Ethics & Philosophy"
            badgeVariant="blue"
            title="Guidance, Not Labels"
            subtitle="“MeLife is designed to support exploration and counselling. Assessment results should help students understand possibilities — not force them into a single permanent career decision.”"
          />
        </Reveal>

        {/* 3 Core Ethical Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Pillar 1 */}
          <Reveal animation="fade-up" delay={100}>
            <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-2xs interactive-card h-full">
              <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#2563EB]/15 flex items-center justify-center text-[#2563EB] mb-4">
                <Compass className="w-5 h-5 text-[#2563EB]" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-2">
                Descriptive, Not Prescriptive
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Our reports illuminate tendencies and affinities to open doors — never to pigeonhole a student into a narrow box or dictate a single rigid path.
              </p>
            </div>
          </Reveal>

          {/* Pillar 2 */}
          <Reveal animation="fade-up" delay={200}>
            <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-2xs interactive-card h-full">
              <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#14B8A6]/20 flex items-center justify-center text-[#14B8A6] mb-4">
                <Sparkles className="w-5 h-5 text-[#14B8A6]" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-2">
                Developmental Continuum
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Human potential is fluid. We support periodic reflection as students mature, discover new curiosities, and acquire new skills over time.
              </p>
            </div>
          </Reveal>

          {/* Pillar 3 */}
          <Reveal animation="fade-up" delay={300}>
            <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-2xs interactive-card h-full">
              <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#2563EB]/15 flex items-center justify-center text-[#2563EB] mb-4">
                <HeartHandshake className="w-5 h-5 text-[#2563EB]" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-2">
                Empowering Human Mentorship
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Assessments are tools to spark meaningful, structured conversations between students, parents, and trained educators — never automated replacers.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

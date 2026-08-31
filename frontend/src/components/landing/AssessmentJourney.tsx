import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JOURNEY_STAGES, type JourneyStage } from "@/data/landing";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/common/Reveal";

export function AssessmentJourney() {
  return (
    <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
      <Container size="default">
        <Reveal animation="fade-up">
          <SectionHeading
            badge="Age-Calibrated Progression"
            badgeVariant="blue"
            title="The Developmental Assessment Journey"
            subtitle="MeLife assessments form an integrated developmental roadmap — supporting informed decisions at every crucial educational transition."
          />
        </Reveal>

        {/* 7-Stage Interactive Connected Timeline */}
        <div className="relative mt-12 mb-16">
          {/* Subtle Horizontal Connecting Guideline */}
          <div
            className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 pointer-events-none opacity-40"
            style={{
              background:
                "linear-gradient(90deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.6) 50%, rgba(20, 184, 166, 0.3) 100%)",
            }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 relative z-10">
            {JOURNEY_STAGES.map((stage: JourneyStage, idx: number) => (
              <Reveal key={stage.id} animation="fade-up" delay={idx * 80}>
                <div
                  className={`flex flex-col h-full p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative group interactive-card ${
                    stage.isFeatured
                      ? "bg-[#F8FAFC] border-[#2563EB]/40 shadow-[0_4px_20px_rgba(37,99,235,0.1)]"
                      : "bg-white border-slate-200 shadow-2xs"
                  }`}
                >
                  {/* Step Number Circle */}
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-transform group-hover:scale-110 ${
                        stage.isFeatured
                          ? "bg-[#2563EB] text-white shadow-xs"
                          : "bg-[#F1F5F9] border border-[#2563EB]/20 text-[#2563EB]"
                      }`}
                    >
                      {stage.stageNumber}
                    </div>
                    {stage.isFeatured && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-[#2563EB] bg-white px-2 py-0.5 rounded-full border border-[#2563EB]/20">
                        <Sparkles className="w-2.5 h-2.5 text-[#2563EB]" />
                        Key Stage
                      </span>
                    )}
                  </div>

                  {/* Title & Age */}
                  <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider mb-1 block">
                    {stage.age}
                  </span>
                  <h3 className="text-sm font-bold text-[#0F172A] mb-1.5 leading-snug group-hover:text-[#2563EB] transition-colors">
                    {stage.title}
                  </h3>

                  {/* Target Group */}
                  <p className="text-[11px] font-medium text-[#64748B] mb-2.5">
                    {stage.targetGroup}
                  </p>

                  {/* Description */}
                  <p className="text-[11px] text-[#64748B] leading-relaxed mb-4 flex-1">
                    {stage.description}
                  </p>

                  {/* Focus Chips */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1">
                    {stage.focusAreas.map((area: string) => (
                      <span
                        key={area}
                        className="text-[9px] font-medium text-[#2563EB] bg-white border border-[#2563EB]/15 px-1.5 py-0.5 rounded"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Bottom Banner Callout */}
        <Reveal animation="zoom-in" delay={300}>
          <div className="rounded-2xl p-6 sm:p-8 bg-[#0F172A] text-white border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#14B8A6] block mb-1">
                Universal Assessment Architecture
              </span>
              <h4 className="text-lg sm:text-xl font-bold text-white mb-2">
                Unified Foundation Across All 7 Life Stages
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                All stages run on a standardized, accessible assessment engine designed for consistent longitudinal guidance — without exposing scoring weights or algorithms to the client.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              href="#assessments"
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white border-0 shrink-0 btn-shimmer"
            >
              <span>View Featured Assessments</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

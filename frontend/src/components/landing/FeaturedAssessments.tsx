import React from "react";
import { Sparkles, Compass, Target, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FEATURED_ASSESSMENTS, type FeaturedAssessment } from "@/data/landing";
import { Reveal } from "@/components/common/Reveal";

const iconMap: Record<string, React.ReactNode> = {
  "skill-finder": <Sparkles className="w-5 h-5 text-[#2563EB]" />,
  "stream-finder": <Compass className="w-5 h-5 text-[#2563EB]" />,
  "right-career": <Target className="w-5 h-5 text-[#2563EB]" />,
};

export function FeaturedAssessments() {
  return (
    <section id="assessments" className="py-20 sm:py-28 bg-[#F1F5F9] relative">
      <Container size="default">
        <Reveal animation="fade-up">
          <SectionHeading
            badge="Flagship Instruments"
            badgeVariant="blue"
            title="Featured Assessments"
            subtitle="Targeted psychometric evaluations calibrated for pivotal transition points in a learner's educational life."
          />
        </Reveal>

        {/* 3 Prominent Featured Assessment Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {FEATURED_ASSESSMENTS.map((item: FeaturedAssessment, idx: number) => (
            <Reveal key={item.id} animation="fade-up" delay={idx * 120}>
              <div className="flex flex-col h-full rounded-3xl bg-white p-7 sm:p-8 border border-slate-200/90 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.06)] interactive-card group relative">
                {/* Top Badge & Duration */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] bg-[#2563EB]/10 px-3 py-1 rounded-full border border-[#2563EB]/20">
                    {item.badge}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-semibold text-[#64748B] bg-[#F8FAFC] px-2.5 py-1 rounded-full border border-slate-200">
                    <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>{item.duration}</span>
                  </div>
                </div>

                {/* Header Icon + Age + Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] border border-[#2563EB]/15 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#2563EB]/10 transition-all duration-300">
                    {iconMap[item.id]}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block">
                      {item.age}
                    </span>
                    <h3 className="text-xl font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Tagline & Description */}
                <p className="text-xs sm:text-sm font-semibold text-[#2563EB] mb-3">
                  {item.tagline}
                </p>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6 flex-1">
                  {item.description}
                </p>

                {/* Outcomes Checklist */}
                <div className="mb-6 pt-4 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A] block mb-2.5">
                    Key Profile Outcomes:
                  </span>
                  <div className="space-y-2">
                    {item.outcomes.map((outcome: string) => (
                      <div key={outcome} className="flex items-start gap-2 text-xs text-[#64748B]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#14B8A6] shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="md"
                    href="/student/assessments"
                    className="w-full justify-center group-hover:border-[#2563EB] group-hover:bg-[#F8FAFC] transition-all"
                  >
                    <span>Explore Details</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

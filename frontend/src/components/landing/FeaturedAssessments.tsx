import React from "react";
import { Sparkles, Compass, Target, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FEATURED_ASSESSMENTS, type FeaturedAssessment } from "@/data/landing";
import { Reveal } from "@/components/common/Reveal";

const iconMap: Record<string, React.ReactNode> = {
  "skill-finder": <Sparkles className="w-5 h-5 text-[#00BFA5]" />,
  "stream-finder": <Compass className="w-5 h-5 text-[#00B8D4]" />,
  "right-career": <Target className="w-5 h-5 text-[#008F83]" />,
};

export function FeaturedAssessments() {
  return (
    <section id="assessments" className="py-20 sm:py-28 bg-[#F7FAF9] relative">
      <Container size="default">
        <Reveal animation="fade-up">
          <SectionHeading
            badge="Flagship Instruments"
            badgeVariant="teal"
            title="Featured Assessments"
            subtitle="Targeted psychometric evaluations calibrated for pivotal transition points in a learner's educational life."
          />
        </Reveal>

        {/* 3 Prominent Featured Assessment Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {FEATURED_ASSESSMENTS.map((item: FeaturedAssessment, idx: number) => (
            <Reveal key={item.id} animation="fade-up" delay={idx * 120}>
              <div className="flex flex-col h-full rounded-3xl bg-white p-7 sm:p-8 border border-[#E3ECEA] shadow-[0_10px_30px_-10px_rgba(23,43,42,0.06)] interactive-card group relative">
                {/* Top Badge & Duration */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#008F83] bg-[#00BFA5]/15 px-3 py-1 rounded-full border border-[#00BFA5]/30">
                    {item.badge}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-semibold text-[#526866] bg-[#F7FAF9] px-2.5 py-1 rounded-full border border-[#E3ECEA]">
                    <Clock className="w-3.5 h-3.5 text-[#00B8D4]" />
                    <span>{item.duration}</span>
                  </div>
                </div>

                {/* Header Icon + Age + Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F7FAF9] border border-[#00BFA5]/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#00BFA5]/15 transition-all duration-300">
                    {iconMap[item.id]}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#008F83] uppercase tracking-wider block">
                      {item.age}
                    </span>
                    <h3 className="text-xl font-bold text-[#172B2A] group-hover:text-[#008F83] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Tagline & Description */}
                <p className="text-xs sm:text-sm font-semibold text-[#008F83] mb-3">
                  {item.tagline}
                </p>
                <p className="text-xs sm:text-sm text-[#526866] leading-relaxed mb-6 flex-1">
                  {item.description}
                </p>

                {/* Outcomes Checklist */}
                <div className="mb-6 pt-4 border-t border-[#E3ECEA]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#172B2A] block mb-2.5">
                    Key Profile Outcomes:
                  </span>
                  <div className="space-y-2">
                    {item.outcomes.map((outcome: string) => (
                      <div key={outcome} className="flex items-start gap-2 text-xs text-[#526866]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00BFA5] shrink-0 mt-0.5" />
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
                    href="/participant/assessments"
                    className="w-full justify-center group-hover:border-[#00BFA5] group-hover:bg-[#F7FAF9] transition-all"
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

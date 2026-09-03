import React from "react";
import { UserCheck, FileCheck2, Layers, Compass } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HOW_IT_WORKS_STEPS, type HowItWorksStep } from "@/data/landing";
import { Reveal } from "@/components/common/Reveal";

const iconMap: Record<string, React.ReactNode> = {
  UserCheck: <UserCheck className="w-5 h-5 text-[#00BFA5]" />,
  FileCheck2: <FileCheck2 className="w-5 h-5 text-[#00B8D4]" />,
  Layers: <Layers className="w-5 h-5 text-[#00C896]" />,
  Compass: <Compass className="w-5 h-5 text-[#008F83]" />,
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-white relative overflow-hidden">
      <Container size="default">
        <Reveal animation="fade-up">
          <SectionHeading
            badge="4-Step Structured Process"
            badgeVariant="teal"
            title="How 3G MeLife Works"
            subtitle="A calm, multi-stage assessment journey designed to transform self-reflection into actionable clarity."
          />
        </Reveal>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {HOW_IT_WORKS_STEPS.map((item: HowItWorksStep, idx: number) => (
            <Reveal key={item.step} animation="fade-up" delay={idx * 100}>
              <div className="flex flex-col h-full p-6 sm:p-7 rounded-2xl bg-[#F7FAF9] border border-[#E3ECEA] interactive-card group">
                {/* Step Number Badge */}
                <div className="flex items-center justify-between mb-5">
                  <span className="w-8 h-8 rounded-full bg-[#00BFA5] text-[#172B2A] text-xs font-black flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                    {item.number}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#00BFA5]/20 flex items-center justify-center">
                    {iconMap[item.iconName]}
                  </div>
                </div>

                {/* Step Tag */}
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#008F83] mb-1 block">
                  {item.step}
                </span>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#172B2A] mb-2 group-hover:text-[#008F83] transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#526866] leading-relaxed mb-4 flex-1">
                  {item.description}
                </p>

                {/* Detail */}
                <div className="pt-3 border-t border-[#E3ECEA] text-[11px] text-[#008F83] font-medium leading-snug">
                  {item.detail}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

import React from "react";
import { GraduationCap, Users, Compass, Building2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AUDIENCE_DATA, type AudienceItem } from "@/data/landing";
import { Reveal } from "@/components/common/Reveal";

const iconMap: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="w-6 h-6 text-[#2563EB]" />,
  Users: <Users className="w-6 h-6 text-[#2563EB]" />,
  Compass: <Compass className="w-6 h-6 text-[#2563EB]" />,
  Building2: <Building2 className="w-6 h-6 text-[#2563EB]" />,
};

export function AudienceSection() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-[#F1F5F9] relative">
      <Container size="default">
        <Reveal animation="fade-up">
          <SectionHeading
            badge="Designed for Every Stakeholder"
            badgeVariant="blue"
            title="Who 3G MeLife Serves"
            subtitle="MeLife provides objective, evidence-informed psychometric clarity for learners, families, and guidance professionals."
          />
        </Reveal>

        {/* 4 Core Audience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {AUDIENCE_DATA.map((item: AudienceItem, idx: number) => (
            <Reveal key={item.id} animation="fade-up" delay={idx * 100}>
              <div className="flex flex-col h-full p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04)] interactive-card group">
                {/* Header Icon + Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#2563EB]/15 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#2563EB]/10 transition-all duration-300">
                    {iconMap[item.iconName]}
                  </div>
                  <span className="text-[11px] font-semibold text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded-full border border-[#2563EB]/20">
                    {item.badge}
                  </span>
                </div>

                {/* Title and Role */}
                <h3 className="text-xl font-bold text-[#0F172A] mb-1 group-hover:text-[#2563EB] transition-colors">
                  {item.title}
                </h3>
                <span className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider mb-3 block">
                  {item.role}
                </span>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6 flex-1">
                  {item.description}
                </p>

                {/* Key Benefit Footer */}
                <div className="pt-4 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-[#2563EB] block leading-snug">
                    ✓ {item.keyBenefit}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

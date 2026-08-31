import React from "react";
import {
  Sparkles,
  BrainCircuit,
  ShieldCheck,
  Target,
  BookOpenCheck,
  Activity,
  HeartHandshake,
  Globe,
  Info,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DIMENSIONS_DATA, type DimensionItem } from "@/data/landing";
import { Reveal } from "@/components/common/Reveal";

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5 text-[#2563EB]" />,
  BrainCircuit: <BrainCircuit className="w-5 h-5 text-[#2563EB]" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-[#14B8A6]" />,
  Target: <Target className="w-5 h-5 text-[#2563EB]" />,
  BookOpenCheck: <BookOpenCheck className="w-5 h-5 text-[#2563EB]" />,
  Activity: <Activity className="w-5 h-5 text-[#14B8A6]" />,
  HeartHandshake: <HeartHandshake className="w-5 h-5 text-[#14B8A6]" />,
  Globe: <Globe className="w-5 h-5 text-[#2563EB]" />,
};

export function AssessmentDimensions() {
  return (
    <section id="dimensions" className="py-20 sm:py-28 bg-[#F8FAFC] relative">
      <Container size="default">
        <Reveal animation="fade-up">
          <SectionHeading
            badge="Multi-Faceted Evaluation"
            badgeVariant="blue"
            title="Holistic Assessment Dimensions"
            subtitle="Meaningful guidance requires looking beyond single metrics to understand the full learner context."
          />
        </Reveal>

        {/* 8 Dimensions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DIMENSIONS_DATA.map((item: DimensionItem, idx: number) => (
            <Reveal key={item.title} animation="fade-up" delay={idx * 70}>
              <div className="flex flex-col h-full p-6 rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_16px_rgba(15,23,42,0.03)] interactive-card group">
                {/* Header Icon + Category */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#2563EB]/15 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#2563EB]/10 transition-all duration-300">
                    {iconMap[item.iconName]}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] bg-[#2563EB]/10 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-[#0F172A] mb-2 group-hover:text-[#2563EB] transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#64748B] leading-relaxed mb-4 flex-1">
                  {item.description}
                </p>

                {/* Relevance Note */}
                <div className="pt-3 border-t border-slate-100 text-[11px] text-[#2563EB] font-medium leading-snug">
                  {item.relevance}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Mandatory Educational Disclaimer */}
        <Reveal animation="zoom-in" delay={200}>
          <div className="mt-10 p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-center gap-2.5 text-center text-xs text-[#64748B] shadow-2xs">
            <Info className="w-4 h-4 text-[#2563EB] shrink-0" />
            <span>
              <strong>Note:</strong> Assessment dimensions are calibrated and selected according to the learner&apos;s age, academic stage, and specific assessment scope.
            </span>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

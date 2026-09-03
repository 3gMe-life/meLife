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
  Sparkles: <Sparkles className="w-5 h-5 text-[#00BFA5]" />,
  BrainCircuit: <BrainCircuit className="w-5 h-5 text-[#00BFA5]" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-[#00B8D4]" />,
  Target: <Target className="w-5 h-5 text-[#008F83]" />,
  BookOpenCheck: <BookOpenCheck className="w-5 h-5 text-[#00BFA5]" />,
  Activity: <Activity className="w-5 h-5 text-[#00B8D4]" />,
  HeartHandshake: <HeartHandshake className="w-5 h-5 text-[#00C896]" />,
  Globe: <Globe className="w-5 h-5 text-[#008F83]" />,
};

export function AssessmentDimensions() {
  return (
    <section id="dimensions" className="py-20 sm:py-28 bg-[#F7FAF9] relative">
      <Container size="default">
        <Reveal animation="fade-up">
          <SectionHeading
            badge="Multi-Faceted Evaluation"
            badgeVariant="teal"
            title="Holistic Assessment Dimensions"
            subtitle="Meaningful guidance requires looking beyond single metrics to understand the full learner context."
          />
        </Reveal>

        {/* 8 Dimensions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DIMENSIONS_DATA.map((item: DimensionItem, idx: number) => (
            <Reveal key={item.title} animation="fade-up" delay={idx * 70}>
              <div className="flex flex-col h-full p-6 rounded-2xl bg-white border border-[#E3ECEA] shadow-[0_4px_16px_rgba(23,43,42,0.03)] interactive-card group">
                {/* Header Icon + Category */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F7FAF9] border border-[#00BFA5]/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#00BFA5]/15 transition-all duration-300">
                    {iconMap[item.iconName]}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#008F83] bg-[#00BFA5]/15 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-[#172B2A] mb-2 group-hover:text-[#008F83] transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#526866] leading-relaxed mb-4 flex-1">
                  {item.description}
                </p>

                {/* Relevance Note */}
                <div className="pt-3 border-t border-[#E3ECEA] text-[11px] text-[#008F83] font-medium leading-snug">
                  {item.relevance}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Mandatory Educational Disclaimer */}
        <Reveal animation="zoom-in" delay={200}>
          <div className="mt-10 p-4 rounded-2xl bg-white border border-[#E3ECEA] flex items-center justify-center gap-2.5 text-center text-xs text-[#526866] shadow-2xs">
            <Info className="w-4 h-4 text-[#00BFA5] shrink-0" />
            <span>
              <strong>Note:</strong> Assessment dimensions are calibrated and selected according to the learner&apos;s age, academic stage, and specific assessment scope.
            </span>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

import React from "react";
import { ArrowRight, Sparkles, Mail } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/common/Reveal";

export function FinalCTA() {
  return (
    <section className="py-20 sm:py-28 bg-white relative">
      <Container size="default">
        <Reveal animation="zoom-in">
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 text-center text-[#172B2A] bg-gradient-to-tr from-[#00B8D4] via-[#00BFA5] to-[#00C896] shadow-[0_24px_60px_-15px_rgba(0,191,165,0.35)]">
            {/* Ambient Background Decorative Circles */}
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/15 blur-2xl pointer-events-none animate-pulse-glow" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-black/10 blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/40 backdrop-blur-md text-[#172B2A] mb-6 border border-white/50 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#008F83]" />
                <span>Begin Your Journey Today</span>
              </div>

              {/* Title */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#172B2A] mb-6 leading-tight">
                Start Understanding the Possibilities.
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base lg:text-lg text-[#172B2A]/85 font-medium max-w-2xl mx-auto mb-8 leading-relaxed">
                Explore MeLife assessments and begin a clearer, evidence-informed journey toward educational choices and future career pathways.
              </p>

              {/* Dual CTAs */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  variant="glass"
                  size="lg"
                  href="#assessments"
                  className="w-full sm:w-auto bg-white text-[#172B2A] hover:bg-[#F7FAF9] hover:text-[#008F83] border-0 shadow-lg btn-shimmer font-bold"
                >
                  <span>Explore Assessments</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  href="mailto:contact@3gmelife.com"
                  className="w-full sm:w-auto text-[#172B2A] border-[#172B2A]/30 hover:bg-white/20 hover:border-[#172B2A]"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Us</span>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

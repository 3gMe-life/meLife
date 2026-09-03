import React from "react";
import Image from "next/image";
import { ArrowRight, Compass, ShieldCheck, Sparkles, BrainCircuit, Target, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/common/Reveal";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 lg:pt-44 lg:pb-32 overflow-hidden bg-[#F7FAF9]"
      style={{
        background:
          "radial-gradient(circle at 80% 30%, rgba(0, 191, 165, 0.08) 0%, rgba(235, 242, 240, 0.7) 45%, rgba(247, 250, 249, 1) 75%)",
      }}
    >
      {/* Subtle decorative background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#00BFA5 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <Container size="default" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Content Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <Reveal animation="fade-up" delay={50}>
              {/* Top Eyebrow Badge */}
              <Badge
                variant="teal"
                icon={<Sparkles className="w-3.5 h-3.5 text-[#008F83]" />}
                className="mb-6 shadow-2xs"
              >
                Psychometric Assessment & Career Guidance
              </Badge>
            </Reveal>

            <Reveal animation="fade-up" delay={150}>
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#172B2A] leading-[1.15] mb-6">
                Discover Strengths.{" "}
                <span className="brand-gradient-text">
                  Choose Directions
                </span>{" "}
                With Confidence.
              </h1>
            </Reveal>

            <Reveal animation="fade-up" delay={250}>
              {/* Subtitle Description */}
              <p className="text-base sm:text-lg md:text-xl text-[#526866] leading-relaxed max-w-2xl mb-8 font-normal">
                MeLife helps students understand their interests, emerging strengths, and abilities so they can explore educational and career pathways with greater clarity and purpose.
              </p>
            </Reveal>

            <Reveal animation="fade-up" delay={350}>
              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto mb-8">
                <Button
                  variant="primary"
                  size="lg"
                  href="#assessments"
                  className="w-full sm:w-auto btn-shimmer shadow-md"
                >
                  <span>Explore Assessments</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  href="#how-it-works"
                  className="w-full sm:w-auto hover:bg-[#EBF2F0] transition-colors"
                >
                  <Compass className="w-4 h-4 text-[#008F83]" />
                  <span>How MeLife Works</span>
                </Button>
              </div>
            </Reveal>

            <Reveal animation="fade-up" delay={450}>
              {/* Trust Line & Indicators */}
              <div className="pt-6 border-t border-[#E3ECEA] w-full max-w-2xl">
                <p className="text-xs sm:text-sm font-semibold text-[#008F83] mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00BFA5] shrink-0" />
                  <span>Designed for students, parents, counsellors and educational institutions.</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 text-xs text-[#526866] bg-white border border-[#E3ECEA] px-2.5 py-1 rounded-md shadow-2xs hover:border-[#00BFA5]/40 transition-colors">
                    <ShieldCheck className="w-3 h-3 text-[#00B8D4]" />
                    Evidence-Informed
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-[#526866] bg-white border border-[#E3ECEA] px-2.5 py-1 rounded-md shadow-2xs hover:border-[#00BFA5]/40 transition-colors">
                    <BrainCircuit className="w-3 h-3 text-[#00BFA5]" />
                    Age-Calibrated Continuum
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-[#526866] bg-white border border-[#E3ECEA] px-2.5 py-1 rounded-md shadow-2xs hover:border-[#00BFA5]/40 transition-colors">
                    <Target className="w-3 h-3 text-[#008F83]" />
                    Holistic Profiling
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Visual Composition Column */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            {/* Ambient Radial Illumination */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#00BFA5]/10 blur-3xl -z-0 pointer-events-none animate-pulse-glow" />
            <div className="absolute w-56 h-56 rounded-full bg-[#00B8D4]/10 blur-2xl top-1/2 left-1/3 -z-0 pointer-events-none" />

            <Reveal animation="zoom-in" delay={200} className="relative w-full max-w-md mx-auto">
              {/* Outer Decorative Concentric Rings */}
              <div className="absolute -inset-4 sm:-inset-6 border border-[#00BFA5]/15 rounded-3xl -z-10 pointer-events-none" />
              <div className="absolute -inset-8 sm:-inset-12 border border-[#00BFA5]/8 rounded-[32px] -z-10 pointer-events-none hidden sm:block" />

              {/* Main Premium Glass Card */}
              <div className="relative rounded-3xl bg-white/95 backdrop-blur-xl border border-[#E3ECEA] p-6 sm:p-8 shadow-[0_20px_50px_-15px_rgba(23,43,42,0.1)] text-center transition-all duration-300">
                {/* Top Badge on Card */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EBF2F0] border border-[#E3ECEA] text-[#008F83] mb-5">
                  <Sparkles className="w-3.5 h-3.5 text-[#00BFA5]" />
                  <span>3G MeLife Diagnostic Ecosystem</span>
                </div>

                {/* Central Verified Logo */}
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto mb-6 rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(0,191,165,0.25)] border-2 border-white bg-gradient-to-tr from-[#00B8D4] via-[#00BFA5] to-[#00C896] flex items-center justify-center p-1.5 animate-float-slow">
                  <Image
                    src="/melifelogo.png"
                    alt="3G ME LIFE - Psychometric Assessment & Career Guidance"
                    width={176}
                    height={176}
                    priority
                    className="object-contain rounded-xl w-full h-full"
                  />
                </div>

                {/* Logo Title & Subtitle */}
                <h3 className="text-xl font-bold text-[#172B2A] tracking-tight">
                  Comprehensive Psychometrics
                </h3>
                <p className="text-xs text-[#526866] mt-1 mb-5">
                  From Middle School Discovery to Career Readiness
                </p>

                {/* Micro Assessment Metric Cards Grid */}
                <div className="grid grid-cols-2 gap-2 text-left pt-4 border-t border-[#E3ECEA]">
                  <div className="p-2.5 rounded-xl bg-[#F7FAF9] border border-[#E3ECEA] hover:bg-[#EBF2F0] transition-colors">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#008F83]">
                      Ages 10–13
                    </span>
                    <p className="text-xs font-semibold text-[#172B2A] mt-0.5">Skill Finder</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F7FAF9] border border-[#E3ECEA] hover:bg-[#EBF2F0] transition-colors">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#008F83]">
                      Ages 14–15
                    </span>
                    <p className="text-xs font-semibold text-[#172B2A] mt-0.5">Stream Finder</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F7FAF9] border border-[#E3ECEA] hover:bg-[#EBF2F0] transition-colors">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#008F83]">
                      Ages 16–17
                    </span>
                    <p className="text-xs font-semibold text-[#172B2A] mt-0.5">Domain Finders</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F7FAF9] border border-[#E3ECEA] hover:bg-[#EBF2F0] transition-colors">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#008F83]">
                      Ages 18+
                    </span>
                    <p className="text-xs font-semibold text-[#172B2A] mt-0.5">Right Career</p>
                  </div>
                </div>
              </div>

              {/* Floating Satellite Dimension Chips with Organic Staggered Floating */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E3ECEA] shadow-md flex items-center gap-1.5 text-xs font-semibold text-[#172B2A] animate-float-slow">
                <span className="w-2 h-2 rounded-full bg-[#00BFA5] animate-pulse-dot" />
                <span>Interests</span>
              </div>

              <div className="absolute -top-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E3ECEA] shadow-md flex items-center gap-1.5 text-xs font-semibold text-[#172B2A] animate-float-delayed">
                <span className="w-2 h-2 rounded-full bg-[#00B8D4] animate-pulse-dot" />
                <span>Aptitude</span>
              </div>

              <div className="absolute -bottom-4 -left-3 sm:-left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E3ECEA] shadow-md flex items-center gap-1.5 text-xs font-semibold text-[#172B2A] animate-float-delayed">
                <span className="w-2 h-2 rounded-full bg-[#00C896] animate-pulse-dot" />
                <span>Strengths</span>
              </div>

              <div className="absolute -bottom-4 -right-3 sm:-right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E3ECEA] shadow-md flex items-center gap-1.5 text-xs font-semibold text-[#172B2A] animate-float-slow">
                <span className="w-2 h-2 rounded-full bg-[#008F83] animate-pulse-dot" />
                <span>Career Direction</span>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

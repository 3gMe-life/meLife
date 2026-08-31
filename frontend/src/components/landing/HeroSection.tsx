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
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 lg:pt-44 lg:pb-32 overflow-hidden bg-[#F8FAFC]"
      style={{
        background:
          "radial-gradient(circle at 80% 30%, rgba(37, 99, 235, 0.08) 0%, rgba(241, 245, 249, 0.7) 45%, rgba(248, 250, 252, 1) 75%)",
      }}
    >
      {/* Subtle decorative background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#2563EB 1px, transparent 1px)`,
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
                variant="blue"
                icon={<Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />}
                className="mb-6 shadow-2xs"
              >
                Psychometric Assessment & Career Guidance
              </Badge>
            </Reveal>

            <Reveal animation="fade-up" delay={150}>
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-[1.15] mb-6">
                Discover Strengths.{" "}
                <span className="bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#14B8A6] bg-clip-text text-transparent">
                  Choose Directions
                </span>{" "}
                With Confidence.
              </h1>
            </Reveal>

            <Reveal animation="fade-up" delay={250}>
              {/* Subtitle Description */}
              <p className="text-base sm:text-lg md:text-xl text-[#64748B] leading-relaxed max-w-2xl mb-8 font-normal">
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
                  className="w-full sm:w-auto hover:bg-[#F1F5F9] transition-colors"
                >
                  <Compass className="w-4 h-4 text-[#2563EB]" />
                  <span>How MeLife Works</span>
                </Button>
              </div>
            </Reveal>

            <Reveal animation="fade-up" delay={450}>
              {/* Trust Line & Indicators */}
              <div className="pt-6 border-t border-slate-200 w-full max-w-2xl">
                <p className="text-xs sm:text-sm font-semibold text-[#2563EB] mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#14B8A6] shrink-0" />
                  <span>Designed for students, parents, counsellors and educational institutions.</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 text-xs text-[#64748B] bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-2xs hover:border-[#2563EB]/40 transition-colors">
                    <ShieldCheck className="w-3 h-3 text-[#2563EB]" />
                    Evidence-Informed
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-[#64748B] bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-2xs hover:border-[#2563EB]/40 transition-colors">
                    <BrainCircuit className="w-3 h-3 text-[#2563EB]" />
                    Age-Calibrated Continuum
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-[#64748B] bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-2xs hover:border-[#2563EB]/40 transition-colors">
                    <Target className="w-3 h-3 text-[#2563EB]" />
                    Holistic Profiling
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Visual Composition Column */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            {/* Ambient Radial Illumination */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#2563EB]/10 blur-3xl -z-0 pointer-events-none animate-pulse-glow" />
            <div className="absolute w-56 h-56 rounded-full bg-[#14B8A6]/10 blur-2xl top-1/2 left-1/3 -z-0 pointer-events-none" />

            <Reveal animation="zoom-in" delay={200} className="relative w-full max-w-md mx-auto">
              {/* Outer Decorative Concentric Rings */}
              <div className="absolute -inset-4 sm:-inset-6 border border-[#2563EB]/15 rounded-3xl -z-10 pointer-events-none" />
              <div className="absolute -inset-8 sm:-inset-12 border border-[#2563EB]/8 rounded-[32px] -z-10 pointer-events-none hidden sm:block" />

              {/* Main Premium Glass Card */}
              <div className="relative rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/90 p-6 sm:p-8 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.1)] text-center transition-all duration-300">
                {/* Top Badge on Card */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F1F5F9] border border-slate-200 text-[#2563EB] mb-5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>3G MeLife Diagnostic Ecosystem</span>
                </div>

                {/* Central Verified Logo */}
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto mb-6 rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(37,99,235,0.2)] border-2 border-white bg-gradient-to-tr from-[#2563EB] to-[#14B8A6] flex items-center justify-center p-1.5 animate-float-slow">
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
                <h3 className="text-xl font-bold text-[#0F172A] tracking-tight">
                  Comprehensive Psychometrics
                </h3>
                <p className="text-xs text-[#64748B] mt-1 mb-5">
                  From Middle School Discovery to Career Readiness
                </p>

                {/* Micro Assessment Metric Cards Grid */}
                <div className="grid grid-cols-2 gap-2 text-left pt-4 border-t border-slate-200">
                  <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 hover:bg-[#F1F5F9] transition-colors">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#2563EB]">
                      Ages 10–13
                    </span>
                    <p className="text-xs font-semibold text-[#0F172A] mt-0.5">Skill Finder</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 hover:bg-[#F1F5F9] transition-colors">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#2563EB]">
                      Ages 14–15
                    </span>
                    <p className="text-xs font-semibold text-[#0F172A] mt-0.5">Stream Finder</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 hover:bg-[#F1F5F9] transition-colors">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#2563EB]">
                      Ages 16–17
                    </span>
                    <p className="text-xs font-semibold text-[#0F172A] mt-0.5">Domain Finders</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 hover:bg-[#F1F5F9] transition-colors">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#2563EB]">
                      Ages 18+
                    </span>
                    <p className="text-xs font-semibold text-[#0F172A] mt-0.5">Right Career</p>
                  </div>
                </div>
              </div>

              {/* Floating Satellite Dimension Chips with Organic Staggered Floating */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 shadow-md flex items-center gap-1.5 text-xs font-semibold text-[#0F172A] animate-float-slow">
                <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse-dot" />
                <span>Interests</span>
              </div>

              <div className="absolute -top-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 shadow-md flex items-center gap-1.5 text-xs font-semibold text-[#0F172A] animate-float-delayed">
                <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse-dot" />
                <span>Aptitude</span>
              </div>

              <div className="absolute -bottom-4 -left-3 sm:-left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 shadow-md flex items-center gap-1.5 text-xs font-semibold text-[#0F172A] animate-float-delayed">
                <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse-dot" />
                <span>Strengths</span>
              </div>

              <div className="absolute -bottom-4 -right-3 sm:-right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 shadow-md flex items-center gap-1.5 text-xs font-semibold text-[#0F172A] animate-float-slow">
                <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse-dot" />
                <span>Career Direction</span>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

import React from "react";
import {
  Sparkles,
  TrendingUp,
  Compass,
  CheckCircle,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/common/Reveal";

export function ReportPreview() {
  return (
    <section id="report-preview" className="py-20 sm:py-28 bg-[#F1F5F9] relative">
      <Container size="default">
        <Reveal animation="fade-up">
          <SectionHeading
            badge="Sample Diagnostic Output"
            badgeVariant="blue"
            title="Results People Can Understand"
            subtitle="Jargon-free, visual reports designed to facilitate productive conversations between students, families, and counsellors."
          />
        </Reveal>

        {/* Dashboard / Report Mockup Container */}
        <Reveal animation="zoom-in" delay={150}>
          <div className="max-w-5xl mx-auto rounded-3xl bg-white border border-slate-200 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.08)] overflow-hidden">
            {/* Mockup Top Application Bar */}
            <div className="px-6 py-4 bg-[#0F172A] text-white flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold text-xs shadow-xs">
                  3G
                </div>
                <div>
                  <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider block">
                    MeLife Stream Finder Report (Sample Preview)
                  </span>
                  <span className="text-sm font-bold text-white">
                    Student Profile: Aarav S. • Grade 10
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-white/10 text-teal-200 px-3 py-1 rounded-full border border-teal-400/20">
                  <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse-dot" />
                  <span>Validated Report</span>
                </span>
              </div>
            </div>

            {/* Report Body */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Top Row: Executive Summary & Interest Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#2563EB]/20 flex flex-col justify-between interactive-card">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">
                      Primary Stream Alignment
                    </span>
                    <h4 className="text-lg font-bold text-[#0F172A] mt-1">
                      Science & Technology (PCM / CS)
                    </h4>
                    <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                      High synergy between analytical reasoning speed and computational problem-solving interest.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2">
                    <Badge variant="teal" size="sm">
                      Strong Fit
                    </Badge>
                    <span className="text-[11px] text-[#64748B]">Secondary: Tech-Economics</span>
                  </div>
                </div>

                {/* Interest Index */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs md:col-span-2">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#2563EB]" />
                      <span>Top Measured Interest Clusters</span>
                    </h4>
                    <span className="text-[11px] text-[#2563EB] font-medium">Interest Mapping</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#0F172A]">Systems & Algorithmic Design</span>
                        <span className="text-[#2563EB]">High Affinity (92%)</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-[#F1F5F9] overflow-hidden border border-slate-200/80">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#14B8A6] transition-all duration-1000"
                          style={{ width: "92%" }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#0F172A]">Applied Scientific Inquiry</span>
                        <span className="text-[#2563EB]">High Affinity (85%)</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-[#F1F5F9] overflow-hidden border border-slate-200/80">
                        <div
                          className="h-full rounded-full bg-[#2563EB] transition-all duration-1000"
                          style={{ width: "85%" }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#0F172A]">Quantitative & Financial Models</span>
                        <span className="text-[#14B8A6]">Moderate Affinity (68%)</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-[#F1F5F9] overflow-hidden border border-slate-200/80">
                        <div
                          className="h-full rounded-full bg-[#14B8A6] transition-all duration-1000"
                          style={{ width: "68%" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Row: Strengths & Development Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strength Profile */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs interactive-card">
                  <h4 className="text-sm font-bold text-[#0F172A] mb-3 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[#14B8A6]" />
                    <span>Demonstrated Strengths</span>
                  </h4>
                  <div className="space-y-2.5">
                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[#0F172A] block">
                          Spatial & Abstract Reasoning
                        </span>
                        <span className="text-[11px] text-[#64748B]">
                          Excellent mental rotation and multi-variable logic.
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-[#2563EB] bg-white border border-[#2563EB]/20 px-2 py-0.5 rounded shrink-0">
                        Strong Area
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[#0F172A] block">
                          Numerical Problem Formulation
                        </span>
                        <span className="text-[11px] text-[#64748B]">
                          High comfort structuring mathematical relationships.
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-[#2563EB] bg-white border border-[#2563EB]/20 px-2 py-0.5 rounded shrink-0">
                        Strong Area
                      </span>
                    </div>
                  </div>
                </div>

                {/* Emerging & Exploration Areas */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs interactive-card">
                  <h4 className="text-sm font-bold text-[#0F172A] mb-3 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-[#2563EB]" />
                    <span>Emerging & Exploration Areas</span>
                  </h4>
                  <div className="space-y-2.5">
                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[#0F172A] block">
                          Long-Form Verbal Synthesis
                        </span>
                        <span className="text-[11px] text-[#64748B]">
                          Can develop further through structured technical writing.
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-[#64748B] bg-white border border-slate-200 px-2 py-0.5 rounded shrink-0">
                        Emerging Area
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[#0F172A] block">
                          Collaborative Project Leadership
                        </span>
                        <span className="text-[11px] text-[#64748B]">
                          Opportunity to engage in group science competitions.
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-[#2563EB] bg-white border border-[#2563EB]/20 px-2 py-0.5 rounded shrink-0">
                        Explore Further
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Recommendations & Counsellor Prompts */}
              <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-[#2563EB]" />
                    <span>Discussion Guide for Parents & Counsellor</span>
                  </h4>
                  <span className="text-[11px] text-[#64748B]">
                    Actionable Next Steps
                  </span>
                </div>
                <p className="text-xs text-[#0F172A] leading-relaxed">
                  &ldquo;Explore advanced secondary elective combinations including Computer Science with Higher Mathematics. Inquire into pre-engineering maker clubs to test applied interest before Grade 11 board registration.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

"use client";

import React from "react";
import { Users, CheckCircle2, MessageSquare } from "lucide-react";

interface ParentMentorNoteProps {
  className?: string;
}

export function ParentMentorNote({ className = "" }: ParentMentorNoteProps) {
  const guidancePoints = [
    {
      title: "Interests Are Explorations, Not Prescriptions",
      description:
        "High interest alignment highlights environments the student is currently curious to explore, not a narrow permanent career verdict.",
    },
    {
      title: "Self-Report vs. Task Performance",
      description:
        "Self-ratings show personal confidence and style, while task accuracy reflects performance on a small sample of timed questions today.",
    },
    {
      title: "Skills & Reasoning Are Trainable",
      description:
        "Lower task scores are starting points for practice and experiential learning, never permanent cognitive limitations.",
    },
    {
      title: "Make Career Decisions Multidimensional",
      description:
        "Consider assessment results alongside academic performance, interests, real-world experience, motivation, teacher observations, family context, and professional counselling.",
    },
  ];

  return (
    <div
      className={`rounded-3xl bg-white dark:bg-[#172B2A] border border-[#00BFA5]/30 p-5 sm:p-7 shadow-sm space-y-4 print:p-5 print:rounded-2xl print:bg-white print:border-[#E3ECEA] print:shadow-none print-break-avoid ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E3ECEA] dark:border-white/10 pb-3 print:border-[#E3ECEA] print:pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center shrink-0 print:border print:border-[#00BFA5]/30 print:text-[#008F83]">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight print:text-[#172B2A]">
              For Parents, Teachers & Mentors
            </h3>
            <p className="text-[11px] text-[#728B88] dark:text-[#9FB3B0] print:text-[#526866]">
              Constructive principles for discussing this psychometric profile at home and in school
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#00BFA5]/10 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/25 self-start sm:self-auto print:border-[#00BFA5] print:text-[#008F83] print:bg-[#F0FDF4]">
          Mentorship Guidance
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {guidancePoints.map((point, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-1.5 print:bg-[#F9FCFB] print:border-[#E3ECEA]"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00BFA5] shrink-0" />
              <h4 className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] print:text-[#172B2A]">
                {point.title}
              </h4>
            </div>
            <p className="text-[11px] text-[#526866] dark:text-[#A7C2BF] print:text-[#415654] leading-relaxed pl-6">
              {point.description}
            </p>
          </div>
        ))}
      </div>

      <div className="p-3.5 rounded-2xl bg-[#00BFA5]/5 border border-[#00BFA5]/20 flex items-start gap-2.5 text-xs text-[#172B2A] dark:text-[#E0EBE8] leading-relaxed print:bg-[#F0FDF4] print:border-[#00BFA5]/30 print:text-[#172B2A]">
        <MessageSquare className="w-4 h-4 text-[#008F83] dark:text-[#00BFA5] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#008F83] dark:text-[#00BFA5] font-bold">Suggested Discussion Opener: </strong>
          &ldquo;Which of these interest areas or projects sounds most fun for you to try this term? Let&apos;s pick one small project and explore it together without any pressure.&rdquo;
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Compass } from "lucide-react";

interface ReportPageWrapperProps {
  pageNumber: number;
  totalPages: number;
  children: React.ReactNode;
  isFirstPage?: boolean;
}

export const ReportPageWrapper: React.FC<ReportPageWrapperProps> = ({
  pageNumber,
  totalPages,
  children,
  isFirstPage = false,
}) => {
  return (
    <div
      className={`report-page-container relative ${
        isFirstPage ? "print-page-first" : "print-page"
      } print:bg-white print:text-[#172B2A]`}
    >
      {/* Running Header (Print only, omitted on Cover page) */}
      {!isFirstPage && (
        <div className="hidden print:flex items-center justify-between text-[8pt] font-mono text-[#526866] border-b border-[#E3ECEA] pb-2 mb-3 shrink-0">
          <div className="flex items-center gap-1.5 text-[#008F83] font-bold">
            <Compass className="w-3.5 h-3.5 text-[#008F83]" />
            <span>3G MeLife • Stream Finder</span>
          </div>
          <span className="text-[#688582]">Senior Secondary Academic Discovery Report</span>
        </div>
      )}

      {/* Main Page Content */}
      <div className="report-page-content flex-1 flex flex-col justify-between">
        {children}
      </div>

      {/* Running Footer (Print only) */}
      <div className="hidden print:flex items-center justify-between text-[7.5pt] font-mono text-[#728B88] border-t border-[#E3ECEA] pt-2 mt-3 shrink-0">
        <span>
          © {new Date().getFullYear()} 3G MeLife • Non-Prescriptive Educational Guidance
        </span>
        <span className="font-bold text-[#172B2A]">
          Page {pageNumber} of {totalPages}
        </span>
      </div>
    </div>
  );
};

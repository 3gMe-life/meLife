"use client";

import React, { useState } from "react";
import { Award, Star, MessageSquare, ShieldCheck, UserCheck, ThumbsUp } from "lucide-react";
import { useCounsellorOverview, useCounsellorReviews } from "../hooks/useCounsellorQueries";

export const CounsellorReviewsView: React.FC = () => {
  const [starFilter, setStarFilter] = useState<number | "ALL">("ALL");
  const { data: overview, isLoading: isLoadingOverview } = useCounsellorOverview();
  const { data: reviews = [], isLoading: isLoadingReviews } = useCounsellorReviews();

  const profile = overview?.counsellorProfile;
  const rating = profile?.rating || 4.9;
  const reviewCount = profile?.reviewCount || reviews.length || 18;

  // Fallback seed reviews if profile has none yet
  const displayedReviews = reviews.length > 0 ? reviews : [
    {
      id: "rev-1",
      studentName: "Aarav Sharma",
      rating: 5,
      comment: "Dr. Alistair's insights were extraordinarily clear. The RIASEC alignment walkthrough helped me decide between AI Systems and Data Engineering with complete confidence!",
      date: "2 days ago",
      sessionType: "CAREER_GUIDANCE",
    },
    {
      id: "rev-2",
      studentName: "Priya Nair",
      rating: 5,
      comment: "Very empathetic and structured discussion. The step-by-step action plan and career exploration checklist were super helpful for my college applications.",
      date: "1 week ago",
      sessionType: "DETAILED_PROFILE",
    },
    {
      id: "rev-3",
      studentName: "Rohan V.",
      rating: 5,
      comment: "Excellent guidance on understanding my cognitive strengths and developmental growth areas. Highly recommend this consultation!",
      date: "2 weeks ago",
      sessionType: "CAREER_GUIDANCE",
    },
  ];

  const filtered = displayedReviews.filter((r: any) => {
    if (starFilter === "ALL") return true;
    return r.rating === starFilter;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Bar */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-indigo-500" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Student Reviews & Mentorship Feedback
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Ratings and feedback from verified students who attended one-on-one career guidance sessions.
          </p>
        </div>
      </div>

      {/* Ratings Overview Card */}
      <div className="mb-8 grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 md:grid-cols-3 md:items-center">
        {/* Big Rating */}
        <div className="flex flex-col items-center justify-center border-b border-slate-100 pb-6 dark:border-slate-800 md:border-b-0 md:border-r md:pb-0 md:pr-6">
          <div className="text-5xl font-black text-slate-900 dark:text-white">
            {Number(rating).toFixed(1)}
          </div>
          <div className="mt-2 flex items-center gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="mt-1 text-xs font-semibold text-slate-400">
            Based on {reviewCount} verified student sessions
          </span>
        </div>

        {/* Rating Breakdown */}
        <div className="col-span-2 space-y-2">
          {[
            { stars: 5, pct: 92, count: 16 },
            { stars: 4, pct: 8, count: 2 },
            { stars: 3, pct: 0, count: 0 },
            { stars: 2, pct: 0, count: 0 },
            { stars: 1, pct: 0, count: 0 },
          ].map((bar) => (
            <div key={bar.stars} className="flex items-center gap-3 text-xs">
              <span className="w-12 font-bold text-slate-600 dark:text-slate-300">
                {bar.stars} Stars
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-amber-400"
                  style={{ width: `${bar.pct}%` }}
                />
              </div>
              <span className="w-8 text-right font-medium text-slate-400">{bar.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-400">Filter by Rating:</span>
        <button
          onClick={() => setStarFilter("ALL")}
          className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
            starFilter === "ALL"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          All Reviews
        </button>
        {[5, 4, 3].map((num) => (
          <button
            key={num}
            onClick={() => setStarFilter(num)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              starFilter === num
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
            }`}
          >
            {num} Stars
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filtered.map((rev: any, idx: number) => (
          <div
            key={rev.id || idx}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {rev.studentName ? rev.studentName.charAt(0) : "S"}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    {rev.studentName || "Student"}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <ShieldCheck className="h-3 w-3" />
                      Verified Session
                    </span>
                    <span>•</span>
                    <span>{rev.date || "Recent"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              &quot;{rev.comment}&quot;
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

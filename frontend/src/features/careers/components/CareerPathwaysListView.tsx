"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  Globe,
  Compass,
  Filter,
  ArrowRight,
  BookOpenCheck,
} from "lucide-react";
import { CareerMatchDTO } from "../types/career.types";
import { CareerCard } from "./CareerCard";
import { CareerDetailModal } from "./CareerDetailModal";

interface CareerPathwaysListViewProps {
  recommendations: CareerMatchDTO[];
  isAssessed: boolean;
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}

const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", native: "English", dir: "ltr" },
  { code: "ml", label: "Malayalam", native: "മലയാളം", dir: "ltr" },
  { code: "hi", label: "Hindi", native: "हिन्दी", dir: "ltr" },
  { code: "ar", label: "Arabic", native: "العربية", dir: "rtl" },
  { code: "ta", label: "Tamil", native: "தமிழ்", dir: "ltr" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ", dir: "ltr" },
];

export function CareerPathwaysListView({
  recommendations,
  isAssessed,
  currentLanguage,
  onLanguageChange,
}: CareerPathwaysListViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"match" | "title">("match");
  const [previewCareer, setPreviewCareer] = useState<CareerMatchDTO | null>(null);

  const activeLangConfig =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
  const isRtl = activeLangConfig.dir === "rtl";

  // Derive unique categories from recommendations
  const categories = useMemo(() => {
    const set = new Set<string>();
    recommendations.forEach((c) => set.add(c.category));
    return ["ALL", ...Array.from(set)];
  }, [recommendations]);

  // Filter & sort recommendations
  const filteredCareers = useMemo(() => {
    return recommendations
      .filter((c) => {
        const matchesCategory =
          selectedCategory === "ALL" ||
          c.category.toLowerCase().includes(selectedCategory.toLowerCase());
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          c.title.toLowerCase().includes(query) ||
          c.category.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.keySkills.some((s) => s.toLowerCase().includes(query));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "match") return b.matchPercentage - a.matchPercentage;
        return a.title.localeCompare(b.title);
      });
  }, [recommendations, selectedCategory, searchQuery, sortBy]);

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#172B2A] via-[#102423] to-[#0D1C1B] text-white p-6 sm:p-10 border border-white/10 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#00BFA5]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-[#00B8D4]/10 blur-2xl pointer-events-none" />

        <div className="relative space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-[#00BFA5]/20 text-[#00BFA5] border border-[#00BFA5]/30 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAssessed ? "AI Mapped Pathways" : "Career Exploration"}</span>
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-white/90 border border-white/15">
                {recommendations.length} Pathways Available
              </span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-semibold">
              <Globe className="w-3.5 h-3.5 text-[#00BFA5]" />
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="bg-transparent text-white focus:outline-none cursor-pointer font-bold pr-1"
                aria-label="Select career exploration language"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option
                    key={lang.code}
                    value={lang.code}
                    className="bg-[#172B2A] text-white"
                  >
                    {lang.native} ({lang.label})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white mb-2">
              Curated Career Pathways
            </h1>
            <p className="text-xs sm:text-sm text-[#9FB3B0] max-w-2xl leading-relaxed">
              Explore careers, academic pathways, and future opportunities mapped to your psychometric profile and natural cognitive strengths.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Assessment Invitation Banner (if not assessed yet) */}
      {!isAssessed && (
        <div className="rounded-3xl bg-gradient-to-r from-amber-500/15 via-[#00BFA5]/15 to-emerald-500/15 border border-[#00BFA5]/30 p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-black text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#00BFA5]" />
              <span>Unlock Your Personalized AI Career Matching</span>
            </h3>
            <p className="text-xs text-[#526866] dark:text-[#9FB3B0] max-w-xl">
              Complete the Skill Finder psychometric assessment to calibrate your exact interest and cognitive dimensions against these career pathways.
            </p>
          </div>

          <Link
            href="/participant/assessments/SKILL_FINDER"
            className="px-5 py-2.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-black transition-all shadow-md shadow-[#00BFA5]/25 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <BookOpenCheck className="w-4 h-4" />
            <span>Start Skill Finder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 3. Filter Bar & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 rounded-2xl p-4 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#728B88] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search careers, skills, or industries..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs text-[#172B2A] dark:text-[#F7FAF9] placeholder-[#728B88] focus:outline-none focus:border-[#00BFA5]"
          />
        </div>

        {/* Category Dropdown & Sort */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#526866] dark:text-[#9FB3B0]">
            <Filter className="w-3.5 h-3.5 text-[#00BFA5]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none cursor-pointer"
              aria-label="Filter by category"
            >
              <option value="ALL">All Categories</option>
              {categories
                .filter((c) => c !== "ALL")
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-[#526866] dark:text-[#9FB3B0]">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "match" | "title")}
              className="px-3 py-2 rounded-xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none cursor-pointer"
              aria-label="Sort careers"
            >
              <option value="match">Highest Match</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Career Pathways Grid */}
      {filteredCareers.length === 0 ? (
        <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9]">
            No Career Pathways Match Your Filter
          </h3>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
            Try adjusting your search terms or selecting a different category.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("ALL");
            }}
            className="px-4 py-2 rounded-xl bg-[#00BFA5] text-[#172B2A] text-xs font-bold cursor-pointer hover:bg-[#008F83] hover:text-white transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((career) => (
            <CareerCard
              key={career.id || career.slug}
              career={career}
              onQuickView={(c) => setPreviewCareer(c)}
            />
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      <CareerDetailModal
        career={previewCareer}
        isOpen={Boolean(previewCareer)}
        onClose={() => setPreviewCareer(null)}
      />
    </div>
  );
}

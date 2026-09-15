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
  Layers,
  LayoutGrid,
  CheckCircle2,
  TrendingUp,
  Cpu,
  HeartPulse,
  DollarSign,
  Wrench,
  Palette,
  GraduationCap,
  Briefcase,
  Scale,
  Leaf,
  Tv,
  Building,
} from "lucide-react";
import {
  CareerMatchDTO,
  CareerDomainSummary,
  CareerTier,
} from "../types/career.types";
import { CareerCard } from "./CareerCard";
import { CareerDetailModal } from "./CareerDetailModal";

interface CareerPathwaysListViewProps {
  recommendations: CareerMatchDTO[];
  domainSummaries?: CareerDomainSummary[];
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
  domainSummaries = [],
  isAssessed,
  currentLanguage,
  onLanguageChange,
}: CareerPathwaysListViewProps) {
  const [activeTab, setActiveTab] = useState<"RECOMMENDED" | "DOMAINS" | "ALL">("RECOMMENDED");
  const [selectedDomain, setSelectedDomain] = useState<string>("ALL");
  const [selectedTier, setSelectedTier] = useState<CareerTier | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"match" | "title">("match");
  const [previewCareer, setPreviewCareer] = useState<CareerMatchDTO | null>(null);

  const activeLangConfig =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
  const isRtl = activeLangConfig.dir === "rtl";

  // Derive unique domains from recommendations if domainSummaries is not fully provided
  const availableDomains = useMemo(() => {
    if (domainSummaries && domainSummaries.length > 0) {
      return domainSummaries;
    }
    const map = new Map<string, { domainName: string; matchCount: number; maxScore: number }>();
    recommendations.forEach((c) => {
      const code = c.domainCode || c.category || "GENERAL";
      const name = c.domainName || c.category || "General";
      const existing = map.get(code) || { domainName: name, matchCount: 0, maxScore: 0 };
      existing.matchCount += 1;
      if (c.matchPercentage > existing.maxScore) existing.maxScore = c.matchPercentage;
      map.set(code, existing);
    });
    return Array.from(map.entries()).map(([code, val]) => ({
      domainCode: code,
      domainName: val.domainName,
      matchCount: val.matchCount,
      topMatchPercentage: val.maxScore,
    }));
  }, [recommendations, domainSummaries]);

  // Filter & sort recommendations
  const filteredCareers = useMemo(() => {
    return recommendations
      .filter((c) => {
        // Domain Filter
        const matchesDomain =
          selectedDomain === "ALL" ||
          (c.domainCode && c.domainCode.toLowerCase() === selectedDomain.toLowerCase()) ||
          c.category.toLowerCase().includes(selectedDomain.toLowerCase());

        // Tier Filter
        const matchesTier = selectedTier === "ALL" || c.tier === selectedTier;

        // Search Filter
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          c.title.toLowerCase().includes(query) ||
          (c.shortTitle && c.shortTitle.toLowerCase().includes(query)) ||
          c.category.toLowerCase().includes(query) ||
          (c.domainName && c.domainName.toLowerCase().includes(query)) ||
          (c.familyName && c.familyName.toLowerCase().includes(query)) ||
          (c.clusterName && c.clusterName.toLowerCase().includes(query)) ||
          c.description.toLowerCase().includes(query) ||
          (c.keySkills && c.keySkills.some((s) => s.toLowerCase().includes(query))) ||
          (c.coreSkills && c.coreSkills.some((s) => s.toLowerCase().includes(query)));

        return matchesDomain && matchesTier && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "match") return b.matchPercentage - a.matchPercentage;
        return a.title.localeCompare(b.title);
      });
  }, [recommendations, selectedDomain, selectedTier, searchQuery, sortBy]);

  // Tier groups for the Recommended View
  const primaryMatches = useMemo(
    () => filteredCareers.filter((c) => c.tier === "PRIMARY"),
    [filteredCareers]
  );
  const secondaryMatches = useMemo(
    () => filteredCareers.filter((c) => c.tier === "SECONDARY"),
    [filteredCareers]
  );
  const exploreFurtherMatches = useMemo(
    () => filteredCareers.filter((c) => c.tier === "EXPLORE_FURTHER" || c.tier === "DEVELOPING"),
    [filteredCareers]
  );

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#172B2A] via-[#102423] to-[#0D1C1B] text-white p-6 sm:p-10 border border-white/10 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#00BFA5]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-[#00B8D4]/10 blur-2xl pointer-events-none" />

        <div className="relative space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3.5 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-[#00BFA5]/20 text-[#00BFA5] border border-[#00BFA5]/30 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAssessed ? "Multi-Pillar Calibrated Matching" : "Global Career Taxonomy"}</span>
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-white/90 border border-white/15">
                {recommendations.length} Occupations Available
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
              Career Pathways & Global Occupations
            </h1>
            <p className="text-xs sm:text-sm text-[#9FB3B0] max-w-2xl leading-relaxed">
              Explore 100+ global occupations organized across 12 domains, with psychometric evidence synthesis mapping your cognitive strengths, interests, and academic stream compatibility.
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
              <span>Unlock Your Personalized Multi-Assessment Career Matching</span>
            </h3>
            <p className="text-xs text-[#526866] dark:text-[#9FB3B0] max-w-xl">
              Complete the Skill Finder, Stream Finder, or Career Finder assessments to calibrate your exact interest, cognitive, and academic vectors against these occupational pathways.
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

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E3ECEA] dark:border-white/10 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => {
            setActiveTab("RECOMMENDED");
            setSelectedDomain("ALL");
            setSelectedTier("ALL");
          }}
          className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "RECOMMENDED"
              ? "bg-[#00BFA5] text-[#172B2A] shadow-md shadow-[#00BFA5]/20"
              : "text-[#526866] dark:text-[#9FB3B0] hover:bg-[#F4F8F7] dark:hover:bg-white/5"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Recommended For You</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("DOMAINS");
          }}
          className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "DOMAINS"
              ? "bg-[#00BFA5] text-[#172B2A] shadow-md shadow-[#00BFA5]/20"
              : "text-[#526866] dark:text-[#9FB3B0] hover:bg-[#F4F8F7] dark:hover:bg-white/5"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Explore 12 Domains</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("ALL");
            setSelectedDomain("ALL");
            setSelectedTier("ALL");
          }}
          className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "ALL"
              ? "bg-[#00BFA5] text-[#172B2A] shadow-md shadow-[#00BFA5]/20"
              : "text-[#526866] dark:text-[#9FB3B0] hover:bg-[#F4F8F7] dark:hover:bg-white/5"
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>All Occupations ({recommendations.length})</span>
        </button>
      </div>

      {/* 4. Domain Pills Strip (shown in DOMAINS or ALL tab) */}
      {(activeTab === "DOMAINS" || activeTab === "ALL") && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedDomain("ALL")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedDomain === "ALL"
                ? "bg-[#172B2A] text-white dark:bg-white dark:text-[#172B2A]"
                : "bg-[#F4F8F7] dark:bg-white/5 text-[#526866] dark:text-[#9FB3B0] hover:bg-[#E3ECEA]"
            }`}
          >
            All Domains
          </button>
          {availableDomains.map((d) => (
            <button
              key={d.domainCode}
              type="button"
              onClick={() => setSelectedDomain(d.domainCode)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedDomain.toLowerCase() === d.domainCode.toLowerCase()
                  ? "bg-[#00BFA5] text-[#172B2A] shadow-sm font-black"
                  : "bg-[#F4F8F7] dark:bg-white/5 text-[#526866] dark:text-[#9FB3B0] hover:bg-[#E3ECEA]"
              }`}
            >
              <span>{d.domainName}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10 font-bold">
                {d.matchCount}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* 5. Filter Bar & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 rounded-2xl p-4 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#728B88] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search occupations, skills, roadmaps, or domains..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs text-[#172B2A] dark:text-[#F7FAF9] placeholder-[#728B88] focus:outline-none focus:border-[#00BFA5]"
          />
        </div>

        {/* Tier Filter & Sort */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#526866] dark:text-[#9FB3B0]">
            <Filter className="w-3.5 h-3.5 text-[#00BFA5]" />
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value as CareerTier | "ALL")}
              className="px-3 py-2 rounded-xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] focus:outline-none cursor-pointer"
              aria-label="Filter by alignment tier"
            >
              <option value="ALL">All Alignment Tiers</option>
              <option value="PRIMARY">Top Alignment (Primary)</option>
              <option value="SECONDARY">High Compatibility (Secondary)</option>
              <option value="EXPLORE_FURTHER">Recommended for Exploration</option>
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

      {/* 6. Content Views */}
      {filteredCareers.length === 0 ? (
        <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9]">
            No Occupations Match Your Filter
          </h3>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0]">
            Try adjusting your search terms, selecting a different domain, or clearing filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedDomain("ALL");
              setSelectedTier("ALL");
            }}
            className="px-4 py-2 rounded-xl bg-[#00BFA5] text-[#172B2A] text-xs font-bold cursor-pointer hover:bg-[#008F83] hover:text-white transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : activeTab === "RECOMMENDED" && selectedDomain === "ALL" && selectedTier === "ALL" && !searchQuery ? (
        /* Tiered Recommended View */
        <div className="space-y-10">
          {/* Section 1: Primary Pathways (Top Alignment) */}
          {primaryMatches.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Top Career Pathways</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30">
                      Strong Alignment
                    </span>
                  </h2>
                  <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-0.5">
                    Highest statistical synergy with your validated cognitive and interest profile.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {primaryMatches.map((career) => (
                  <CareerCard
                    key={career.id || career.slug}
                    career={career}
                    onQuickView={(c) => setPreviewCareer(c)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Secondary Pathways (High Compatibility) */}
          {secondaryMatches.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-[#E3ECEA] dark:border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                    <span>High Compatibility Opportunities</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-700 dark:text-sky-300 font-bold border border-sky-500/30">
                      Secondary Alignment
                    </span>
                  </h2>
                  <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-0.5">
                    Strong cross-disciplinary alignment offering fertile ground for accelerated skill growth.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {secondaryMatches.map((career) => (
                  <CareerCard
                    key={career.id || career.slug}
                    career={career}
                    onQuickView={(c) => setPreviewCareer(c)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Explore Further */}
          {exploreFurtherMatches.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-[#E3ECEA] dark:border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span>Explore Further</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 font-bold border border-purple-500/30">
                      Broader Horizons
                    </span>
                  </h2>
                  <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mt-0.5">
                    Pathways across adjacent domains to expand your perspective and future possibilities.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exploreFurtherMatches.map((career) => (
                  <CareerCard
                    key={career.id || career.slug}
                    career={career}
                    onQuickView={(c) => setPreviewCareer(c)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Flat Grid View (For Search, Domain, or All Views) */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#728B88] dark:text-[#9FB3B0]">
              Showing {filteredCareers.length} of {recommendations.length} occupations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCareers.map((career) => (
              <CareerCard
                key={career.id || career.slug}
                career={career}
                onQuickView={(c) => setPreviewCareer(c)}
              />
            ))}
          </div>
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

"use client";

import React, { useState } from "react";
import { Compass, Sparkles, HelpCircle, CheckCircle2, ChevronRight, BarChart3 } from "lucide-react";

export interface RiasecClusterInput {
  code: string;
  name: string;
  percentage: number;
  clusterTitle?: string;
  description?: string;
  key?: string;
}

interface RiasecRadarMapProps {
  clusters: RiasecClusterInput[];
  primaryOrientation?: string;
  secondaryOrientation?: string;
  summary?: string;
}

// 6 standard RIASEC clusters in Holland Hexagon order
const RIASEC_ORDER = [
  { key: "R", code: "REALISTIC", name: "Builder / Realistic", icon: "🔨", color: "#38BDF8", desc: "Hands-on, physical, mechanical, practical problem solving." },
  { key: "I", code: "INVESTIGATIVE", name: "Explorer / Investigative", icon: "🔬", color: "#00BFA5", desc: "Analytical, scientific, intellectual curiosity, deep inquiry." },
  { key: "A", code: "ARTISTIC", name: "Creator / Artistic", icon: "🎨", color: "#EC4899", desc: "Expressive, creative, original, unconventional and visual." },
  { key: "S", code: "SOCIAL", name: "Helper / Social", icon: "🤝", color: "#10B981", desc: "Empathetic, nurturing, collaborative, teaching, human-centric." },
  { key: "E", code: "ENTERPRISING", name: "Leader / Enterprising", icon: "🚀", color: "#F59E0B", desc: "Persuasive, energetic, leadership, initiative, enterprising." },
  { key: "C", code: "CONVENTIONAL", name: "Organizer / Conventional", icon: "📊", color: "#6366F1", desc: "Structured, systematic, detail-oriented, organized, reliable." },
];

export const RiasecRadarMap: React.FC<RiasecRadarMapProps> = ({
  clusters,
  primaryOrientation,
  secondaryOrientation,
  summary,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>("I");

  // Normalize and sort clusters into hexagon vertices
  const polygonPoints: Array<{
    key: string;
    code: string;
    name: string;
    score: number;
    color: string;
    icon: string;
    desc: string;
    x: number;
    y: number;
    labelX: number;
    labelY: number;
  }> = RIASEC_ORDER.map((item, index) => {
    // Find matching cluster from props
    const matched = clusters.find(
      (c) =>
        c.code.toUpperCase().includes(item.code) ||
        c.name.toLowerCase().includes(item.code.toLowerCase()) ||
        c.code.toUpperCase() === item.key ||
        c.name.toLowerCase().includes(item.name.toLowerCase().split("/")[0].trim())
    );

    const score = matched ? Math.min(100, Math.max(15, Math.round(matched.percentage))) : 50;
    const desc = matched?.description || item.desc;

    // Hexagon math on 400x400 SVG canvas, center (200, 200), radius max 130
    const angle = (index * 60 - 90) * (Math.PI / 180); // Start at top (Investigative / Realistic)
    const center = 200;
    const maxRadius = 130;
    const currentRadius = (score / 100) * maxRadius;

    const x = center + currentRadius * Math.cos(angle);
    const y = center + currentRadius * Math.sin(angle);

    // Label coordinate (outer perimeter)
    const labelRadius = maxRadius + 32;
    const labelX = center + labelRadius * Math.cos(angle);
    const labelY = center + labelRadius * Math.sin(angle);

    return {
      key: item.key,
      code: item.code,
      name: item.name,
      score,
      color: item.color,
      icon: item.icon,
      desc,
      x,
      y,
      labelX,
      labelY,
    };
  });

  // Generate SVG polygon point string
  const polygonString = polygonPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // Derive top 3 Holland Code letters
  const sortedByScore = [...polygonPoints].sort((a, b) => b.score - a.score);
  const hollandCode = sortedByScore.slice(0, 3).map((p) => p.key).join("-");
  const topTrait = sortedByScore[0];
  const secondTrait = sortedByScore[1];

  const activeCluster = polygonPoints.find((p) => p.key === selectedKey) || polygonPoints[0];

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0B1B19] via-[#112926] to-[#0A1615] border border-[#00BFA5]/30 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden print:p-5 print:rounded-2xl print:bg-none print:bg-white print:text-[#172B2A] print:border-[#E3ECEA]">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#00BFA5]/15 blur-3xl print:hidden" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-[#38BDF8]/15 blur-3xl print:hidden" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6 print:border-[#E3ECEA] print:pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>04. RIASEC Holland Interest Code</span>
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 print:border-[#00BFA5] print:text-[#008F83]">
              Code: {hollandCode}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight print:text-[#172B2A]">
            Holland Hexagon Interest Dynamics
          </h2>
          <p className="text-xs sm:text-sm text-[#9FB3B0] max-w-xl leading-relaxed print:text-[#526866]">
            Scientifically maps your vocational inclinations across 6 foundational interest clusters.
            {primaryOrientation && <span> Your primary pull centers on <strong>{primaryOrientation}</strong>.</span>}
          </p>
        </div>

        {/* Top Badges */}
        <div className="flex items-center gap-2 self-start sm:self-auto print:hidden">
          <div className="text-right px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">Primary Vector</div>
            <div className="text-xs font-black text-[#00BFA5] flex items-center gap-1">
              <span>{topTrait.icon}</span> {topTrait.name.split("/")[0]} ({topTrait.score}%)
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Radar Polygon (Left) & Detailed Dimension Drawer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: SVG Radar Canvas */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
          <div className="w-full max-w-[380px] aspect-square relative">
            <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-xl overflow-visible">
              <defs>
                {/* Glowing Radar Gradient */}
                <radialGradient id="riasecRadarGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00BFA5" stopOpacity="0.55" />
                  <stop offset="60%" stopColor="#00B8D4" stopOpacity="0.30" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.10" />
                </radialGradient>
                <linearGradient id="polyStrokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00BFA5" />
                  <stop offset="50%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>

              {/* Hexagon concentric grid rings (25%, 50%, 75%, 100%) */}
              {[0.25, 0.5, 0.75, 1].map((scale, i) => {
                const ringPoints = RIASEC_ORDER.map((_, idx) => {
                  const angle = (idx * 60 - 90) * (Math.PI / 180);
                  const r = 130 * scale;
                  return `${200 + r * Math.cos(angle)},${200 + r * Math.sin(angle)}`;
                }).join(" ");

                return (
                  <polygon
                    key={i}
                    points={ringPoints}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeDasharray={scale === 1 ? "none" : "3,3"}
                    className="print:stroke-[#E3ECEA]"
                  />
                );
              })}

              {/* Axis Spoke Lines */}
              {RIASEC_ORDER.map((_, idx) => {
                const angle = (idx * 60 - 90) * (Math.PI / 180);
                const x2 = 200 + 130 * Math.cos(angle);
                const y2 = 200 + 130 * Math.sin(angle);
                return (
                  <line
                    key={idx}
                    x1="200"
                    y1="200"
                    x2={x2}
                    y2={y2}
                    stroke="rgba(255, 255, 255, 0.12)"
                    strokeWidth="1"
                    className="print:stroke-[#E3ECEA]"
                  />
                );
              })}

              {/* The Data Polygon */}
              <polygon
                points={polygonString}
                fill="url(#riasecRadarGradient)"
                stroke="url(#polyStrokeGradient)"
                strokeWidth="2.5"
                className="transition-all duration-700 ease-out print:fill-[#00BFA5]/20 print:stroke-[#00BFA5]"
              />

              {/* Vertices Nodes & Clickable Hotspots */}
              {polygonPoints.map((pt) => {
                const isSelected = selectedKey === pt.key;
                return (
                  <g
                    key={pt.key}
                    onClick={() => setSelectedKey(pt.key)}
                    className="cursor-pointer group"
                  >
                    {/* Outer glow circle on active */}
                    {isSelected && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="14"
                        fill={pt.color}
                        fillOpacity="0.25"
                        className="animate-pulse"
                      />
                    )}
                    {/* Vertex Dot */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? "6.5" : "4.5"}
                      fill={pt.color}
                      stroke="#0B1B19"
                      strokeWidth="2"
                      className="transition-all duration-300 group-hover:scale-125 print:stroke-white"
                    />

                    {/* Outer Label */}
                    <text
                      x={pt.labelX}
                      y={pt.labelY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`text-[11px] font-black tracking-tight transition-all duration-200 select-none ${
                        isSelected
                          ? "fill-[#00BFA5] font-black scale-110"
                          : "fill-white/80 group-hover:fill-white font-bold print:fill-[#172B2A]"
                      }`}
                    >
                      {pt.key} - {pt.name.split("/")[0].trim()}
                    </text>
                    <text
                      x={pt.labelX}
                      y={pt.labelY + 13}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[10px] font-mono fill-white/50 print:fill-[#688582]"
                    >
                      {pt.score}%
                    </text>
                  </g>
                );
              })}

              {/* Center Code Badge */}
              <circle cx="200" cy="200" r="18" fill="#0E2422" stroke="#00BFA5" strokeWidth="1.5" className="print:fill-white print:stroke-[#00BFA5]" />
              <text
                x="200"
                y="201"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[10px] font-black fill-[#00BFA5] tracking-wider"
              >
                {hollandCode.split("-")[0] || "RIA"}
              </text>
            </svg>
          </div>

          <div className="text-[11px] text-[#9FB3B0] text-center mt-2 flex items-center gap-1.5 print:hidden">
            <Sparkles className="w-3.5 h-3.5 text-[#00BFA5]" />
            <span>Click any node on the hexagon to inspect dimensional drivers</span>
          </div>
        </div>

        {/* Right: Detailed Breakdown Drawer & Horizontal Score Bars */}
        <div className="lg:col-span-6 space-y-4">
          {/* Active Selected Dimension Spotlight Card */}
          <div
            className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 transition-all duration-300 relative overflow-hidden print:bg-[#F7FAF9] print:border-[#E3ECEA] print:text-[#172B2A]"
            style={{ borderLeftColor: activeCluster.color, borderLeftWidth: "4px" }}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl p-1.5 rounded-lg bg-white/10 print:bg-white">{activeCluster.icon}</span>
                <div>
                  <div className="text-sm font-black text-white flex items-center gap-2 print:text-[#172B2A]">
                    {activeCluster.name}
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${activeCluster.color}20`,
                        color: activeCluster.color,
                      }}
                    >
                      {activeCluster.score >= 75 ? "Dominant Orientation" : activeCluster.score >= 50 ? "Moderate Affinity" : "Latent Explorer"}
                    </span>
                  </div>
                  <span className="text-[10px] text-white/50 uppercase font-mono tracking-wider print:text-[#688582]">
                    Holland Code: {activeCluster.key} • {activeCluster.code}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black font-mono text-white print:text-[#172B2A]">{activeCluster.score}%</div>
                <div className="text-[9px] uppercase tracking-wider text-white/40 print:text-[#688582]">Fit Score</div>
              </div>
            </div>

            <p className="text-xs text-[#C5D6D3] leading-relaxed mt-2 print:text-[#415654]">
              {activeCluster.desc}
            </p>
          </div>

          {/* All 6 Clusters Compact Comparative Stack */}
          <div className="space-y-2 pt-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/50 flex items-center justify-between print:text-[#526866]">
              <span>Comparative Affinity Ranking</span>
              <span>Alignment %</span>
            </div>

            {sortedByScore.map((item, idx) => {
              const isSelected = selectedKey === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setSelectedKey(item.key)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                    isSelected
                      ? "bg-[#00BFA5]/15 border-[#00BFA5]/60 text-white shadow-sm print:bg-emerald-50 print:border-[#00BFA5]"
                      : "bg-white/[0.02] border-white/5 text-white/80 hover:bg-white/[0.06] hover:border-white/15 print:border-[#E3ECEA] print:text-[#172B2A]"
                  }`}
                >
                  <span className="text-xs font-mono font-black text-white/40 w-4">{idx + 1}.</span>
                  <span className="text-sm">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold truncate">{item.name}</span>
                      <span className="font-mono font-bold text-[#00BFA5]">{item.score}%</span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden print:bg-[#E3ECEA]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.score}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {summary && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-[#C5D6D3] leading-relaxed print:bg-emerald-50/50 print:border-[#00BFA5]/30 print:text-[#2A4442]">
              <span className="font-black text-[#00BFA5] uppercase tracking-wider block text-[10px] mb-0.5">Holland Profile Synthesis:</span>
              {summary}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

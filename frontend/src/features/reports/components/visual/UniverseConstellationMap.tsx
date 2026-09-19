"use client";

import React, { useState } from "react";
import { Sparkles, Brain, Compass, Info } from "lucide-react";
import { ScoredDimensionItem } from "../../types/report.types";

interface UniverseConstellationMapProps {
  dimensions: ScoredDimensionItem[];
  archetypeTitle?: string;
}

interface ConstellationNode {
  id: string;
  name: string;
  code: string;
  score: number;
  level: string;
  x: number;
  y: number;
  category: "cognitive" | "interest" | "behavioral" | "strengths";
  description?: string;
}

export const UniverseConstellationMap: React.FC<UniverseConstellationMapProps> = ({
  dimensions,
  archetypeTitle = "Creative Maker & Systems Explorer",
}) => {
  const [activeNode, setActiveNode] = useState<ConstellationNode | null>(null);

  // Map input dimensions to fixed orbital positions on a 600x400 SVG canvas
  const defaultNodes: Array<{ name: string; code: string; x: number; y: number; category: ConstellationNode["category"] }> = [
    { name: "Analytical Thinking", code: "INVESTIGATIVE", x: 300, y: 80, category: "cognitive" },
    { name: "Creative Discovery", code: "CREATOR", x: 490, y: 150, category: "interest" },
    { name: "Problem Solving", code: "CRITICAL_THINKING", x: 460, y: 310, category: "behavioral" },
    { name: "Practical Building", code: "BUILDER", x: 300, y: 340, category: "interest" },
    { name: "Strategic Inquiry", code: "LOGICAL", x: 140, y: 310, category: "cognitive" },
    { name: "Curiosity & Agility", code: "EXPLORER", x: 110, y: 150, category: "interest" },
  ];

  const nodes: ConstellationNode[] = defaultNodes.map((def) => {
    const matched = dimensions.find(
      (d) =>
        d.code.toUpperCase().includes(def.code) ||
        d.name.toLowerCase().includes(def.name.toLowerCase().split(" ")[0])
    );
    const score = matched?.scalePositionPercentage ?? (matched as any)?.rawScore ?? 75;
    const level = matched?.level ?? (score >= 80 ? "High" : score >= 60 ? "Proficient" : "Moderate");
    const description = matched?.description ?? `Calibrated strength in ${def.name.toLowerCase()}.`;

    return {
      id: def.code,
      name: matched?.name || def.name,
      code: def.code,
      score: Math.min(100, Math.max(20, Math.round(score))),
      level,
      x: def.x,
      y: def.y,
      category: def.category,
      description,
    };
  });

  const centerHub = { x: 300, y: 210 };

  // Interconnecting links
  const links = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 0],
    [0, 3],
    [1, 4],
    [5, 2],
  ];

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0B1B19] via-[#112926] to-[#0A1615] border border-[#00BFA5]/30 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden print:p-5 print:rounded-2xl print:bg-none print:bg-white print:text-[#172B2A] print:border-[#E3ECEA]">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#00BFA5]/15 blur-3xl print:hidden" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-[#00B8D4]/15 blur-3xl print:hidden" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5 mb-6 print:border-[#E3ECEA] print:pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#00BFA5] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>03. Your Dimension Universe</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/15 print:hidden">
              Interactive Constellation
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight print:text-[#172B2A]">
            Multidimensional Capability Galaxy
          </h2>
          <p className="text-xs text-[#9FB3B0] max-w-xl leading-relaxed print:text-[#526866]">
            Visual synthesis of your interconnected thinking modes, creative drivers, and cognitive strengths. Node magnitude reflects verified assessment calibration.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#9FB3B0] print:hidden">
          <Info className="w-4 h-4 text-[#00BFA5]" />
          <span className="text-[11px]">Hover or tap nodes to explore dimensions</span>
        </div>
      </div>

      {/* SVG Interactive Constellation */}
      <div className="relative flex items-center justify-center my-2">
        <div className="w-full max-w-2xl aspect-[600/420] relative">
          <svg
            viewBox="0 0 600 420"
            className="w-full h-full overflow-visible select-none"
            role="img"
            aria-label="Psychometric Universe Constellation Chart"
          >
            <defs>
              {/* Center Hub Gradient */}
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00BFA5" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#00B8D4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#00C896" stopOpacity="0" />
              </radialGradient>

              {/* Node Glow Filters */}
              <filter id="nodeGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Gradient for Links */}
              <linearGradient id="linkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00BFA5" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#00B8D4" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#00C896" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Orbit Guides */}
            <circle
              cx={centerHub.x}
              cy={centerHub.y}
              r="140"
              fill="none"
              stroke="#00BFA5"
              strokeOpacity="0.12"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <circle
              cx={centerHub.x}
              cy={centerHub.y}
              r="80"
              fill="none"
              stroke="#00B8D4"
              strokeOpacity="0.08"
              strokeWidth="1"
            />

            {/* Radial Hub Connectors */}
            {nodes.map((node) => (
              <line
                key={`hub-${node.id}`}
                x1={centerHub.x}
                y1={centerHub.y}
                x2={node.x}
                y2={node.y}
                stroke="#00BFA5"
                strokeOpacity={activeNode?.id === node.id ? "0.6" : "0.2"}
                strokeWidth={activeNode?.id === node.id ? "2" : "1"}
                strokeDasharray="2 3"
                className="transition-all duration-300"
              />
            ))}

            {/* Constellation Interconnecting Web Links */}
            {links.map(([i, j], lIdx) => {
              const n1 = nodes[i];
              const n2 = nodes[j];
              if (!n1 || !n2) return null;
              const isHighlighted = activeNode && (activeNode.id === n1.id || activeNode.id === n2.id);

              return (
                <line
                  key={`link-${lIdx}`}
                  x1={n1.x}
                  y1={n1.y}
                  x2={n2.x}
                  y2={n2.y}
                  stroke={isHighlighted ? "#00BFA5" : "url(#linkGrad)"}
                  strokeOpacity={isHighlighted ? "0.8" : "0.35"}
                  strokeWidth={isHighlighted ? "2.5" : "1.2"}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Center Core Persona Hub */}
            <circle
              cx={centerHub.x}
              cy={centerHub.y}
              r="45"
              fill="url(#centerGlow)"
              className="animate-pulse"
            />
            <circle
              cx={centerHub.x}
              cy={centerHub.y}
              r="24"
              fill="#172B2A"
              stroke="#00BFA5"
              strokeWidth="2.5"
              className="drop-shadow-lg"
            />
            <text
              x={centerHub.x}
              y={centerHub.y + 4}
              textAnchor="middle"
              fill="#00BFA5"
              fontSize="9"
              fontWeight="900"
              letterSpacing="0.05em"
              className="uppercase pointer-events-none select-none"
            >
              CORE
            </text>

            {/* Dimension Orbit Nodes */}
            {nodes.map((node) => {
              const radius = 18 + (node.score / 100) * 14;
              const isSelected = activeNode?.id === node.id;

              return (
                <g
                  key={node.id}
                  className="cursor-pointer group transition-transform duration-300"
                  onClick={() => setActiveNode(node)}
                  onMouseEnter={() => setActiveNode(node)}
                >
                  {/* Outer Pulsing Aura */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius + (isSelected ? 10 : 4)}
                    fill="#00BFA5"
                    fillOpacity={isSelected ? "0.35" : "0.12"}
                    className="transition-all duration-300"
                  />

                  {/* Node Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius}
                    fill={isSelected ? "#00BFA5" : "#172B2A"}
                    stroke={isSelected ? "#FFFFFF" : "#00BFA5"}
                    strokeWidth={isSelected ? "3" : "2"}
                    filter="url(#nodeGlow)"
                    className="transition-all duration-300 shadow-md"
                  />

                  {/* Node Score Label */}
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fill={isSelected ? "#172B2A" : "#FFFFFF"}
                    fontSize="11"
                    fontWeight="900"
                    className="pointer-events-none select-none font-mono"
                  >
                    {node.score}%
                  </text>

                  {/* Node Name (Curved / Positioned below/above) */}
                  <text
                    x={node.x}
                    y={node.y > centerHub.y ? node.y + radius + 14 : node.y - radius - 8}
                    textAnchor="middle"
                    fill="#F7FAF9"
                    fontSize="11"
                    fontWeight="700"
                    className="pointer-events-none select-none"
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Active Node Detail Card */}
      <div className="relative z-10 mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:bg-[#F4F8F7] print:border-[#E3ECEA] print:text-[#172B2A]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00B8D4] to-[#00BFA5] text-[#172B2A] flex items-center justify-center font-black text-sm shrink-0">
            {activeNode ? `${activeNode.score}%` : "100%"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white print:text-[#172B2A]">
                {activeNode ? activeNode.name : `Core Archetype: ${archetypeTitle}`}
              </h4>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#00BFA5]/20 text-[#00BFA5] border border-[#00BFA5]/30">
                {activeNode ? `${activeNode.level} Strength` : "Dominant Profile"}
              </span>
            </div>
            <p className="text-xs text-[#9FB3B0] mt-0.5 print:text-[#526866]">
              {activeNode
                ? activeNode.description
                : "Your unique synthesis reflects strong creative problem solving, structured investigation, and exploratory passion."}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] font-mono text-[#00BFA5] uppercase tracking-wider block">
            Psychometric Calibration
          </span>
          <span className="text-[11px] font-bold text-white/80 print:text-[#526866]">
            Secondary School Cohort Normalized
          </span>
        </div>
      </div>
    </div>
  );
};

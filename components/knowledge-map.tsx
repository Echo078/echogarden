"use client";

import { knowledgeCategories, knowledgeEntries } from "@/data/knowledge";

interface KnowledgeMapProps {
  activeCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

// Subtopics for each category (derived from tags and entries)
const categorySubtopics: Record<string, string[]> = {
  courses: ["DSP", "Physics", "Math"],
  instruments: ["GC-MS", "NMR", "Spectroscopy"],
  work: ["Writing", "Presentations", "Workflow"],
  formulas: ["Chemistry", "Units", "Equations"],
  tools: ["Python", "Git", "Setup"],
};

export function KnowledgeMap({ activeCategory, onCategorySelect }: KnowledgeMapProps) {
  const getCategoryCount = (categoryId: string) => {
    return knowledgeEntries.filter((e) => e.category === categoryId).length;
  };

  return (
    <div className="relative mb-12 overflow-hidden rounded-xl border border-foreground/6 bg-card/30 p-6 backdrop-blur-sm md:p-8">
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.015]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="0.5" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Map Title */}
      <div className="mb-6 flex items-center gap-3">
        <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground/40">
          Knowledge Network
        </span>
        <div className="h-px flex-1 bg-foreground/5" aria-hidden="true" />
      </div>

      {/* SVG Knowledge Tree */}
      <svg
        viewBox="0 0 800 280"
        className="w-full"
        style={{ maxHeight: "280px" }}
      >
        <defs>
          {/* Gradient for branches */}
          <linearGradient id="branchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
          </linearGradient>
          
          {/* Glow filter for active nodes */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Central Root Node */}
        <g className="text-primary">
          {/* Root circle */}
          <circle
            cx="400"
            cy="140"
            r="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.4"
          />
          <circle
            cx="400"
            cy="140"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <circle
            cx="400"
            cy="140"
            r="6"
            fill="currentColor"
            opacity="0.8"
          />
          
          {/* Decorative rings */}
          <circle
            cx="400"
            cy="140"
            r="32"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="2 4"
            opacity="0.2"
          />
        </g>

        {/* Branch paths to each category */}
        {knowledgeCategories.map((category, index) => {
          const angle = (index - 2) * 35 * (Math.PI / 180); // Spread from -70 to +70 degrees
          const isActive = activeCategory === category.id;
          const isHighlighted = activeCategory === null || isActive;
          
          // Calculate positions
          const branchLength = 120;
          const endX = 400 + Math.cos(angle) * branchLength;
          const endY = 140 - Math.sin(angle) * branchLength;
          
          // Control points for curved branches
          const ctrlX = 400 + Math.cos(angle) * 60;
          const ctrlY = 140 - Math.sin(angle) * 30;

          const subtopics = categorySubtopics[category.id] || [];

          return (
            <g
              key={category.id}
              className={`cursor-pointer transition-opacity duration-300 ${
                isHighlighted ? "opacity-100" : "opacity-30"
              }`}
              onClick={() => onCategorySelect(isActive ? null : category.id)}
            >
              {/* Main branch curve */}
              <path
                d={`M 400 140 Q ${ctrlX} ${ctrlY} ${endX} ${endY}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={isActive ? "2" : "1"}
                className={`text-primary transition-all duration-300 ${
                  isActive ? "opacity-80" : "opacity-40"
                }`}
              />

              {/* Category node */}
              <g filter={isActive ? "url(#glow)" : undefined}>
                <circle
                  cx={endX}
                  cy={endY}
                  r={isActive ? "14" : "10"}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={isActive ? "2" : "1"}
                  className={`text-primary transition-all duration-300 ${
                    isActive ? "opacity-90" : "opacity-50"
                  }`}
                />
                <circle
                  cx={endX}
                  cy={endY}
                  r="4"
                  fill="currentColor"
                  className={`text-primary transition-all duration-300 ${
                    isActive ? "opacity-90" : "opacity-60"
                  }`}
                />
              </g>

              {/* Category label */}
              <text
                x={endX + (Math.cos(angle) > 0 ? 20 : -20)}
                y={endY + 4}
                textAnchor={Math.cos(angle) > 0 ? "start" : "end"}
                className={`fill-current text-[11px] transition-all duration-300 ${
                  isActive ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {category.name.split(" & ")[0]}
              </text>

              {/* Count badge */}
              <text
                x={endX + (Math.cos(angle) > 0 ? 20 : -20)}
                y={endY + 16}
                textAnchor={Math.cos(angle) > 0 ? "start" : "end"}
                className="fill-current text-[8px] text-muted-foreground/50"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {getCategoryCount(category.id)} entries
              </text>

              {/* Subtopic branches */}
              {subtopics.map((subtopic, subIndex) => {
                // Spread subtopics more and offset from main branch direction
                const subAngleOffset = (subIndex - 1) * 25; // Wider spread: 25 degrees apart
                const subAngle = angle + (subAngleOffset * (Math.PI / 180));
                const subLength = 85; // Longer branches
                const subEndX = endX + Math.cos(subAngle) * subLength;
                const subEndY = endY - Math.sin(subAngle) * subLength;

                // Position label further from node
                const labelOffset = 14;
                const labelX = subEndX + (Math.cos(subAngle) > 0 ? labelOffset : -labelOffset);
                const labelY = subEndY + (Math.sin(subAngle) < -0.3 ? -6 : Math.sin(subAngle) > 0.3 ? 10 : 4);

                return (
                  <g key={subtopic}>
                    {/* Subtopic branch */}
                    <line
                      x1={endX}
                      y1={endY}
                      x2={subEndX}
                      y2={subEndY}
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className={`text-primary transition-all duration-300 ${
                        isActive ? "opacity-50" : "opacity-20"
                      }`}
                    />
                    
                    {/* Subtopic node */}
                    <circle
                      cx={subEndX}
                      cy={subEndY}
                      r="3"
                      fill="currentColor"
                      className={`text-primary transition-all duration-300 ${
                        isActive ? "opacity-60" : "opacity-25"
                      }`}
                    />

                    {/* Subtopic label (only show when active) */}
                    {isActive && (
                      <text
                        x={labelX}
                        y={labelY}
                        textAnchor={Math.cos(subAngle) > 0 ? "start" : "end"}
                        className="fill-current text-[10px] text-foreground"
                        style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}
                      >
                        {subtopic}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Central label */}
        <text
          x="400"
          y="185"
          textAnchor="middle"
          className="fill-current text-[9px] text-muted-foreground/40"
          style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em" }}
        >
          Knowledge Root
        </text>
      </svg>

      {/* Interaction hint */}
      <div className="mt-4 text-center">
        <p className="font-serif text-[10px] italic text-muted-foreground/40">
          Select a branch to explore
        </p>
      </div>
    </div>
  );
}

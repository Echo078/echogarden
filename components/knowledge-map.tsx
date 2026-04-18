"use client";

import { knowledgeCategories, knowledgeEntries } from "@/data/knowledge";

interface KnowledgeMapProps {
  activeCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

// Subtopics for each category
const categorySubtopics: Record<string, string[]> = {
  courses: ["DSP", "Physics", "Math"],
  instruments: ["GC-MS", "NMR", "Spectroscopy"],
  work: ["Writing", "Presentations", "Workflow"],
  formulas: ["Chemistry", "Units", "Equations"],
  tools: ["Python", "Git", "Setup"],
};

// Fixed positions for horizontal layout - all branches spread left and right with more vertical spread
const branchPositions = [
  { angle: 140, labelSide: "left" as const },   // Courses - upper left
  { angle: 180, labelSide: "left" as const },   // Instruments - middle left
  { angle: 220, labelSide: "left" as const },   // Work - lower left
  { angle: 0, labelSide: "right" as const },    // Formulas - upper right
  { angle: 330, labelSide: "right" as const },  // Tools - lower right
];

export function KnowledgeMap({ activeCategory, onCategorySelect }: KnowledgeMapProps) {
  const getCategoryCount = (categoryId: string) => {
    return knowledgeEntries.filter((e) => e.category === categoryId).length;
  };

  const centerX = 400;
  const centerY = 130;
  const branchLength = 100;
  const subBranchLength = 45;

  return (
    <div className="relative mb-6 overflow-hidden rounded-xl border border-foreground/6 bg-card/30 px-4 py-4 backdrop-blur-sm md:px-6">
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.015]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="0.5" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* SVG Knowledge Tree - Horizontal Layout */}
      <svg
        viewBox="0 0 800 260"
        className="w-full"
        style={{ maxHeight: "260px" }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Central Root Node */}
        <g className="text-primary">
          <circle cx={centerX} cy={centerY} r="18" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <circle cx={centerX} cy={centerY} r="10" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          <circle cx={centerX} cy={centerY} r="4" fill="currentColor" opacity="0.7" />
        </g>

        {/* Branch paths to each category */}
        {knowledgeCategories.map((category, index) => {
          const pos = branchPositions[index];
          const angleRad = (pos.angle * Math.PI) / 180;
          const isActive = activeCategory === category.id;
          const isHighlighted = activeCategory === null || isActive;
          
          const endX = centerX + Math.cos(angleRad) * branchLength;
          const endY = centerY + Math.sin(angleRad) * branchLength;
          
          const subtopics = categorySubtopics[category.id] || [];

          // Label positioning
          const labelX = pos.labelSide === "left" ? endX - 14 : endX + 14;
          const labelAnchor = pos.labelSide === "left" ? "end" : "start";

          return (
            <g
              key={category.id}
              className={`cursor-pointer transition-opacity duration-300 ${
                isHighlighted ? "opacity-100" : "opacity-30"
              }`}
              onClick={() => onCategorySelect(isActive ? null : category.id)}
            >
              {/* Main branch line */}
              <line
                x1={centerX}
                y1={centerY}
                x2={endX}
                y2={endY}
                stroke="currentColor"
                strokeWidth={isActive ? "1.5" : "1"}
                className={`text-primary transition-all duration-300 ${
                  isActive ? "opacity-70" : "opacity-30"
                }`}
              />

              {/* Category node */}
              <g filter={isActive ? "url(#glow)" : undefined}>
                <circle
                  cx={endX}
                  cy={endY}
                  r={isActive ? "10" : "7"}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={isActive ? "1.5" : "1"}
                  className={`text-primary transition-all duration-300 ${
                    isActive ? "opacity-80" : "opacity-40"
                  }`}
                />
                <circle
                  cx={endX}
                  cy={endY}
                  r="3"
                  fill="currentColor"
                  className={`text-primary transition-all duration-300 ${
                    isActive ? "opacity-80" : "opacity-50"
                  }`}
                />
              </g>

              {/* Category label - Level 2 */}
              <text
                x={labelX}
                y={endY + 1}
                textAnchor={labelAnchor}
                className={`fill-current text-[10px] transition-all duration-300 ${
                  isActive ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {category.name.split(" & ")[0]}
              </text>

              {/* Count - below category name */}
              <text
                x={labelX}
                y={endY + 12}
                textAnchor={labelAnchor}
                className="fill-current text-[7px] text-muted-foreground/40"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {getCategoryCount(category.id)}
              </text>

              {/* Subtopic branches - Level 3 */}
              {subtopics.map((subtopic, subIndex) => {
                // Fan out subtopics perpendicular to main branch
                const baseSubAngle = pos.angle + 90; // perpendicular
                const subSpread = 35; // degrees between subtopics
                const subAngleOffset = (subIndex - 1) * subSpread;
                const subAngleRad = ((baseSubAngle + subAngleOffset) * Math.PI) / 180;
                
                const subEndX = endX + Math.cos(subAngleRad) * subBranchLength;
                const subEndY = endY + Math.sin(subAngleRad) * subBranchLength;

                // Label position - always away from branch
                const subLabelX = subEndX + (Math.cos(subAngleRad) > 0 ? 8 : -8);
                const subLabelAnchor = Math.cos(subAngleRad) > 0 ? "start" : "end";
                const subLabelY = subEndY + (Math.sin(subAngleRad) > 0.3 ? 10 : Math.sin(subAngleRad) < -0.3 ? -4 : 3);

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
                        isActive ? "opacity-40" : "opacity-15"
                      }`}
                    />
                    
                    {/* Subtopic node */}
                    <circle
                      cx={subEndX}
                      cy={subEndY}
                      r="2"
                      fill="currentColor"
                      className={`text-primary transition-all duration-300 ${
                        isActive ? "opacity-50" : "opacity-20"
                      }`}
                    />

                    {/* Subtopic label - always visible but dimmer when not active */}
                    <text
                      x={subLabelX}
                      y={subLabelY}
                      textAnchor={subLabelAnchor}
                      className={`fill-current text-[8px] transition-all duration-300 ${
                        isActive ? "text-foreground/80" : "text-muted-foreground/30"
                      }`}
                      style={{ fontFamily: "var(--font-mono)", fontWeight: isActive ? 500 : 400 }}
                    >
                      {subtopic}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Central label */}
        <text
          x={centerX}
          y={centerY + 32}
          textAnchor="middle"
          className="fill-current text-[7px] text-muted-foreground/30"
          style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em" }}
        >
          Knowledge
        </text>
      </svg>
    </div>
  );
}

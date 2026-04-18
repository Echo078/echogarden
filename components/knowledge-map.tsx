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
    <div className="relative mb-12 overflow-hidden rounded-xl border border-foreground/6 bg-card/30 p-8 backdrop-blur-sm md:p-10">
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.012]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="24" cy="24" r="0.5" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Map Title */}
      <div className="mb-8 flex items-center gap-3">
        <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/35">
          Knowledge Network
        </span>
        <div className="h-px flex-1 bg-foreground/4" aria-hidden="true" />
      </div>

      {/* SVG Knowledge Tree - Larger and more spacious */}
      <svg
        viewBox="0 0 900 380"
        className="w-full"
        style={{ maxHeight: "380px" }}
      >
        <defs>
          {/* Glow filter for active nodes */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Central Root Node - Larger */}
        <g className="text-primary">
          {/* Outer decorative ring */}
          <circle
            cx="450"
            cy="190"
            r="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="3 6"
            opacity="0.15"
          />
          {/* Root circles */}
          <circle
            cx="450"
            cy="190"
            r="32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.3"
          />
          <circle
            cx="450"
            cy="190"
            r="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.5"
          />
          <circle
            cx="450"
            cy="190"
            r="8"
            fill="currentColor"
            opacity="0.7"
          />
        </g>

        {/* Branch paths to each category */}
        {knowledgeCategories.map((category, index) => {
          const angle = (index - 2) * 38 * (Math.PI / 180); // Spread from -76 to +76 degrees
          const isActive = activeCategory === category.id;
          const isHighlighted = activeCategory === null || isActive;
          
          // Calculate positions - longer branches
          const branchLength = 160;
          const endX = 450 + Math.cos(angle) * branchLength;
          const endY = 190 - Math.sin(angle) * branchLength;
          
          // Control points for curved branches
          const ctrlX = 450 + Math.cos(angle) * 80;
          const ctrlY = 190 - Math.sin(angle) * 40;

          const subtopics = categorySubtopics[category.id] || [];

          return (
            <g
              key={category.id}
              className={`cursor-pointer transition-opacity duration-500 ${
                isHighlighted ? "opacity-100" : "opacity-25"
              }`}
              onClick={() => onCategorySelect(isActive ? null : category.id)}
            >
              {/* Main branch curve */}
              <path
                d={`M 450 190 Q ${ctrlX} ${ctrlY} ${endX} ${endY}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={isActive ? "2.5" : "1.5"}
                className={`text-primary transition-all duration-500 ${
                  isActive ? "opacity-70" : "opacity-30"
                }`}
              />

              {/* Category node - larger click target */}
              <g filter={isActive ? "url(#glow)" : undefined}>
                <circle
                  cx={endX}
                  cy={endY}
                  r={isActive ? "20" : "16"}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={isActive ? "2" : "1.5"}
                  className={`text-primary transition-all duration-500 ${
                    isActive ? "opacity-80" : "opacity-40"
                  }`}
                />
                <circle
                  cx={endX}
                  cy={endY}
                  r="6"
                  fill="currentColor"
                  className={`text-primary transition-all duration-500 ${
                    isActive ? "opacity-85" : "opacity-50"
                  }`}
                />
                {/* Invisible larger click target */}
                <circle
                  cx={endX}
                  cy={endY}
                  r="28"
                  fill="transparent"
                  className="cursor-pointer"
                />
              </g>

              {/* Category label - larger text */}
              <text
                x={endX + (Math.cos(angle) > 0 ? 28 : -28)}
                y={endY + 5}
                textAnchor={Math.cos(angle) > 0 ? "start" : "end"}
                className={`fill-current transition-all duration-500 ${
                  isActive ? "text-foreground" : "text-muted-foreground/70"
                }`}
                style={{ 
                  fontFamily: "var(--font-serif)", 
                  fontSize: isActive ? "15px" : "13px",
                  fontWeight: isActive ? "500" : "400"
                }}
              >
                {category.name.split(" & ")[0]}
              </text>

              {/* Count badge - slightly larger */}
              <text
                x={endX + (Math.cos(angle) > 0 ? 28 : -28)}
                y={endY + 22}
                textAnchor={Math.cos(angle) > 0 ? "start" : "end"}
                className="fill-current text-muted-foreground/40"
                style={{ fontFamily: "var(--font-mono)", fontSize: "10px" }}
              >
                {getCategoryCount(category.id)} entries
              </text>

              {/* Subtopic branches - longer */}
              {subtopics.map((subtopic, subIndex) => {
                const subAngle = angle + ((subIndex - 1) * 18 * (Math.PI / 180));
                const subLength = 60;
                const subEndX = endX + Math.cos(subAngle) * subLength;
                const subEndY = endY - Math.sin(subAngle) * subLength;

                return (
                  <g key={subtopic}>
                    {/* Subtopic branch */}
                    <line
                      x1={endX}
                      y1={endY}
                      x2={subEndX}
                      y2={subEndY}
                      stroke="currentColor"
                      strokeWidth="1"
                      className={`text-primary transition-all duration-500 ${
                        isActive ? "opacity-40" : "opacity-15"
                      }`}
                    />
                    
                    {/* Subtopic node - larger */}
                    <circle
                      cx={subEndX}
                      cy={subEndY}
                      r="5"
                      fill="currentColor"
                      className={`text-primary transition-all duration-500 ${
                        isActive ? "opacity-55" : "opacity-20"
                      }`}
                    />

                    {/* Subtopic label - larger, always visible but faded when inactive */}
                    <text
                      x={subEndX + (Math.cos(subAngle) > 0 ? 10 : -10)}
                      y={subEndY + 4}
                      textAnchor={Math.cos(subAngle) > 0 ? "start" : "end"}
                      className={`fill-current transition-all duration-500 ${
                        isActive ? "text-muted-foreground/65" : "text-muted-foreground/25"
                      }`}
                      style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}
                    >
                      {subtopic}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Central label - larger */}
        <text
          x="450"
          y="250"
          textAnchor="middle"
          className="fill-current text-muted-foreground/30"
          style={{ fontFamily: "var(--font-mono)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em" }}
        >
          Knowledge Root
        </text>
      </svg>

      {/* Interaction hint */}
      <div className="mt-6 text-center">
        <p className="font-serif text-xs italic text-muted-foreground/35">
          Select a branch to explore
        </p>
      </div>
    </div>
  );
}

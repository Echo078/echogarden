export interface ResearchProject {
  id: string;
  slug: string;
  title: string;
  timeRange: string;
  phase: string;
  phaseLabel: string;
  summary: string;
  researchQuestion?: string; // Central research question (for current focus)
  themes: string[];
  order: number;
  isCurrent?: boolean;
}

// Three long-term research projects representing a journey from first encounter to deeper inquiry
export const researchProjects: ResearchProject[] = [
  {
    id: "1",
    slug: "acoustic-ecology",
    title: "Acoustic Ecology & Field Recording",
    timeRange: "2021 — 2023",
    phase: "encounter",
    phaseLabel: "First Encounter",
    summary:
      "Initial exploration of environmental sound and listening practices. Learning to hear landscapes as living systems, documenting urban and natural soundscapes, and developing a personal vocabulary for acoustic observation.",
    themes: ["field recording", "deep listening", "soundscape ecology", "documentation"],
    order: 1,
  },
  {
    id: "2",
    slug: "bio-inspired-materials",
    title: "Bio-Inspired Materials & Fabrication",
    timeRange: "2023 — 2024",
    phase: "exploration",
    phaseLabel: "Exploration",
    summary:
      "Investigating how natural systems inform material design. Experimentation with mycelium composites, plant-based polymers, and generative growth patterns. Bridging biology, chemistry, and digital fabrication.",
    themes: ["biomaterials", "mycelium", "generative design", "sustainable fabrication"],
    order: 2,
  },
  {
    id: "3",
    slug: "sonic-interaction-design",
    title: "Sonic Interaction & Embodied Computing",
    timeRange: "2024 — Present",
    phase: "inquiry",
    phaseLabel: "Deeper Inquiry",
    summary:
      "Synthesizing earlier threads into a focused research practice. Designing sonic interfaces that respond to touch, breath, and movement. Exploring how sound shapes our perception of space and presence.",
    researchQuestion: "How can sound become a medium for embodied interaction — responsive to gesture, breath, and spatial presence?",
    themes: ["interaction design", "embodied cognition", "spatial audio", "tangible interfaces"],
    order: 3,
    isCurrent: true,
  },
];

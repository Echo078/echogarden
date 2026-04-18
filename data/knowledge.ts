export interface KnowledgeEntry {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  quickRef?: string; // optional quick reference preview
  updatedAt: string;
}

export interface KnowledgeCategory {
  id: string;
  name: string;
  icon: string; // simple text icon for the tree
  description: string;
}

export const knowledgeCategories: KnowledgeCategory[] = [
  {
    id: "courses",
    name: "Courses",
    icon: "◇",
    description: "Course notes and study materials",
  },
  {
    id: "instruments",
    name: "Instruments & Lab Methods",
    icon: "○",
    description: "Lab protocols and instrument guides",
  },
  {
    id: "work",
    name: "Work Notes",
    icon: "□",
    description: "Professional tips and workflows",
  },
  {
    id: "formulas",
    name: "Formulas & Quick References",
    icon: "△",
    description: "Frequently used equations and lookups",
  },
  {
    id: "tools",
    name: "Tools & Setup",
    icon: "◎",
    description: "Software configurations and tooling",
  },
];

export const knowledgeEntries: KnowledgeEntry[] = [
  {
    id: "1",
    title: "Signal Processing Fundamentals",
    description: "Notes on Fourier transforms, filtering, and spectral analysis from the graduate course.",
    category: "courses",
    tags: ["DSP", "math"],
    quickRef: "FFT: O(n log n) • Nyquist: fs > 2fmax",
    updatedAt: "2026-04-15",
  },
  {
    id: "2",
    title: "GC-MS Operation Protocol",
    description: "Step-by-step guide for running samples on the gas chromatograph mass spectrometer.",
    category: "instruments",
    tags: ["chromatography", "protocol"],
    quickRef: "Inlet: 250°C • Column flow: 1.2 mL/min",
    updatedAt: "2026-04-12",
  },
  {
    id: "3",
    title: "Python Environment Setup",
    description: "Standard setup for scientific Python with conda, including common packages and configurations.",
    category: "tools",
    tags: ["python", "setup"],
    quickRef: "conda create -n sci python=3.11",
    updatedAt: "2026-04-10",
  },
  {
    id: "4",
    title: "Beer-Lambert Law Applications",
    description: "Common applications and rearrangements of the Beer-Lambert equation for spectroscopy.",
    category: "formulas",
    tags: ["spectroscopy", "chemistry"],
    quickRef: "A = εbc • T = 10^(-A)",
    updatedAt: "2026-04-08",
  },
  {
    id: "5",
    title: "Lab Meeting Best Practices",
    description: "Notes on presenting data effectively and fielding questions in weekly lab meetings.",
    category: "work",
    tags: ["presentation", "communication"],
    updatedAt: "2026-04-05",
  },
  {
    id: "6",
    title: "NMR Sample Preparation",
    description: "Standard procedures for preparing samples for proton and carbon NMR analysis.",
    category: "instruments",
    tags: ["NMR", "protocol"],
    quickRef: "600 μL CDCl3 • 5mm tube",
    updatedAt: "2026-04-03",
  },
  {
    id: "7",
    title: "Statistical Mechanics Review",
    description: "Key concepts from the stat mech course: ensembles, partition functions, and thermodynamic relations.",
    category: "courses",
    tags: ["physics", "thermodynamics"],
    quickRef: "Z = Σ e^(-βE) • F = -kT ln Z",
    updatedAt: "2026-03-28",
  },
  {
    id: "8",
    title: "Git Workflow for Research",
    description: "Branching strategy and commit conventions for managing research code and data analysis scripts.",
    category: "tools",
    tags: ["git", "workflow"],
    quickRef: "feat/ fix/ data/ • squash before merge",
    updatedAt: "2026-03-25",
  },
  {
    id: "9",
    title: "Unit Conversion Quick Sheet",
    description: "Common unit conversions for energy, pressure, and concentration used in daily calculations.",
    category: "formulas",
    tags: ["units", "chemistry"],
    quickRef: "1 eV = 96.485 kJ/mol • 1 atm = 101.325 kPa",
    updatedAt: "2026-03-20",
  },
  {
    id: "10",
    title: "Writing Research Abstracts",
    description: "Structure and tips for writing clear, compelling abstracts for papers and conference submissions.",
    category: "work",
    tags: ["writing", "academic"],
    updatedAt: "2026-03-15",
  },
];

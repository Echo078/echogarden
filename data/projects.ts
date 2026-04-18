export interface Project {
  id: string;
  title: string;
  summary: string;
  description?: string;
  domains: ("mechanical" | "hardware" | "software" | "acoustic")[];
  projectType: "course" | "hackathon" | "personal" | "research";
  skills: string[];
  year: number;
  image?: string;
  link?: string;
}

export const domains = [
  { id: "mechanical", name: "Mechanical", icon: "⚙" },
  { id: "hardware", name: "Hardware", icon: "◇" },
  { id: "software", name: "Software", icon: "◈" },
  { id: "acoustic", name: "Acoustic", icon: "◎" },
] as const;

export const projectTypes = [
  { id: "course", name: "Course", icon: "□" },
  { id: "hackathon", name: "Hackathon", icon: "△" },
  { id: "personal", name: "Personal", icon: "○" },
  { id: "research", name: "Research", icon: "◇" },
] as const;

export const allSkills = [
  "CAD",
  "3D Printing",
  "CNC",
  "Laser Cutting",
  "Arduino",
  "Raspberry Pi",
  "PCB Design",
  "Soldering",
  "Python",
  "JavaScript",
  "React",
  "Node.js",
  "Machine Learning",
  "Signal Processing",
  "Audio Engineering",
  "Max/MSP",
  "Pure Data",
  "Acoustics",
  "Vibration Analysis",
  "MATLAB",
  "Simulation",
  "Prototyping",
  "User Research",
  "Data Visualization",
];

export const projects: Project[] = [
  {
    id: "1",
    title: "Resonant Chamber",
    summary: "Acoustic installation exploring the resonant properties of architectural spaces",
    domains: ["acoustic", "hardware"],
    projectType: "research",
    skills: ["Audio Engineering", "Signal Processing", "Arduino", "Max/MSP"],
    year: 2026,
  },
  {
    id: "2",
    title: "Modular Synth Interface",
    summary: "Custom hardware interface for controlling modular synthesizers via gesture",
    domains: ["hardware", "software", "acoustic"],
    projectType: "personal",
    skills: ["Arduino", "PCB Design", "Soldering", "Python", "Max/MSP"],
    year: 2025,
  },
  {
    id: "3",
    title: "Kinetic Sound Sculpture",
    summary: "Motorized sculpture generating ambient soundscapes through mechanical movement",
    domains: ["mechanical", "acoustic"],
    projectType: "course",
    skills: ["CAD", "3D Printing", "Arduino", "Audio Engineering", "Prototyping"],
    year: 2025,
  },
  {
    id: "4",
    title: "Environmental Noise Mapper",
    summary: "Web app for visualizing and analyzing urban soundscapes using machine learning",
    domains: ["software", "acoustic"],
    projectType: "hackathon",
    skills: ["Python", "JavaScript", "React", "Machine Learning", "Data Visualization"],
    year: 2025,
  },
  {
    id: "5",
    title: "Vibration Harvesting Device",
    summary: "Prototype device for converting ambient vibrations into usable electrical energy",
    domains: ["mechanical", "hardware"],
    projectType: "research",
    skills: ["CAD", "Simulation", "PCB Design", "MATLAB", "Vibration Analysis"],
    year: 2024,
  },
  {
    id: "6",
    title: "Algorithmic Composition Tool",
    summary: "Generative music system based on natural language input and mood analysis",
    domains: ["software", "acoustic"],
    projectType: "personal",
    skills: ["Python", "Machine Learning", "Signal Processing", "Pure Data"],
    year: 2024,
  },
  {
    id: "7",
    title: "Pneumatic Percussion System",
    summary: "Air-powered mechanical percussion instrument controlled via MIDI",
    domains: ["mechanical", "hardware", "acoustic"],
    projectType: "course",
    skills: ["CAD", "CNC", "Arduino", "3D Printing", "Audio Engineering"],
    year: 2024,
  },
  {
    id: "8",
    title: "Wearable Haptic Metronome",
    summary: "Vibration-based rhythm trainer for musicians and dancers",
    domains: ["hardware", "software"],
    projectType: "hackathon",
    skills: ["Arduino", "PCB Design", "Python", "User Research", "Prototyping"],
    year: 2023,
  },
];

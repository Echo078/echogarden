// Dates and descriptions are documented in docs/portfolio-migration.md.
// These describe the original portfolio; an old “Present” is not a current status.
export interface Project {
  id: string;
  title: string;
  summary: string;
  domains: ("mechanical" | "hardware" | "software" | "acoustic")[];
  projectType: "course" | "hackathon" | "research" | "project";
  skills: string[];
  year: number;
  period: string;
  image?: string;
  resources: { label: string; href: string }[];
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
  { id: "research", name: "Research", icon: "◇" },
  { id: "project", name: "Project", icon: "○" },
] as const;

export const projects: Project[] = [
  {
    id: "5gw-tsticks",
    title: "5GW T-Sticks",
    summary: "Digital musical instrument work during a summer internship at McGill’s Input Devices and Music Interaction Laboratory (IDMIL), involving ESP32-based electronics, force sensing and capacitive sensing.",
    domains: ["mechanical", "hardware", "acoustic"], projectType: "research",
    skills: ["ESP32", "FSR", "Capacitive Sensing", "OSC", "3D Printing"],
    year: 2024, period: "May – August 2024", image: "/portfolio/thumbnails/5gw-tsticks.jpg",
    resources: [{ label: "T-Stick documentation", href: "https://idmil.github.io/tstick-docs/" }],
  },
  {
    id: "acoustic-analysis-of-music-pairings",
    title: "Musical Acoustics Analysis of Instrument Pairings",
    summary: "A sensory communication course project analyzing waveforms, spectra and the acoustic compatibility of kazoo, tongue drum, flute, timpani and kalimba.",
    domains: ["acoustic", "software"], projectType: "course",
    skills: ["Acoustics", "Signal Processing", "Spectral Analysis"],
    year: 2024, period: "September 2024 · original portfolio", image: "/portfolio/thumbnails/acoustic-analysis-of-music-pairings.jpg",
    resources: [
      { label: "Code on GitHub", href: "https://github.com/Echo078/Musical-Acoustics-Analysis-of-Instrument-Pairings-ECE446-Project-" },
      { label: "Analysis & recordings on Drive", href: "https://drive.google.com/drive/folders/1BJka5IYPkS_hlfal3NeGz-CHBUlvxf1H?usp=sharing" },
    ],
  },
  {
    id: "pa-flrtrx", title: "PA-FLRTRX",
    summary: "A Class E power amplifier and third-order bandpass filter for a flexible radio transceiver. Design targets: 1–10 W, 8–16 MHz and total harmonic distortion below 10%.",
    domains: ["hardware"], projectType: "course",
    skills: ["RF Design", "Circuit Simulation", "Hardware Testing", "Power Amplifiers"],
    year: 2024, period: "January – May 2024", image: "/portfolio/thumbnails/pa-flrtrx.jpg", resources: [],
  },
  {
    id: "soul-manager", title: "Soul Manager",
    summary: "A sleeping tent prototype built in 24 hours at MakeUofT 2024, combining a music alarm, sunrise LEDs, coffee aromatherapy, sensors and a computer interface.",
    domains: ["hardware", "software"], projectType: "hackathon",
    skills: ["Prototyping", "Sensors", "HTML"], year: 2024, period: "February 2024", image: "/portfolio/thumbnails/soul-manager.jpg",
    resources: [{ label: "SoulMassager on Devpost", href: "https://devpost.com/software/soulmassage" }],
  },
  {
    id: "ghostless-halloween-arcade-shooter-game", title: "Ghostless Halloween",
    summary: "A 2D arcade shooter written in C for CPUlator and the DE1-SoC board, with eight-direction movement, shooting, randomly spawning enemies and score tracking.",
    domains: ["hardware", "software"], projectType: "project",
    skills: ["C", "DE1-SoC", "CPUlator"], year: 2024, period: "March – April 2024", image: "/portfolio/thumbnails/ghostless-halloween-arcade-shooter-game.jpg",
    resources: [{ label: "Code on GitHub", href: "https://github.com/Echo078/Ghostless-Halloween" }],
  },
  {
    id: "dance-after-work", title: "Dance After Work",
    summary: "An audiovisual rhythm game on the DE1-SoC FPGA board, programmed in Verilog and inspired by Osu!: hit circles follow a preselected song’s beat.",
    domains: ["hardware", "software", "acoustic"], projectType: "project",
    skills: ["Verilog", "FPGA", "DE1-SoC"], year: 2023, period: "November – December 2023",
    resources: [{ label: "Code on GitHub", href: "https://github.com/Echo078/Dance-After-Work-Music-Rhythm-Game-on-DE1-SoC-" }],
  },
  {
    id: "music-genius", title: "Music Genius",
    summary: "A deep learning system that classifies the genre of a piano melody, then uses the melody and predicted genre to generate new music.",
    domains: ["software", "acoustic"], projectType: "project",
    skills: ["Machine Learning", "MFCC", "Librosa", "Music21", "RNN"], year: 2023, period: "June – September 2023", image: "/portfolio/thumbnails/music-genius.jpg",
    resources: [
      { label: "Code on GitHub", href: "https://github.com/RunzeZhu28/Melody-Generator" },
      { label: "Project report", href: "https://drive.google.com/file/d/1FlBhvCxOu8_JOcBI40fxJM4QnOb35Q4e/view?usp=sharing" },
    ],
  },
  {
    id: "harmony-hacker", title: "Harmony Hacker",
    summary: "A MakeUofT 2023 project that lets any pressed piano key trigger the next correct MIDI note, with a Raspberry Pi, touchscreen controls and distance-based volume control.",
    domains: ["hardware", "software", "acoustic"], projectType: "hackathon",
    skills: ["Raspberry Pi", "MIDI", "Ultrasonic Sensing", "Prototyping"], year: 2023, period: "February 2023", image: "/portfolio/thumbnails/harmony-hacker.jpg",
    resources: [{ label: "Team code on GitHub", href: "https://github.com/ahmedkhalf/makeuoft2023-piano-hack" }],
  },
  {
    id: "helispin", title: "Helispin",
    summary: "Helicopter-seed-inspired wind turbine research using CFD analysis and visualization. Silver award, 2021 Canada-Wide Science Fair.",
    domains: ["mechanical"], projectType: "research",
    skills: ["CFD", "Aerodynamics", "Simulation"], year: 2021, period: "October 2020 – May 2021", image: "/portfolio/thumbnails/helispin.jpg",
    resources: [
      { label: "Project report", href: "https://drive.google.com/file/d/143RKNaRRqlIqInSTKRChyoWxftj9sazt/view?usp=sharing" },
      { label: "Project logbook", href: "https://drive.google.com/file/d/1-o72ljLdUFvin3rJiQAQ4L3jl_j0BraB/view?usp=sharing" },
    ],
  },
];

export const allSkills = [...new Set(projects.flatMap((project) => project.skills))].sort();
export const paSections = ["design-overview", "schematic-simulation", "hardware-design", "testing", "next-step"] as const;

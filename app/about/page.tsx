import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Echo's Garden",
  description:
    "Interdisciplinary researcher exploring sonic interaction, embodied computing, and the spaces between music and engineering.",
};

// Research interests
const interests = {
  primary: ["Sonic Interaction Design", "Embodied Computing"],
  secondary: ["Spatial Audio", "Tangible Interfaces", "Acoustic Ecology"],
};

// Selected experience
const experience = [
  { label: "M.S. Media Arts & Sciences", type: "education" },
  { label: "B.S. Mechanical Engineering", type: "education" },
  { label: "Sonic Interaction Lab", type: "research" },
  { label: "Hardware Prototyping", type: "practice" },
];

export default function AboutPage() {
  return (
    <main className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Compact Header */}
      <header className="shrink-0 px-6 py-4 md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            <span>Return</span>
          </Link>

          {/* Quick links in header */}
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">CV</a>
            <a href="mailto:echo@example.com" className="text-xs text-muted-foreground transition-colors hover:text-foreground">Contact</a>
          </div>
        </div>
      </header>

      {/* Main Content - One Screen Grid */}
      <div className="flex-1 overflow-auto px-6 pb-6 md:px-10 md:pb-8">
        <div className="mx-auto grid h-full max-w-6xl gap-5 md:grid-cols-12 md:gap-6">
          
          {/* Left Column: Identity + Current Focus */}
          <div className="flex flex-col gap-5 md:col-span-4 md:gap-6">
            {/* Identity Card */}
            <div className="rounded-lg border border-foreground/8 bg-card/40 p-5">
              {/* Portrait */}
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-foreground/10 bg-secondary/30">
                  <span className="font-serif text-2xl text-muted-foreground/40">E</span>
                </div>
                <div>
                  <h1 className="font-serif text-xl font-light text-foreground">Echo Chen</h1>
                  <p className="text-xs text-muted-foreground">Researcher & Sound Artist</p>
                </div>
              </div>
              
              {/* One-liner */}
              <p className="text-sm leading-relaxed text-muted-foreground">
                Interdisciplinary researcher at the intersection of sound, interaction, and embodied experience.
              </p>
            </div>

            {/* Current Focus */}
            <div className="rounded-lg border border-primary/15 bg-card/40 p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="font-serif text-xs italic text-primary">Current Focus</span>
                <span className="font-mono text-[9px] text-muted-foreground/50">2024—</span>
              </div>
              <h2 className="mb-2 font-serif text-base font-normal text-foreground">
                Sonic Interaction & Embodied Computing
              </h2>
              <p className="mb-3 text-xs italic leading-relaxed text-muted-foreground">
                How can sound become a medium for embodied interaction?
              </p>
              <Link
                href="/research"
                className="inline-flex items-center gap-1 text-[11px] text-primary transition-colors hover:underline"
              >
                View research
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </div>

            {/* Quick Navigation */}
            <div className="grid grid-cols-2 gap-2">
              <Link href="/research" className="rounded-md border border-foreground/8 bg-card/30 px-3 py-2 text-center text-xs text-foreground transition-colors hover:bg-card/50">
                Research
              </Link>
              <Link href="/projects" className="rounded-md border border-foreground/8 bg-card/30 px-3 py-2 text-center text-xs text-foreground transition-colors hover:bg-card/50">
                Projects
              </Link>
              <Link href="/diary" className="rounded-md border border-foreground/8 bg-card/30 px-3 py-2 text-center text-xs text-foreground transition-colors hover:bg-card/50">
                Sound Diary
              </Link>
              <Link href="/blog" className="rounded-md border border-foreground/8 bg-card/30 px-3 py-2 text-center text-xs text-foreground transition-colors hover:bg-card/50">
                Writing
              </Link>
            </div>
          </div>

          {/* Middle Column: Research Interests + Bio */}
          <div className="flex flex-col gap-5 md:col-span-5 md:gap-6">
            {/* Research Interests */}
            <div className="rounded-lg border border-foreground/8 bg-card/40 p-5">
              <h2 className="mb-4 flex items-center gap-3 font-serif text-xs italic text-muted-foreground">
                Research Interests
                <span className="h-px flex-1 bg-foreground/8" />
              </h2>
              
              {/* Primary */}
              <div className="mb-3 flex flex-wrap gap-2">
                {interests.primary.map((item) => (
                  <span key={item} className="rounded-md bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary">
                    {item}
                  </span>
                ))}
              </div>
              
              {/* Secondary */}
              <div className="flex flex-wrap gap-1.5">
                {interests.secondary.map((item) => (
                  <span key={item} className="rounded-md bg-secondary/50 px-2 py-0.5 text-[11px] text-muted-foreground">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Short Bio */}
            <div className="flex-1 rounded-lg border border-foreground/8 bg-card/40 p-5">
              <h2 className="mb-4 flex items-center gap-3 font-serif text-xs italic text-muted-foreground">
                About
                <span className="h-px flex-1 bg-foreground/8" />
              </h2>
              <div className="space-y-3 text-sm leading-relaxed text-foreground/85">
                <p>
                  I design sonic interfaces that respond to touch, breath, and movement. 
                  My work draws from mechanical engineering, acoustic research, and musical 
                  practice to explore how sound can shape our perception of space and presence.
                </p>
                <p>
                  Currently pursuing graduate research in Media Arts & Sciences, my practice 
                  combines technical prototyping with artistic experimentation in spatial audio 
                  synthesis and gesture-responsive instruments.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Experience + Links */}
          <div className="flex flex-col gap-5 md:col-span-3 md:gap-6">
            {/* Selected Experience */}
            <div className="flex-1 rounded-lg border border-foreground/8 bg-card/40 p-5">
              <h2 className="mb-4 flex items-center gap-3 font-serif text-xs italic text-muted-foreground">
                Background
                <span className="h-px flex-1 bg-foreground/8" />
              </h2>
              
              <div className="space-y-4">
                {/* Education */}
                <div>
                  <h3 className="mb-2 font-mono text-[9px] font-medium uppercase tracking-widest text-muted-foreground/60">
                    Education
                  </h3>
                  <ul className="space-y-1">
                    {experience.filter(e => e.type === "education").map((item) => (
                      <li key={item.label} className="text-xs text-foreground/80">{item.label}</li>
                    ))}
                  </ul>
                </div>

                {/* Research */}
                <div>
                  <h3 className="mb-2 font-mono text-[9px] font-medium uppercase tracking-widest text-muted-foreground/60">
                    Research
                  </h3>
                  <ul className="space-y-1">
                    {experience.filter(e => e.type === "research").map((item) => (
                      <li key={item.label} className="text-xs text-foreground/80">{item.label}</li>
                    ))}
                  </ul>
                </div>

                {/* Practice */}
                <div>
                  <h3 className="mb-2 font-mono text-[9px] font-medium uppercase tracking-widest text-muted-foreground/60">
                    Practice
                  </h3>
                  <ul className="space-y-1">
                    {experience.filter(e => e.type === "practice").map((item) => (
                      <li key={item.label} className="text-xs text-foreground/80">{item.label}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* External Links */}
            <div className="rounded-lg border border-foreground/8 bg-card/40 p-5">
              <h2 className="mb-3 flex items-center gap-3 font-serif text-xs italic text-muted-foreground">
                Connect
                <span className="h-px flex-1 bg-foreground/8" />
              </h2>
              <div className="flex flex-col gap-2">
                <a href="mailto:echo@example.com" className="flex items-center gap-2 text-xs text-foreground/80 transition-colors hover:text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  Email
                </a>
                <a href="#" className="flex items-center gap-2 text-xs text-foreground/80 transition-colors hover:text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                  GitHub
                </a>
                <a href="#" className="flex items-center gap-2 text-xs text-foreground/80 transition-colors hover:text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                  Scholar
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

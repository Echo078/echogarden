import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Echo's Garden",
  description:
    "Interdisciplinary researcher exploring sonic interaction, embodied computing, and the spaces between music and engineering.",
};

// Research interests
const interests = [
  "Sonic Interaction Design",
  "Embodied Computing", 
  "Spatial Audio",
  "Tangible Interfaces",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-6 md:px-12 md:py-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
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
        </div>
      </header>

      {/* Main Content - Two Columns */}
      <div className="px-6 pb-16 md:px-12 md:pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-12 md:flex-row md:gap-16">
            
            {/* Left Sidebar: Identity, Connect, Background */}
            <aside className="shrink-0 md:w-64">
              {/* Portrait */}
              <div className="mb-5 overflow-hidden rounded-lg border border-foreground/10">
                <div className="flex aspect-square items-center justify-center bg-secondary/30">
                  <span className="font-serif text-6xl text-muted-foreground/30">E</span>
                </div>
              </div>

              {/* Name & Title */}
              <div className="mb-6 text-center md:text-left">
                <h1 className="mb-1 font-serif text-2xl font-light text-foreground">
                  Echo Chen
                </h1>
                <p className="mb-1 text-sm font-medium text-primary">
                  Graduate Researcher
                </p>
                <p className="text-xs text-muted-foreground">
                  Media Arts & Sciences
                </p>
              </div>

              {/* Connect Icons */}
              <div className="mb-8 flex justify-center gap-3 md:justify-start">
                <a 
                  href="mailto:echo@example.com" 
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                  title="Email"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </a>
                <a 
                  href="#" 
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                  title="GitHub"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                </a>
                <a 
                  href="#" 
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                  title="Google Scholar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                </a>
                <a 
                  href="#" 
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                  title="LinkedIn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                <a 
                  href="#" 
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                  title="CV"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                </a>
              </div>

              {/* Research Interests */}
              <div className="mb-8">
                <h2 className="mb-3 font-serif text-sm font-medium text-foreground">
                  Research Interests
                </h2>
                <ul className="space-y-1.5">
                  {interests.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Explore Links */}
              <div className="rounded-lg border border-foreground/8 bg-card/30 p-4">
                <h2 className="mb-3 font-serif text-xs italic text-muted-foreground">
                  Explore
                </h2>
                <div className="flex flex-col gap-2">
                  <Link href="/research" className="text-sm text-foreground/80 transition-colors hover:text-primary">
                    Research Journey
                  </Link>
                  <Link href="/projects" className="text-sm text-foreground/80 transition-colors hover:text-primary">
                    Project Archive
                  </Link>
                  <Link href="/diary" className="text-sm text-foreground/80 transition-colors hover:text-primary">
                    Sound Diary
                  </Link>
                  <Link href="/blog" className="text-sm text-foreground/80 transition-colors hover:text-primary">
                    Writing
                  </Link>
                </div>
              </div>
            </aside>

            {/* Right Content: About & More */}
            <div className="flex-1">
              {/* About Section */}
              <section className="mb-12">
                <h2 className="mb-5 font-serif text-2xl font-light text-foreground">
                  About
                </h2>
                <div className="space-y-4 text-base leading-relaxed text-foreground/85">
                  <p>
                    I am a graduate researcher in Media Arts & Sciences, advised by{" "}
                    <a href="#" className="text-primary hover:underline">Prof. Advisor Name</a>.
                    My work explores how sound can become a medium for embodied interaction — 
                    responsive to gesture, breath, and spatial presence.
                  </p>
                  <p>
                    Prior to this, I obtained a B.S. in Mechanical Engineering, where I developed 
                    interests in acoustic phenomena and tangible interface design. This 
                    interdisciplinary background shapes my approach to research at the intersection 
                    of engineering, design, and artistic practice.
                  </p>
                  <p>
                    My current research focuses on designing sonic interfaces that respond to 
                    touch, breath, and movement, exploring how sound shapes our perception of 
                    space and presence.
                  </p>
                </div>
              </section>

              {/* Current Focus */}
              <section className="mb-12">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="font-serif text-2xl font-light text-foreground">
                    Current Focus
                  </h2>
                  <Link 
                    href="/research" 
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    View All →
                  </Link>
                </div>
                
                <div className="rounded-lg border border-foreground/8 bg-card/40 p-5">
                  <h3 className="mb-2 font-serif text-lg font-normal text-foreground">
                    Sonic Interaction & Embodied Computing
                  </h3>
                  <p className="mb-3 text-sm italic text-primary">
                    2024 — Present
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Synthesizing earlier threads into a focused research practice. Designing 
                    sonic interfaces that respond to touch, breath, and movement. Exploring 
                    how sound shapes our perception of space and presence.
                  </p>
                </div>
              </section>

              {/* Selected Projects */}
              <section>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="font-serif text-2xl font-light text-foreground">
                    Selected Projects
                  </h2>
                  <Link 
                    href="/projects" 
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    View All →
                  </Link>
                </div>
                
                <div className="space-y-4">
                  <div className="rounded-lg border border-foreground/8 bg-card/40 p-5">
                    <h3 className="mb-1 font-serif text-base font-normal text-foreground">
                      Breath-Responsive Sound Installation
                    </h3>
                    <p className="mb-2 flex items-center gap-2 text-xs text-muted-foreground/60">
                      <span className="rounded bg-secondary/50 px-1.5 py-0.5 text-[10px] uppercase">
                        Hardware
                      </span>
                      <span>·</span>
                      <span>2024</span>
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      An interactive installation that translates breathing patterns into 
                      spatial sound, creating an intimate dialogue between body and environment.
                    </p>
                  </div>

                  <div className="rounded-lg border border-foreground/8 bg-card/40 p-5">
                    <h3 className="mb-1 font-serif text-base font-normal text-foreground">
                      Tangible Sound Synthesizer
                    </h3>
                    <p className="mb-2 flex items-center gap-2 text-xs text-muted-foreground/60">
                      <span className="rounded bg-secondary/50 px-1.5 py-0.5 text-[10px] uppercase">
                        Acoustic
                      </span>
                      <span>·</span>
                      <span>2023</span>
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      A physical interface for sound synthesis using gesture and touch, 
                      bridging the gap between digital sound and tactile interaction.
                    </p>
                  </div>
                </div>
              </section>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

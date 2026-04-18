import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Echo's Garden",
  description:
    "Interdisciplinary researcher exploring sonic interaction, embodied computing, and the spaces between music and engineering.",
};

// Research interests data
const researchInterests = [
  { label: "Sonic Interaction Design", primary: true },
  { label: "Embodied Computing", primary: true },
  { label: "Spatial Audio", primary: false },
  { label: "Tangible Interfaces", primary: false },
  { label: "Acoustic Ecology", primary: false },
  { label: "Human-Computer Interaction", primary: false },
];

// Experience highlights
const experienceHighlights = [
  {
    category: "Education",
    items: ["M.S. in Media Arts & Sciences", "B.S. in Mechanical Engineering"],
  },
  {
    category: "Research",
    items: ["Sonic Interaction Lab", "Tangible Media Group"],
  },
  {
    category: "Practice",
    items: ["Sound Design", "Hardware Prototyping", "Creative Coding"],
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-10 md:px-12 md:py-14">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="mb-12 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
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

      {/* Hero Section */}
      <section className="px-6 pb-12 md:px-12 md:pb-16">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
            {/* Portrait placeholder */}
            <div className="shrink-0">
              <div className="h-32 w-32 rounded-lg border border-foreground/10 bg-secondary/30 md:h-40 md:w-40">
                {/* Portrait image would go here */}
                <div className="flex h-full items-center justify-center">
                  <span className="font-serif text-4xl text-muted-foreground/30">E</span>
                </div>
              </div>
            </div>

            {/* Identity */}
            <div className="flex-1">
              <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                About
              </p>
              <h1 className="mb-3 font-serif text-3xl font-light tracking-tight text-foreground md:text-4xl">
                Echo Chen
              </h1>
              <p className="mb-4 font-serif text-lg italic text-muted-foreground">
                Interdisciplinary researcher at the intersection of sound, interaction, and embodied experience.
              </p>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                I design sonic interfaces that respond to touch, breath, and movement. 
                My work draws from mechanical engineering, acoustic research, and musical practice 
                to explore how sound can shape our perception of space and presence.
              </p>

              {/* Quick links */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/research"
                  className="rounded-md border border-foreground/10 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-foreground/20 hover:bg-secondary/30"
                >
                  Research
                </Link>
                <Link
                  href="/projects"
                  className="rounded-md border border-foreground/10 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-foreground/20 hover:bg-secondary/30"
                >
                  Projects
                </Link>
                <a
                  href="#"
                  className="rounded-md border border-foreground/10 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-foreground/20 hover:bg-secondary/30"
                >
                  CV
                </a>
                <a
                  href="mailto:echo@example.com"
                  className="rounded-md border border-foreground/10 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-foreground/20 hover:bg-secondary/30"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Interests */}
      <section className="px-6 pb-12 md:px-12 md:pb-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center gap-4">
            <h2 className="font-serif text-sm italic text-muted-foreground">Research Interests</h2>
            <div className="h-px flex-1 bg-foreground/10" aria-hidden="true" />
          </div>

          <div className="flex flex-wrap gap-2">
            {researchInterests.map((interest) => (
              <span
                key={interest.label}
                className={`rounded-md px-3 py-1.5 text-xs ${
                  interest.primary
                    ? "bg-primary/15 font-medium text-primary"
                    : "bg-secondary/40 text-muted-foreground"
                }`}
              >
                {interest.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Short Bio */}
      <section className="px-6 pb-12 md:px-12 md:pb-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center gap-4">
            <h2 className="font-serif text-sm italic text-muted-foreground">Biography</h2>
            <div className="h-px flex-1 bg-foreground/10" aria-hidden="true" />
          </div>

          <div className="rounded-lg border border-foreground/8 bg-card/40 p-5 md:p-6">
            <p className="text-sm leading-relaxed text-foreground/90">
              Echo Chen is an interdisciplinary researcher and sound artist exploring the 
              intersection of sonic interaction design, embodied computing, and acoustic ecology. 
              Their work investigates how sound-based interfaces can create meaningful connections 
              between human bodies and computational systems, drawing from backgrounds in mechanical 
              engineering, music technology, and human-computer interaction.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-foreground/90">
              Currently pursuing graduate research in Media Arts & Sciences, Echo&apos;s practice 
              combines technical prototyping with artistic experimentation. Past work includes 
              projects in spatial audio synthesis, gesture-responsive instruments, and 
              environment-aware sound installations.
            </p>
          </div>
        </div>
      </section>

      {/* Experience Highlights */}
      <section className="px-6 pb-12 md:px-12 md:pb-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center gap-4">
            <h2 className="font-serif text-sm italic text-muted-foreground">Background</h2>
            <div className="h-px flex-1 bg-foreground/10" aria-hidden="true" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {experienceHighlights.map((group) => (
              <div key={group.category}>
                <h3 className="mb-3 font-mono text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  {group.category}
                </h3>
                <ul className="flex flex-col gap-1.5">
                  {group.items.map((item) => (
                    <li key={item} className="text-sm text-foreground/80">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Focus */}
      <section className="px-6 pb-12 md:px-12 md:pb-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center gap-4">
            <h2 className="font-serif text-sm italic text-muted-foreground">Current Focus</h2>
            <div className="h-px flex-1 bg-foreground/10" aria-hidden="true" />
          </div>

          <div className="flex flex-col gap-4 rounded-lg border border-primary/15 bg-card/40 p-5 md:flex-row md:items-center md:gap-6 md:p-6">
            <div className="flex-1">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                2024 — Present
              </p>
              <h3 className="mb-2 font-serif text-lg font-normal text-foreground">
                Sonic Interaction & Embodied Computing
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Designing sonic interfaces that respond to touch, breath, and movement. 
                Exploring how sound shapes our perception of space and presence.
              </p>
            </div>
            <Link
              href="/research"
              className="group inline-flex shrink-0 items-center gap-1.5 text-xs text-primary transition-all hover:gap-2"
            >
              <span>View research</span>
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
                className="transition-transform group-hover:translate-x-0.5"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation Links */}
      <section className="px-6 pb-16 md:px-12 md:pb-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center gap-4">
            <h2 className="font-serif text-sm italic text-muted-foreground">Explore</h2>
            <div className="h-px flex-1 bg-foreground/10" aria-hidden="true" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/research"
              className="group rounded-lg border border-foreground/8 bg-card/30 p-5 transition-all hover:border-foreground/15 hover:bg-card/50"
            >
              <h3 className="mb-1 font-serif text-base font-normal text-foreground transition-colors group-hover:text-primary">
                Research Journey
              </h3>
              <p className="text-xs text-muted-foreground">
                From first encounter to deeper inquiry
              </p>
            </Link>
            <Link
              href="/projects"
              className="group rounded-lg border border-foreground/8 bg-card/30 p-5 transition-all hover:border-foreground/15 hover:bg-card/50"
            >
              <h3 className="mb-1 font-serif text-base font-normal text-foreground transition-colors group-hover:text-primary">
                Project Archive
              </h3>
              <p className="text-xs text-muted-foreground">
                Cross-disciplinary work and experiments
              </p>
            </Link>
            <Link
              href="/diary"
              className="group rounded-lg border border-foreground/8 bg-card/30 p-5 transition-all hover:border-foreground/15 hover:bg-card/50"
            >
              <h3 className="mb-1 font-serif text-base font-normal text-foreground transition-colors group-hover:text-primary">
                Sound Diary
              </h3>
              <p className="text-xs text-muted-foreground">
                Daily improvisations and sound notes
              </p>
            </Link>
            <Link
              href="/blog"
              className="group rounded-lg border border-foreground/8 bg-card/30 p-5 transition-all hover:border-foreground/15 hover:bg-card/50"
            >
              <h3 className="mb-1 font-serif text-base font-normal text-foreground transition-colors group-hover:text-primary">
                Reading Room
              </h3>
              <p className="text-xs text-muted-foreground">
                Essays and reflections
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pb-12 md:px-12 md:pb-16">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-center gap-6 text-xs uppercase tracking-widest text-muted-foreground/60">
            <a href="mailto:echo@example.com" className="transition-colors hover:text-muted-foreground">
              Email
            </a>
            <span className="h-px w-4 bg-foreground/10" aria-hidden="true" />
            <a href="#" className="transition-colors hover:text-muted-foreground">
              Scholar
            </a>
            <span className="h-px w-4 bg-foreground/10" aria-hidden="true" />
            <a href="#" className="transition-colors hover:text-muted-foreground">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

import Link from "next/link";
import { researchProjects } from "@/data/research";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research Journey — Echo's Garden",
  description:
    "A quiet research timeline tracing the path from first encounter to deeper inquiry.",
};

// Phase colors - subtle, muted tones
const phaseStyles: Record<string, { dot: string; line: string; badge: string }> = {
  encounter: {
    dot: "bg-[#8fa68c]",
    line: "bg-[#8fa68c]/30",
    badge: "bg-[#8fa68c]/15 text-[#5a7a58] border-[#8fa68c]/30",
  },
  exploration: {
    dot: "bg-[#7a9a88]",
    line: "bg-[#7a9a88]/30",
    badge: "bg-[#7a9a88]/15 text-[#4a7060] border-[#7a9a88]/30",
  },
  inquiry: {
    dot: "bg-[#5a8068]",
    line: "bg-[#5a8068]/30",
    badge: "bg-[#5a8068]/15 text-[#3a5548] border-[#5a8068]/30",
  },
};

export default function ResearchPage() {
  const sortedProjects = [...researchProjects].sort((a, b) => a.order - b.order);
  const currentProject = researchProjects.find((p) => p.isCurrent);

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

          <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
            Research Journey
          </p>
          <h1 className="mb-6 font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl">
            From Encounter to Inquiry
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            A path of deepening questions. Three long-term projects that trace a journey 
            from initial curiosity through exploration to focused research practice.
          </p>
        </div>
      </header>

      {/* Current Focus Section */}
      {currentProject && (
        <section className="px-6 pb-12 md:px-12 md:pb-16">
          <div className="mx-auto max-w-3xl">
            {/* Section Header */}
            <div className="mb-6 flex items-center gap-4">
              <span className="font-serif text-sm italic text-muted-foreground">Current Focus</span>
              <div className="h-px flex-1 bg-foreground/10" aria-hidden="true" />
            </div>

            {/* Current Focus Card */}
            <div className="rounded-xl border border-primary/20 bg-card/50 p-6 shadow-sm md:p-8">
              {/* Phase badge and time */}
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className={`rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-wider ${phaseStyles[currentProject.phase].badge}`}>
                  {currentProject.phaseLabel}
                </span>
                <span className="font-mono text-xs text-muted-foreground/60">
                  {currentProject.timeRange}
                </span>
              </div>

              {/* Title */}
              <h2 className="mb-4 font-serif text-2xl font-normal leading-snug text-foreground md:text-3xl">
                {currentProject.title}
              </h2>

              {/* Research Question */}
              {currentProject.researchQuestion && (
                <blockquote className="mb-5 border-l-2 border-primary/30 pl-4">
                  <p className="font-serif text-base italic leading-relaxed text-foreground/80 md:text-lg">
                    {currentProject.researchQuestion}
                  </p>
                </blockquote>
              )}

              {/* Summary */}
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground md:text-base">
                {currentProject.summary}
              </p>

              {/* Themes */}
              <div className="mb-6 flex flex-wrap gap-2">
                {currentProject.themes.map((theme) => (
                  <span
                    key={theme}
                    className="rounded-md bg-primary/10 px-2.5 py-1 text-xs text-primary/80"
                  >
                    {theme}
                  </span>
                ))}
              </div>

              {/* Action row */}
              <div className="flex items-center justify-between">
                <Link
                  href={`/research/${currentProject.slug}`}
                  className="group inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/20"
                >
                  <span>Explore this research</span>
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
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>

                {/* Mini timeline preview */}
                <a 
                  href="#journey" 
                  className="hidden items-center gap-2 text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground md:flex"
                >
                  <span className="font-serif italic">See full journey</span>
                  <div className="flex items-center gap-1">
                    {sortedProjects.map((p, i) => (
                      <div
                        key={p.id}
                        className={`h-1.5 rounded-full transition-all ${
                          p.isCurrent 
                            ? "w-4 bg-primary" 
                            : "w-1.5 bg-foreground/20"
                        }`}
                        title={p.title}
                      />
                    ))}
                  </div>
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
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Research Journey Timeline */}
      <section id="journey" className="scroll-mt-8 px-6 pb-20 md:px-12 md:pb-28">
        <div className="mx-auto max-w-3xl">
          {/* Section Header */}
          <div className="mb-10 flex items-center gap-4">
            <span className="font-serif text-sm italic text-muted-foreground">Research Journey</span>
            <div className="h-px flex-1 bg-foreground/10" aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
              2021 — Present
            </span>
          </div>

          {/* Timeline container */}
          <div className="relative">
            {/* Vertical line */}
            <div 
              className="absolute left-[11px] top-4 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-[#8fa68c]/40 via-[#7a9a88]/40 to-[#5a8068]/40 md:left-[15px]"
              aria-hidden="true"
            />

            {/* Timeline items */}
            <div className="flex flex-col gap-14 md:gap-16">
              {sortedProjects.map((project, index) => {
                const styles = phaseStyles[project.phase];
                const isLast = index === sortedProjects.length - 1;

                return (
                  <div key={project.id} className="relative pl-10 md:pl-14">
                    {/* Timeline dot */}
                    <div 
                      className={`absolute left-0 top-1 h-6 w-6 rounded-full border-4 border-background ${styles.dot} md:h-8 md:w-8 ${
                        project.isCurrent ? "ring-2 ring-primary/30 ring-offset-2 ring-offset-background" : ""
                      }`}
                      aria-hidden="true"
                    />

                    {/* Content card */}
                    <article className="group">
                      {/* Phase label & time */}
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <span 
                          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${styles.badge}`}
                        >
                          {project.phaseLabel}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground/60">
                          {project.timeRange}
                        </span>
                        {project.isCurrent && (
                          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-primary">
                            Current
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="mb-2 font-serif text-lg font-normal leading-snug text-foreground md:text-xl">
                        {project.title}
                      </h3>

                      {/* Summary */}
                      <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                        {project.summary}
                      </p>

                      {/* Themes */}
                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {project.themes.map((theme) => (
                          <span
                            key={theme}
                            className="rounded-md bg-secondary/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground/70"
                          >
                            {theme}
                          </span>
                        ))}
                      </div>

                      {/* View project link */}
                      <Link
                        href={`/research/${project.slug}`}
                        className="inline-flex items-center gap-2 text-xs text-muted-foreground/60 transition-all hover:gap-3 hover:text-foreground"
                      >
                        <span className="font-serif italic">View project</span>
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
                    </article>
                  </div>
                );
              })}
            </div>

            {/* End marker */}
            <div className="mt-10 pl-10 md:mt-12 md:pl-14">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-foreground/10" aria-hidden="true" />
                <span className="font-serif text-sm italic text-muted-foreground/50">
                  The inquiry continues
                </span>
                <div className="h-px flex-1 bg-foreground/10" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pb-12 md:px-12 md:pb-16">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-center gap-6 text-xs uppercase tracking-widest text-muted-foreground/60">
            <span>Research journey</span>
            <span className="h-px w-10 bg-foreground/10" aria-hidden="true" />
            <span>2021 — Present</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

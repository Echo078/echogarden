import type { Metadata } from "next";
import { BotanicalBackgroundSubtle } from "@/components/botanical-background-subtle";

export const metadata: Metadata = {
  title: "CV — Echo's Garden",
  description: "Curriculum vitae and academic background.",
};

export default function CVPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <BotanicalBackgroundSubtle />
      {/* Page Header */}
      <header className="px-6 py-8 md:px-12 md:py-10">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
            Curriculum Vitae
          </p>
          <h1 className="mb-6 font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl">
            CV
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            Academic background, publications, and experience.
          </p>
        </div>
      </header>

      {/* CV Content */}
      <section className="px-6 pb-20 md:px-12 md:pb-28">
        <div className="mx-auto max-w-3xl">
          {/* Download Link */}
          <div className="mb-12">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download PDF
            </a>
          </div>

          {/* Education */}
          <section className="mb-12">
            <h2 className="mb-6 font-serif text-xl font-normal text-foreground">
              Education
            </h2>
            <div className="space-y-6">
              <div className="border-l-2 border-primary/20 pl-4">
                <p className="font-mono text-xs text-muted-foreground/60">2024 — Present</p>
                <h3 className="mt-1 font-medium text-foreground">
                  M.S. Media Arts & Sciences
                </h3>
                <p className="text-sm text-muted-foreground">
                  MIT Media Lab
                </p>
              </div>
              <div className="border-l-2 border-foreground/10 pl-4">
                <p className="font-mono text-xs text-muted-foreground/60">2020 — 2024</p>
                <h3 className="mt-1 font-medium text-foreground">
                  B.S. Mechanical Engineering
                </h3>
                <p className="text-sm text-muted-foreground">
                  University of Example
                </p>
              </div>
            </div>
          </section>

          {/* Experience */}
          <section className="mb-12">
            <h2 className="mb-6 font-serif text-xl font-normal text-foreground">
              Experience
            </h2>
            <div className="space-y-6">
              <div className="border-l-2 border-primary/20 pl-4">
                <p className="font-mono text-xs text-muted-foreground/60">2024 — Present</p>
                <h3 className="mt-1 font-medium text-foreground">
                  Graduate Research Assistant
                </h3>
                <p className="text-sm text-muted-foreground">
                  Responsive Environments Group, MIT Media Lab
                </p>
              </div>
              <div className="border-l-2 border-foreground/10 pl-4">
                <p className="font-mono text-xs text-muted-foreground/60">2023</p>
                <h3 className="mt-1 font-medium text-foreground">
                  Research Intern
                </h3>
                <p className="text-sm text-muted-foreground">
                  Audio Research Lab
                </p>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section className="mb-12">
            <h2 className="mb-6 font-serif text-xl font-normal text-foreground">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                "Max/MSP",
                "Pure Data",
                "Python",
                "C++",
                "Arduino",
                "CAD",
                "3D Printing",
                "Audio Signal Processing",
                "Machine Learning",
                "Physical Computing",
              ].map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-secondary/50 px-3 py-1 text-sm text-muted-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-20 flex items-center justify-center gap-6 text-xs uppercase tracking-widest text-muted-foreground/40">
            <span>Last updated</span>
            <span className="h-px w-10 bg-foreground/10" aria-hidden="true" />
            <span>April 2026</span>
          </footer>
        </div>
      </section>
    </div>
  );
}

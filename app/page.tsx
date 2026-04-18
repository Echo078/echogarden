import Link from "next/link";
import { diaryEntries } from "@/data/diary";
import { SpecimenCard } from "@/components/specimen-card";

export default function HomePage() {
  const latestEntry = diaryEntries[0];
  const totalEntries = diaryEntries.length;

  return (
    <main className="min-h-screen bg-background">
      {/* Entrance Hall */}
      <div className="flex min-h-screen flex-col px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
          
          {/* Header - quiet threshold */}
          <header className="mb-20 md:mb-28">
            <p className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">
              Sound Specimen Museum
            </p>
            <h1 className="mb-6 font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Echo&apos;s Garden
            </h1>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground">
              A quiet place for daily improvisations and sound notes. 
              Each specimen preserved as it was heard.
            </p>
          </header>

          {/* Latest Specimen Preview */}
          <section className="mb-16 md:mb-24">
            <div className="mb-8 flex items-center gap-4">
              <h2 className="font-serif text-lg font-normal italic text-muted-foreground">
                Latest Specimen
              </h2>
              <div className="h-px flex-1 bg-foreground/10" aria-hidden="true" />
            </div>

            {/* Single specimen card - same as archive */}
            <div className="max-w-[220px]">
              <SpecimenCard 
                entry={latestEntry} 
                specimenNumber={totalEntries} 
              />
            </div>
          </section>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Navigation */}
          <nav className="mb-16 flex flex-col gap-4">
            <Link
              href="/diary"
              className="group inline-flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="font-serif text-lg italic">Enter the Cabinet</span>
              <span className="h-px w-8 bg-foreground/20 transition-all group-hover:w-12 group-hover:bg-foreground/40" aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-widest">
                {totalEntries} specimens
              </span>
            </Link>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="font-serif text-lg italic">Reading Room</span>
              <span className="h-px w-8 bg-foreground/20 transition-all group-hover:w-12 group-hover:bg-foreground/40" aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-widest">
                Essays
              </span>
            </Link>
            <Link
              href="/knowledge"
              className="group inline-flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="font-serif text-lg italic">Reference Grove</span>
              <span className="h-px w-8 bg-foreground/20 transition-all group-hover:w-12 group-hover:bg-foreground/40" aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-widest">
                Knowledge
              </span>
            </Link>
          </nav>

          {/* Footer */}
          <footer className="flex items-center gap-6 text-xs uppercase tracking-widest text-muted-foreground/60">
            <span>Ongoing collection</span>
            <span className="h-px w-6 bg-foreground/10" aria-hidden="true" />
            <span>Est. 2026</span>
          </footer>
        </div>
      </div>
    </main>
  );
}

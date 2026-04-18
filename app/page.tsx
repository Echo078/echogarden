import Link from "next/link";
import { diaryEntries } from "@/data/diary";
import { SpecimenCard } from "@/components/specimen-card";

export default function HomePage() {
  const latestEntry = diaryEntries[0];
  const totalEntries = diaryEntries.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Entrance Hall */}
      <div className="flex min-h-[calc(100vh-4rem)] flex-col px-6 py-12 md:px-12 md:py-16">
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
          
          {/* Hero - quiet welcome */}
          <header className="mb-16 md:mb-20">
            <p className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">
              Sound Specimen Museum
            </p>
            <h1 className="mb-6 font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl">
              Welcome to the Garden
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

          {/* Footer */}
          <footer className="flex items-center gap-6 text-xs uppercase tracking-widest text-muted-foreground/60">
            <span>Ongoing collection</span>
            <span className="h-px w-6 bg-foreground/10" aria-hidden="true" />
            <span>Est. 2026</span>
          </footer>
        </div>
      </div>
    </div>
  );
}

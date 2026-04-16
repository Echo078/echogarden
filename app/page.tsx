import Link from "next/link";
import { getLatestEntry, formatDate } from "@/data/diary";
import { AudioPlayer } from "@/components/audio-player";

export default function HomePage() {
  const latestEntry = getLatestEntry();

  return (
    <main className="min-h-screen px-6 py-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <header className="mb-20 text-center md:mb-28">
          <h1 className="mb-4 font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl">
            Echo Garden
          </h1>
          <p className="text-lg text-muted-foreground">
            A quiet place for daily improvisations and sound notes.
          </p>
        </header>

        {/* Latest Sound Preview */}
        <section className="mb-16">
          <p className="mb-6 text-sm uppercase tracking-widest text-muted-foreground">
            Latest Sound
          </p>
          
          <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4">
              <time className="text-sm text-muted-foreground">
                {formatDate(latestEntry.date)}
              </time>
              <h2 className="mt-1 font-serif text-2xl font-medium text-card-foreground">
                {latestEntry.title}
              </h2>
            </div>
            
            <p className="mb-5 leading-relaxed text-muted-foreground">
              {latestEntry.note}
            </p>

            <div className="mb-4 flex flex-wrap gap-2">
              {latestEntry.mood.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            <AudioPlayer src={latestEntry.audioFile} title={latestEntry.title} />
          </article>
        </section>

        {/* Navigation */}
        <nav className="text-center">
          <Link
            href="/diary"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <span>Browse All Entries</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </nav>

        {/* Footer */}
        <footer className="mt-24 text-center text-sm text-muted-foreground">
          <p>A personal space for capturing fleeting sounds.</p>
        </footer>
      </div>
    </main>
  );
}

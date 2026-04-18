import Link from "next/link";
import { blogEntries } from "@/data/blog";
import { noteEntries } from "@/data/notes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writings — Echo's Garden",
  description: "Essays and collected writings on sound, listening, and the practice of attention.",
};

export default function BlogPage() {
  const totalBlogEntries = blogEntries.length;
  const totalNotes = noteEntries.length;

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-10 md:px-12 md:py-14">
        <div className="mx-auto max-w-6xl">
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

          <div className="mb-12">
            <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
              Reading Room
            </p>
            <h1 className="mb-4 font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl">
              Writings
            </h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
              Essays and collected fragments on sound, listening, and the practice of attention.
            </p>
          </div>
        </div>
      </header>

      {/* Dual Column Layout */}
      <section className="px-6 pb-20 md:px-12 md:pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
            
            {/* Left Column: Blog Archive */}
            <div className="flex-1 lg:flex-[2]">
              {/* Column Header */}
              <div className="mb-8 flex items-center gap-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Essays
                </span>
                <div className="h-px flex-1 bg-foreground/10" aria-hidden="true" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                  {totalBlogEntries}
                </span>
              </div>

              {/* Blog Entries - Soft Archive Cards */}
              <div className="flex flex-col gap-5">
                {blogEntries.map((entry) => {
                  const date = new Date(entry.date);
                  const formattedDate = date.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <Link
                      key={entry.id}
                      href={`/blog/${entry.slug}`}
                      className="group block"
                    >
                      <article className="rounded-lg border border-foreground/6 bg-card/40 px-6 py-5 shadow-sm transition-all hover:border-foreground/12 hover:bg-card/60 hover:shadow-md">
                        {/* Date - quiet mono */}
                        <time 
                          dateTime={entry.date}
                          className="mb-2.5 block font-mono text-[9px] uppercase tracking-wider text-muted-foreground/50"
                        >
                          {formattedDate}
                        </time>

                        {/* Title - literary serif */}
                        <h2 className="mb-2.5 font-serif text-lg font-normal leading-snug text-foreground transition-colors group-hover:text-primary md:text-xl">
                          {entry.title}
                        </h2>

                        {/* Excerpt - comfortable reading */}
                        <p className="mb-4 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground/80">
                          {entry.excerpt}
                        </p>

                        {/* Footer - tags and read indicator */}
                        <div className="flex items-center justify-between gap-4">
                          {entry.tags && entry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {entry.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-secondary/40 px-2 py-0.5 text-[8px] uppercase tracking-wider text-muted-foreground/60"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground/40 transition-all group-hover:gap-2 group-hover:text-primary/70">
                            <span className="font-serif italic">Continue</span>
                            <span className="h-px w-3 bg-current transition-all group-hover:w-5" aria-hidden="true" />
                          </span>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Quiet Notes Rail */}
            <aside className="lg:w-48 lg:flex-none">
              {/* Column Header */}
              <div className="mb-6 flex items-center gap-3 lg:mb-8">
                <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/50">
                  Slips
                </span>
                <div className="h-px flex-1 bg-foreground/5" aria-hidden="true" />
              </div>

              {/* Notes List - minimal slips */}
              <div className="flex flex-col gap-5 lg:gap-6">
                {noteEntries.map((note) => {
                  const date = new Date(note.date);
                  const day = date.getDate();
                  const month = date.toLocaleDateString("en-US", { month: "short" });

                  return (
                    <div key={note.id} className="group">
                      {/* Date - very quiet */}
                      <time 
                        dateTime={note.date}
                        className="mb-1 block font-mono text-[8px] uppercase tracking-wider text-muted-foreground/35"
                      >
                        {month} {day}
                      </time>

                      {/* Fragment - brief and light */}
                      <p className="font-serif text-[11px] italic leading-snug text-muted-foreground/60">
                        {note.fragment}
                      </p>
                    </div>
                  );
                })}
              </div>
            </aside>
          </div>

          {/* Footer */}
          <footer className="mt-20 flex items-center justify-center gap-6 text-xs uppercase tracking-widest text-muted-foreground/40">
            <span>Collected writings</span>
            <span className="h-px w-10 bg-foreground/10" aria-hidden="true" />
            <span>Est. 2026</span>
          </footer>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import { blogEntries } from "@/data/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writings — Echo's Garden",
  description: "Essays and collected writings on sound, listening, and the practice of attention.",
};

export default function BlogPage() {
  const totalEntries = blogEntries.length;

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-10 md:px-12 md:py-14">
        <div className="mx-auto max-w-4xl">
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
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Essays and collected thoughts on sound, listening, and the practice of attention.
            </p>
          </div>

          {/* Entry count */}
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {totalEntries} entries
            </span>
            <div className="h-px flex-1 bg-foreground/10" aria-hidden="true" />
          </div>
        </div>
      </header>

      {/* Soft Archive Cards */}
      <section className="px-6 pb-20 md:px-12 md:pb-28">
        <div className="mx-auto max-w-4xl">
          {/* Cards in a gentle vertical flow with occasional side-by-side on larger screens */}
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
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
                  <article className="flex h-full flex-col rounded-xl border border-foreground/8 bg-card/60 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-foreground/15 hover:bg-card hover:shadow-md md:p-8">
                    {/* Date - quiet and small */}
                    <time 
                      dateTime={entry.date}
                      className="mb-4 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70"
                    >
                      {formattedDate}
                    </time>

                    {/* Title - prominent serif */}
                    <h2 className="mb-3 font-serif text-xl font-normal leading-snug text-foreground transition-colors group-hover:text-primary md:text-2xl">
                      {entry.title}
                    </h2>

                    {/* Excerpt - generous and readable */}
                    <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {entry.excerpt}
                    </p>

                    {/* Footer: tags and read indicator */}
                    <div className="flex items-end justify-between gap-4">
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {entry.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-secondary/40 px-2 py-0.5 text-[9px] uppercase tracking-wider text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60 transition-all group-hover:gap-2.5 group-hover:text-primary">
                        <span className="font-serif italic">Read</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
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
                      </span>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>

          {/* Footer */}
          <footer className="mt-20 flex items-center justify-center gap-6 text-xs uppercase tracking-widest text-muted-foreground/50">
            <span>Collected writings</span>
            <span className="h-px w-10 bg-foreground/10" aria-hidden="true" />
            <span>Est. 2026</span>
          </footer>
        </div>
      </section>
    </main>
  );
}

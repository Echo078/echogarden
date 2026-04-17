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
        <div className="mx-auto max-w-2xl">
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

          <div className="mb-16">
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
        </div>
      </header>

      {/* Editorial List */}
      <section className="px-6 pb-20 md:px-12 md:pb-28">
        <div className="mx-auto max-w-2xl">
          {/* Entry count */}
          <div className="mb-10 flex items-center gap-4">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {totalEntries} entries
            </span>
            <div className="h-px flex-1 bg-foreground/10" aria-hidden="true" />
          </div>

          {/* Blog entries list */}
          <div className="space-y-0">
            {blogEntries.map((entry, index) => {
              const date = new Date(entry.date);
              const formattedDate = date.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              });
              const year = date.getFullYear();

              return (
                <article
                  key={entry.id}
                  className="group"
                >
                  {/* Top border for all except first */}
                  {index > 0 && (
                    <div className="h-px bg-foreground/8" aria-hidden="true" />
                  )}
                  
                  <Link
                    href={`/blog/${entry.slug}`}
                    className="block py-8 transition-colors md:py-10"
                  >
                    {/* Date */}
                    <div className="mb-3 flex items-center gap-3">
                      <time 
                        dateTime={entry.date}
                        className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
                      >
                        {formattedDate}, {year}
                      </time>
                    </div>

                    {/* Title */}
                    <h2 className="mb-3 font-serif text-xl font-normal leading-snug text-foreground transition-colors group-hover:text-primary md:text-2xl">
                      {entry.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                      {entry.excerpt}
                    </p>

                    {/* Tags and read more */}
                    <div className="flex items-center justify-between">
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {entry.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-secondary/50 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-secondary-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="font-serif italic">Read</span>
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
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>

          {/* Bottom border */}
          <div className="h-px bg-foreground/8" aria-hidden="true" />

          {/* Footer */}
          <footer className="mt-20 flex items-center justify-center gap-6 text-xs uppercase tracking-widest text-muted-foreground/60">
            <span>Collected writings</span>
            <span className="h-px w-10 bg-foreground/10" aria-hidden="true" />
            <span>Est. 2026</span>
          </footer>
        </div>
      </section>
    </main>
  );
}

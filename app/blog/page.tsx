"use client";

import Link from "next/link";
import { blogEntries } from "@/data/blog";
import { noteEntries } from "@/data/notes";
import { useLanguage } from "@/components/language-provider";
import { translations } from "@/lib/translations";

export default function BlogPage() {
  const { lang, t } = useLanguage();
  const blogT = translations.blog;
  const locale = lang === "zh" ? "zh-CN" : "en-US";

  const totalBlogEntries = blogEntries.length;
  const totalNotes = noteEntries.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <header className="px-6 py-8 md:px-12 md:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
              {blogT.subtitle[lang]}
            </p>
            <h1 className="mb-4 font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl">
              {blogT.pageTitle[lang]}
            </h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
              {blogT.description[lang]}
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
                  {blogT.essays[lang]}
                </span>
                <div className="h-px flex-1 bg-foreground/10" aria-hidden="true" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                  {totalBlogEntries}
                </span>
              </div>

              {/* Blog Entries as Soft Archive Cards */}
              <div className="flex flex-col gap-6">
                {blogEntries.map((entry) => {
                  const date = new Date(entry.date);
                  const formattedDate = date.toLocaleDateString(locale, {
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
                      <article className="rounded-lg border border-foreground/8 bg-card/40 p-5 shadow-sm backdrop-blur-sm transition-all hover:border-foreground/12 hover:bg-card/60 hover:shadow-md md:p-6">
                        {/* Date */}
                        <time 
                          dateTime={entry.date}
                          className="mb-3 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground/50"
                        >
                          {formattedDate}
                        </time>

                        {/* Title */}
                        <h2 className="mb-2.5 font-serif text-lg font-normal leading-snug text-foreground transition-colors group-hover:text-primary md:text-xl">
                          {entry.title}
                        </h2>

                        {/* Excerpt */}
                        <p className="mb-4 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground/80">
                          {entry.excerpt}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between gap-4">
                          {entry.tags && entry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {entry.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-secondary/30 px-2 py-0.5 text-[9px] uppercase tracking-wider text-muted-foreground/60"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground/40 transition-all group-hover:gap-2 group-hover:text-primary/70">
                            <span className="font-serif italic">{blogT.read[lang]}</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="9"
                              height="9"
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
            </div>

            {/* Right Column: Quiet Notes Rail */}
            <aside className="hidden lg:block lg:flex-1">
              {/* Column Header */}
              <div className="mb-8 flex items-center gap-3">
                <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground/40">
                  {blogT.fragments[lang]}
                </span>
                <div className="h-px flex-1 bg-foreground/5" aria-hidden="true" />
              </div>

              {/* Minimal Notes as Archive Slips */}
              <div className="flex flex-col gap-4">
                {noteEntries.slice(0, 8).map((note) => {
                  const date = new Date(note.date);
                  const day = date.getDate();
                  const month = date.toLocaleDateString(locale, { month: "short" });

                  return (
                    <div 
                      key={note.id}
                      className="border-l border-foreground/6 py-1 pl-3 transition-colors hover:border-foreground/15"
                    >
                      {/* Date marker */}
                      <time 
                        dateTime={note.date}
                        className="mb-1 block font-mono text-[8px] uppercase tracking-wider text-muted-foreground/35"
                      >
                        {month} {day}
                      </time>

                      {/* Fragment */}
                      <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground/55">
                        {note.text.length > 55 ? note.text.slice(0, 55) + '...' : note.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </aside>
          </div>

          {/* Footer */}
          <footer className="mt-20 flex items-center justify-center gap-6 text-xs uppercase tracking-widest text-muted-foreground/40">
            <span>{blogT.collectedWritings[lang]}</span>
            <span className="h-px w-10 bg-foreground/10" aria-hidden="true" />
            <span>{t("home.established")}</span>
          </footer>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { translations } from "@/lib/translations";
import { getBlogPosts, getEssays } from "@/lib/actions";
import type { BlogPost, Essay } from "@/lib/database.types";
import { blogEntries as staticBlogEntries } from "@/data/blog";
import { noteEntries } from "@/data/notes";

// Adapter for display - Fragments (short-form)
interface DisplayFragment {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  slug: string;
  tags?: string[];
}

// Adapter for display - Essays (long-form)
interface DisplayEssay {
  id: string;
  date: string;
  title: string;
  subtitle: string | null;
  slug: string;
  tags?: string[];
  readingTime?: number;
}

function toFragment(post: BlogPost): DisplayFragment {
  return {
    id: post.id,
    date: post.date,
    title: post.title,
    excerpt: post.excerpt || "",
    slug: post.slug,
    tags: post.tags || [],
  };
}

function toEssayDisplay(essay: Essay): DisplayEssay {
  return {
    id: essay.id,
    date: essay.date,
    title: essay.title,
    subtitle: essay.subtitle,
    slug: essay.slug,
    tags: essay.tags || [],
    readingTime: essay.reading_time_minutes || undefined,
  };
}

export default function BlogPage() {
  const { lang, t } = useLanguage();
  const blogT = translations.blog;

  // Essays (long-form)
  const [essays, setEssays] = useState<DisplayEssay[]>([]);
  
  // Fragments (short-form) - from blog_posts table
  const [fragments, setFragments] = useState<DisplayFragment[]>(
    staticBlogEntries.map(e => ({
      id: e.id,
      date: e.date,
      title: e.title,
      excerpt: e.excerpt,
      slug: e.slug,
      tags: e.tags,
    }))
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      const [fragmentsResult, essaysResult] = await Promise.all([
        getBlogPosts(),
        getEssays(),
      ]);
      
      if (fragmentsResult.data && fragmentsResult.data.length > 0) {
        setFragments(fragmentsResult.data.map(toFragment));
      }
      if (essaysResult.data) {
        setEssays(essaysResult.data.map(toEssayDisplay));
      }
      setLoading(false);
    }
    loadContent();
  }, []);

  const totalEssays = essays.length;
  const totalFragments = fragments.length;

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
            
            {/* Left Column: Essays (long-form) */}
            <div className="flex-1 lg:flex-[2]">
              {/* Column Header */}
              <div className="mb-8 flex items-center gap-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {blogT.essays[lang]}
                </span>
                <div className="h-px flex-1 bg-foreground/10" aria-hidden="true" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                  {totalEssays}
                </span>
              </div>

              {/* Loading state */}
              {loading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span>{lang === "zh" ? "加载中..." : "Loading..."}</span>
                </div>
              )}

              {/* Essays */}
              {!loading && essays.length > 0 && (
                <div className="flex flex-col gap-6">
                  {essays.map((essay) => {
                    const [year, month, day] = essay.date.split("-").map(Number);
                    const monthNames = lang === "zh"
                      ? ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
                      : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    const formattedDate = `${monthNames[month - 1]} ${day}, ${year}`;

                    return (
                      <Link
                        key={essay.id}
                        href={`/essays/${essay.slug}`}
                        className="group block"
                      >
                        <article className="rounded-lg border border-foreground/8 bg-card/40 p-5 shadow-sm backdrop-blur-sm transition-all hover:border-foreground/12 hover:bg-card/60 hover:shadow-md md:p-6">
                          <time 
                            dateTime={essay.date}
                            className="mb-3 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground/50"
                          >
                            {formattedDate}
                          </time>
                          <h2 className="mb-1.5 font-serif text-lg font-normal leading-snug text-foreground transition-colors group-hover:text-primary md:text-xl">
                            {essay.title}
                          </h2>
                          {essay.subtitle && (
                            <p className="mb-3 text-sm text-muted-foreground/70">{essay.subtitle}</p>
                          )}
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              {essay.tags && essay.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                  {essay.tags.slice(0, 2).map((tag) => (
                                    <span key={tag} className="rounded-full bg-secondary/30 px-2 py-0.5 text-[9px] uppercase tracking-wider text-muted-foreground/60">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {essay.readingTime && (
                                <span className="text-[10px] text-muted-foreground/40">
                                  {essay.readingTime} min read
                                </span>
                              )}
                            </div>
                            <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground/40 transition-all group-hover:gap-2 group-hover:text-primary/70">
                              <span className="font-serif italic">{blogT.read[lang]}</span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
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
              )}

              {/* Empty state for essays */}
              {!loading && essays.length === 0 && (
                <p className="text-sm text-muted-foreground/60 italic">
                  {lang === "zh" ? "暂无文章..." : "No essays yet..."}
                </p>
              )}

              {/* Fragments Section (below essays) */}
              {!loading && fragments.length > 0 && (
                <div className="mt-12">
                  <div className="mb-6 flex items-center gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {blogT.fragments[lang]}
                    </span>
                    <div className="h-px flex-1 bg-foreground/10" aria-hidden="true" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                      {totalFragments}
                    </span>
                  </div>
                  <div className="flex flex-col gap-4">
                    {fragments.map((fragment) => {
                      const [year, month, day] = fragment.date.split("-").map(Number);
                      const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                      const formattedDate = `${shortMonths[month - 1]} ${day}, ${year}`;

                      return (
                        <Link key={fragment.id} href={`/blog/${fragment.slug}`} className="group block">
                          <article className="rounded-lg border border-foreground/6 bg-card/20 p-4 transition-all hover:border-foreground/10 hover:bg-card/40">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="mb-1 text-sm font-medium text-foreground/90 transition-colors group-hover:text-primary">
                                  {fragment.title}
                                </h3>
                                <p className="line-clamp-1 text-xs text-muted-foreground/60">
                                  {fragment.excerpt}
                                </p>
                              </div>
                              <time className="flex-shrink-0 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/40">
                                {formattedDate}
                              </time>
                            </div>
                          </article>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Quiet Notes Rail */}
            <aside className="hidden lg:block lg:flex-1">
              {/* Column Header */}
              <div className="mb-8 flex items-center gap-3">
                <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground/40">
                  {blogT.notes[lang]}
                </span>
                <div className="h-px flex-1 bg-foreground/5" aria-hidden="true" />
              </div>

              {/* Minimal Notes (static) */}
              <div className="flex flex-col gap-4">
                {noteEntries.slice(0, 8).map((note) => {
                  const [, noteMonth, noteDay] = note.date.split("-").map(Number);
                  const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                  const month = shortMonths[noteMonth - 1];
                  const day = noteDay;

                  return (
                    <div 
                      key={note.id}
                      className="border-l border-foreground/6 py-1 pl-3 transition-colors hover:border-foreground/15"
                    >
                      <time 
                        dateTime={note.date}
                        className="mb-1 block font-mono text-[8px] uppercase tracking-wider text-muted-foreground/35"
                      >
                        {month} {day}
                      </time>
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

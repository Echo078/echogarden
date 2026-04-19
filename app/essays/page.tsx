"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { getEssays } from "@/lib/actions";
import type { Essay } from "@/lib/database.types";

export default function EssaysPage() {
  const { lang } = useLanguage();
  const [essays, setEssays] = useState<Essay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const result = await getEssays();
      if (result.data) {
        setEssays(result.data);
      }
      setLoading(false);
    }
    load();
  }, []);

  const featuredEssays = essays.filter(e => e.featured);
  const regularEssays = essays.filter(e => !e.featured);

  // Format date consistently to avoid hydration issues
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    const months = ["January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November", "December"];
    return `${months[month - 1]} ${day}, ${year}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div>
        {/* Header */}
        <header className="border-b border-foreground/8 bg-background/60 backdrop-blur-md">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="text-xs text-muted-foreground/60 transition-colors hover:text-foreground"
            >
              ← {lang === "zh" ? "返回" : "Back"}
            </Link>
            <h1 className="font-serif text-lg font-light text-foreground">
              {lang === "zh" ? "散文" : "Essays"}
            </h1>
            <div className="w-12" />
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-6 py-12">
          {/* Page intro */}
          <div className="mb-12 text-center">
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground">
              {lang === "zh" 
                ? "长篇的思考与反思，关于音乐、创作、生活。"
                : "Longer reflections on music, creativity, and life."}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : essays.length === 0 ? (
            <div className="rounded-xl bg-card/30 p-12 text-center backdrop-blur-sm">
              <p className="text-sm text-muted-foreground">
                {lang === "zh" ? "暂无文章" : "No essays yet."}
              </p>
            </div>
          ) : (
            <>
              {/* Featured Essays */}
              {featuredEssays.length > 0 && (
                <section className="mb-12">
                  <h2 className="mb-6 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    {lang === "zh" ? "精选" : "Featured"}
                  </h2>
                  <div className="space-y-6">
                    {featuredEssays.map((essay) => (
                      <Link
                        key={essay.id}
                        href={`/essays/${essay.slug}`}
                        className="group block rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6 transition-all hover:border-primary/40 hover:shadow-lg"
                      >
                        <div className="mb-3 flex items-center gap-3">
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                            Featured
                          </span>
                          <span className="text-xs text-muted-foreground/50">
                            {formatDate(essay.date)}
                          </span>
                          {essay.reading_time_minutes && (
                            <span className="text-xs text-muted-foreground/50">
                              • {essay.reading_time_minutes} min read
                            </span>
                          )}
                        </div>
                        <h3 className="mb-2 font-serif text-xl font-light text-foreground group-hover:text-primary transition-colors">
                          {essay.title}
                        </h3>
                        {essay.subtitle && (
                          <p className="text-sm text-muted-foreground">
                            {essay.subtitle}
                          </p>
                        )}
                        {essay.tags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {essay.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-foreground/5 px-2 py-0.5 text-[10px] text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* All Essays */}
              {regularEssays.length > 0 && (
                <section>
                  {featuredEssays.length > 0 && (
                    <h2 className="mb-6 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                      {lang === "zh" ? "所有文章" : "All Essays"}
                    </h2>
                  )}
                  <div className="space-y-4">
                    {regularEssays.map((essay) => (
                      <Link
                        key={essay.id}
                        href={`/essays/${essay.slug}`}
                        className="group block rounded-lg border border-foreground/8 bg-card/30 p-5 backdrop-blur-sm transition-all hover:border-foreground/20 hover:bg-card/50"
                      >
                        <div className="mb-2 flex items-center gap-3">
                          <span className="text-xs text-muted-foreground/50">
                            {formatDate(essay.date)}
                          </span>
                          {essay.reading_time_minutes && (
                            <span className="text-xs text-muted-foreground/50">
                              • {essay.reading_time_minutes} min read
                            </span>
                          )}
                        </div>
                        <h3 className="mb-1 font-serif text-lg font-light text-foreground group-hover:text-primary transition-colors">
                          {essay.title}
                        </h3>
                        {essay.subtitle && (
                          <p className="text-sm text-muted-foreground/70">
                            {essay.subtitle}
                          </p>
                        )}
                        {essay.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {essay.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-foreground/5 px-2 py-0.5 text-[10px] text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

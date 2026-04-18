"use client";

import Link from "next/link";
import { useState } from "react";
import { knowledgeCategories, knowledgeEntries } from "@/data/knowledge";
import { KnowledgeMap } from "@/components/knowledge-map";

export default function KnowledgePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredEntries = activeCategory
    ? knowledgeEntries.filter((entry) => entry.category === activeCategory)
    : knowledgeEntries;

  const totalEntries = knowledgeEntries.length;

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
              Reference Grove
            </p>
            <h1 className="mb-4 font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl">
              Knowledge
            </h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
              A personal reference library for engineering knowledge, course notes, 
              lab methods, and frequently used formulas.
            </p>
          </div>
        </div>
      </header>

      {/* Knowledge Map */}
      <section className="px-6 md:px-12">
        <div className="mx-auto max-w-6xl">
          <KnowledgeMap 
            activeCategory={activeCategory} 
            onCategorySelect={setActiveCategory} 
          />
        </div>
      </section>

      {/* Two Column Layout */}
      <section className="px-6 pb-20 md:px-12 md:pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
            
            {/* Left Column: Category Tree */}
            <aside className="shrink-0 lg:w-56">
              {/* Tree Header */}
              <div className="mb-6 flex items-center gap-3">
                <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/50">
                  Categories
                </span>
                <div className="h-px flex-1 bg-foreground/8" aria-hidden="true" />
              </div>

              {/* Category Tree */}
              <nav className="flex flex-col gap-1">
                {/* All entries option */}
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`group flex items-center gap-3 rounded-md px-3 py-2.5 text-left transition-all ${
                    activeCategory === null
                      ? "bg-secondary/50 text-foreground"
                      : "text-muted-foreground hover:bg-secondary/30 hover:text-foreground"
                  }`}
                >
                  <span className="text-xs text-muted-foreground/60">✦</span>
                  <span className="text-[13px]">All Entries</span>
                  <span className="ml-auto font-mono text-[10px] text-muted-foreground/50">
                    {totalEntries}
                  </span>
                </button>

                {/* Divider */}
                <div className="my-2 h-px bg-foreground/5" aria-hidden="true" />

                {/* Categories */}
                {knowledgeCategories.map((category) => {
                  const count = knowledgeEntries.filter(
                    (e) => e.category === category.id
                  ).length;

                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`group flex items-center gap-3 rounded-md px-3 py-2.5 text-left transition-all ${
                        activeCategory === category.id
                          ? "bg-secondary/50 text-foreground"
                          : "text-muted-foreground hover:bg-secondary/30 hover:text-foreground"
                      }`}
                    >
                      <span className="text-xs text-muted-foreground/60">
                        {category.icon}
                      </span>
                      <span className="text-[13px]">{category.name}</span>
                      <span className="ml-auto font-mono text-[10px] text-muted-foreground/50">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </nav>

              {/* Tree decoration */}
              <div className="mt-8 hidden lg:block">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground/30">
                  <span className="font-serif italic">Growing steadily</span>
                </div>
              </div>
            </aside>

            {/* Right Column: Knowledge Cards */}
            <div className="flex-1">
              {/* Column Header */}
              <div className="mb-8 flex items-center gap-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {activeCategory
                    ? knowledgeCategories.find((c) => c.id === activeCategory)?.name
                    : "All References"}
                </span>
                <div className="h-px flex-1 bg-foreground/10" aria-hidden="true" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                  {filteredEntries.length}
                </span>
              </div>

              {/* Knowledge Cards Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredEntries.map((entry) => {
                  const category = knowledgeCategories.find(
                    (c) => c.id === entry.category
                  );
                  const date = new Date(entry.updatedAt);
                  const formattedDate = date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <article
                      key={entry.id}
                      className="group rounded-lg border border-foreground/8 bg-card/40 p-4 shadow-sm backdrop-blur-sm transition-all hover:border-foreground/12 hover:bg-card/60 hover:shadow-md"
                    >
                      {/* Header row */}
                      <div className="mb-2.5 flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground/50">
                            {category?.icon}
                          </span>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/50">
                            {category?.name}
                          </span>
                        </div>
                        <time
                          dateTime={entry.updatedAt}
                          className="font-mono text-[9px] text-muted-foreground/40"
                        >
                          {formattedDate}
                        </time>
                      </div>

                      {/* Title */}
                      <h3 className="mb-1.5 font-serif text-[15px] font-normal leading-snug text-foreground transition-colors group-hover:text-primary">
                        {entry.title}
                      </h3>

                      {/* Description */}
                      <p className="mb-3 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground/70">
                        {entry.description}
                      </p>

                      {/* Quick reference preview */}
                      {entry.quickRef && (
                        <div className="mb-3 rounded bg-secondary/30 px-2.5 py-1.5">
                          <code className="font-mono text-[10px] text-muted-foreground/80">
                            {entry.quickRef}
                          </code>
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-secondary/40 px-2 py-0.5 text-[8px] uppercase tracking-wider text-muted-foreground/60"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Empty state */}
              {filteredEntries.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="font-serif text-lg italic text-muted-foreground/50">
                    No entries yet
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground/40">
                    Knowledge grows slowly, like a garden.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-20 flex items-center justify-center gap-6 text-xs uppercase tracking-widest text-muted-foreground/40">
            <span>Reference Grove</span>
            <span className="h-px w-10 bg-foreground/10" aria-hidden="true" />
            <span>Est. 2026</span>
          </footer>
        </div>
      </section>
    </main>
  );
}

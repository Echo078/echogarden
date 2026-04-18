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
    <main className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Compact Header */}
      <header className="shrink-0 px-6 py-4 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
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
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            <span>Return</span>
          </Link>

          <div className="flex items-center gap-4">
            <h1 className="font-serif text-lg font-light tracking-tight text-foreground">
              Knowledge
            </h1>
            <span className="font-mono text-[9px] text-muted-foreground/50">
              {totalEntries} entries
            </span>
          </div>

          <div className="w-16" /> {/* Spacer for balance */}
        </div>
      </header>

      {/* Knowledge Map - Compact */}
      <section className="shrink-0 px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <KnowledgeMap 
            activeCategory={activeCategory} 
            onCategorySelect={setActiveCategory} 
          />
        </div>
      </section>

      {/* Two Column Layout - Fills remaining space */}
      <section className="min-h-0 flex-1 px-6 pb-4 md:px-10">
        <div className="mx-auto flex h-full max-w-7xl gap-6 lg:gap-10">
          
          {/* Left Column: Category Tree - Compact */}
          <aside className="hidden shrink-0 lg:block lg:w-44">
            <div className="flex flex-col gap-0.5">
              {/* All entries option */}
              <button
                onClick={() => setActiveCategory(null)}
                className={`group flex items-center gap-2 rounded px-2.5 py-1.5 text-left transition-all ${
                  activeCategory === null
                    ? "bg-secondary/50 text-foreground"
                    : "text-muted-foreground hover:bg-secondary/30 hover:text-foreground"
                }`}
              >
                <span className="text-[10px] text-muted-foreground/50">*</span>
                <span className="text-[11px]">All</span>
                <span className="ml-auto font-mono text-[9px] text-muted-foreground/40">
                  {totalEntries}
                </span>
              </button>

              {/* Categories */}
              {knowledgeCategories.map((category) => {
                const count = knowledgeEntries.filter(
                  (e) => e.category === category.id
                ).length;

                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`group flex items-center gap-2 rounded px-2.5 py-1.5 text-left transition-all ${
                      activeCategory === category.id
                        ? "bg-secondary/50 text-foreground"
                        : "text-muted-foreground hover:bg-secondary/30 hover:text-foreground"
                    }`}
                  >
                    <span className="text-[10px] text-muted-foreground/50">
                      {category.icon}
                    </span>
                    <span className="text-[11px]">{category.name.split(" & ")[0]}</span>
                    <span className="ml-auto font-mono text-[9px] text-muted-foreground/40">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Column: Knowledge Cards - Scrollable */}
          <div className="flex min-h-0 flex-1 flex-col">
            {/* Column Header */}
            <div className="mb-3 flex shrink-0 items-center gap-3">
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60">
                {activeCategory
                  ? knowledgeCategories.find((c) => c.id === activeCategory)?.name.split(" & ")[0]
                  : "All"}
              </span>
              <div className="h-px flex-1 bg-foreground/8" aria-hidden="true" />
              <span className="font-mono text-[9px] text-muted-foreground/40">
                {filteredEntries.length}
              </span>
            </div>

            {/* Knowledge Cards Grid - Scrollable */}
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredEntries.map((entry) => {
                  const category = knowledgeCategories.find(
                    (c) => c.id === entry.category
                  );

                  return (
                    <article
                      key={entry.id}
                      className="group rounded-lg border border-foreground/6 bg-card/30 p-3 transition-all hover:border-foreground/10 hover:bg-card/50"
                    >
                      {/* Header row */}
                      <div className="mb-1.5 flex items-center gap-1.5">
                        <span className="text-[9px] text-muted-foreground/40">
                          {category?.icon}
                        </span>
                        <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/40">
                          {category?.name.split(" & ")[0]}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mb-1 font-serif text-[13px] font-normal leading-snug text-foreground">
                        {entry.title}
                      </h3>

                      {/* Description */}
                      <p className="mb-2 line-clamp-1 text-[10px] leading-relaxed text-muted-foreground/60">
                        {entry.description}
                      </p>

                      {/* Quick reference preview */}
                      {entry.quickRef && (
                        <div className="mb-2 rounded bg-secondary/20 px-2 py-1">
                          <code className="font-mono text-[9px] text-muted-foreground/70">
                            {entry.quickRef}
                          </code>
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-secondary/30 px-1.5 py-0.5 text-[7px] uppercase tracking-wider text-muted-foreground/50"
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
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="font-serif text-sm italic text-muted-foreground/40">
                    No entries yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

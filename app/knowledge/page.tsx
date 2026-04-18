"use client";

import Link from "next/link";
import { useState } from "react";
import { knowledgeCategories, knowledgeEntries } from "@/data/knowledge";
import { KnowledgeMap } from "@/components/knowledge-map";

export default function KnowledgePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter entries by category and search query
  const filteredEntries = knowledgeEntries.filter((entry) => {
    const matchesCategory = activeCategory ? entry.category === activeCategory : true;
    
    if (!searchQuery.trim()) return matchesCategory;
    
    const query = searchQuery.toLowerCase();
    const category = knowledgeCategories.find((c) => c.id === entry.category);
    
    const matchesSearch = 
      entry.title.toLowerCase().includes(query) ||
      entry.description.toLowerCase().includes(query) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(query)) ||
      category?.name.toLowerCase().includes(query) ||
      (entry.quickRef && entry.quickRef.toLowerCase().includes(query));
    
    return matchesCategory && matchesSearch;
  });

  const totalEntries = knowledgeEntries.length;

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="shrink-0 px-6 py-6 md:px-10 md:py-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
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

          <div className="flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                Reference Grove
              </p>
              <h1 className="font-serif text-3xl font-light tracking-tight text-foreground md:text-4xl">
                Knowledge Tree
              </h1>
            </div>
            <p className="hidden text-right text-sm text-muted-foreground md:block">
              <span className="font-serif text-2xl font-light text-foreground">
                {totalEntries}
              </span>
              <br />
              entries
            </p>
          </div>
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
          
          {/* Left Column: Category Tree + Search */}
          <aside className="hidden shrink-0 lg:block lg:w-48">
            {/* Search Input */}
            <div className="mb-4">
              <div className="relative">
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
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes, formulas..."
                  className="w-full rounded-md border border-foreground/10 bg-card/30 py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary/30 focus:bg-card/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                    aria-label="Clear search"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Search hint when active */}
              {searchQuery && (
                <p className="mt-2 text-[10px] text-muted-foreground/50">
                  {filteredEntries.length} {filteredEntries.length === 1 ? "result" : "results"} for &ldquo;{searchQuery}&rdquo;
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              {/* All entries option */}
              <button
                onClick={() => setActiveCategory(null)}
                className={`group flex items-center gap-2 rounded px-3 py-2 text-left transition-all ${
                  activeCategory === null
                    ? "bg-secondary/50 text-foreground"
                    : "text-muted-foreground hover:bg-secondary/30 hover:text-foreground"
                }`}
              >
                <span className="text-xs text-muted-foreground/50">*</span>
                <span className="text-xs">All</span>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground/40">
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
                    className={`group flex items-center gap-2 rounded px-3 py-2 text-left transition-all ${
                      activeCategory === category.id
                        ? "bg-secondary/50 text-foreground"
                        : "text-muted-foreground hover:bg-secondary/30 hover:text-foreground"
                    }`}
                  >
                    <span className="text-xs text-muted-foreground/50">
                      {category.icon}
                    </span>
                    <span className="text-xs">{category.name.split(" & ")[0]}</span>
                    <span className="ml-auto font-mono text-[10px] text-muted-foreground/40">
                      {count}
                    </span>
                  </button>
                );
              })}
              </div>
            </div>
          </aside>

          {/* Right Column: Knowledge Cards - Scrollable */}
          <div className="flex min-h-0 flex-1 flex-col">
            {/* Column Header */}
            <div className="mb-4 flex shrink-0 items-center gap-4">
              <h2 className="font-serif text-base font-normal italic text-muted-foreground">
                {activeCategory
                  ? knowledgeCategories.find((c) => c.id === activeCategory)?.name
                  : "All Entries"}
              </h2>
              <div className="h-px flex-1 bg-foreground/10" aria-hidden="true" />
              <span className="font-mono text-xs text-muted-foreground/50">
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
                      className="group rounded-lg border border-foreground/8 bg-card/40 p-4 transition-all hover:border-foreground/12 hover:bg-card/60"
                    >
                      {/* Header row */}
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground/50">
                          {category?.icon}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/50">
                          {category?.name.split(" & ")[0]}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mb-1.5 font-serif text-sm font-normal leading-snug text-foreground">
                        {entry.title}
                      </h3>

                      {/* Description */}
                      <p className="mb-2.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground/70">
                        {entry.description}
                      </p>

                      {/* Quick reference preview */}
                      {entry.quickRef && (
                        <div className="mb-2.5 rounded bg-secondary/30 px-2.5 py-1.5">
                          <code className="font-mono text-[10px] text-muted-foreground/80">
                            {entry.quickRef}
                          </code>
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {entry.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-secondary/40 px-2 py-0.5 text-[9px] uppercase tracking-wider text-muted-foreground/60"
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
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <p className="font-serif text-base italic text-muted-foreground/50">
                    {searchQuery ? `No results for "${searchQuery}"` : "No entries yet"}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-3 text-xs text-primary/60 hover:text-primary transition-colors"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

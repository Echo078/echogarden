import Link from "next/link";
import { diaryEntries, formatDate } from "@/data/diary";
import { SpecimenCard } from "@/components/specimen-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audio Diary — Echo's Garden",
  description: "Browse all audio diary entries. A collection of daily improvisations and sound notes.",
};

export default function DiaryPage() {
  const totalEntries = diaryEntries.length;

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border px-6 py-8 md:px-12 md:py-12">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
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
                Collection
              </p>
              <h1 className="font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl">
                Audio Diary
              </h1>
            </div>
            <p className="hidden text-right text-sm text-muted-foreground md:block">
              <span className="font-serif text-2xl text-foreground">{totalEntries}</span>
              <br />
              specimens
            </p>
          </div>
        </div>
      </header>

      {/* Archive Grid */}
      <section className="px-6 py-12 md:px-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          {/* Grid of specimens */}
          <div className="grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
            {diaryEntries.map((entry, index) => (
              <SpecimenCard
                key={entry.id}
                entry={entry}
                formattedDate={formatDate(entry.date)}
                specimenNumber={totalEntries - index}
              />
            ))}
          </div>

          {/* Archive footer */}
          <div className="mt-16 flex items-center justify-center gap-8 text-xs uppercase tracking-widest text-muted-foreground">
            <span>Ongoing collection</span>
            <span className="h-px w-12 bg-border" aria-hidden="true" />
            <span>Est. 2026</span>
          </div>
        </div>
      </section>
    </main>
  );
}

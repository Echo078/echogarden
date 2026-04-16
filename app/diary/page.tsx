import Link from "next/link";
import { diaryEntries, formatDate, groupEntriesByMonth } from "@/data/diary";
import { SpecimenCard } from "@/components/specimen-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audio Diary — Echo's Garden",
  description: "A botanical archive of sound specimens. Daily improvisations preserved like pressed flowers.",
};

export default function DiaryPage() {
  const entriesByMonth = groupEntriesByMonth(diaryEntries);
  const months = Object.keys(entriesByMonth);

  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-16 text-center">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
            <span>Return to Garden</span>
          </Link>
          
          <h1 className="mb-4 font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl">
            Sound Herbarium
          </h1>
          <p className="mx-auto max-w-md text-balance text-muted-foreground">
            A collection of {diaryEntries.length} sound specimens, preserved like botanical treasures.
          </p>

          {/* Decorative divider */}
          <div className="mx-auto mt-8 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-border" />
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-primary/50" aria-hidden="true">
              <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1" />
              <circle cx="8" cy="8" r="1" fill="currentColor" />
            </svg>
            <span className="h-px w-12 bg-border" />
          </div>
        </header>

        {/* Entries grouped by month */}
        <div className="space-y-16">
          {months.map((month) => (
            <section key={month}>
              {/* Month header */}
              <div className="mb-6 flex items-center gap-4">
                <h2 className="font-serif text-lg font-medium text-foreground/80">{month}</h2>
                <span className="h-px flex-1 bg-border/50" />
                <span className="text-xs text-muted-foreground">
                  {entriesByMonth[month].length} {entriesByMonth[month].length === 1 ? "specimen" : "specimens"}
                </span>
              </div>

              {/* Grid of cards */}
              <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                {entriesByMonth[month].map((entry) => (
                  <SpecimenCard
                    key={entry.id}
                    entry={entry}
                    formattedDate={formatDate(entry.date)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-24 text-center">
          <div className="mx-auto mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-border" />
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-primary/40" aria-hidden="true">
              <path
                d="M10 4C10 4 6 8 6 12C6 14.5 7.5 17 10 18C12.5 17 14 14.5 14 12C14 8 10 4 10 4Z"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </svg>
            <span className="h-px w-8 bg-border" />
          </div>
          <p className="text-sm text-muted-foreground">
            New specimens added as they are collected...
          </p>
        </footer>
      </div>
    </main>
  );
}

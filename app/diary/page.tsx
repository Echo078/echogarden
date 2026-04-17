import Link from "next/link";
import { diaryEntries, type DiaryEntry } from "@/data/diary";
import { SpecimenCard } from "@/components/specimen-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audio Diary — Echo's Garden",
  description:
    "Browse all audio diary entries. A collection of daily improvisations and sound notes.",
};

// Group entries by month
function groupByMonth(entries: DiaryEntry[]): Map<string, DiaryEntry[]> {
  const groups = new Map<string, DiaryEntry[]>();

  entries.forEach((entry) => {
    const date = new Date(entry.date);
    const monthKey = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });

    if (!groups.has(monthKey)) {
      groups.set(monthKey, []);
    }
    groups.get(monthKey)!.push(entry);
  });

  return groups;
}

export default function DiaryPage() {
  const totalEntries = diaryEntries.length;
  const groupedEntries = groupByMonth(diaryEntries);

  // Create specimen numbers (descending from total)
  const specimenNumbers = new Map<string, number>();
  diaryEntries.forEach((entry, index) => {
    specimenNumbers.set(entry.id, totalEntries - index);
  });

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

          <div className="flex items-end justify-between">
            <div>
              <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
                Specimen Cabinet
              </p>
              <h1 className="font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl">
                Sound Specimens
              </h1>
            </div>
            <p className="hidden text-right text-sm text-muted-foreground md:block">
              <span className="font-serif text-3xl font-light text-foreground">
                {totalEntries}
              </span>
              <br />
              preserved
            </p>
          </div>
        </div>
      </header>

      {/* Archive Grid - Grouped by Month */}
      <section className="px-6 pb-16 md:px-12 md:pb-24">
        <div className="mx-auto max-w-6xl">
          {Array.from(groupedEntries.entries()).map(([month, entries]) => (
            <div key={month} className="mb-16 last:mb-0">
              {/* Month heading */}
              <div className="mb-8 flex items-center gap-4">
                <h2 className="font-serif text-lg font-normal italic text-muted-foreground">
                  {month}
                </h2>
                <div className="h-px flex-1 bg-foreground/10" aria-hidden="true" />
              </div>

              {/* Specimen cabinet grid - varied heights create organic rhythm */}
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8 lg:grid-cols-4 lg:gap-10">
                {entries.map((entry) => (
                  <SpecimenCard
                    key={entry.id}
                    entry={entry}
                    specimenNumber={specimenNumbers.get(entry.id)!}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Archive footer */}
          <div className="mt-24 flex items-center justify-center gap-6 text-xs uppercase tracking-widest text-muted-foreground">
            <span>Ongoing collection</span>
            <span className="h-px w-10 bg-foreground/10" aria-hidden="true" />
            <span>Est. 2026</span>
          </div>
        </div>
      </section>
    </main>
  );
}

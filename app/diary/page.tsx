import Link from "next/link";
import { diaryEntries, formatDate } from "@/data/diary";
import { DiaryEntryCard } from "@/components/diary-entry-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audio Diary — Echo's Garden",
  description: "Browse all audio diary entries. A collection of daily improvisations and sound notes.",
};

export default function DiaryPage() {
  return (
    <main className="min-h-screen px-6 py-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <header className="mb-16">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            <span>Back to Home</span>
          </Link>
          
          <h1 className="mb-3 font-serif text-3xl font-light tracking-tight text-foreground md:text-4xl">
            Audio Diary
          </h1>
          <p className="text-muted-foreground">
            A collection of {diaryEntries.length} sound notes and improvisations.
          </p>
        </header>

        {/* Entries List */}
        <section className="space-y-6">
          {diaryEntries.map((entry, index) => (
            <DiaryEntryCard
              key={entry.id}
              entry={entry}
              formattedDate={formatDate(entry.date)}
              isFirst={index === 0}
            />
          ))}
        </section>

        {/* Footer */}
        <footer className="mt-20 text-center text-sm text-muted-foreground">
          <p>More sounds to come...</p>
        </footer>
      </div>
    </main>
  );
}

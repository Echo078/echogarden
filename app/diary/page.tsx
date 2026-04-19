"use client";

import { useEffect, useState } from "react";
import { SpecimenCard } from "@/components/specimen-card";
import { useLanguage } from "@/components/language-provider";
import { getMusicSpecimens } from "@/lib/actions";
import type { MusicSpecimen } from "@/lib/database.types";
import { diaryEntries as staticEntries, type DiaryEntry } from "@/data/diary";

// Adapter to convert DB specimen to DiaryEntry format for SpecimenCard
function toDisplayEntry(specimen: MusicSpecimen): DiaryEntry {
  return {
    id: specimen.id,
    date: specimen.date,
    title: specimen.title,
    note: specimen.note || "",
    mood: specimen.mood || [],
    audioFile: specimen.audio_url,
    specimen: (specimen.specimen_type as DiaryEntry["specimen"]) || "leaf",
  };
}

// Group entries by month
function groupByMonth(entries: DiaryEntry[], locale: string): Map<string, DiaryEntry[]> {
  const groups = new Map<string, DiaryEntry[]>();

  entries.forEach((entry) => {
    const date = new Date(entry.date);
    const monthKey = date.toLocaleDateString(locale, {
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
  const { lang, t } = useLanguage();
  const locale = lang === "zh" ? "zh-CN" : "en-US";
  
  const [entries, setEntries] = useState<DiaryEntry[]>(staticEntries);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSpecimens() {
      const result = await getMusicSpecimens();
      if (result.data && result.data.length > 0) {
        setEntries(result.data.map(toDisplayEntry));
      }
      setLoading(false);
    }
    loadSpecimens();
  }, []);

  const totalEntries = entries.length;
  const groupedEntries = groupByMonth(entries, locale);

  // Create specimen numbers (descending from total)
  const specimenNumbers = new Map<string, number>();
  entries.forEach((entry, index) => {
    specimenNumbers.set(entry.id, totalEntries - index);
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <header className="px-6 py-8 md:px-12 md:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between">
            <div>
              <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
                {t("diary.subtitle")}
              </p>
              <h1 className="font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl">
                {t("diary.pageTitle")}
              </h1>
            </div>
            <p className="hidden text-right text-sm text-muted-foreground md:block">
              <span className="font-serif text-3xl font-light text-foreground">
                {totalEntries}
              </span>
              <br />
              {t("diary.preserved")}
            </p>
          </div>
        </div>
      </header>

      {/* Loading state */}
      {loading && (
        <div className="px-6 md:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>{lang === "zh" ? "加载中..." : "Loading..."}</span>
            </div>
          </div>
        </div>
      )}

      {/* Archive Grid - Grouped by Month */}
      {!loading && (
        <section className="px-6 pb-16 md:px-12 md:pb-24">
          <div className="mx-auto max-w-6xl">
            {Array.from(groupedEntries.entries()).map(([month, monthEntries]) => (
              <div key={month} className="mb-16 last:mb-0">
                {/* Month heading */}
                <div className="mb-8 flex items-center gap-4">
                  <h2 className="font-serif text-lg font-normal italic text-muted-foreground">
                    {month}
                  </h2>
                  <div className="h-px flex-1 bg-foreground/10" aria-hidden="true" />
                </div>

                {/* Specimen cabinet grid */}
                <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8 lg:grid-cols-4 lg:gap-10">
                  {monthEntries.map((entry) => (
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
              <span>{t("home.ongoingCollection")}</span>
              <span className="h-px w-10 bg-foreground/10" aria-hidden="true" />
              <span>{t("home.established")}</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

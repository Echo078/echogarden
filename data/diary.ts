import type { SpecimenType } from "@/components/specimen-illustrations";

export interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  note: string;
  mood: string[];
  audioFile: string;
  specimen: SpecimenType;
}

// Only verified recordings belong here. The original template audio files did not exist.
// Published performances and productions are in /music; live specimens still load from the database.
export const diaryEntries: DiaryEntry[] = [];

export function getLatestEntry(): DiaryEntry | undefined {
  return diaryEntries[0];
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

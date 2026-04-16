export type SpecimenType = "leaf" | "seed" | "petal" | "shell" | "stone" | "branch" | "wind" | "bark" | "fruit";

export interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  note: string;
  mood: string[];
  audioFile: string;
  specimen: SpecimenType;
}

export const diaryEntries: DiaryEntry[] = [
  {
    id: "1",
    date: "2026-04-16",
    title: "Morning Light",
    note: "A gentle improvisation captured while watching the sunrise through the kitchen window.",
    mood: ["peaceful", "hopeful"],
    audioFile: "/audio/morning-light.mp3",
    specimen: "petal",
  },
  {
    id: "2",
    date: "2026-04-14",
    title: "After the Rain",
    note: "Soft piano notes inspired by the quiet that comes after a spring shower.",
    mood: ["reflective", "calm"],
    audioFile: "/audio/after-rain.mp3",
    specimen: "leaf",
  },
  {
    id: "3",
    date: "2026-04-12",
    title: "Evening Drift",
    note: "A slow, meandering piece recorded as the day came to a close.",
    mood: ["dreamy", "nostalgic"],
    audioFile: "/audio/evening-drift.mp3",
    specimen: "wind",
  },
  {
    id: "4",
    date: "2026-04-10",
    title: "Garden Whispers",
    note: "Inspired by a walk through the botanical garden.",
    mood: ["grateful", "gentle"],
    audioFile: "/audio/garden-whispers.mp3",
    specimen: "branch",
  },
  {
    id: "5",
    date: "2026-04-08",
    title: "First Coffee",
    note: "A simple morning melody, the quiet joy of a warm cup.",
    mood: ["content", "simple"],
    audioFile: "/audio/first-coffee.mp3",
    specimen: "seed",
  },
  {
    id: "6",
    date: "2026-03-28",
    title: "Ocean Memory",
    note: "Remembering the sound of waves from a childhood trip.",
    mood: ["nostalgic", "vast"],
    audioFile: "/audio/ocean-memory.mp3",
    specimen: "shell",
  },
  {
    id: "7",
    date: "2026-03-22",
    title: "Stone Path",
    note: "The rhythm of footsteps on an old garden path.",
    mood: ["grounded", "steady"],
    audioFile: "/audio/stone-path.mp3",
    specimen: "stone",
  },
  {
    id: "8",
    date: "2026-03-15",
    title: "Spring Unfold",
    note: "New growth pushing through last year's fallen leaves.",
    mood: ["hopeful", "tender"],
    audioFile: "/audio/spring-unfold.mp3",
    specimen: "fruit",
  },
];

export function getLatestEntry(): DiaryEntry {
  return diaryEntries[0];
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatMonthYear(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function groupEntriesByMonth(entries: DiaryEntry[]): Record<string, DiaryEntry[]> {
  return entries.reduce((acc, entry) => {
    const monthYear = formatMonthYear(entry.date);
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(entry);
    return acc;
  }, {} as Record<string, DiaryEntry[]>);
}

export interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  note: string;
  mood: string[];
  audioFile: string;
}

export const diaryEntries: DiaryEntry[] = [
  {
    id: "1",
    date: "2026-04-16",
    title: "Morning Light",
    note: "A gentle improvisation captured while watching the sunrise through the kitchen window. The birds were singing outside.",
    mood: ["peaceful", "hopeful"],
    audioFile: "/audio/morning-light.mp3",
  },
  {
    id: "2",
    date: "2026-04-14",
    title: "After the Rain",
    note: "Soft piano notes inspired by the quiet that comes after a spring shower. Everything felt fresh and clean.",
    mood: ["reflective", "calm"],
    audioFile: "/audio/after-rain.mp3",
  },
  {
    id: "3",
    date: "2026-04-12",
    title: "Evening Drift",
    note: "A slow, meandering piece recorded as the day came to a close. Letting thoughts wander freely.",
    mood: ["dreamy", "nostalgic"],
    audioFile: "/audio/evening-drift.mp3",
  },
  {
    id: "4",
    date: "2026-04-10",
    title: "Garden Whispers",
    note: "Inspired by a walk through the botanical garden. Trying to capture the feeling of being surrounded by growing things.",
    mood: ["grateful", "gentle"],
    audioFile: "/audio/garden-whispers.mp3",
  },
  {
    id: "5",
    date: "2026-04-08",
    title: "First Coffee",
    note: "A simple morning melody, nothing complicated. Just the quiet joy of a warm cup and a clear mind.",
    mood: ["content", "simple"],
    audioFile: "/audio/first-coffee.mp3",
  },
];

export function getLatestEntry(): DiaryEntry {
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

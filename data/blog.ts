export interface BlogEntry {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  tags?: string[];
  slug: string;
}

export const blogEntries: BlogEntry[] = [
  {
    id: "1",
    date: "2026-04-15",
    title: "On the Practice of Listening",
    excerpt: "There is a particular quality of attention that arises when we stop trying to hear something specific. The forest teaches this — how to receive sound without grasping, how to let the rustle of leaves simply pass through.",
    tags: ["listening", "practice"],
    slug: "on-the-practice-of-listening",
  },
  {
    id: "2",
    date: "2026-04-10",
    title: "Morning Rituals and the Threshold of Sound",
    excerpt: "Before the first note is played, there is always a moment of crossing over. The instrument sits waiting, the room holds its breath. I have come to cherish this threshold — the space between silence and the beginning of something.",
    tags: ["ritual", "morning"],
    slug: "morning-rituals-threshold-of-sound",
  },
  {
    id: "3",
    date: "2026-04-03",
    title: "Collecting Moments",
    excerpt: "What does it mean to preserve a sound? Not the recording itself, but the act of noticing — that particular bird call at 6:47am, the way rain sounds different on new leaves. Each specimen in this garden began as a moment of attention.",
    tags: ["collection", "attention"],
    slug: "collecting-moments",
  },
  {
    id: "4",
    date: "2026-03-28",
    title: "The Quiet Between",
    excerpt: "In Japanese, the word 'ma' describes the meaningful pause between things. I have been thinking about the silences in music, how they are not absence but presence of a different kind. The breath before the next phrase.",
    tags: ["silence", "reflection"],
    slug: "the-quiet-between",
  },
  {
    id: "5",
    date: "2026-03-20",
    title: "Why I Keep a Sound Diary",
    excerpt: "This practice began simply — a way to remember the improvised melodies that would otherwise vanish. But it has become something else: a form of presence, a daily commitment to noticing what the ear encounters.",
    tags: ["practice", "diary"],
    slug: "why-i-keep-a-sound-diary",
  },
];

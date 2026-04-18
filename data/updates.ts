export interface Update {
  id: string;
  date: string;
  content: string;
}

export const updates: Update[] = [
  {
    id: "1",
    date: "2026-04-16",
    content: "Added new improvisation 'Morning Light' to the Music Specimens collection",
  },
  {
    id: "2",
    date: "2026-04-14",
    content: "Published new essay on embodied listening in the Blog",
  },
  {
    id: "3",
    date: "2026-04-10",
    content: "Updated Research page with current focus on sonic interaction design",
  },
  {
    id: "4",
    date: "2026-04-08",
    content: "Added three new entries to the Knowledge base",
  },
  {
    id: "5",
    date: "2026-04-05",
    content: "Completed project documentation for Breath Controller prototype",
  },
];

export function formatUpdateDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

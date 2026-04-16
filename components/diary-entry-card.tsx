import { AudioPlayer } from "@/components/audio-player";
import type { DiaryEntry } from "@/data/diary";

interface DiaryEntryCardProps {
  entry: DiaryEntry;
  formattedDate: string;
  isFirst?: boolean;
}

export function DiaryEntryCard({ entry, formattedDate, isFirst }: DiaryEntryCardProps) {
  return (
    <article className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      {isFirst && (
        <span className="mb-3 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          Latest
        </span>
      )}
      
      <div className="mb-4">
        <time className="text-sm text-muted-foreground">{formattedDate}</time>
        <h2 className="mt-1 font-serif text-xl font-medium text-card-foreground md:text-2xl">
          {entry.title}
        </h2>
      </div>

      <p className="mb-5 leading-relaxed text-muted-foreground">{entry.note}</p>

      <div className="mb-4 flex flex-wrap gap-2">
        {entry.mood.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <AudioPlayer src={entry.audioFile} title={entry.title} />
    </article>
  );
}

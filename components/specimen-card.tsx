"use client";

import { useState, useRef } from "react";
import type { DiaryEntry } from "@/data/diary";

interface SpecimenCardProps {
  entry: DiaryEntry;
  specimenNumber: number;
}

export function SpecimenCard({ entry, specimenNumber }: SpecimenCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    if (duration) {
      setProgress((current / duration) * 100);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  // Format specimen number with leading zeros
  const formattedNumber = String(specimenNumber).padStart(3, "0");

  // Extract just day for compact display
  const day = new Date(entry.date).getDate();

  return (
    <article className="group flex h-full flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-secondary/20 md:p-5">
      {/* Specimen marker area */}
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          No. {formattedNumber}
        </span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-[10px] font-medium text-muted-foreground">
          {day}
        </span>
      </div>

      {/* Title */}
      <h3 className="mb-2 font-serif text-base font-normal leading-snug tracking-tight text-foreground md:text-lg">
        {entry.title}
      </h3>

      {/* One-line note - clamped */}
      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground md:text-sm">
        {entry.note}
      </p>

      {/* Mood tags */}
      <div className="mb-4 flex flex-wrap gap-x-2 gap-y-1">
        {entry.mood.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="text-[10px] italic text-muted-foreground/70"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Play control area - pushed to bottom */}
      <div className="mt-auto pt-3">
        <audio
          ref={audioRef}
          src={entry.audioFile}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          preload="metadata"
        />

        <button
          onClick={togglePlay}
          className="flex w-full items-center gap-2"
          aria-label={isPlaying ? `Pause ${entry.title}` : `Play ${entry.title}`}
        >
          {/* Play/Pause button */}
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background transition-colors group-hover:border-primary/50">
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-foreground"
              >
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="ml-0.5 text-foreground"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </div>

          {/* Progress line */}
          <div className="relative h-px flex-1 bg-border">
            <div
              className="absolute left-0 top-0 h-full bg-primary/60 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </button>
      </div>
    </article>
  );
}

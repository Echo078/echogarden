"use client";

import { useState, useRef } from "react";
import type { DiaryEntry } from "@/data/diary";

interface SpecimenCardProps {
  entry: DiaryEntry;
  formattedDate: string;
  specimenNumber: number;
}

export function SpecimenCard({ entry, formattedDate, specimenNumber }: SpecimenCardProps) {
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

  // Extract just month and day for compact date display
  const compactDate = new Date(entry.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <article className="group relative flex flex-col bg-card p-6 transition-colors hover:bg-secondary/30 md:p-8">
      {/* Specimen number */}
      <div className="mb-6 flex items-start justify-between">
        <span className="font-mono text-xs text-muted-foreground">
          No. {formattedNumber}
        </span>
        <time className="text-xs text-muted-foreground">{compactDate}</time>
      </div>

      {/* Title */}
      <h2 className="mb-3 font-serif text-xl font-normal tracking-tight text-foreground md:text-2xl">
        {entry.title}
      </h2>

      {/* Note */}
      <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
        {entry.note}
      </p>

      {/* Mood tags */}
      <div className="mb-6 flex flex-wrap gap-2">
        {entry.mood.map((tag) => (
          <span
            key={tag}
            className="text-xs italic text-muted-foreground before:mr-1 before:content-['·']"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Audio player - minimal line style */}
      <div className="mt-auto">
        <audio
          ref={audioRef}
          src={entry.audioFile}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          preload="metadata"
        />
        
        <button
          onClick={togglePlay}
          className="flex w-full items-center gap-3 text-left"
          aria-label={isPlaying ? `Pause ${entry.title}` : `Play ${entry.title}`}
        >
          {/* Play/Pause indicator */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border transition-colors group-hover:border-primary group-hover:bg-primary/5">
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
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
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="ml-0.5 text-foreground"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </div>

          {/* Progress bar */}
          <div className="relative h-px flex-1 bg-border">
            <div
              className="absolute left-0 top-0 h-full bg-primary transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </button>
      </div>
    </article>
  );
}

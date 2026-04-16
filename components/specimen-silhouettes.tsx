"use client";

import { useState, useRef } from "react";
import type { DiaryEntry } from "@/data/diary";
import type { SpecimenType } from "./specimen-illustrations";

// Define organic silhouette clip paths for each specimen type
// These are softly irregular shapes inspired by natural forms
const silhouetteClipPaths: Record<SpecimenType, string> = {
  // Leaf: elongated oval, slightly asymmetric, pointed ends
  leaf: "M 50 2 C 75 5, 92 20, 95 45 C 98 70, 85 90, 50 98 C 15 90, 2 70, 5 45 C 8 20, 25 5, 50 2 Z",
  
  // Petal: soft rounded teardrop shape
  petal: "M 50 3 C 80 8, 95 30, 95 55 C 95 80, 75 95, 50 97 C 25 95, 5 80, 5 55 C 5 30, 20 8, 50 3 Z",
  
  // Wind: flowing, elongated horizontal form
  wind: "M 3 50 C 8 25, 25 10, 50 8 C 75 6, 92 20, 97 50 C 92 80, 75 94, 50 92 C 25 90, 8 75, 3 50 Z",
  
  // Fern: tall, slightly narrow with soft curves
  fern: "M 50 2 C 70 5, 82 18, 85 40 C 88 62, 80 82, 50 98 C 20 82, 12 62, 15 40 C 18 18, 30 5, 50 2 Z",
  
  // Seed: compact, slightly rounded asymmetric
  seed: "M 50 5 C 78 10, 93 32, 92 55 C 91 78, 72 93, 50 95 C 28 93, 9 78, 8 55 C 7 32, 22 10, 50 5 Z",
  
  // Stone: irregular rounded form
  stone: "M 50 5 C 75 3, 92 22, 95 48 C 98 74, 78 95, 50 95 C 22 95, 2 74, 5 48 C 8 22, 25 3, 50 5 Z",
  
  // Shell: curved asymmetric spiral-inspired
  shell: "M 45 3 C 75 5, 95 25, 95 52 C 95 79, 70 97, 45 97 C 20 97, 3 79, 5 52 C 7 25, 20 5, 45 3 Z",
  
  // Bark: slightly rectangular with organic edges
  bark: "M 50 3 C 78 5, 95 20, 95 50 C 95 80, 78 95, 50 97 C 22 95, 5 80, 5 50 C 5 20, 22 5, 50 3 Z",
};

interface SpecimenSilhouetteProps {
  entry: DiaryEntry;
  specimenNumber: number;
}

export function SpecimenSilhouette({ entry, specimenNumber }: SpecimenSilhouetteProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const clipId = `clip-${entry.id}`;

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

  const formattedNumber = String(specimenNumber).padStart(3, "0");
  const day = new Date(entry.date).getDate();
  const clipPath = silhouetteClipPaths[entry.specimen] || silhouetteClipPaths.leaf;

  return (
    <article className="group relative flex flex-col">
      {/* SVG clip path definition */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path
              d={clipPath}
              transform="scale(0.01)"
            />
          </clipPath>
        </defs>
      </svg>

      {/* The specimen container with organic silhouette */}
      <div
        className="relative flex flex-col overflow-hidden bg-card transition-all duration-300 hover:shadow-lg"
        style={{
          clipPath: `url(#${clipId})`,
          aspectRatio: entry.specimen === "wind" ? "1.15 / 1" : "0.85 / 1",
        }}
      >
        {/* Subtle inner border effect using inset shadow */}
        <div 
          className="pointer-events-none absolute inset-0 rounded-[inherit]" 
          style={{
            clipPath: `url(#${clipId})`,
            boxShadow: "inset 0 0 0 1px var(--border)",
          }}
        />

        {/* Background pattern - subtle texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-transparent to-secondary/20 opacity-60" />

        {/* Content container */}
        <div className="relative z-10 flex h-full flex-col p-5 md:p-6">
          {/* Top area: number and day */}
          <div className="mb-auto flex items-start justify-between">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70">
              No. {formattedNumber}
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background/60 text-[10px] font-medium text-muted-foreground backdrop-blur-sm">
              {day}
            </span>
          </div>

          {/* Center: Title and note */}
          <div className="my-auto py-4 text-center">
            <h3 className="mb-2 font-serif text-base font-normal leading-snug tracking-tight text-foreground md:text-lg">
              {entry.title}
            </h3>
            <p className="mx-auto line-clamp-2 max-w-[90%] text-[11px] leading-relaxed text-muted-foreground">
              {entry.note}
            </p>
          </div>

          {/* Bottom: Play control */}
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
              className="flex w-full items-center justify-center gap-2"
              aria-label={isPlaying ? `Pause ${entry.title}` : `Play ${entry.title}`}
            >
              {/* Play/Pause button */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-background/80 backdrop-blur-sm transition-all duration-200 group-hover:border-primary/50 group-hover:bg-background">
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
            </button>

            {/* Progress indicator - thin arc at bottom */}
            <div className="mx-auto mt-2 h-0.5 w-3/4 overflow-hidden rounded-full bg-border/50">
              <div
                className="h-full bg-primary/60 transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Specimen label beneath - outside the clipped area */}
      <div className="mt-2 flex items-center justify-center gap-2 px-2">
        {entry.mood.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="text-[9px] italic text-muted-foreground/50"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

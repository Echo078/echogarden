"use client";

import { useState, useRef } from "react";
import type { DiaryEntry } from "@/data/diary";

interface SpecimenCardProps {
  entry: DiaryEntry;
  specimenNumber: number;
}

// Organic silhouette shapes as SVG clip paths - softly irregular, natural forms
const specimenShapes: Record<string, { clipPath: string; aspectRatio: string; viewBox: string; path: string }> = {
  leaf: {
    clipPath: "url(#leaf-clip)",
    aspectRatio: "3/4",
    viewBox: "0 0 120 160",
    path: "M60 4 C25 20, 8 60, 10 100 C12 130, 35 156, 60 156 C85 156, 108 130, 110 100 C112 60, 95 20, 60 4 Z",
  },
  petal: {
    clipPath: "url(#petal-clip)",
    aspectRatio: "4/5",
    viewBox: "0 0 128 160",
    path: "M64 6 C30 6, 6 45, 6 85 C6 125, 28 154, 64 154 C100 154, 122 125, 122 85 C122 45, 98 6, 64 6 Z",
  },
  wind: {
    clipPath: "url(#wind-clip)",
    aspectRatio: "5/4",
    viewBox: "0 0 160 128",
    path: "M12 64 C12 35, 40 8, 80 8 C120 8, 148 35, 148 64 C148 93, 120 120, 80 120 C40 120, 12 93, 12 64 Z",
  },
  fern: {
    clipPath: "url(#fern-clip)",
    aspectRatio: "2/3",
    viewBox: "0 0 106 160",
    path: "M53 4 C30 4, 10 40, 8 80 C6 120, 25 156, 53 156 C81 156, 100 120, 98 80 C96 40, 76 4, 53 4 Z",
  },
  seed: {
    clipPath: "url(#seed-clip)",
    aspectRatio: "3/4",
    viewBox: "0 0 120 160",
    path: "M60 8 C35 8, 16 50, 14 90 C12 130, 32 152, 60 152 C88 152, 108 130, 106 90 C104 50, 85 8, 60 8 Z",
  },
};

// Background colors for each specimen type - muted botanical tones
const specimenColors: Record<string, { bg: string; accent: string }> = {
  leaf: { bg: "bg-[#e8ede6]", accent: "text-[#7a8b72]" },
  petal: { bg: "bg-[#f0ebe6]", accent: "text-[#a89080]" },
  wind: { bg: "bg-[#e6eaed]", accent: "text-[#7a8590]" },
  fern: { bg: "bg-[#e4ebe4]", accent: "text-[#6b7b68]" },
  seed: { bg: "bg-[#ede9e4]", accent: "text-[#8a7a68]" },
};

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

  const formattedNumber = String(specimenNumber).padStart(3, "0");
  const day = new Date(entry.date).getDate();
  const shape = specimenShapes[entry.specimen] || specimenShapes.leaf;
  const colors = specimenColors[entry.specimen] || specimenColors.leaf;
  const clipId = `${entry.specimen}-clip-${entry.id}`;

  return (
    <article 
      className="group relative"
      style={{ aspectRatio: shape.aspectRatio }}
    >
      {/* SVG clip path definition */}
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path 
              d={shape.path} 
              transform={`scale(${1/parseFloat(shape.viewBox.split(' ')[2])}, ${1/parseFloat(shape.viewBox.split(' ')[3])})`}
            />
          </clipPath>
        </defs>
      </svg>

      {/* Main specimen container with organic shape */}
      <div 
        className={`relative flex h-full flex-col overflow-hidden ${colors.bg} transition-all duration-300 group-hover:shadow-lg`}
        style={{ clipPath: `url(#${clipId})` }}
      >
        {/* Subtle inner border effect */}
        <div 
          className="pointer-events-none absolute inset-0 border border-foreground/[0.06]"
          style={{ clipPath: `url(#${clipId})` }}
        />

        {/* Header area with specimen number and day */}
        <div className="relative flex shrink-0 items-start justify-between px-4 pt-4 md:px-5 md:pt-5">
          <span className={`font-mono text-[9px] uppercase tracking-wider ${colors.accent} opacity-70`}>
            No. {formattedNumber}
          </span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background/60 text-[9px] font-medium text-muted-foreground">
            {day}
          </span>
        </div>

        {/* Content area - centered in the shape */}
        <div className="flex flex-1 flex-col items-center justify-center px-5 py-3 text-center md:px-6">
          {/* Title */}
          <h3 className="mb-1.5 font-serif text-sm font-normal leading-snug tracking-tight text-foreground md:text-base">
            {entry.title}
          </h3>

          {/* Compact note */}
          <p className="mb-2 line-clamp-2 text-[10px] leading-relaxed text-muted-foreground md:text-xs">
            {entry.note}
          </p>

          {/* Single mood tag */}
          <span className={`text-[9px] italic ${colors.accent} opacity-60`}>
            {entry.mood[0]}
          </span>
        </div>

        {/* Play control at bottom */}
        <div className="shrink-0 px-5 pb-4 md:px-6 md:pb-5">
          <audio
            ref={audioRef}
            src={entry.audioFile}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            preload="metadata"
          />

          <button
            onClick={togglePlay}
            className="mx-auto flex w-full max-w-[80%] items-center justify-center gap-2"
            aria-label={isPlaying ? `Pause ${entry.title}` : `Play ${entry.title}`}
          >
            {/* Play/Pause indicator */}
            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background/80 transition-colors ${colors.accent}`}>
              {isPlaying ? (
                <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </div>

            {/* Progress arc - simplified to line for clarity */}
            <div className="relative h-px flex-1 bg-foreground/10">
              <div
                className={`absolute left-0 top-0 h-full transition-all duration-100 ${colors.accent.replace('text-', 'bg-')}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </button>
        </div>
      </div>
    </article>
  );
}

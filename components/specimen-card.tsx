"use client";

import { useState, useRef } from "react";
import type { DiaryEntry } from "@/data/diary";
import { SpecimenIllustration } from "./specimen-illustrations";

interface SpecimenCardProps {
  entry: DiaryEntry;
  specimenNumber: number;
}

// Background colors for each specimen type - deeper botanical tones
const specimenColors: Record<string, { bg: string; accent: string }> = {
  leaf: { bg: "bg-[#e2e8df]", accent: "text-[#4a5c42]" },
  petal: { bg: "bg-[#ebe5df]", accent: "text-[#7a5c4a]" },
  wind: { bg: "bg-[#dfe4e8]", accent: "text-[#4a5566]" },
  fern: { bg: "bg-[#dce5dc]", accent: "text-[#3a4d38]" },
  seed: { bg: "bg-[#e8e3dc]", accent: "text-[#5c4a38]" },
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
  const colors = specimenColors[entry.specimen] || specimenColors.leaf;

  return (
    <article className="group relative h-full">
      {/* Clean rectangular card with soft rounded corners */}
      <div 
        className={`relative flex h-full flex-col overflow-hidden rounded-lg border border-foreground/[0.08] ${colors.bg} transition-all duration-500 hover:border-foreground/[0.12] hover:shadow-sm`}
      >
        {/* Illustration area with breathing animation when playing */}
        <div className="relative flex aspect-[4/3] shrink-0 items-center justify-center overflow-hidden">
          {/* Soft breathing glow behind illustration - only when playing */}
          <div 
            className={`absolute inset-0 transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
          >
            <div 
              className={`absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full ${colors.accent.replace('text-', 'bg-')} blur-2xl`}
              style={{
                animation: isPlaying ? 'breathe 4s ease-in-out infinite' : 'none',
              }}
            />
          </div>

          {/* Wind flow lines - animate when playing */}
          <svg 
            className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
          >
            <path
              d="M-10 30 Q 30 25, 50 30 T 110 28"
              stroke="currentColor"
              strokeWidth="0.3"
              fill="none"
              className={`${colors.accent}`}
              style={{
                animation: isPlaying ? 'windFlow1 6s ease-in-out infinite' : 'none',
                opacity: 0.2,
              }}
            />
            <path
              d="M-10 50 Q 35 45, 55 50 T 110 48"
              stroke="currentColor"
              strokeWidth="0.25"
              fill="none"
              className={`${colors.accent}`}
              style={{
                animation: isPlaying ? 'windFlow2 7s ease-in-out infinite' : 'none',
                opacity: 0.15,
              }}
            />
            <path
              d="M-10 70 Q 25 68, 50 72 T 110 70"
              stroke="currentColor"
              strokeWidth="0.2"
              fill="none"
              className={`${colors.accent}`}
              style={{
                animation: isPlaying ? 'windFlow3 8s ease-in-out infinite' : 'none',
                opacity: 0.12,
              }}
            />
          </svg>

          {/* Specimen illustration */}
          <SpecimenIllustration 
            type={entry.specimen} 
            className={`relative z-10 h-10 w-10 ${colors.accent} transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
          />

          {/* Specimen number - top left */}
          <span className={`absolute left-3 top-3 font-mono text-[9px] uppercase tracking-wider ${colors.accent} opacity-50`}>
            No. {formattedNumber}
          </span>

          {/* Day badge - top right */}
          <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-background/50 text-[9px] font-medium text-muted-foreground backdrop-blur-sm">
            {day}
          </span>
        </div>

        {/* Content area */}
        <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
          {/* Title */}
          <h3 className="mb-1 font-serif text-sm font-normal leading-snug tracking-tight text-foreground">
            {entry.title}
          </h3>

          {/* Note - clamped */}
          <p className="mb-2 line-clamp-2 flex-1 text-[10px] leading-relaxed text-muted-foreground">
            {entry.note}
          </p>

          {/* Mood tag */}
          <span className={`mb-3 text-[9px] italic ${colors.accent} opacity-60`}>
            {entry.mood[0]}
          </span>

          {/* Audio control */}
          <audio
            ref={audioRef}
            src={entry.audioFile}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            preload="metadata"
          />

          <button
            onClick={togglePlay}
            className="flex w-full items-center gap-2.5"
            aria-label={isPlaying ? `Pause ${entry.title}` : `Play ${entry.title}`}
          >
            {/* Play button with breathing ring */}
            <div className="relative flex shrink-0 items-center justify-center">
              {/* Breathing ring - only when playing */}
              <div 
                className={`absolute h-8 w-8 rounded-full border ${colors.accent.replace('text-', 'border-')} transition-opacity duration-500 ${isPlaying ? 'opacity-40' : 'opacity-0'}`}
                style={{
                  animation: isPlaying ? 'breatheRing 3s ease-in-out infinite' : 'none',
                }}
              />
              <div 
                className={`flex h-6 w-6 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-all duration-300 ${colors.accent}`}
              >
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
            </div>

            {/* Progress bar */}
            <div className="relative h-px flex-1 bg-foreground/10 overflow-hidden">
              <div
                className={`absolute left-0 top-0 h-full transition-all duration-100 ${colors.accent.replace('text-', 'bg-')}`}
                style={{ width: `${progress}%` }}
              />
              {/* Subtle shimmer when playing */}
              {isPlaying && (
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  style={{
                    animation: 'shimmer 3s ease-in-out infinite',
                  }}
                />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* CSS Keyframes for animations */}
      <style jsx>{`
        @keyframes breathe {
          0%, 100% {
            opacity: 0.15;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.25;
            transform: translate(-50%, -50%) scale(1.15);
          }
        }

        @keyframes breatheRing {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.25);
            opacity: 0.15;
          }
        }

        @keyframes windFlow1 {
          0%, 100% {
            d: path("M-10 30 Q 30 25, 50 30 T 110 28");
          }
          50% {
            d: path("M-10 32 Q 35 28, 55 32 T 110 30");
          }
        }

        @keyframes windFlow2 {
          0%, 100% {
            d: path("M-10 50 Q 35 45, 55 50 T 110 48");
          }
          50% {
            d: path("M-10 48 Q 30 52, 50 48 T 110 50");
          }
        }

        @keyframes windFlow3 {
          0%, 100% {
            d: path("M-10 70 Q 25 68, 50 72 T 110 70");
          }
          50% {
            d: path("M-10 72 Q 30 70, 55 68 T 110 72");
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </article>
  );
}

"use client";

import { useState, useRef } from "react";
import type { DiaryEntry } from "@/data/diary";
import { SpecimenIllustration } from "./specimen-illustrations";

interface SpecimenCardProps {
  entry: DiaryEntry;
  specimenNumber: number;
}

// Background colors for each specimen type - muted botanical tones
// Active colors are deeper, more saturated sage/moss greens
const specimenColors: Record<string, { bg: string; accent: string; active: string }> = {
  leaf: { bg: "bg-[#e8ede6]", accent: "text-[#7a8b72]", active: "#4a6b42" },
  petal: { bg: "bg-[#f0ebe6]", accent: "text-[#a89080]", active: "#5a7a52" },
  wind: { bg: "bg-[#e6eaed]", accent: "text-[#7a8590]", active: "#4a7060" },
  fern: { bg: "bg-[#e4ebe4]", accent: "text-[#6b7b68]", active: "#3d5f38" },
  seed: { bg: "bg-[#ede9e4]", accent: "text-[#8a7a68]", active: "#5a6b48" },
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
        {/* Upper area: Illustration with breathing animation - fixed height */}
        <div className="relative flex h-24 shrink-0 items-center justify-center overflow-hidden">
          {/* Strong breathing glow behind illustration - only when playing */}
          <div 
            className={`absolute inset-0 transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* Primary breathing pulse */}
            <div 
              className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                backgroundColor: colors.active,
                opacity: isPlaying ? 0.3 : 0,
                filter: 'blur(16px)',
                animation: isPlaying ? 'breathe 3.5s ease-in-out infinite' : 'none',
              }}
            />
            {/* Secondary pulse ring */}
            <div 
              className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border"
              style={{
                borderColor: colors.active,
                opacity: isPlaying ? 0.35 : 0,
                animation: isPlaying ? 'breatheRingOuter 3.5s ease-in-out infinite' : 'none',
              }}
            />
          </div>

          {/* Wind flow lines - stronger and more defined */}
          <svg 
            className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
            viewBox="0 0 100 75" 
            preserveAspectRatio="none"
          >
            <path
              d="M-10 20 Q 30 15, 50 20 T 110 18"
              stroke={colors.active}
              strokeWidth="0.8"
              fill="none"
              style={{
                animation: isPlaying ? 'windFlow1 5s ease-in-out infinite' : 'none',
                opacity: 0.5,
              }}
            />
            <path
              d="M-10 37 Q 35 32, 55 37 T 110 35"
              stroke={colors.active}
              strokeWidth="0.6"
              fill="none"
              style={{
                animation: isPlaying ? 'windFlow2 6s ease-in-out infinite' : 'none',
                opacity: 0.4,
              }}
            />
            <path
              d="M-10 55 Q 25 53, 50 57 T 110 55"
              stroke={colors.active}
              strokeWidth="0.5"
              fill="none"
              style={{
                animation: isPlaying ? 'windFlow3 7s ease-in-out infinite' : 'none',
                opacity: 0.35,
              }}
            />
          </svg>

          {/* Specimen illustration */}
          <SpecimenIllustration 
            type={entry.specimen} 
            className={`relative z-10 h-9 w-9 transition-all duration-700 ${isPlaying ? 'scale-110' : 'scale-100'}`}
            style={{
              color: isPlaying ? colors.active : undefined,
            }}
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

        {/* Lower area: Content and playback controls */}
        <div className="flex flex-1 flex-col px-3 pb-3 pt-2">
          {/* Title */}
          <h3 className="mb-1 font-serif text-[13px] font-normal leading-snug tracking-tight text-foreground">
            {entry.title}
          </h3>

          {/* Note - clamped */}
          <p className="mb-1.5 line-clamp-2 text-[10px] leading-relaxed text-muted-foreground">
            {entry.note}
          </p>

          {/* Mood tag */}
          <span 
            className="mb-2 text-[9px] italic transition-colors duration-300"
            style={{ color: isPlaying ? colors.active : undefined }}
          >
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
            className="flex w-full items-center gap-3"
            aria-label={isPlaying ? `Pause ${entry.title}` : `Play ${entry.title}`}
          >
            {/* Play button with breathing ring */}
            <div className="relative flex shrink-0 items-center justify-center">
              {/* Outer breathing ring */}
              <div 
                className="absolute h-8 w-8 rounded-full transition-opacity duration-300"
                style={{
                  border: `1.5px solid ${colors.active}`,
                  opacity: isPlaying ? 0.5 : 0,
                  animation: isPlaying ? 'breatheRing 3s ease-in-out infinite' : 'none',
                }}
              />
              {/* Inner pulse */}
              <div 
                className="absolute h-6 w-6 rounded-full transition-opacity duration-300"
                style={{
                  backgroundColor: colors.active,
                  opacity: isPlaying ? 0.15 : 0,
                  animation: isPlaying ? 'breatheRingInner 3s ease-in-out infinite' : 'none',
                }}
              />
              {/* Play button */}
              <div 
                className="relative flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300"
                style={{
                  backgroundColor: isPlaying ? colors.active : 'rgba(255,255,255,0.8)',
                  color: isPlaying ? '#fff' : colors.active,
                  backdropFilter: 'blur(8px)',
                }}
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

            {/* Progress bar - thicker and more visible */}
            <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-foreground/10">
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-all duration-100"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: colors.active,
                }}
              />
              {/* Stronger shimmer when playing */}
              {isPlaying && (
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${colors.active}40, transparent)`,
                    animation: 'shimmer 2.5s ease-in-out infinite',
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
            opacity: 0.25;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.45;
            transform: translate(-50%, -50%) scale(1.2);
          }
        }

        @keyframes breatheRing {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.35);
            opacity: 0.2;
          }
        }

        @keyframes breatheRingInner {
          0%, 100% {
            transform: scale(1);
            opacity: 0.15;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.25;
          }
        }

        @keyframes breatheRingOuter {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 0.15;
          }
        }

        @keyframes windFlow1 {
          0%, 100% {
            d: path("M-10 20 Q 30 15, 50 20 T 110 18");
          }
          50% {
            d: path("M-10 22 Q 35 18, 55 22 T 110 20");
          }
        }

        @keyframes windFlow2 {
          0%, 100% {
            d: path("M-10 37 Q 35 32, 55 37 T 110 35");
          }
          50% {
            d: path("M-10 35 Q 30 39, 50 35 T 110 37");
          }
        }

        @keyframes windFlow3 {
          0%, 100% {
            d: path("M-10 55 Q 25 53, 50 57 T 110 55");
          }
          50% {
            d: path("M-10 57 Q 30 55, 55 53 T 110 57");
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

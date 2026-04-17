"use client";

import { useState, useRef } from "react";
import type { DiaryEntry } from "@/data/diary";
import { SpecimenIllustration } from "./specimen-illustrations";

interface SpecimenCardProps {
  entry: DiaryEntry;
  specimenNumber: number;
}

// Background colors for each specimen type - elegant green tones
const specimenColors: Record<string, { bg: string; accent: string; active: string }> = {
  leaf: { bg: "bg-[#dce8dc]", accent: "text-[#5a7a58]", active: "#3d5f3a" },
  petal: { bg: "bg-[#e2ebe0]", accent: "text-[#6a8a65]", active: "#4a6b45" },
  wind: { bg: "bg-[#d8e5db]", accent: "text-[#5b8068]", active: "#3a6050" },
  fern: { bg: "bg-[#d5e3d5]", accent: "text-[#4d7050]", active: "#2d4d30" },
  seed: { bg: "bg-[#e0e8dd]", accent: "text-[#6b8560]", active: "#4a6540" },
};

export function SpecimenCard({ entry, specimenNumber }: SpecimenCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
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
    const dur = audioRef.current.duration;
    if (dur) {
      setProgress((current / dur) * 100);
      setDuration(dur);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formattedNumber = String(specimenNumber).padStart(3, "0");
  const dateObj = new Date(entry.date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const year = dateObj.getFullYear();
  const colors = specimenColors[entry.specimen] || specimenColors.leaf;

  return (
    <article className="group relative h-full">
      <div 
        className={`relative flex h-full flex-col overflow-hidden rounded-lg border border-foreground/[0.06] ${colors.bg} transition-all duration-500 hover:border-foreground/[0.12]`}
      >
        {/* Upper area: Illustration with play button and animations (40%) */}
        <div className="relative flex basis-[40%] items-center justify-center overflow-hidden">
          {/* Wandering glow orbs when playing */}
          <div className={`absolute inset-0 transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
            <div 
              className="absolute h-10 w-10 rounded-full"
              style={{
                backgroundColor: colors.active,
                opacity: 0.25,
                filter: 'blur(12px)',
                animation: 'wanderOrb1 8s ease-in-out infinite',
              }}
            />
            <div 
              className="absolute h-7 w-7 rounded-full"
              style={{
                backgroundColor: colors.active,
                opacity: 0.2,
                filter: 'blur(10px)',
                animation: 'wanderOrb2 10s ease-in-out infinite',
              }}
            />
          </div>

          {/* Wind flow lines when playing */}
          <svg 
            className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
            viewBox="0 0 100 75" 
            preserveAspectRatio="none"
          >
            <path
              d="M-10 25 Q 30 20, 50 25 T 110 23"
              stroke={colors.active}
              strokeWidth="0.6"
              fill="none"
              style={{ animation: 'windFlow1 5s ease-in-out infinite', opacity: 0.4 }}
            />
            <path
              d="M-10 50 Q 35 45, 55 50 T 110 48"
              stroke={colors.active}
              strokeWidth="0.5"
              fill="none"
              style={{ animation: 'windFlow2 6s ease-in-out infinite', opacity: 0.3 }}
            />
          </svg>

          {/* Central play button with specimen illustration */}
          <button
            onClick={togglePlay}
            className="relative z-10 flex items-center justify-center"
            aria-label={isPlaying ? `Pause ${entry.title}` : `Play ${entry.title}`}
          >
            {/* Breathing ring when playing */}
            <div 
              className="absolute h-16 w-16 rounded-full transition-opacity duration-300"
              style={{
                border: `1.5px solid ${colors.active}`,
                opacity: isPlaying ? 0.4 : 0,
                animation: isPlaying ? 'breatheRing 3s ease-in-out infinite' : 'none',
              }}
            />
            
            {/* Specimen illustration as the play button */}
            <div className="relative flex h-12 w-12 items-center justify-center">
              <SpecimenIllustration 
                type={entry.specimen} 
                className={`h-10 w-10 transition-all duration-500 ${isPlaying ? 'scale-110 opacity-30' : 'scale-100 opacity-100'}`}
                style={{ color: isPlaying ? colors.active : undefined }}
              />
              
              {/* Play/Pause icon overlay */}
              <div 
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'}`}
                style={{ color: colors.active }}
              >
                {isPlaying ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </div>
            </div>
          </button>

          {/* Specimen number - top left corner */}
          <span className={`absolute left-3 top-3 font-mono text-[8px] uppercase tracking-widest ${colors.accent} opacity-40`}>
            {formattedNumber}
          </span>
        </div>

        {/* Lower area: Museum specimen label (60%) */}
        <div className="flex basis-[60%] flex-col border-t border-foreground/[0.06] bg-card/50 px-4 py-3">
          {/* Date line - quiet and small */}
          <div className="mb-2 flex items-baseline gap-1.5">
            <span className="font-mono text-[9px] tracking-wider text-muted-foreground/70">
              {month} {day}
            </span>
            <span className="text-[8px] text-muted-foreground/40">{year}</span>
          </div>

          {/* Divider line */}
          <div className="mb-2 h-px w-8 bg-foreground/10" />

          {/* Title - strongest element */}
          <h3 className="mb-1.5 font-serif text-[15px] font-medium leading-tight tracking-tight text-foreground">
            {entry.title}
          </h3>

          {/* Note - single line, quieter */}
          <p className="mb-3 line-clamp-1 text-[10px] leading-relaxed text-muted-foreground/80">
            {entry.note}
          </p>

          {/* Bottom row: mood tag and progress */}
          <div className="mt-auto flex items-center justify-between">
            {/* Mood tag - small label style */}
            <span 
              className="rounded-sm bg-foreground/[0.04] px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wider transition-colors duration-300"
              style={{ color: isPlaying ? colors.active : undefined }}
            >
              {entry.mood[0]}
            </span>

            {/* Duration / progress indicator */}
            <div className="flex items-center gap-2">
              {/* Mini progress bar */}
              <div className="h-0.5 w-12 overflow-hidden rounded-full bg-foreground/10">
                <div
                  className="h-full rounded-full transition-all duration-100"
                  style={{ width: `${progress}%`, backgroundColor: colors.active }}
                />
              </div>
              {/* Time */}
              <span className="font-mono text-[8px] text-muted-foreground/60">
                {duration > 0 ? formatTime(duration) : '--:--'}
              </span>
            </div>
          </div>
        </div>

        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          src={entry.audioFile}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onLoadedMetadata={() => {
            if (audioRef.current) setDuration(audioRef.current.duration);
          }}
          preload="metadata"
        />
      </div>

      {/* CSS Keyframes */}
      <style jsx>{`
        @keyframes wanderOrb1 {
          0%, 100% { top: 20%; left: 25%; transform: scale(1); }
          25% { top: 35%; left: 65%; transform: scale(1.1); }
          50% { top: 55%; left: 45%; transform: scale(0.9); }
          75% { top: 30%; left: 20%; transform: scale(1.05); }
        }
        @keyframes wanderOrb2 {
          0%, 100% { top: 60%; left: 70%; transform: scale(1); }
          33% { top: 25%; left: 30%; transform: scale(1.15); }
          66% { top: 50%; left: 55%; transform: scale(0.85); }
        }
        @keyframes breatheRing {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.25); opacity: 0.15; }
        }
        @keyframes windFlow1 {
          0%, 100% { d: path("M-10 25 Q 30 20, 50 25 T 110 23"); }
          50% { d: path("M-10 27 Q 35 22, 55 27 T 110 25"); }
        }
        @keyframes windFlow2 {
          0%, 100% { d: path("M-10 50 Q 35 45, 55 50 T 110 48"); }
          50% { d: path("M-10 48 Q 30 52, 50 48 T 110 50"); }
        }
      `}</style>
    </article>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { SpecimenIcon } from "@/components/specimen-icon";
import type { DiaryEntry } from "@/data/diary";

interface SpecimenCardProps {
  entry: DiaryEntry;
  formattedDate: string;
}

export function SpecimenCard({ entry, formattedDate }: SpecimenCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <article className="group relative flex flex-col rounded-xl border border-border/60 bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      {/* Wind lines animation - visible when playing */}
      {isPlaying && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
          <div className="wind-line wind-line-1" />
          <div className="wind-line wind-line-2" />
          <div className="wind-line wind-line-3" />
        </div>
      )}

      {/* Specimen icon */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex size-10 items-center justify-center rounded-full bg-secondary/50 text-primary/70 transition-colors group-hover:bg-secondary group-hover:text-primary">
          <SpecimenIcon type={entry.specimen} className="size-5" />
        </div>
        <time className="text-xs text-muted-foreground">{formattedDate}</time>
      </div>

      {/* Content */}
      <h3 className="mb-2 font-serif text-lg font-medium leading-snug text-card-foreground">
        {entry.title}
      </h3>
      <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {entry.note}
      </p>

      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {entry.mood.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-secondary/60 px-2 py-0.5 text-[10px] tracking-wide text-secondary-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Play button with breathing pulse */}
      <button
        onClick={togglePlay}
        className="relative flex items-center gap-3 self-start"
        aria-label={isPlaying ? `Pause ${entry.title}` : `Play ${entry.title}`}
      >
        {/* Breathing pulse rings */}
        {isPlaying && (
          <>
            <span className="absolute left-4 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-primary/20" />
            <span className="absolute left-4 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 animate-[pulse_2s_ease-in-out_infinite]" />
          </>
        )}
        
        {/* Play/Pause button */}
        <div className={`relative z-10 flex size-8 items-center justify-center rounded-full border transition-all duration-200 ${
          isPlaying 
            ? "border-primary bg-primary text-primary-foreground" 
            : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary"
        }`}>
          {isPlaying ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <rect x="2" y="2" width="3" height="8" rx="0.5" />
              <rect x="7" y="2" width="3" height="8" rx="0.5" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <path d="M3 2L10 6L3 10V2Z" />
            </svg>
          )}
        </div>

        {/* Progress indicator */}
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">
            {isPlaying ? "Playing..." : "Listen"}
          </span>
          {isPlaying && (
            <div className="h-0.5 w-16 overflow-hidden rounded-full bg-secondary">
              <div 
                className="h-full bg-primary transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </button>

      <audio ref={audioRef} src={entry.audioFile} preload="metadata" />

      <style jsx>{`
        .wind-line {
          position: absolute;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--primary), transparent);
          opacity: 0.2;
          animation: windFlow 3s ease-in-out infinite;
        }
        .wind-line-1 {
          top: 20%;
          left: -100%;
          width: 60%;
          animation-delay: 0s;
        }
        .wind-line-2 {
          top: 50%;
          left: -100%;
          width: 80%;
          animation-delay: 0.8s;
        }
        .wind-line-3 {
          top: 75%;
          left: -100%;
          width: 50%;
          animation-delay: 1.5s;
        }
        @keyframes windFlow {
          0% {
            transform: translateX(0);
            opacity: 0;
          }
          20% {
            opacity: 0.3;
          }
          80% {
            opacity: 0.3;
          }
          100% {
            transform: translateX(calc(100% + 200%));
            opacity: 0;
          }
        }
      `}</style>
    </article>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { diaryEntries } from "@/data/diary";

export function RandomAudioPlayer() {
  const [currentEntry, setCurrentEntry] = useState(() => {
    const randomIndex = Math.floor(Math.random() * diaryEntries.length);
    return diaryEntries[randomIndex];
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const loadRandom = () => {
    const randomIndex = Math.floor(Math.random() * diaryEntries.length);
    setCurrentEntry(diaryEntries[randomIndex]);
    setIsPlaying(false);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentEntry]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="rounded-lg border border-foreground/6 bg-card/30 backdrop-blur-sm p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary/50"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
            Random Improvisation
          </span>
        </div>
        <button
          onClick={loadRandom}
          className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] text-muted-foreground/50 transition-colors hover:bg-secondary/30 hover:text-muted-foreground"
          aria-label="Shuffle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="9"
            height="9"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 3h5v5" />
            <path d="M4 20 21 3" />
            <path d="M21 16v5h-5" />
            <path d="M15 15l6 6" />
            <path d="M4 4l5 5" />
          </svg>
          <span>Shuffle</span>
        </button>
      </div>

      {/* Track Info */}
      <div className="mb-3">
        <h3 className="mb-0.5 font-serif text-sm font-medium text-foreground">
          {currentEntry.title}
        </h3>
        <p className="text-[10px] text-muted-foreground/50">
          {new Date(currentEntry.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Audio Element */}
      <audio ref={audioRef} src={currentEntry.audioFile} preload="metadata" />

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="h-0.5 w-full overflow-hidden rounded-full bg-foreground/6">
          <div
            className="h-full rounded-full bg-primary/40 transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[9px] text-muted-foreground/40">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={togglePlay}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/15 bg-primary/8 text-primary/70 transition-all hover:bg-primary/15 hover:text-primary"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
          )}
        </button>

        <Link
          href="/diary"
          className="flex items-center gap-1 text-[10px] text-muted-foreground/50 transition-colors hover:text-primary"
        >
          <span>All specimens</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="8"
            height="8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

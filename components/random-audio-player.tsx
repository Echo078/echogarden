"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { getMusicSpecimens } from "@/lib/actions";
import type { MusicSpecimen } from "@/lib/database.types";
import { diaryEntries as staticEntries, type DiaryEntry } from "@/data/diary";

// Adapter to convert DB specimen to DiaryEntry format
function toDisplayEntry(specimen: MusicSpecimen): DiaryEntry {
  return {
    id: specimen.id,
    date: specimen.date,
    title: specimen.title,
    note: specimen.note || "",
    mood: specimen.mood || [],
    audioFile: specimen.audio_url,
    specimen: (specimen.specimen_type as DiaryEntry["specimen"]) || "leaf",
  };
}

export function RandomAudioPlayer() {
  const { t, lang } = useLanguage();
  const [entries, setEntries] = useState<DiaryEntry[]>(staticEntries);
  const [currentEntry, setCurrentEntry] = useState<DiaryEntry>(() => {
    const randomIndex = Math.floor(Math.random() * staticEntries.length);
    return staticEntries[randomIndex];
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load specimens from DB on mount
  useEffect(() => {
    async function loadSpecimens() {
      const result = await getMusicSpecimens();
      if (result.data && result.data.length > 0) {
        const dbEntries = result.data.map(toDisplayEntry);
        setEntries(dbEntries);
        // Update current entry to one from DB
        const randomIndex = Math.floor(Math.random() * dbEntries.length);
        setCurrentEntry(dbEntries[randomIndex]);
      }
    }
    loadSpecimens();
  }, []);

  const loadRandom = () => {
    const randomIndex = Math.floor(Math.random() * entries.length);
    setCurrentEntry(entries[randomIndex]);
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
    <div className="relative rounded-xl border border-foreground/8 bg-card/50 backdrop-blur-md p-5 shadow-sm">
      {/* Breathing glow background when playing */}
      <div 
        className={`absolute inset-0 rounded-xl transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(95, 125, 85, 0.15) 0%, transparent 70%)',
          animation: isPlaying ? 'breatheGlow 4s ease-in-out infinite' : 'none',
        }}
      />

      {/* Wandering orbs when playing */}
      <div className={`absolute inset-0 overflow-hidden rounded-xl transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
        <div 
          className="absolute h-16 w-16 rounded-full"
          style={{
            backgroundColor: 'rgba(95, 125, 85, 0.2)',
            filter: 'blur(20px)',
            animation: isPlaying ? 'wanderOrb1 8s ease-in-out infinite' : 'none',
          }}
        />
        <div 
          className="absolute h-10 w-10 rounded-full"
          style={{
            backgroundColor: 'rgba(130, 160, 120, 0.15)',
            filter: 'blur(15px)',
            animation: isPlaying ? 'wanderOrb2 10s ease-in-out infinite' : 'none',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-colors duration-300 ${isPlaying ? 'text-primary' : 'text-primary/50'}`}
              >
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
              {/* Pulse rings when playing */}
              {isPlaying && (
                <>
                  <span 
                    className="absolute inset-0 rounded-full border border-primary/30"
                    style={{ animation: 'pulseRing 2s ease-out infinite' }}
                  />
                  <span 
                    className="absolute inset-0 rounded-full border border-primary/20"
                    style={{ animation: 'pulseRing 2s ease-out infinite 0.5s' }}
                  />
                </>
              )}
            </div>
            <span className={`text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${isPlaying ? 'text-foreground/80' : 'text-muted-foreground/60'}`}>
              {t("audioPlayer.shuffleToDiscover")}
            </span>
          </div>
          <button
            onClick={loadRandom}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] text-muted-foreground/50 transition-all hover:bg-secondary/40 hover:text-muted-foreground"
            aria-label="Shuffle"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
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
            <span>{t("audioPlayer.shuffle")}</span>
          </button>
        </div>

        {/* Track Info */}
        <div className="mb-4">
          <h3 className={`mb-1 font-serif text-base font-medium transition-colors duration-300 ${isPlaying ? 'text-foreground' : 'text-foreground/90'}`}>
            {currentEntry.title}
          </h3>
          <p className="text-[11px] text-muted-foreground/50">
            {new Date(currentEntry.date).toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Audio Element */}
        <audio ref={audioRef} src={currentEntry.audioFile} preload="metadata" />

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="relative h-1 w-full overflow-hidden rounded-full bg-foreground/8">
            <div
              className={`h-full rounded-full transition-all duration-100 ${isPlaying ? 'bg-primary' : 'bg-primary/50'}`}
              style={{ width: `${progressPercent}%` }}
            />
            {/* Shimmer effect when playing */}
            {isPlaying && (
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                  animation: 'shimmer 2s infinite',
                }}
              />
            )}
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground/40">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={togglePlay}
            className="relative flex items-center justify-center"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {/* Breathing ring when playing */}
            <div 
              className="absolute h-12 w-12 rounded-full transition-opacity duration-300"
              style={{
                border: '2px solid rgba(95, 125, 85, 0.4)',
                opacity: isPlaying ? 1 : 0,
                animation: isPlaying ? 'breatheRing 3s ease-in-out infinite' : 'none',
              }}
            />
            <div 
              className="absolute h-14 w-14 rounded-full transition-opacity duration-300"
              style={{
                border: '1px solid rgba(95, 125, 85, 0.2)',
                opacity: isPlaying ? 1 : 0,
                animation: isPlaying ? 'breatheRing 3s ease-in-out infinite 0.5s' : 'none',
              }}
            />
            
            {/* Button */}
            <div 
              className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                isPlaying 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
              }`}
            >
              {isPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="ml-0.5"
                >
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              )}
            </div>
          </button>

          <Link
            href="/diary"
            className="flex items-center gap-1.5 text-xs text-muted-foreground/50 transition-colors hover:text-primary"
          >
            <span>{t("audioPlayer.viewAllSpecimens")}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
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

      {/* CSS Keyframes */}
      <style jsx>{`
        @keyframes breatheGlow {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        @keyframes breatheRing {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.15); opacity: 0.15; }
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes wanderOrb1 {
          0%, 100% { top: 20%; left: 15%; transform: scale(1); }
          25% { top: 50%; left: 70%; transform: scale(1.2); }
          50% { top: 70%; left: 40%; transform: scale(0.8); }
          75% { top: 30%; left: 25%; transform: scale(1.1); }
        }
        @keyframes wanderOrb2 {
          0%, 100% { top: 60%; left: 75%; transform: scale(1); }
          33% { top: 20%; left: 30%; transform: scale(1.3); }
          66% { top: 55%; left: 60%; transform: scale(0.7); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

"use client";

interface AudioPlayerProps {
  src: string;
  title: string;
}

export function AudioPlayer({ src, title }: AudioPlayerProps) {
  return (
    <div className="rounded-lg bg-secondary/50 p-3">
      <audio
        controls
        className="w-full h-10"
        preload="metadata"
        aria-label={`Play ${title}`}
      >
        <source src={src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

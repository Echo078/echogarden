"use client";

import { useState, useEffect } from "react";

interface TypingTextProps {
  text: string;
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export function TypingText({
  text,
  className = "",
  typingSpeed = 150,
  deletingSpeed = 80,
  pauseDuration = 3500,
}: TypingTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isPaused) {
      timeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(timeout);
    }

    if (!isDeleting) {
      // Typing
      if (displayText.length < text.length) {
        timeout = setTimeout(() => {
          setDisplayText(text.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        // Finished typing, pause before deleting
        setIsPaused(true);
      }
    } else {
      // Deleting
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(text.slice(0, displayText.length - 1));
        }, deletingSpeed);
      } else {
        // Finished deleting, start typing again
        setIsDeleting(false);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, isPaused, text, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={className}>
      {displayText}
      <span 
        className="ml-0.5 inline-block w-[2px] bg-primary/60 animate-pulse"
        style={{ height: "1em", verticalAlign: "text-bottom" }}
        aria-hidden="true"
      />
    </span>
  );
}

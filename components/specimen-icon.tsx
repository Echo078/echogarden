import type { SpecimenType } from "@/data/diary";

interface SpecimenIconProps {
  type: SpecimenType;
  className?: string;
}

export function SpecimenIcon({ type, className = "" }: SpecimenIconProps) {
  const baseClass = `${className}`;
  
  switch (type) {
    case "leaf":
      return (
        <svg viewBox="0 0 32 32" fill="none" className={baseClass} aria-hidden="true">
          <path
            d="M16 4C16 4 8 10 8 18C8 22 11 26 16 28C21 26 24 22 24 18C24 10 16 4 16 4Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 12V24"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      );
    case "seed":
      return (
        <svg viewBox="0 0 32 32" fill="none" className={baseClass} aria-hidden="true">
          <ellipse
            cx="16"
            cy="18"
            rx="6"
            ry="9"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M16 9V5"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      );
    case "petal":
      return (
        <svg viewBox="0 0 32 32" fill="none" className={baseClass} aria-hidden="true">
          <path
            d="M16 6C12 6 8 10 8 16C8 22 12 26 16 26C20 26 24 22 24 16C24 10 20 6 16 6Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="16" cy="16" r="2" stroke="currentColor" strokeWidth="1" />
        </svg>
      );
    case "shell":
      return (
        <svg viewBox="0 0 32 32" fill="none" className={baseClass} aria-hidden="true">
          <path
            d="M8 20C8 14 12 8 20 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M10 22C10 17 13 12 19 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M12 24C12 20 14 16 18 16"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      );
    case "stone":
      return (
        <svg viewBox="0 0 32 32" fill="none" className={baseClass} aria-hidden="true">
          <ellipse
            cx="16"
            cy="18"
            rx="10"
            ry="6"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M10 16C12 14 14 13 18 14"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      );
    case "branch":
      return (
        <svg viewBox="0 0 32 32" fill="none" className={baseClass} aria-hidden="true">
          <path
            d="M16 28V8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M16 12L22 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M16 18L10 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "wind":
      return (
        <svg viewBox="0 0 32 32" fill="none" className={baseClass} aria-hidden="true">
          <path
            d="M4 12H20C22 12 24 10 24 8C24 6 22 4 20 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M6 18H24"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M8 24H18C20 24 22 26 22 28"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      );
    case "bark":
      return (
        <svg viewBox="0 0 32 32" fill="none" className={baseClass} aria-hidden="true">
          <rect
            x="10"
            y="6"
            width="12"
            height="20"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M13 10V14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <path d="M19 16V22" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      );
    case "fruit":
      return (
        <svg viewBox="0 0 32 32" fill="none" className={baseClass} aria-hidden="true">
          <circle cx="16" cy="18" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M16 10V6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M16 6C18 6 20 8 20 8"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

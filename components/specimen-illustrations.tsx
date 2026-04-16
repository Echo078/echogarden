// Delicate botanical specimen illustrations
// Style: elegant, quiet, natural, muted colors, field-journal feeling

export type SpecimenType =
  | "leaf"
  | "branch"
  | "seed"
  | "petal"
  | "moss"
  | "fern"
  | "shell"
  | "stone"
  | "wind";

interface IllustrationProps {
  className?: string;
}

// Delicate single leaf with veins
export function LeafSpecimen({ className = "" }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M50 15C35 25 25 45 25 70C25 90 35 105 50 110C65 105 75 90 75 70C75 45 65 25 50 15Z"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M50 20V105"
        stroke="currentColor"
        strokeWidth="0.4"
        opacity="0.5"
      />
      <path
        d="M50 35L35 50"
        stroke="currentColor"
        strokeWidth="0.3"
        opacity="0.4"
      />
      <path
        d="M50 35L65 50"
        stroke="currentColor"
        strokeWidth="0.3"
        opacity="0.4"
      />
      <path
        d="M50 50L32 68"
        stroke="currentColor"
        strokeWidth="0.3"
        opacity="0.4"
      />
      <path
        d="M50 50L68 68"
        stroke="currentColor"
        strokeWidth="0.3"
        opacity="0.4"
      />
      <path
        d="M50 65L38 82"
        stroke="currentColor"
        strokeWidth="0.3"
        opacity="0.4"
      />
      <path
        d="M50 65L62 82"
        stroke="currentColor"
        strokeWidth="0.3"
        opacity="0.4"
      />
    </svg>
  );
}

// Minimal branch with small leaves
export function BranchSpecimen({ className = "" }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M30 105C35 85 45 65 60 45C70 32 80 22 85 18"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.6"
        fill="none"
      />
      <ellipse
        cx="42"
        cy="78"
        rx="8"
        ry="12"
        transform="rotate(-25 42 78)"
        stroke="currentColor"
        strokeWidth="0.4"
        opacity="0.5"
        fill="none"
      />
      <ellipse
        cx="55"
        cy="58"
        rx="7"
        ry="10"
        transform="rotate(-35 55 58)"
        stroke="currentColor"
        strokeWidth="0.4"
        opacity="0.5"
        fill="none"
      />
      <ellipse
        cx="70"
        cy="38"
        rx="6"
        ry="9"
        transform="rotate(-40 70 38)"
        stroke="currentColor"
        strokeWidth="0.4"
        opacity="0.5"
        fill="none"
      />
      <ellipse
        cx="82"
        cy="25"
        rx="5"
        ry="7"
        transform="rotate(-45 82 25)"
        stroke="currentColor"
        strokeWidth="0.4"
        opacity="0.4"
        fill="none"
      />
    </svg>
  );
}

// Single seed with delicate wing
export function SeedSpecimen({ className = "" }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <ellipse
        cx="50"
        cy="85"
        rx="10"
        ry="15"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.6"
        fill="none"
      />
      <path
        d="M50 70C48 55 46 40 50 20C54 40 52 55 50 70"
        stroke="currentColor"
        strokeWidth="0.4"
        opacity="0.5"
        fill="none"
      />
      <path
        d="M50 65C42 50 35 35 38 18"
        stroke="currentColor"
        strokeWidth="0.3"
        opacity="0.4"
        fill="none"
      />
      <path
        d="M50 65C58 50 65 35 62 18"
        stroke="currentColor"
        strokeWidth="0.3"
        opacity="0.4"
        fill="none"
      />
      <circle
        cx="50"
        cy="85"
        r="3"
        stroke="currentColor"
        strokeWidth="0.3"
        opacity="0.4"
        fill="none"
      />
    </svg>
  );
}

// Soft petal shape
export function PetalSpecimen({ className = "" }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M50 100C50 100 30 75 30 50C30 30 40 15 50 15C60 15 70 30 70 50C70 75 50 100 50 100Z"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.6"
        fill="none"
      />
      <path
        d="M50 20V95"
        stroke="currentColor"
        strokeWidth="0.3"
        opacity="0.35"
      />
      <path
        d="M50 30C45 35 38 42 35 50"
        stroke="currentColor"
        strokeWidth="0.25"
        opacity="0.3"
        fill="none"
      />
      <path
        d="M50 30C55 35 62 42 65 50"
        stroke="currentColor"
        strokeWidth="0.25"
        opacity="0.3"
        fill="none"
      />
      <path
        d="M50 50C42 60 36 72 35 82"
        stroke="currentColor"
        strokeWidth="0.25"
        opacity="0.3"
        fill="none"
      />
      <path
        d="M50 50C58 60 64 72 65 82"
        stroke="currentColor"
        strokeWidth="0.25"
        opacity="0.3"
        fill="none"
      />
    </svg>
  );
}

// Moss cluster - small organic forms
export function MossSpecimen({ className = "" }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g opacity="0.6">
        <path
          d="M50 95C50 95 50 85 50 80C50 75 48 70 50 65"
          stroke="currentColor"
          strokeWidth="0.4"
        />
        <circle cx="50" cy="60" r="6" stroke="currentColor" strokeWidth="0.4" fill="none" />
      </g>
      <g opacity="0.5">
        <path
          d="M38 98C38 98 38 88 40 82C42 76 38 72 40 68"
          stroke="currentColor"
          strokeWidth="0.4"
        />
        <circle cx="40" cy="63" r="5" stroke="currentColor" strokeWidth="0.4" fill="none" />
      </g>
      <g opacity="0.5">
        <path
          d="M62 98C62 98 62 90 60 84C58 78 62 74 60 70"
          stroke="currentColor"
          strokeWidth="0.4"
        />
        <circle cx="60" cy="65" r="5" stroke="currentColor" strokeWidth="0.4" fill="none" />
      </g>
      <g opacity="0.4">
        <path
          d="M28 100C28 100 30 92 32 88"
          stroke="currentColor"
          strokeWidth="0.35"
        />
        <circle cx="32" cy="84" r="4" stroke="currentColor" strokeWidth="0.35" fill="none" />
      </g>
      <g opacity="0.4">
        <path
          d="M72 100C72 100 70 92 68 88"
          stroke="currentColor"
          strokeWidth="0.35"
        />
        <circle cx="68" cy="84" r="4" stroke="currentColor" strokeWidth="0.35" fill="none" />
      </g>
    </svg>
  );
}

// Fern frond - elegant curved form
export function FernSpecimen({ className = "" }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M50 105C48 90 46 70 48 50C50 30 55 18 58 12"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.6"
        fill="none"
      />
      {/* Left leaflets */}
      <path d="M47 95C42 92 38 88 35 85" stroke="currentColor" strokeWidth="0.3" opacity="0.45" />
      <path d="M47 85C40 82 34 78 30 74" stroke="currentColor" strokeWidth="0.3" opacity="0.45" />
      <path d="M47 75C38 72 32 67 27 62" stroke="currentColor" strokeWidth="0.3" opacity="0.45" />
      <path d="M48 65C40 62 34 56 30 50" stroke="currentColor" strokeWidth="0.3" opacity="0.4" />
      <path d="M49 55C42 52 38 46 35 40" stroke="currentColor" strokeWidth="0.3" opacity="0.4" />
      <path d="M51 45C46 42 42 37 40 32" stroke="currentColor" strokeWidth="0.3" opacity="0.35" />
      <path d="M54 35C50 32 48 28 46 24" stroke="currentColor" strokeWidth="0.25" opacity="0.35" />
      {/* Right leaflets */}
      <path d="M49 90C55 88 62 86 68 85" stroke="currentColor" strokeWidth="0.3" opacity="0.45" />
      <path d="M48 80C56 78 64 76 72 75" stroke="currentColor" strokeWidth="0.3" opacity="0.45" />
      <path d="M48 70C58 68 68 65 76 63" stroke="currentColor" strokeWidth="0.3" opacity="0.45" />
      <path d="M49 60C58 58 68 54 76 50" stroke="currentColor" strokeWidth="0.3" opacity="0.4" />
      <path d="M51 50C58 48 66 44 72 40" stroke="currentColor" strokeWidth="0.3" opacity="0.4" />
      <path d="M53 40C58 38 64 34 68 30" stroke="currentColor" strokeWidth="0.3" opacity="0.35" />
      <path d="M56 30C60 28 64 24 66 22" stroke="currentColor" strokeWidth="0.25" opacity="0.35" />
    </svg>
  );
}

// Shell spiral - nautilus-like
export function ShellSpecimen({ className = "" }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M65 60C65 75 55 88 42 88C29 88 20 75 20 60C20 45 32 35 45 35C58 35 68 48 68 65C68 82 55 95 40 95C25 95 12 80 12 60C12 40 28 25 50 25C72 25 85 42 85 65"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.6"
        fill="none"
      />
      <circle
        cx="52"
        cy="58"
        r="8"
        stroke="currentColor"
        strokeWidth="0.4"
        opacity="0.5"
        fill="none"
      />
      <circle
        cx="52"
        cy="58"
        r="3"
        stroke="currentColor"
        strokeWidth="0.3"
        opacity="0.4"
        fill="none"
      />
    </svg>
  );
}

// Smooth stone - organic pebble shape
export function StoneSpecimen({ className = "" }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <ellipse
        cx="50"
        cy="65"
        rx="30"
        ry="22"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.6"
        fill="none"
      />
      <ellipse
        cx="48"
        cy="62"
        rx="20"
        ry="14"
        stroke="currentColor"
        strokeWidth="0.35"
        opacity="0.4"
        fill="none"
      />
      <ellipse
        cx="45"
        cy="60"
        rx="10"
        ry="7"
        stroke="currentColor"
        strokeWidth="0.25"
        opacity="0.3"
        fill="none"
      />
      <path
        d="M25 72C28 78 35 82 45 82"
        stroke="currentColor"
        strokeWidth="0.3"
        opacity="0.35"
        fill="none"
      />
    </svg>
  );
}

// Wind trace - abstract flowing lines
export function WindSpecimen({ className = "" }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M15 45C30 42 50 38 70 45C85 50 90 55 88 60"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.5"
        fill="none"
      />
      <path
        d="M10 60C25 58 45 55 65 60C80 64 90 70 85 75"
        stroke="currentColor"
        strokeWidth="0.45"
        opacity="0.45"
        fill="none"
      />
      <path
        d="M20 75C35 72 55 70 72 76C82 80 88 86 82 90"
        stroke="currentColor"
        strokeWidth="0.4"
        opacity="0.4"
        fill="none"
      />
      <circle cx="88" cy="60" r="2" stroke="currentColor" strokeWidth="0.3" opacity="0.4" fill="none" />
      <circle cx="85" cy="75" r="2" stroke="currentColor" strokeWidth="0.3" opacity="0.35" fill="none" />
      <circle cx="82" cy="90" r="2" stroke="currentColor" strokeWidth="0.3" opacity="0.3" fill="none" />
    </svg>
  );
}

// Map specimen type to component
export function SpecimenIllustration({
  type,
  className = "",
}: {
  type: SpecimenType;
  className?: string;
}) {
  const illustrations = {
    leaf: LeafSpecimen,
    branch: BranchSpecimen,
    seed: SeedSpecimen,
    petal: PetalSpecimen,
    moss: MossSpecimen,
    fern: FernSpecimen,
    shell: ShellSpecimen,
    stone: StoneSpecimen,
    wind: WindSpecimen,
  };

  const Component = illustrations[type];
  return <Component className={className} />;
}

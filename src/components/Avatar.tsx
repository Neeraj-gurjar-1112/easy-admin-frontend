import { initialsOf } from "@/utils/formatters";

interface AvatarProps {
  name: string;
  /** `lg` for page headers (details). */
  size?: "md" | "lg";
}

const TONE_COUNT = 6;

/** Stable tone per name so the same agent always gets the same colour. */
function toneOf(name: string): number {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) % 9973;
  return (hash % TONE_COUNT) + 1;
}

// Initials circle used in list rows and detail headers.
export default function Avatar({ name, size = "md" }: AvatarProps) {
  const className = `avatar avatar-tone-${toneOf(name)}${size === "lg" ? " avatar-lg" : ""}`;
  return (
    <span className={className} aria-hidden="true">
      {initialsOf(name)}
    </span>
  );
}

import type { PillarKey } from "@/types/lead";

interface Props {
  pillarKey: PillarKey;
  className?: string;
}

const COMMON = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function PillarIcon({ pillarKey, className }: Props) {
  switch (pillarKey) {
    case "positioning":
      return (
        <svg {...COMMON} className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4.5" />
          <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "communication":
      return (
        <svg {...COMMON} className={className} aria-hidden="true">
          <path d="M4 5.5h16v11H9.5L5 20.5v-4H4z" />
          <path d="M7.5 9.5h9M7.5 13h6" />
        </svg>
      );
    case "digitalPresence":
      return (
        <svg {...COMMON} className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M3.5 12h17M12 3.5c2.6 2.2 4 5.2 4 8.5s-1.4 6.3-4 8.5c-2.6-2.2-4-5.2-4-8.5s1.4-6.3 4-8.5Z" />
        </svg>
      );
    case "content":
      return (
        <svg {...COMMON} className={className} aria-hidden="true">
          <rect x="6" y="3.5" width="14" height="14" rx="1.5" />
          <path d="M6 13.5 9.5 10l3 3 2-2 2.5 2.5" />
          <circle cx="13.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
          <path d="M4 7.5v11a1.5 1.5 0 0 0 1.5 1.5H16" />
        </svg>
      );
    case "conversion":
      return (
        <svg {...COMMON} className={className} aria-hidden="true">
          <path d="M4 4.5h16l-6 8v6.5l-4 1.5V12.5Z" />
        </svg>
      );
    case "strategy":
      return (
        <svg {...COMMON} className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" />
          <path d="m15 9-4.2 2-1.8 4.2 4.2-2Z" />
        </svg>
      );
    default:
      return null;
  }
}

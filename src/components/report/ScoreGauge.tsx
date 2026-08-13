import type { Classification } from "@/types/lead";

const CLASSIFICATION_COLOR: Record<Classification, string> = {
  "CRÍTICO": "var(--critico)",
  "PRECISA MELHORAR": "var(--melhorar)",
  "BOA BASE": "var(--boa-base)",
  ESTRUTURADO: "var(--estruturado)",
};

interface ScoreGaugeProps {
  score: number;
  classification: Classification;
}

export function ScoreGauge({ score, classification }: ScoreGaugeProps) {
  const color = CLASSIFICATION_COLOR[classification];
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="relative flex h-44 w-44 shrink-0 items-center justify-center">
      <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth="12"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold text-ink">{score}</span>
        <span className="text-xs text-ink-soft">de 100</span>
      </div>
    </div>
  );
}

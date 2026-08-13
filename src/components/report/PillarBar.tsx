import type { PillarKey } from "@/types/lead";

function scoreColor(score: number): string {
  if (score < 40) return "var(--critico)";
  if (score < 60) return "var(--melhorar)";
  if (score < 80) return "var(--boa-base)";
  return "var(--estruturado)";
}

interface PillarBarProps {
  pillarKey: PillarKey;
  label: string;
  score: number;
  description: string;
}

export function PillarBar({ label, score, description }: PillarBarProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-ink">{label}</h3>
        <span className="text-sm font-bold" style={{ color: scoreColor(score) }}>
          {score}/100
        </span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${score}%`, backgroundColor: scoreColor(score) }}
        />
      </div>
      <p className="mt-3 text-sm text-ink-soft">{description}</p>
    </div>
  );
}

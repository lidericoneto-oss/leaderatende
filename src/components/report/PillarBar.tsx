import { PILLAR_TIPS } from "@/lib/scoring";
import type { PillarKey } from "@/types/lead";
import { PillarIcon } from "./PillarIcon";

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

export function PillarBar({ pillarKey, label, score, description }: PillarBarProps) {
  const color = scoreColor(score);
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: `${color}1a`, color }}
          >
            <PillarIcon pillarKey={pillarKey} className="h-4.5 w-4.5" />
          </span>
          <h3 className="text-sm font-semibold text-ink">{label}</h3>
        </div>
        <span className="text-sm font-bold" style={{ color }}>
          {score}/100
        </span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <p className="mt-3 text-sm text-ink-soft">{description}</p>
      <div className="mt-3 flex items-start gap-2 rounded-lg bg-background p-2.5">
        <span className="text-xs font-semibold text-brand">Dica</span>
        <span className="text-xs text-ink-soft">{PILLAR_TIPS[pillarKey]}</span>
      </div>
    </div>
  );
}

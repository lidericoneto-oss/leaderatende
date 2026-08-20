import type { Pillar } from "@/types/lead";

interface Props {
  pillars: Pillar[];
}

const SIZE = 320;
const CENTER = SIZE / 2;
const MAX_RADIUS = 76;
const RINGS = [0.25, 0.5, 0.75, 1];

// Rótulos curtos pro gráfico (o card de cada pilar já mostra o nome completo).
const SHORT_LABELS: Record<string, string> = {
  "Presença Digital": "Presença",
};

function pointAt(index: number, total: number, radius: number): [number, number] {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return [CENTER + radius * Math.cos(angle), CENTER + radius * Math.sin(angle)];
}

export function PillarRadarChart({ pillars }: Props) {
  const total = pillars.length;

  const ringPolygons = RINGS.map((ratio) =>
    pillars
      .map((_, i) => pointAt(i, total, MAX_RADIUS * ratio).join(","))
      .join(" ")
  );

  const scorePolygon = pillars
    .map((pillar, i) => pointAt(i, total, MAX_RADIUS * (pillar.score / 100)).join(","))
    .join(" ");

  return (
    <div className="flex justify-center">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="h-auto w-full max-w-xs overflow-visible"
        aria-hidden="true"
      >
        {ringPolygons.map((points, i) => (
          <polygon
            key={i}
            points={points}
            fill="none"
            stroke="var(--border)"
            strokeWidth="1"
          />
        ))}

        {pillars.map((_, i) => {
          const [x, y] = pointAt(i, total, MAX_RADIUS);
          return (
            <line
              key={i}
              x1={CENTER}
              y1={CENTER}
              x2={x}
              y2={y}
              stroke="var(--border)"
              strokeWidth="1"
            />
          );
        })}

        <polygon
          points={scorePolygon}
          fill="var(--brand)"
          fillOpacity="0.22"
          stroke="var(--brand)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {pillars.map((pillar, i) => {
          const [x, y] = pointAt(i, total, MAX_RADIUS * (pillar.score / 100));
          return (
            <circle
              key={pillar.key}
              cx={x}
              cy={y}
              r="3"
              fill="var(--brand)"
              stroke="var(--surface)"
              strokeWidth="1.5"
            />
          );
        })}

        {pillars.map((pillar, i) => {
          const [x, y] = pointAt(i, total, MAX_RADIUS + 24);
          const anchor = x < CENTER - 8 ? "end" : x > CENTER + 8 ? "start" : "middle";
          return (
            <text
              key={pillar.key}
              x={x}
              y={y}
              textAnchor={anchor}
              dominantBaseline="middle"
              className="fill-ink-soft"
              style={{ fontSize: "10px", fontWeight: 600 }}
            >
              {SHORT_LABELS[pillar.label] ?? pillar.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

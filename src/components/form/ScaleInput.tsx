interface ScaleInputProps {
  question: string;
  value: number;
  onChange: (value: number) => void;
}

const SCALE_LABELS: Record<number, string> = {
  1: "Discordo totalmente",
  5: "Concordo totalmente",
};

export function ScaleInput({ question, value, onChange }: ScaleInputProps) {
  return (
    <fieldset className="rounded-xl border border-border bg-surface p-4">
      <legend className="text-sm font-medium text-ink">{question}</legend>
      <div className="mt-3 flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`flex h-10 flex-1 items-center justify-center rounded-lg border text-sm font-semibold transition ${
              value === n
                ? "border-brand bg-brand text-white"
                : "border-border bg-background text-ink-soft hover:border-brand/40"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-xs text-ink-soft">
        <span>{SCALE_LABELS[1]}</span>
        <span>{SCALE_LABELS[5]}</span>
      </div>
    </fieldset>
  );
}

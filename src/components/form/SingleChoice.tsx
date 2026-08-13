interface SingleChoiceProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  columns?: 1 | 2;
}

export function SingleChoice({
  label,
  options,
  value,
  onChange,
  required,
  columns = 2,
}: SingleChoiceProps) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-ink">
        {label}
        {required && <span className="text-critico"> *</span>}
      </legend>
      <div
        className={`mt-2.5 grid gap-2 ${
          columns === 2 ? "sm:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {options.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`rounded-lg border px-4 py-2.5 text-left text-sm transition ${
                selected
                  ? "border-brand bg-brand-light text-brand font-medium"
                  : "border-border bg-surface text-ink-soft hover:border-brand/40 hover:text-ink"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

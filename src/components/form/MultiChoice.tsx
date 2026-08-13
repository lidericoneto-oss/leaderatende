interface MultiChoiceProps {
  label: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  max?: number;
  columns?: 1 | 2;
}

export function MultiChoice({
  label,
  options,
  value,
  onChange,
  max,
  columns = 2,
}: MultiChoiceProps) {
  function toggle(option: string) {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
      return;
    }
    if (max && value.length >= max) return;
    onChange([...value, option]);
  }

  return (
    <fieldset>
      <legend className="text-sm font-medium text-ink">
        {label}
        {max && (
          <span className="ml-1.5 text-xs font-normal text-ink-soft">
            (selecione até {max} — {value.length}/{max})
          </span>
        )}
      </legend>
      <div
        className={`mt-2.5 grid gap-2 ${
          columns === 2 ? "sm:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {options.map((option) => {
          const selected = value.includes(option);
          const disabled = !selected && !!max && value.length >= max;
          return (
            <button
              key={option}
              type="button"
              disabled={disabled}
              onClick={() => toggle(option)}
              className={`flex items-center gap-2.5 rounded-lg border px-4 py-2.5 text-left text-sm transition ${
                selected
                  ? "border-brand bg-brand-light text-brand font-medium"
                  : disabled
                    ? "border-border bg-surface text-ink-soft/40"
                    : "border-border bg-surface text-ink-soft hover:border-brand/40 hover:text-ink"
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                  selected ? "border-brand bg-brand" : "border-border"
                }`}
              >
                {selected && (
                  <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 fill-white">
                    <path d="M4.5 8.5 1.5 5.5l1-1 2 2 4-4 1 1z" />
                  </svg>
                )}
              </span>
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

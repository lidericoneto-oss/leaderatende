interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  helper?: string;
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  helper,
}: TextInputProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">
        {label}
        {required && <span className="text-critico"> *</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
      />
      {helper && <span className="mt-1 block text-xs text-ink-soft">{helper}</span>}
    </label>
  );
}

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helper?: string;
}

export function TextAreaInput({
  label,
  value,
  onChange,
  placeholder,
  helper,
}: TextAreaProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="mt-1.5 w-full resize-none rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15"
      />
      {helper && <span className="mt-1 block text-xs text-ink-soft">{helper}</span>}
    </label>
  );
}

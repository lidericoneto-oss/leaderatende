interface LogoProps {
  inverted?: boolean;
  className?: string;
}

export function Logo({ inverted = false, className = "" }: LogoProps) {
  return (
    <span
      className={`font-display text-lg uppercase tracking-wide ${
        inverted ? "text-white" : "text-ink"
      } ${className}`}
    >
      Leader<span className="text-brand">Atende</span>
    </span>
  );
}

import Image from "next/image";

interface LogoProps {
  inverted?: boolean;
  className?: string;
}

export function Logo({ inverted = false, className = "" }: LogoProps) {
  return (
    <Image
      src="/logo-leader.png"
      alt="LEADER consultoria & marketing"
      width={900}
      height={362}
      priority
      className={`h-8 w-auto ${inverted ? "invert" : ""} ${className}`}
    />
  );
}

"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Analisando suas respostas...",
  "Identificando oportunidades...",
  "Avaliando seu posicionamento...",
  "Preparando seu diagnóstico...",
];

interface ProcessingScreenProps {
  onComplete: () => void;
  stepDurationMs?: number;
}

export function ProcessingScreen({
  onComplete,
  stepDurationMs = 650,
}: ProcessingScreenProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= MESSAGES.length - 1) {
      const finalTimer = setTimeout(onComplete, stepDurationMs);
      return () => clearTimeout(finalTimer);
    }
    const timer = setTimeout(() => setIndex((i) => i + 1), stepDurationMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute h-full w-full animate-ping rounded-full bg-brand/20" />
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white">
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current">
            <path
              d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </div>
      <p className="mt-6 text-base font-medium text-ink transition-opacity duration-300 sm:text-lg">
        {MESSAGES[index]}
      </p>
      <div className="mt-6 flex gap-1.5">
        {MESSAGES.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-6 rounded-full transition-colors ${
              i <= index ? "bg-brand" : "bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

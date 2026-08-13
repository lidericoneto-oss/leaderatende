interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
}

export function ProgressBar({
  currentStep,
  totalSteps,
  stepTitle,
}: ProgressBarProps) {
  const percent = (currentStep / totalSteps) * 100;
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-medium text-ink-soft">
        <span>
          Etapa {currentStep} de {totalSteps}
        </span>
        <span>{Math.round(percent)}%</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-brand transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <h2 className="font-display mt-4 text-2xl tracking-tight text-ink uppercase sm:text-3xl">
        {stepTitle}
      </h2>
    </div>
  );
}

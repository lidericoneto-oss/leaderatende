import { MultiChoice } from "@/components/form/MultiChoice";
import { CHALLENGE_OPTIONS, MAX_CHALLENGES } from "@/lib/quiz-data";
import type { QuizData } from "@/types/lead";

interface Props {
  data: QuizData;
  update: (patch: Partial<QuizData>) => void;
}

export function Step4Challenges({ data, update }: Props) {
  return (
    <div className="space-y-6">
      <MultiChoice
        label="Qual dessas situações mais representa sua empresa hoje?"
        options={CHALLENGE_OPTIONS}
        max={MAX_CHALLENGES}
        value={data.challenges}
        onChange={(v) => update({ challenges: v })}
      />
    </div>
  );
}

import { ScaleInput } from "@/components/form/ScaleInput";
import { SELF_ASSESSMENT_QUESTIONS } from "@/lib/quiz-data";
import type { QuizData } from "@/types/lead";

interface Props {
  data: QuizData;
  update: (patch: Partial<QuizData>) => void;
}

export function Step5SelfAssessment({ data, update }: Props) {
  return (
    <div className="space-y-4">
      {SELF_ASSESSMENT_QUESTIONS.map((q) => (
        <ScaleInput
          key={q.key}
          question={q.question}
          value={data[q.key]}
          onChange={(v) => update({ [q.key]: v })}
        />
      ))}
    </div>
  );
}

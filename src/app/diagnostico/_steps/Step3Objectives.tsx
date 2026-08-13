import { MultiChoice } from "@/components/form/MultiChoice";
import { TextAreaInput } from "@/components/form/TextInput";
import { MAX_OBJECTIVES, OBJECTIVE_OPTIONS } from "@/lib/quiz-data";
import type { QuizData } from "@/types/lead";

interface Props {
  data: QuizData;
  update: (patch: Partial<QuizData>) => void;
}

export function Step3Objectives({ data, update }: Props) {
  return (
    <div className="space-y-6">
      <MultiChoice
        label="Qual é o principal objetivo da sua empresa hoje?"
        options={OBJECTIVE_OPTIONS}
        max={MAX_OBJECTIVES}
        value={data.objectives}
        onChange={(v) => update({ objectives: v })}
      />

      <TextAreaInput
        label="O que faria você considerar o marketing da sua empresa um sucesso nos próximos meses?"
        value={data.successDefinition}
        onChange={(v) => update({ successDefinition: v })}
        placeholder="Descreva com suas palavras..."
      />
    </div>
  );
}

import { MultiChoice } from "@/components/form/MultiChoice";
import { SingleChoice } from "@/components/form/SingleChoice";
import {
  ADS_INVESTMENT_OPTIONS,
  CHANNELS,
  MARKETING_RESPONSIBLE_OPTIONS,
  POST_FREQUENCY_OPTIONS,
} from "@/lib/quiz-data";
import type { Channel, QuizData } from "@/types/lead";

interface Props {
  data: QuizData;
  update: (patch: Partial<QuizData>) => void;
}

export function Step2Digital({ data, update }: Props) {
  return (
    <div className="space-y-6">
      <MultiChoice
        label="Quais canais a sua empresa utiliza?"
        options={CHANNELS}
        value={data.channels}
        onChange={(v) => update({ channels: v as Channel[] })}
      />

      <SingleChoice
        label="Quem atualmente cuida do marketing da empresa?"
        required
        options={MARKETING_RESPONSIBLE_OPTIONS}
        value={data.marketingResponsible}
        onChange={(v) =>
          update({ marketingResponsible: v as QuizData["marketingResponsible"] })
        }
      />

      <SingleChoice
        label="Com que frequência sua empresa publica conteúdo?"
        required
        options={POST_FREQUENCY_OPTIONS}
        value={data.postFrequency}
        onChange={(v) => update({ postFrequency: v as QuizData["postFrequency"] })}
      />

      <SingleChoice
        label="Você investe atualmente em anúncios?"
        required
        options={ADS_INVESTMENT_OPTIONS}
        value={data.adsInvestment}
        onChange={(v) => update({ adsInvestment: v as QuizData["adsInvestment"] })}
      />
    </div>
  );
}

import { TextInput } from "@/components/form/TextInput";
import { SingleChoice } from "@/components/form/SingleChoice";
import { COMPANY_STAGES, EMPLOYEE_COUNT_OPTIONS } from "@/lib/quiz-data";
import type { QuizData } from "@/types/lead";

interface Props {
  data: QuizData;
  update: (patch: Partial<QuizData>) => void;
  showErrors: boolean;
}

export function Step1Company({ data, update, showErrors }: Props) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextInput
          label="Nome da empresa"
          required
          value={data.companyName}
          onChange={(v) => update({ companyName: v })}
          placeholder="Ex: Studio Alma"
        />
        <TextInput
          label="Nome do responsável"
          required
          value={data.responsibleName}
          onChange={(v) => update({ responsibleName: v })}
          placeholder="Seu nome"
        />
        <TextInput
          label="Segmento de atuação"
          required
          value={data.segment}
          onChange={(v) => update({ segment: v })}
          placeholder="Ex: Estética, advocacia, varejo..."
        />
        <TextInput
          label="Cidade/região"
          required
          value={data.city}
          onChange={(v) => update({ city: v })}
          placeholder="Ex: Belo Horizonte, MG"
        />
        <TextInput
          label="Site"
          value={data.website}
          onChange={(v) => update({ website: v })}
          placeholder="www.suaempresa.com.br (se possuir)"
        />
        <TextInput
          label="Instagram"
          value={data.instagram}
          onChange={(v) => update({ instagram: v })}
          placeholder="@suaempresa"
        />
        <TextInput
          label="Facebook"
          value={data.facebook}
          onChange={(v) => update({ facebook: v })}
          placeholder="facebook.com/suaempresa (se possuir)"
        />
        <TextInput
          label="WhatsApp comercial"
          required
          value={data.whatsappBusiness}
          onChange={(v) => update({ whatsappBusiness: v })}
          placeholder="(00) 00000-0000"
        />
      </div>

      <SingleChoice
        label="Quantidade aproximada de funcionários"
        required
        options={EMPLOYEE_COUNT_OPTIONS}
        value={data.employeeCount}
        onChange={(v) => update({ employeeCount: v })}
      />

      <SingleChoice
        label="Como você definiria sua empresa hoje?"
        required
        options={COMPANY_STAGES}
        value={data.companyStage}
        onChange={(v) => update({ companyStage: v as QuizData["companyStage"] })}
      />

      <label className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4 text-sm text-ink-soft">
        <input
          type="checkbox"
          checked={data.consent}
          onChange={(e) => update({ consent: e.target.checked })}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-brand"
        />
        <span>
          Concordo em receber o diagnóstico e informações relacionadas à análise
          realizada, conforme a{" "}
          <a href="/privacidade" className="text-brand underline">
            política de privacidade
          </a>
          .
        </span>
      </label>
      {showErrors && !data.consent && (
        <p className="text-xs text-critico">
          É necessário concordar para receber o diagnóstico.
        </p>
      )}
    </div>
  );
}

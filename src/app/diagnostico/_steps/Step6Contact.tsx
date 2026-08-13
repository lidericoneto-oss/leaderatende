import { TextInput } from "@/components/form/TextInput";
import { isValidEmail, isValidPhone } from "@/lib/validation";
import type { QuizData } from "@/types/lead";

interface Props {
  data: QuizData;
  update: (patch: Partial<QuizData>) => void;
  showErrors: boolean;
}

export function Step6Contact({ data, update, showErrors }: Props) {
  const emailError =
    showErrors && data.contactEmail && !isValidEmail(data.contactEmail);
  const phoneError =
    showErrors && data.contactPhone && !isValidPhone(data.contactPhone);

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-soft">
        Últimos detalhes: é para cá que enviaremos o seu diagnóstico.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextInput
          label="Nome"
          required
          value={data.contactName}
          onChange={(v) => update({ contactName: v })}
          placeholder="Seu nome completo"
        />
        <label className="block">
          <span className="text-sm font-medium text-ink">Empresa</span>
          <div className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-ink-soft">
            {data.companyName || "—"}
          </div>
        </label>
        <div>
          <TextInput
            label="WhatsApp"
            required
            type="tel"
            value={data.contactPhone}
            onChange={(v) => update({ contactPhone: v })}
            placeholder="(00) 00000-0000"
          />
          {phoneError && (
            <p className="mt-1 text-xs text-critico">
              Informe um número de WhatsApp válido.
            </p>
          )}
        </div>
        <div>
          <TextInput
            label="E-mail"
            required
            type="email"
            value={data.contactEmail}
            onChange={(v) => update({ contactEmail: v })}
            placeholder="voce@empresa.com"
          />
          {emailError && (
            <p className="mt-1 text-xs text-critico">Informe um e-mail válido.</p>
          )}
        </div>
      </div>

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

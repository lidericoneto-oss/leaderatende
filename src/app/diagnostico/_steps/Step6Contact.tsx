import { TextInput } from "@/components/form/TextInput";
import { isValidEmail } from "@/lib/validation";
import type { QuizData } from "@/types/lead";

interface Props {
  data: QuizData;
  update: (patch: Partial<QuizData>) => void;
  showErrors: boolean;
}

export function Step6Contact({ data, update, showErrors }: Props) {
  const emailError =
    showErrors && data.contactEmail && !isValidEmail(data.contactEmail);

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-soft">
        Vamos enviar seu diagnóstico para{" "}
        <strong className="text-ink">{data.responsibleName || "você"}</strong>{" "}
        no WhatsApp{" "}
        <strong className="text-ink">{data.whatsappBusiness || "informado"}</strong>.
        Falta só o seu e-mail.
      </p>

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

      <div className="rounded-xl border border-brand/30 bg-brand-light p-5">
        <p className="text-sm font-semibold text-ink">
          Seu relatório personalizado está quase pronto.
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          Depois de ver o resultado, você também vai poder enviar um print do
          seu feed do Instagram para receber uma análise visual extra do seu
          perfil.
        </p>
      </div>
    </div>
  );
}

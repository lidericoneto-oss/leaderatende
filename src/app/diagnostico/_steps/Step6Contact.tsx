import type { QuizData } from "@/types/lead";

interface Props {
  data: QuizData;
}

export function Step6Contact({ data }: Props) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-soft">
        Vamos enviar seu diagnóstico para{" "}
        <strong className="text-ink">{data.responsibleName || "você"}</strong>{" "}
        no WhatsApp{" "}
        <strong className="text-ink">{data.whatsappBusiness || "informado"}</strong>{" "}
        e no e-mail{" "}
        <strong className="text-ink">{data.contactEmail || "informado"}</strong>.
      </p>

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

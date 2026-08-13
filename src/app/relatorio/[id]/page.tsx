import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildWhatsAppLink } from "@/lib/config";
import { ScoreGauge } from "@/components/report/ScoreGauge";
import { PillarBar } from "@/components/report/PillarBar";
import { Logo } from "@/components/Logo";
import { describePillar } from "@/lib/scoring";
import type { Classification, Pillar, Priority } from "@/types/lead";

const CLASSIFICATION_BADGE: Record<Classification, string> = {
  "CRÍTICO": "bg-red-50 text-critico border-red-200",
  "PRECISA MELHORAR": "bg-amber-50 text-melhorar border-amber-200",
  "BOA BASE": "bg-blue-50 text-boa-base border-blue-200",
  ESTRUTURADO: "bg-emerald-50 text-estruturado border-emerald-200",
};

const VISION_SEQUENCE = [
  {
    label: "PRIMEIRO",
    text: "Corrigir posicionamento e comunicação.",
  },
  {
    label: "DEPOIS",
    text: "Estruturar conteúdo e presença digital.",
  },
  {
    label: "EM SEGUIDA",
    text: "Criar mecanismos de conversão.",
  },
  {
    label: "POR ÚLTIMO",
    text: "Escalar o que estiver funcionando com mídia paga e outras ações.",
  },
];

export default async function RelatorioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id } });

  if (!lead) notFound();

  const rawPillars: [Pillar["key"], string, number][] = [
    ["positioning", "Posicionamento", lead.scorePositioning],
    ["communication", "Comunicação", lead.scoreCommunication],
    ["digitalPresence", "Presença Digital", lead.scoreDigitalPresence],
    ["content", "Conteúdo", lead.scoreContent],
    ["conversion", "Conversão", lead.scoreConversion],
    ["strategy", "Estratégia", lead.scoreStrategy],
  ];

  const pillars: Pillar[] = rawPillars.map(([key, label, score]) => ({
    key,
    label,
    score,
    description: describePillar(key, score),
  }));

  const priorities: Priority[] = JSON.parse(lead.priorities);
  const recommendations: string[] = JSON.parse(lead.recommendations);

  const classification = lead.classification as Classification;

  const classificationSummary =
    {
      "CRÍTICO":
        "Existem lacunas importantes na presença digital da empresa, com oportunidades claras de melhoria em praticamente todos os pilares.",
      "PRECISA MELHORAR":
        "A empresa possui uma base inicial, mas ainda precisa estruturar pontos importantes do marketing para gerar mais resultado.",
      "BOA BASE": "Boa base, mas existem oportunidades importantes de melhoria.",
      ESTRUTURADO:
        "A empresa já possui uma presença digital estruturada, com oportunidades de otimização e escala.",
    }[classification] ?? "";

  const whatsappSpecialistMessage = `Olá! Acabei de fazer o diagnóstico de marketing da ${lead.companyName} e tive o resultado ${lead.scoreGeneral}/100. Gostaria de conversar sobre os próximos passos.`;
  const whatsappReceiveMessage = `Olá! Gostaria de receber o diagnóstico da ${lead.companyName} (resultado ${lead.scoreGeneral}/100) pelo WhatsApp.`;

  return (
    <div className="min-h-screen pb-24">
      <div className="bg-dark">
        <header className="mx-auto flex max-w-4xl items-center justify-between px-5 py-6">
          <Link href="/">
            <Logo inverted />
          </Link>
        </header>

        <section className="mx-auto max-w-4xl px-5 pb-14 text-center">
          <p className="text-xs font-semibold tracking-wide text-brand uppercase">
            Diagnóstico de Marketing
          </p>
          <h1 className="font-display mt-2 text-3xl tracking-tight text-white uppercase sm:text-4xl">
            {lead.companyName}
          </h1>

          <div className="mt-8 flex flex-col items-center gap-4">
            <ScoreGauge score={lead.scoreGeneral} classification={classification} />
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${CLASSIFICATION_BADGE[classification]}`}
            >
              {classification}
            </span>
            <p className="max-w-md text-sm text-dark-ink-soft">
              {classificationSummary}
            </p>
          </div>
        </section>
      </div>

      <main className="mx-auto max-w-4xl px-5">
        <section className="mt-16">
          <h2 className="text-lg font-semibold text-ink">
            Seu resultado por pilar
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {pillars.map((pillar) => (
              <PillarBar
                key={pillar.key}
                pillarKey={pillar.key}
                label={pillar.label}
                score={pillar.score}
                description={pillar.description}
              />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-lg font-semibold text-ink">
            Principais oportunidades
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {priorities.map((priority) => (
              <div
                key={priority.pillarKey}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <span className="text-xs font-semibold text-brand">
                  PRIORIDADE {priority.rank}
                </span>
                <h3 className="mt-1.5 text-sm font-semibold text-ink">
                  {priority.title}
                </h3>
                <p className="mt-2 text-sm text-ink-soft">
                  {priority.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-lg font-semibold text-ink">
            O que recomendamos mudar primeiro
          </h2>
          <ol className="mt-5 space-y-3">
            {recommendations.map((rec, i) => (
              <li
                key={rec}
                className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4"
              >
                <span className="text-sm font-bold text-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-ink">{rec}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16 rounded-2xl border border-brand/20 bg-brand-light p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-ink">
            Se estivéssemos cuidando do marketing da sua empresa, estas seriam
            nossas prioridades.
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VISION_SEQUENCE.map((v) => (
              <div key={v.label}>
                <span className="text-xs font-semibold text-brand">
                  {v.label}
                </span>
                <p className="mt-1.5 text-sm text-ink">{v.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-ink sm:text-3xl">
            Quer transformar esse diagnóstico em um plano de ação?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft">
            Seu diagnóstico mostra onde estão as principais oportunidades. O
            próximo passo é transformar essas informações em ações concretas
            para melhorar o posicionamento, a comunicação e os resultados da
            sua empresa.
          </p>
          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={buildWhatsAppLink(whatsappSpecialistMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-lg bg-brand px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand/90 sm:w-auto"
            >
              Quero conversar com um especialista
            </a>
            <a
              href={buildWhatsAppLink(whatsappReceiveMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-lg border border-border px-7 py-3 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand sm:w-auto"
            >
              Receber meu diagnóstico no WhatsApp
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

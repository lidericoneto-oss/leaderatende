import Link from "next/link";

const AUDIENCE = [
  "Você tem Instagram ou outras redes sociais ativas",
  "Sente que poderia vender mais do que vende hoje",
  "Tem dificuldade em posicionar a empresa diante da concorrência",
  "Já investe em marketing, mas não sabe se está tendo retorno",
  "Ainda não tem uma estratégia profissional definida",
];

const STEPS = [
  {
    number: "01",
    title: "Responda sobre sua empresa",
    description:
      "Perguntas objetivas sobre seu negócio, sua presença digital, seus objetivos e desafios atuais.",
  },
  {
    number: "02",
    title: "Analisamos suas respostas",
    description:
      "Cruzamos as informações em seis pilares de marketing para identificar onde estão as maiores oportunidades.",
  },
  {
    number: "03",
    title: "Você recebe o diagnóstico",
    description:
      "Um relatório visual e direto, com pontuação, prioridades e as primeiras ações recomendadas.",
  },
  {
    number: "04",
    title: "Decide os próximos passos",
    description:
      "Com o diagnóstico em mãos, você decide se quer transformá-lo em um plano de ação com um especialista.",
  },
];

const PILLARS = [
  "Posicionamento",
  "Comunicação",
  "Presença Digital",
  "Conteúdo",
  "Conversão",
  "Estratégia",
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <span className="text-sm font-semibold tracking-tight text-ink">
          LeaderAtende
        </span>
        <Link
          href="/diagnostico"
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-ink transition hover:border-brand hover:text-brand"
        >
          Iniciar avaliação
        </Link>
      </header>

      <main>
        <section className="mx-auto max-w-4xl px-5 pt-10 pb-16 text-center sm:pt-16 sm:pb-24">
          <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-ink-soft">
            Avaliação gratuita · Leva menos de 5 minutos
          </span>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink sm:text-5xl sm:leading-[1.1]">
            Descubra como sua empresa está sendo percebida no digital.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-ink-soft sm:text-lg">
            Responda algumas perguntas sobre sua empresa e receba uma análise
            profissional com os principais pontos que precisam ser melhorados
            na sua presença digital.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/diagnostico"
              className="w-full rounded-lg bg-brand px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand/90 sm:w-auto"
            >
              Fazer minha avaliação agora
            </Link>
            <span className="text-xs text-ink-soft">
              Sem custo · Resultado imediato · Sem compromisso
            </span>
          </div>
        </section>

        <section className="border-y border-border bg-surface">
          <div className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">
              Essa avaliação é para você
            </p>
            <h2 className="mt-2 max-w-xl text-2xl font-semibold text-ink sm:text-3xl">
              Você sabe como sua empresa está sendo percebida no digital?
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {AUDIENCE.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-border bg-background p-4 text-sm text-ink-soft"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand">
                    <svg viewBox="0 0 12 12" className="h-3 w-3 fill-current">
                      <path d="M4.5 8.5 1.5 5.5l1-1 2 2 4-4 1 1z" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">
            Como funciona
          </p>
          <h2 className="mt-2 max-w-xl text-2xl font-semibold text-ink sm:text-3xl">
            Uma avaliação, não um formulário genérico.
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.number}>
                <span className="text-sm font-semibold text-brand">
                  {s.number}
                </span>
                <h3 className="mt-2 text-base font-semibold text-ink">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-sm text-ink-soft">{s.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-surface">
          <div className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">
              O que você recebe
            </p>
            <h2 className="mt-2 max-w-xl text-2xl font-semibold text-ink sm:text-3xl">
              Um diagnóstico estruturado em seis pilares de marketing.
            </h2>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {PILLARS.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-ink"
                >
                  {p}
                </span>
              ))}
            </div>
            <p className="mt-6 max-w-2xl text-sm text-ink-soft">
              Ao final, você recebe uma pontuação geral, o detalhamento de cada
              pilar, as três principais prioridades identificadas e as
              primeiras ações recomendadas para melhorar sua presença digital.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-16 text-center sm:py-24">
          <h2 className="text-2xl font-semibold text-ink sm:text-3xl">
            Faça uma avaliação rápida e descubra onde estão os principais
            pontos de melhoria.
          </h2>
          <Link
            href="/diagnostico"
            className="mt-8 inline-block rounded-lg bg-brand px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand/90"
          >
            Iniciar minha avaliação
          </Link>
        </section>
      </main>

      <footer className="border-t border-border px-5 py-8 text-center text-xs text-ink-soft">
        <p>
          Ao continuar, você concorda com o uso das informações fornecidas
          para gerar seu diagnóstico e para contato comercial, conforme nossa{" "}
          <Link href="/privacidade" className="text-brand underline">
            política de privacidade
          </Link>
          .
        </p>
        <p className="mt-2">LeaderAtende — Diagnóstico de Marketing</p>
      </footer>
    </div>
  );
}

import Link from "next/link";

export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:py-20">
      <Link href="/" className="text-sm font-semibold text-brand">
        LeaderAtende
      </Link>
      <h1 className="mt-8 text-2xl font-semibold text-ink sm:text-3xl">
        Aviso de privacidade
      </h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink-soft">
        <p>
          As informações que você fornece nesta avaliação (dados da empresa,
          respostas sobre presença digital, objetivos, desafios e dados de
          contato) são utilizadas exclusivamente para gerar o seu diagnóstico
          de marketing e para viabilizar contato comercial relacionado à
          análise realizada.
        </p>
        <p>
          Não compartilhamos seus dados com terceiros para fins alheios a essa
          finalidade. Você pode solicitar a exclusão dos seus dados a qualquer
          momento entrando em contato conosco.
        </p>
        <p>
          O tratamento dos seus dados segue os princípios da Lei Geral de
          Proteção de Dados (LGPD — Lei nº 13.709/2018): finalidade,
          necessidade e transparência.
        </p>
      </div>
    </div>
  );
}

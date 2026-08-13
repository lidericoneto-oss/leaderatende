import type {
  Classification,
  DiagnosisResult,
  Pillar,
  PillarKey,
  Priority,
  QuizData,
} from "@/types/lead";

const PILLAR_LABELS: Record<PillarKey, string> = {
  positioning: "Posicionamento",
  communication: "Comunicação",
  digitalPresence: "Presença Digital",
  content: "Conteúdo",
  conversion: "Conversão",
  strategy: "Estratégia",
};

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function scale1to5(value: number): number {
  return clamp((value - 1) * 25);
}

function has(list: string[], value: string): boolean {
  return list.includes(value);
}

function scorePositioning(data: QuizData): number {
  let score =
    0.5 * scale1to5(data.selfDifferentiation) +
    0.5 * scale1to5(data.selfProfessionalism);

  if (has(data.challenges, "Minha comunicação é parecida com a dos concorrentes"))
    score -= 12;
  if (has(data.challenges, "Meu perfil não transmite profissionalismo")) score -= 12;
  if (
    has(
      data.challenges,
      "Minha empresa é boa, mas não consigo demonstrar isso nas redes"
    )
  )
    score -= 8;
  if (has(data.challenges, "Não tenho uma identidade visual consistente"))
    score -= 8;

  if (data.companyStage === "Negócio recém-iniciado") score -= 5;
  if (data.companyStage === "Empresa consolidada") score += 5;

  return clamp(score);
}

function scoreCommunication(data: QuizData): number {
  let score =
    0.6 * scale1to5(data.selfClarity) + 0.4 * scale1to5(data.selfProfessionalism);

  if (has(data.challenges, "Não sei o que publicar")) score -= 10;
  if (has(data.challenges, "Meu perfil não transmite profissionalismo")) score -= 8;
  if (has(data.challenges, "Minha comunicação é parecida com a dos concorrentes"))
    score -= 8;

  return clamp(score);
}

function scoreDigitalPresence(data: QuizData): number {
  let score: number;

  if (has(data.channels, "Nenhum") || data.channels.length === 0) {
    score = 5;
  } else {
    score = 10 + data.channels.length * 15;
  }

  const frequencyAdjustment: Record<string, number> = {
    "Todos os dias": 10,
    "Algumas vezes por semana": 5,
    "Uma vez por semana": 0,
    "Algumas vezes por mês": -10,
    Raramente: -20,
    "Não publica": -30,
  };
  score += frequencyAdjustment[data.postFrequency] ?? 0;

  if (data.marketingResponsible === "Ninguém") score -= 15;
  if (data.marketingResponsible === "Agência") score += 10;
  if (data.marketingResponsible === "Funcionário interno") score += 5;

  return clamp(score);
}

function scoreContent(data: QuizData): number {
  const frequencyBase: Record<string, number> = {
    "Todos os dias": 90,
    "Algumas vezes por semana": 75,
    "Uma vez por semana": 60,
    "Algumas vezes por mês": 40,
    Raramente: 20,
    "Não publica": 5,
  };
  let score = frequencyBase[data.postFrequency] ?? 50;

  if (has(data.challenges, "Tenho dificuldade para criar conteúdo")) score -= 10;
  if (has(data.challenges, "Não sei o que publicar")) score -= 10;
  if (has(data.challenges, "Não consigo manter regularidade")) score -= 10;
  if (has(data.challenges, "Não tenho uma identidade visual consistente"))
    score -= 8;
  if (has(data.challenges, "Tenho pouco tempo para cuidar do marketing"))
    score -= 6;

  return clamp(score);
}

function scoreConversion(data: QuizData): number {
  let score = 0.6 * scale1to5(data.selfSalesConversion) + 0.4 * 50;

  if (has(data.challenges, "Tenho seguidores, mas poucas vendas")) score -= 15;
  if (has(data.challenges, "Não sei como transformar seguidores em clientes"))
    score -= 15;

  if (has(data.channels, "WhatsApp")) score += 8;
  if (data.whatsappBusiness && data.whatsappBusiness.trim().length > 0)
    score += 5;

  return clamp(score);
}

function scoreStrategy(data: QuizData): number {
  let score = 0.6 * scale1to5(data.selfStrategy) + 0.4 * 50;

  const responsibleAdjustment: Record<string, number> = {
    Ninguém: -15,
    "Eu mesmo": -5,
    Agência: 10,
    "Funcionário interno": 5,
    "Várias pessoas": 0,
  };
  score += responsibleAdjustment[data.marketingResponsible] ?? 0;

  const adsAdjustment: Record<string, number> = {
    "Sim, regularmente": 10,
    "Sim, eventualmente": 3,
    "Já investi, mas parei": -8,
    "Nunca investi": -5,
    "Não sei avaliar": -10,
  };
  score += adsAdjustment[data.adsInvestment] ?? 0;

  if (has(data.challenges, "Meu marketing não tem estratégia")) score -= 15;
  if (has(data.challenges, "Não sei se meus investimentos estão dando resultado"))
    score -= 10;

  return clamp(score);
}

function classify(scoreGeneral: number): {
  classification: Classification;
  summary: string;
} {
  if (scoreGeneral < 40) {
    return {
      classification: "CRÍTICO",
      summary:
        "Existem lacunas importantes na presença digital da empresa, com oportunidades claras de melhoria em praticamente todos os pilares.",
    };
  }
  if (scoreGeneral < 60) {
    return {
      classification: "PRECISA MELHORAR",
      summary:
        "A empresa possui uma base inicial, mas ainda precisa estruturar pontos importantes do marketing para gerar mais resultado.",
    };
  }
  if (scoreGeneral < 80) {
    return {
      classification: "BOA BASE",
      summary:
        "Boa base, mas existem oportunidades importantes de melhoria.",
    };
  }
  return {
    classification: "ESTRUTURADO",
    summary:
      "A empresa já possui uma presença digital estruturada, com oportunidades de otimização e escala.",
  };
}

type Band = "critico" | "melhorar" | "boaBase" | "estruturado";

function bandOf(score: number): Band {
  if (score < 40) return "critico";
  if (score < 60) return "melhorar";
  if (score < 80) return "boaBase";
  return "estruturado";
}

const PILLAR_DESCRIPTIONS: Record<PillarKey, Record<Band, string>> = {
  positioning: {
    critico:
      "Não fica claro por que o cliente deveria escolher sua empresa e não a concorrência.",
    melhorar:
      "O posicionamento ainda não deixa claro por que o cliente deveria escolher sua empresa.",
    boaBase:
      "A empresa já tem um posicionamento reconhecível, mas ainda pode se diferenciar melhor da concorrência.",
    estruturado:
      "O posicionamento é claro e ajuda o público a entender por que escolher a empresa.",
  },
  communication: {
    critico:
      "A comunicação não deixa claro o que a empresa oferece nem para quem.",
    melhorar:
      "Existe comunicação, mas o público ainda tem dificuldade em entender claramente o que a empresa oferece.",
    boaBase:
      "A comunicação é compreensível, mas pode transmitir mais profissionalismo e clareza.",
    estruturado:
      "A comunicação é clara e transmite profissionalismo de forma consistente.",
  },
  digitalPresence: {
    critico:
      "A presença digital é muito limitada ou inexistente nos canais relevantes para o negócio.",
    melhorar:
      "A empresa está presente em poucos canais ou com baixa frequência de atividade.",
    boaBase:
      "A empresa mantém presença ativa nos principais canais, com espaço para ampliar alcance.",
    estruturado:
      "A presença digital é consistente e bem distribuída entre os canais relevantes.",
  },
  content: {
    critico:
      "Praticamente não há produção de conteúdo, o que limita a percepção da empresa no digital.",
    melhorar:
      "O conteúdo ainda não cumpre uma função estratégica além de manter o perfil ativo.",
    boaBase:
      "Existe produção de conteúdo com regularidade, mas ainda pode ser mais estratégica.",
    estruturado:
      "O conteúdo é regular e cumpre um papel estratégico na comunicação da empresa.",
  },
  conversion: {
    critico:
      "Não existe um caminho estruturado entre conhecer a empresa e entrar em contato com ela.",
    melhorar:
      "Existe presença digital, mas o caminho entre o usuário conhecer sua empresa e entrar em contato ainda pode ser melhor estruturado.",
    boaBase:
      "O caminho até o contato comercial existe, mas ainda pode ser simplificado.",
    estruturado:
      "Existe um caminho claro e eficiente entre o público e o contato comercial.",
  },
  strategy: {
    critico:
      "As ações de marketing acontecem sem planejamento ou direcionamento definido.",
    melhorar:
      "As ações de marketing ainda acontecem sem uma estratégia clara por trás.",
    boaBase:
      "Já existe direcionamento estratégico, mas ele pode ser mais estruturado e consistente.",
    estruturado:
      "A empresa conduz o marketing com base em uma estratégia clara e definida.",
  },
};

export function describePillar(key: PillarKey, score: number): string {
  return PILLAR_DESCRIPTIONS[key][bandOf(score)];
}

const PRIORITY_CONTENT: Record<PillarKey, { title: string; description: string }> = {
  positioning: {
    title: "Estruturar o posicionamento",
    description:
      "Seu negócio possui produtos/serviços, mas sua comunicação ainda não deixa claro por que o cliente deveria escolher sua empresa.",
  },
  communication: {
    title: "Estruturar a comunicação",
    description:
      "É importante deixar mais claro, de forma direta, o que a empresa oferece e para quem.",
  },
  digitalPresence: {
    title: "Ampliar a presença digital",
    description:
      "A presença nos canais relevantes ainda pode ser ampliada para aumentar o alcance da empresa.",
  },
  content: {
    title: "Melhorar o conteúdo",
    description:
      "Existe presença nas redes, porém o conteúdo precisa cumprir uma função estratégica além de simplesmente manter o perfil ativo.",
  },
  conversion: {
    title: "Melhorar a conversão",
    description:
      "É importante criar caminhos mais claros para transformar visitantes em contatos e oportunidades comerciais.",
  },
  strategy: {
    title: "Definir uma estratégia",
    description:
      "As ações de marketing precisam de um direcionamento estratégico para gerar mais resultado.",
  },
};

const CHALLENGE_ACTIONS: Record<string, string> = {
  "Tenho dificuldade para criar conteúdo":
    "Criar uma linha editorial simples para orientar as publicações",
  "Meu perfil não transmite profissionalismo":
    "Revisar a apresentação visual do perfil (bio, destaques, identidade)",
  "Não sei o que publicar":
    "Definir temas e formatos de conteúdo alinhados ao objetivo da empresa",
  "Tenho seguidores, mas poucas vendas":
    "Estruturar um caminho claro entre o conteúdo e o contato comercial",
  "Minha empresa é boa, mas não consigo demonstrar isso nas redes":
    "Traduzir os diferenciais reais da empresa em conteúdo e comunicação",
  "Meu marketing não tem estratégia":
    "Definir uma estratégia de marketing com objetivos e prioridades claras",
  "Não sei se meus investimentos estão dando resultado":
    "Implementar acompanhamento de resultados dos investimentos em marketing",
  "Minha comunicação é parecida com a dos concorrentes":
    "Revisar o posicionamento para diferenciar a comunicação da concorrência",
  "Tenho pouco tempo para cuidar do marketing":
    "Estruturar um processo ou rotina que não dependa apenas do seu tempo",
  "Não consigo manter regularidade":
    "Criar um planejamento de publicações para manter regularidade",
  "Não tenho uma identidade visual consistente":
    "Padronizar a identidade visual usada nas redes sociais",
  "Não sei como transformar seguidores em clientes":
    "Estruturar melhor o caminho até o WhatsApp",
};

const PILLAR_FALLBACK_ACTIONS: Record<PillarKey, string> = {
  positioning: "Revisar o posicionamento do perfil",
  communication: "Ajustar a apresentação dos produtos/serviços",
  digitalPresence: "Ampliar a presença nos canais mais relevantes para o público",
  content: "Definir uma linha editorial",
  conversion: "Estruturar melhor o caminho até o WhatsApp",
  strategy: "Criar uma estratégia de marketing com prioridades definidas",
};

function buildPriorities(pillars: Pillar[]): Priority[] {
  const sorted = [...pillars].sort((a, b) => a.score - b.score);
  return sorted.slice(0, 3).map((pillar, index) => ({
    rank: index + 1,
    pillarKey: pillar.key,
    title: PRIORITY_CONTENT[pillar.key].title,
    description: PRIORITY_CONTENT[pillar.key].description,
  }));
}

function buildRecommendations(data: QuizData, pillars: Pillar[]): string[] {
  const actions: string[] = [];

  for (const challenge of data.challenges) {
    const action = CHALLENGE_ACTIONS[challenge];
    if (action && !actions.includes(action)) {
      actions.push(action);
    }
  }

  if (actions.length < 3) {
    const sorted = [...pillars].sort((a, b) => a.score - b.score);
    for (const pillar of sorted) {
      const fallback = PILLAR_FALLBACK_ACTIONS[pillar.key];
      if (!actions.includes(fallback)) {
        actions.push(fallback);
      }
      if (actions.length >= 3) break;
    }
  }

  return actions.slice(0, 5);
}

export function calculateDiagnosis(data: QuizData): DiagnosisResult {
  const scores: Record<PillarKey, number> = {
    positioning: scorePositioning(data),
    communication: scoreCommunication(data),
    digitalPresence: scoreDigitalPresence(data),
    content: scoreContent(data),
    conversion: scoreConversion(data),
    strategy: scoreStrategy(data),
  };

  const pillars: Pillar[] = (Object.keys(scores) as PillarKey[]).map((key) => ({
    key,
    label: PILLAR_LABELS[key],
    score: scores[key],
    description: PILLAR_DESCRIPTIONS[key][bandOf(scores[key])],
  }));

  const scoreGeneral = clamp(
    pillars.reduce((sum, p) => sum + p.score, 0) / pillars.length
  );

  const { classification, summary } = classify(scoreGeneral);

  return {
    scoreGeneral,
    classification,
    classificationSummary: summary,
    pillars,
    priorities: buildPriorities(pillars),
    recommendations: buildRecommendations(data, pillars),
  };
}

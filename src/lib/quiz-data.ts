import type {
  AdsInvestment,
  Channel,
  CompanyStage,
  MarketingResponsible,
  PostFrequency,
} from "@/types/lead";

export const TOTAL_STEPS = 6;

export const STEP_TITLES = [
  "Sobre sua empresa",
  "Sua presença digital",
  "Seus objetivos",
  "Seus desafios",
  "Autoavaliação",
  "Seus contatos",
];

export const COMPANY_STAGES: CompanyStage[] = [
  "Pequena empresa em crescimento",
  "Empresa consolidada",
  "Empresa em expansão",
  "Profissional/autônomo",
  "Negócio recém-iniciado",
  "Outro",
];

export const CHANNELS: Channel[] = [
  "Instagram",
  "Facebook",
  "TikTok",
  "LinkedIn",
  "Site",
  "Google/Perfil da Empresa",
  "WhatsApp",
  "YouTube",
  "Nenhum",
];

export const MARKETING_RESPONSIBLE_OPTIONS: MarketingResponsible[] = [
  "Eu mesmo",
  "Funcionário interno",
  "Freelancer",
  "Agência",
  "Várias pessoas",
  "Ninguém",
];

export const POST_FREQUENCY_OPTIONS: PostFrequency[] = [
  "Todos os dias",
  "Algumas vezes por semana",
  "Uma vez por semana",
  "Algumas vezes por mês",
  "Raramente",
  "Não publica",
];

export const ADS_INVESTMENT_OPTIONS: AdsInvestment[] = [
  "Sim, regularmente",
  "Sim, eventualmente",
  "Já investi, mas parei",
  "Nunca investi",
  "Não sei avaliar",
];

export const OBJECTIVE_OPTIONS = [
  "Atrair mais clientes",
  "Vender mais",
  "Fortalecer a marca",
  "Melhorar o Instagram",
  "Tornar a empresa mais profissional",
  "Aumentar o reconhecimento local",
  "Gerar mais contatos pelo WhatsApp",
  "Melhorar o posicionamento",
  "Criar uma estratégia de marketing",
  "Começar a investir em marketing",
  "Outro",
];

export const MAX_OBJECTIVES = 3;

export const CHALLENGE_OPTIONS = [
  "Tenho dificuldade para criar conteúdo",
  "Meu perfil não transmite profissionalismo",
  "Não sei o que publicar",
  "Tenho seguidores, mas poucas vendas",
  "Minha empresa é boa, mas não consigo demonstrar isso nas redes",
  "Meu marketing não tem estratégia",
  "Não sei se meus investimentos estão dando resultado",
  "Minha comunicação é parecida com a dos concorrentes",
  "Tenho pouco tempo para cuidar do marketing",
  "Não consigo manter regularidade",
  "Não tenho uma identidade visual consistente",
  "Não sei como transformar seguidores em clientes",
  "Outro",
];

export const MAX_CHALLENGES = 3;

export interface SelfAssessmentQuestion {
  key:
    | "selfProfessionalism"
    | "selfClarity"
    | "selfDifferentiation"
    | "selfSalesConversion"
    | "selfStrategy";
  question: string;
}

export const SELF_ASSESSMENT_QUESTIONS: SelfAssessmentQuestion[] = [
  {
    key: "selfProfessionalism",
    question:
      "De 1 a 5, quanto você considera que sua empresa transmite profissionalismo nas redes sociais?",
  },
  {
    key: "selfClarity",
    question:
      "De 1 a 5, quanto você considera que seu público entende claramente o que sua empresa oferece?",
  },
  {
    key: "selfDifferentiation",
    question:
      "De 1 a 5, quanto você considera que sua comunicação diferencia sua empresa dos concorrentes?",
  },
  {
    key: "selfSalesConversion",
    question:
      "De 1 a 5, quanto você considera que suas redes sociais ajudam a gerar vendas?",
  },
  {
    key: "selfStrategy",
    question:
      "De 1 a 5, quanto você considera que sua empresa possui uma estratégia de marketing definida?",
  },
];

export const EMPLOYEE_COUNT_OPTIONS = [
  "Somente eu",
  "2 a 5",
  "6 a 15",
  "16 a 50",
  "Mais de 50",
];

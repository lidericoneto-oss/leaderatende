export type CompanyStage =
  | "Pequena empresa em crescimento"
  | "Empresa consolidada"
  | "Empresa em expansão"
  | "Profissional/autônomo"
  | "Negócio recém-iniciado"
  | "Outro";

export type Channel =
  | "Instagram"
  | "Facebook"
  | "TikTok"
  | "LinkedIn"
  | "Site"
  | "Google/Perfil da Empresa"
  | "WhatsApp"
  | "YouTube"
  | "Nenhum";

export type MarketingResponsible =
  | "Eu mesmo"
  | "Funcionário interno"
  | "Freelancer"
  | "Agência"
  | "Várias pessoas"
  | "Ninguém";

export type PostFrequency =
  | "Todos os dias"
  | "Algumas vezes por semana"
  | "Uma vez por semana"
  | "Algumas vezes por mês"
  | "Raramente"
  | "Não publica";

export type AdsInvestment =
  | "Sim, regularmente"
  | "Sim, eventualmente"
  | "Já investi, mas parei"
  | "Nunca investi"
  | "Não sei avaliar";

export interface QuizStep1 {
  companyName: string;
  responsibleName: string;
  segment: string;
  city: string;
  website: string;
  instagram: string;
  facebook: string;
  whatsappBusiness: string;
  employeeCount: string;
  companyStage: CompanyStage | "";
}

export interface QuizStep2 {
  channels: Channel[];
  marketingResponsible: MarketingResponsible | "";
  postFrequency: PostFrequency | "";
  adsInvestment: AdsInvestment | "";
}

export interface QuizStep3 {
  objectives: string[];
  successDefinition: string;
}

export interface QuizStep4 {
  challenges: string[];
}

export interface QuizStep5 {
  selfProfessionalism: number;
  selfClarity: number;
  selfDifferentiation: number;
  selfSalesConversion: number;
  selfStrategy: number;
}

export interface QuizStep6 {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  consent: boolean;
}

export interface QuizData
  extends QuizStep1,
    QuizStep2,
    QuizStep3,
    QuizStep4,
    QuizStep5,
    QuizStep6 {}

export const PILLAR_KEYS = [
  "positioning",
  "communication",
  "digitalPresence",
  "content",
  "conversion",
  "strategy",
] as const;

export type PillarKey = (typeof PILLAR_KEYS)[number];

export interface Pillar {
  key: PillarKey;
  label: string;
  score: number;
  description: string;
}

export type Classification =
  | "CRÍTICO"
  | "PRECISA MELHORAR"
  | "BOA BASE"
  | "ESTRUTURADO";

export interface Priority {
  rank: number;
  pillarKey: PillarKey;
  title: string;
  description: string;
}

export interface DiagnosisResult {
  scoreGeneral: number;
  classification: Classification;
  classificationSummary: string;
  pillars: Pillar[];
  priorities: Priority[];
  recommendations: string[];
}

export type InstagramAdjustments = Partial<Record<PillarKey, number>>;

export interface InstagramAnalysis {
  summary: string;
  strengths: string[];
  improvements: string[];
  adjustments: InstagramAdjustments;
}

export const LEAD_STATUSES = [
  "NOVO",
  "ANALISADO",
  "CONTATADO",
  "REUNIAO_AGENDADA",
  "PROPOSTA_ENVIADA",
  "NEGOCIACAO",
  "CLIENTE",
  "PERDIDO",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NOVO: "Novo",
  ANALISADO: "Analisado",
  CONTATADO: "Contatado",
  REUNIAO_AGENDADA: "Reunião agendada",
  PROPOSTA_ENVIADA: "Proposta enviada",
  NEGOCIACAO: "Negociação",
  CLIENTE: "Cliente",
  PERDIDO: "Perdido",
};

import { PrismaClient } from "@prisma/client";
import { calculateDiagnosis } from "../src/lib/scoring";
import type { QuizData, LeadStatus } from "../src/types/lead";

const prisma = new PrismaClient();

interface SeedLead {
  quiz: QuizData;
  status: LeadStatus;
  daysAgo: number;
}

const SEED_LEADS: SeedLead[] = [
  {
    status: "NOVO",
    daysAgo: 0,
    quiz: {
      companyName: "Studio Alma Estética",
      responsibleName: "Camila Duarte",
      segment: "Estética e beleza",
      city: "Belo Horizonte, MG",
      website: "",
      instagram: "@studioalma",
      facebook: "",
      whatsappBusiness: "(31) 99123-4567",
      employeeCount: "2 a 5",
      companyStage: "Pequena empresa em crescimento",
      channels: ["Instagram", "WhatsApp"],
      marketingResponsible: "Eu mesmo",
      postFrequency: "Raramente",
      adsInvestment: "Nunca investi",
      objectives: ["Atrair mais clientes", "Melhorar o Instagram"],
      successDefinition: "Ter a agenda cheia todo mês.",
      challenges: [
        "Não sei o que publicar",
        "Não consigo manter regularidade",
        "Meu perfil não transmite profissionalismo",
      ],
      selfProfessionalism: 2,
      selfClarity: 2,
      selfDifferentiation: 2,
      selfSalesConversion: 2,
      selfStrategy: 1,
      contactName: "Camila Duarte",
      contactEmail: "camila@studioalma.com.br",
      contactPhone: "(31) 99123-4567",
      consent: true,
    },
  },
  {
    status: "ANALISADO",
    daysAgo: 1,
    quiz: {
      companyName: "Barbearia Vintage",
      responsibleName: "Rodrigo Melo",
      segment: "Barbearia",
      city: "Curitiba, PR",
      website: "",
      instagram: "@barbeariavintage",
      facebook: "facebook.com/barbeariavintage",
      whatsappBusiness: "(41) 98888-2211",
      employeeCount: "6 a 15",
      companyStage: "Empresa consolidada",
      channels: ["Instagram", "Facebook", "WhatsApp", "Google/Perfil da Empresa"],
      marketingResponsible: "Funcionário interno",
      postFrequency: "Algumas vezes por semana",
      adsInvestment: "Sim, eventualmente",
      objectives: ["Vender mais", "Aumentar o reconhecimento local"],
      successDefinition: "Mais gente vindo pelo Instagram.",
      challenges: [
        "Tenho seguidores, mas poucas vendas",
        "Minha comunicação é parecida com a dos concorrentes",
      ],
      selfProfessionalism: 3,
      selfClarity: 3,
      selfDifferentiation: 2,
      selfSalesConversion: 2,
      selfStrategy: 3,
      contactName: "Rodrigo Melo",
      contactEmail: "rodrigo@barbeariavintage.com.br",
      contactPhone: "(41) 98888-2211",
      consent: true,
    },
  },
  {
    status: "CONTATADO",
    daysAgo: 3,
    quiz: {
      companyName: "Dra. Fernanda Rocha Odontologia",
      responsibleName: "Fernanda Rocha",
      segment: "Odontologia",
      city: "São Paulo, SP",
      website: "www.fernandarocha.odonto.br",
      instagram: "@dra.fernandarocha",
      facebook: "",
      whatsappBusiness: "(11) 97777-3344",
      employeeCount: "2 a 5",
      companyStage: "Profissional/autônomo",
      channels: ["Instagram", "WhatsApp", "Google/Perfil da Empresa"],
      marketingResponsible: "Freelancer",
      postFrequency: "Uma vez por semana",
      adsInvestment: "Já investi, mas parei",
      objectives: [
        "Tornar a empresa mais profissional",
        "Gerar mais contatos pelo WhatsApp",
      ],
      successDefinition: "Fechar mais avaliações pelo WhatsApp.",
      challenges: [
        "Não sei como transformar seguidores em clientes",
        "Não sei se meus investimentos estão dando resultado",
      ],
      selfProfessionalism: 4,
      selfClarity: 3,
      selfDifferentiation: 3,
      selfSalesConversion: 2,
      selfStrategy: 2,
      contactName: "Fernanda Rocha",
      contactEmail: "fernanda@fernandarocha.odonto.br",
      contactPhone: "(11) 97777-3344",
      consent: true,
    },
  },
  {
    status: "REUNIAO_AGENDADA",
    daysAgo: 5,
    quiz: {
      companyName: "Construtora Horizonte",
      responsibleName: "Marcos Vinícius",
      segment: "Construção civil",
      city: "Goiânia, GO",
      website: "www.construtorahorizonte.com.br",
      instagram: "@construtorahorizonte",
      facebook: "facebook.com/construtorahorizonte",
      whatsappBusiness: "(62) 99555-1122",
      employeeCount: "16 a 50",
      companyStage: "Empresa em expansão",
      channels: ["Instagram", "Facebook", "Site", "LinkedIn", "WhatsApp"],
      marketingResponsible: "Várias pessoas",
      postFrequency: "Algumas vezes por mês",
      adsInvestment: "Sim, eventualmente",
      objectives: ["Melhorar o posicionamento", "Fortalecer a marca"],
      successDefinition: "Ser referência regional em incorporação.",
      challenges: [
        "Meu marketing não tem estratégia",
        "Minha empresa é boa, mas não consigo demonstrar isso nas redes",
      ],
      selfProfessionalism: 3,
      selfClarity: 3,
      selfDifferentiation: 2,
      selfSalesConversion: 3,
      selfStrategy: 2,
      contactName: "Marcos Vinícius",
      contactEmail: "marcos@construtorahorizonte.com.br",
      contactPhone: "(62) 99555-1122",
      consent: true,
    },
  },
  {
    status: "PROPOSTA_ENVIADA",
    daysAgo: 8,
    quiz: {
      companyName: "Mercado Bom Preço",
      responsibleName: "Sueli Andrade",
      segment: "Varejo alimentício",
      city: "Recife, PE",
      website: "",
      instagram: "@mercadobompreco",
      facebook: "facebook.com/mercadobompreco",
      whatsappBusiness: "(81) 98123-9090",
      employeeCount: "16 a 50",
      companyStage: "Empresa consolidada",
      channels: ["Instagram", "Facebook", "WhatsApp"],
      marketingResponsible: "Ninguém",
      postFrequency: "Não publica",
      adsInvestment: "Nunca investi",
      objectives: ["Aumentar o reconhecimento local", "Vender mais"],
      successDefinition: "Mais gente conhecendo as promoções da semana.",
      challenges: [
        "Tenho pouco tempo para cuidar do marketing",
        "Não tenho uma identidade visual consistente",
        "Não sei o que publicar",
      ],
      selfProfessionalism: 1,
      selfClarity: 2,
      selfDifferentiation: 1,
      selfSalesConversion: 2,
      selfStrategy: 1,
      contactName: "Sueli Andrade",
      contactEmail: "sueli@mercadobompreco.com.br",
      contactPhone: "(81) 98123-9090",
      consent: true,
    },
  },
  {
    status: "NEGOCIACAO",
    daysAgo: 10,
    quiz: {
      companyName: "Escritório Paiva Advocacia",
      responsibleName: "Ricardo Paiva",
      segment: "Advocacia",
      city: "Porto Alegre, RS",
      website: "www.paivaadvocacia.com.br",
      instagram: "@paivaadvocacia",
      facebook: "",
      whatsappBusiness: "(51) 99321-6655",
      employeeCount: "6 a 15",
      companyStage: "Empresa consolidada",
      channels: ["Instagram", "LinkedIn", "Site", "WhatsApp"],
      marketingResponsible: "Agência",
      postFrequency: "Algumas vezes por semana",
      adsInvestment: "Sim, regularmente",
      objectives: ["Criar uma estratégia de marketing", "Fortalecer a marca"],
      successDefinition: "Ser reconhecido como referência na área trabalhista.",
      challenges: ["Minha comunicação é parecida com a dos concorrentes"],
      selfProfessionalism: 4,
      selfClarity: 4,
      selfDifferentiation: 2,
      selfSalesConversion: 3,
      selfStrategy: 4,
      contactName: "Ricardo Paiva",
      contactEmail: "ricardo@paivaadvocacia.com.br",
      contactPhone: "(51) 99321-6655",
      consent: true,
    },
  },
  {
    status: "CLIENTE",
    daysAgo: 30,
    quiz: {
      companyName: "Fit Company Academia",
      responsibleName: "Bruno Tavares",
      segment: "Academia e fitness",
      city: "Florianópolis, SC",
      website: "www.fitcompany.com.br",
      instagram: "@fitcompanyacademia",
      facebook: "facebook.com/fitcompanyacademia",
      whatsappBusiness: "(48) 99888-4433",
      employeeCount: "16 a 50",
      companyStage: "Empresa em expansão",
      channels: [
        "Instagram",
        "Facebook",
        "TikTok",
        "Site",
        "WhatsApp",
        "Google/Perfil da Empresa",
      ],
      marketingResponsible: "Agência",
      postFrequency: "Todos os dias",
      adsInvestment: "Sim, regularmente",
      objectives: ["Vender mais", "Gerar mais contatos pelo WhatsApp"],
      successDefinition: "Bater a meta de novas matrículas todo mês.",
      challenges: ["Não sei se meus investimentos estão dando resultado"],
      selfProfessionalism: 5,
      selfClarity: 4,
      selfDifferentiation: 4,
      selfSalesConversion: 4,
      selfStrategy: 4,
      contactName: "Bruno Tavares",
      contactEmail: "bruno@fitcompany.com.br",
      contactPhone: "(48) 99888-4433",
      consent: true,
    },
  },
  {
    status: "PERDIDO",
    daysAgo: 20,
    quiz: {
      companyName: "Doce Ponto Confeitaria",
      responsibleName: "Aline Souza",
      segment: "Confeitaria",
      city: "Campinas, SP",
      website: "",
      instagram: "@docepontoconfeitaria",
      facebook: "",
      whatsappBusiness: "(19) 99654-7788",
      employeeCount: "Somente eu",
      companyStage: "Negócio recém-iniciado",
      channels: ["Instagram", "WhatsApp"],
      marketingResponsible: "Eu mesmo",
      postFrequency: "Algumas vezes por semana",
      adsInvestment: "Não sei avaliar",
      objectives: ["Começar a investir em marketing", "Atrair mais clientes"],
      successDefinition: "Vender todas as encomendas do fim de semana.",
      challenges: [
        "Tenho dificuldade para criar conteúdo",
        "Não tenho uma identidade visual consistente",
      ],
      selfProfessionalism: 2,
      selfClarity: 3,
      selfDifferentiation: 2,
      selfSalesConversion: 2,
      selfStrategy: 2,
      contactName: "Aline Souza",
      contactEmail: "aline@doceponto.com.br",
      contactPhone: "(19) 99654-7788",
      consent: true,
    },
  },
];

async function main() {
  await prisma.lead.deleteMany();

  for (const seedLead of SEED_LEADS) {
    const { quiz, status, daysAgo } = seedLead;
    const diagnosis = calculateDiagnosis(quiz);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    await prisma.lead.create({
      data: {
        createdAt,
        companyName: quiz.companyName,
        responsibleName: quiz.responsibleName,
        segment: quiz.segment,
        city: quiz.city,
        website: quiz.website || null,
        instagram: quiz.instagram || null,
        facebook: quiz.facebook || null,
        whatsappBusiness: quiz.whatsappBusiness,
        employeeCount: quiz.employeeCount,
        companyStage: quiz.companyStage,

        channels: JSON.stringify(quiz.channels),
        marketingResponsible: quiz.marketingResponsible,
        postFrequency: quiz.postFrequency,
        adsInvestment: quiz.adsInvestment,

        objectives: JSON.stringify(quiz.objectives),
        successDefinition: quiz.successDefinition || null,

        challenges: JSON.stringify(quiz.challenges),

        selfProfessionalism: quiz.selfProfessionalism,
        selfClarity: quiz.selfClarity,
        selfDifferentiation: quiz.selfDifferentiation,
        selfSalesConversion: quiz.selfSalesConversion,
        selfStrategy: quiz.selfStrategy,

        contactName: quiz.contactName,
        contactEmail: quiz.contactEmail,
        contactPhone: quiz.contactPhone,
        consent: quiz.consent,

        scoreGeneral: diagnosis.scoreGeneral,
        scorePositioning: diagnosis.pillars.find((p) => p.key === "positioning")!
          .score,
        scoreCommunication: diagnosis.pillars.find(
          (p) => p.key === "communication"
        )!.score,
        scoreDigitalPresence: diagnosis.pillars.find(
          (p) => p.key === "digitalPresence"
        )!.score,
        scoreContent: diagnosis.pillars.find((p) => p.key === "content")!.score,
        scoreConversion: diagnosis.pillars.find((p) => p.key === "conversion")!
          .score,
        scoreStrategy: diagnosis.pillars.find((p) => p.key === "strategy")!
          .score,
        classification: diagnosis.classification,
        priorities: JSON.stringify(diagnosis.priorities),
        recommendations: JSON.stringify(diagnosis.recommendations),

        status,
      },
    });
  }

  console.log(`Seed concluído: ${SEED_LEADS.length} leads criados.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

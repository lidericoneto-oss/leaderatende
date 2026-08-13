import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateDiagnosis } from "@/lib/scoring";
import { isValidEmail, isValidPhone } from "@/lib/validation";
import type { QuizData } from "@/types/lead";

export async function POST(request: NextRequest) {
  let data: QuizData;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const errors: string[] = [];

  if (!data.companyName?.trim()) errors.push("Nome da empresa é obrigatório.");
  if (!data.responsibleName?.trim())
    errors.push("Nome do responsável é obrigatório.");
  if (!data.segment?.trim()) errors.push("Segmento é obrigatório.");
  if (!data.city?.trim()) errors.push("Cidade/região é obrigatória.");
  if (!data.whatsappBusiness?.trim())
    errors.push("WhatsApp comercial é obrigatório.");
  if (!data.contactName?.trim()) errors.push("Nome de contato é obrigatório.");
  if (!data.contactEmail || !isValidEmail(data.contactEmail))
    errors.push("E-mail inválido.");
  if (!data.contactPhone || !isValidPhone(data.contactPhone))
    errors.push("WhatsApp de contato inválido.");
  if (!data.consent) errors.push("É necessário concordar com o uso dos dados.");

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  const diagnosis = calculateDiagnosis(data);

  let lead;
  try {
    lead = await prisma.lead.create({
      data: {
      companyName: data.companyName,
      responsibleName: data.responsibleName,
      segment: data.segment,
      city: data.city,
      website: data.website || null,
      instagram: data.instagram || null,
      facebook: data.facebook || null,
      whatsappBusiness: data.whatsappBusiness,
      employeeCount: data.employeeCount,
      companyStage: data.companyStage,

      channels: JSON.stringify(data.channels ?? []),
      marketingResponsible: data.marketingResponsible,
      postFrequency: data.postFrequency,
      adsInvestment: data.adsInvestment,

      objectives: JSON.stringify(data.objectives ?? []),
      successDefinition: data.successDefinition || null,

      challenges: JSON.stringify(data.challenges ?? []),

      selfProfessionalism: data.selfProfessionalism,
      selfClarity: data.selfClarity,
      selfDifferentiation: data.selfDifferentiation,
      selfSalesConversion: data.selfSalesConversion,
      selfStrategy: data.selfStrategy,

      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      consent: data.consent,

      scoreGeneral: diagnosis.scoreGeneral,
      scorePositioning: diagnosis.pillars.find((p) => p.key === "positioning")!.score,
      scoreCommunication: diagnosis.pillars.find((p) => p.key === "communication")!
        .score,
      scoreDigitalPresence: diagnosis.pillars.find(
        (p) => p.key === "digitalPresence"
      )!.score,
      scoreContent: diagnosis.pillars.find((p) => p.key === "content")!.score,
      scoreConversion: diagnosis.pillars.find((p) => p.key === "conversion")!
        .score,
      scoreStrategy: diagnosis.pillars.find((p) => p.key === "strategy")!.score,
      classification: diagnosis.classification,
      priorities: JSON.stringify(diagnosis.priorities),
      recommendations: JSON.stringify(diagnosis.recommendations),

        status: "NOVO",
      },
    });
  } catch (err) {
    console.error("Failed to create lead:", err);
    return NextResponse.json(
      { error: "Não foi possível salvar seu diagnóstico. Tente novamente." },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: lead.id });
}

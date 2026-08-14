import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/config";
import { emailRow } from "@/lib/email";
import { calculateDiagnosis } from "@/lib/scoring";
import { isValidEmail, isValidPhone } from "@/lib/validation";
import type { Lead } from "@prisma/client";
import type { QuizData } from "@/types/lead";

const NOTIFY_TO = "liderico.neto@gmail.com";

async function notifyCompletion(lead: Lead) {
  if (!process.env.RESEND_API_KEY) return;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const reportUrl = `${SITE_URL}/relatorio/${lead.id}`;

  try {
    await resend.emails.send({
      from: "LeaderAtende <onboarding@resend.dev>",
      to: NOTIFY_TO,
      subject: `Diagnóstico concluído: ${lead.companyName} (${lead.scoreGeneral}/100)`,
      html: `
        <div style="font-family:sans-serif;font-size:14px;color:#111;">
          <p><strong>${lead.companyName}</strong> concluiu o diagnóstico.</p>
          <table cellspacing="0" cellpadding="0">
            ${emailRow("Empresa", lead.companyName)}
            ${emailRow("Responsável", lead.responsibleName)}
            ${emailRow("Segmento", lead.segment)}
            ${emailRow("Cidade/região", lead.city)}
            ${emailRow("Site", lead.website)}
            ${emailRow("Instagram", lead.instagram)}
            ${emailRow("Facebook", lead.facebook)}
            ${emailRow("WhatsApp", lead.whatsappBusiness)}
            ${emailRow("Funcionários", lead.employeeCount)}
            ${emailRow("Estágio da empresa", lead.companyStage)}
            ${emailRow("E-mail de contato", lead.contactEmail)}
            ${emailRow("Resultado", `${lead.scoreGeneral}/100 — ${lead.classification}`)}
            ${emailRow("ID", lead.id)}
          </table>
          <p style="margin-top:16px;">
            <a href="${reportUrl}" style="display:inline-block;background:#e8730c;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600;">Ver diagnóstico completo</a>
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Completion notify email failed:", err);
  }
}

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

  await notifyCompletion(lead);

  return NextResponse.json({ id: lead.id });
}

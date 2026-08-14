import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const NOTIFY_TO = "liderico.neto@gmail.com";

interface Step1Payload {
  companyName?: string;
  responsibleName?: string;
  segment?: string;
  city?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  whatsappBusiness?: string;
  employeeCount?: string;
  companyStage?: string;
}

function row(label: string, value?: string): string {
  if (!value?.trim()) return "";
  return `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;">${label}</td><td style="padding:4px 0;">${value}</td></tr>`;
}

export async function POST(request: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  let data: Step1Payload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  if (!data.companyName?.trim()) {
    return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: "LeaderAtende <onboarding@resend.dev>",
      to: NOTIFY_TO,
      subject: `Diagnóstico iniciado: ${data.companyName}`,
      html: `
        <div style="font-family:sans-serif;font-size:14px;color:#111;">
          <p>Alguém começou o diagnóstico e preencheu a Etapa 1:</p>
          <table cellspacing="0" cellpadding="0">
            ${row("Empresa", data.companyName)}
            ${row("Responsável", data.responsibleName)}
            ${row("Segmento", data.segment)}
            ${row("Cidade/região", data.city)}
            ${row("Site", data.website)}
            ${row("Instagram", data.instagram)}
            ${row("Facebook", data.facebook)}
            ${row("WhatsApp", data.whatsappBusiness)}
            ${row("Funcionários", data.employeeCount)}
            ${row("Estágio da empresa", data.companyStage)}
          </table>
          <p style="color:#6b7280;">Se a pessoa não terminar o quiz, esse pode ser o único contato que você recebe dela — vale um WhatsApp.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Step1 notify email failed:", err);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

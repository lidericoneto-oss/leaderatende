import type { Lead } from "@prisma/client";
import type { Classification, InstagramAnalysis, Pillar, Priority } from "@/types/lead";

export interface ReportPdfData {
  lead: Lead;
  pillars: Pillar[];
  priorities: Priority[];
  recommendations: string[];
  scoreGeneral: number;
  classification: Classification;
  classificationSummary: string;
  instagramAnalysis: InstagramAnalysis | null;
}

const INK: [number, number, number] = [19, 18, 17];
const INK_SOFT: [number, number, number] = [86, 80, 74];
const BRAND: [number, number, number] = [232, 115, 12];
const BORDER: [number, number, number] = [231, 227, 222];
const GREEN: [number, number, number] = [5, 150, 105];
const AMBER: [number, number, number] = [202, 138, 4];

function bandColor(score: number): [number, number, number] {
  if (score < 40) return [220, 38, 38];
  if (score < 60) return AMBER;
  if (score < 80) return [37, 99, 235];
  return GREEN;
}

function parseJsonArray(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function generateReportPdf(data: ReportPdfData) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const marginX = 20;
  const pageWidth = 210;
  const pageHeight = 297;
  const contentWidth = pageWidth - marginX * 2;
  let y = 20;

  function ensureSpace(needed: number) {
    if (y + needed > pageHeight - 18) {
      doc.addPage();
      y = 20;
    }
  }

  function addSectionTitle(text: string) {
    ensureSpace(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...INK);
    doc.text(text, marginX, y);
    y += 5;
    doc.setDrawColor(...BRAND);
    doc.setLineWidth(0.6);
    doc.line(marginX, y, marginX + contentWidth, y);
    y += 6;
  }

  function addText(
    text: string,
    opts?: { size?: number; color?: [number, number, number]; bold?: boolean }
  ) {
    const size = opts?.size ?? 10;
    doc.setFont("helvetica", opts?.bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...(opts?.color ?? INK_SOFT));
    const lines: string[] = doc.splitTextToSize(text, contentWidth);
    const lineHeight = size * 0.42;
    ensureSpace(lines.length * lineHeight + 2);
    doc.text(lines, marginX, y);
    y += lines.length * lineHeight + 3;
  }

  // Cabeçalho
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(...INK);
  doc.text("Diagnóstico de Marketing — LEADER", marginX, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...INK_SOFT);
  doc.text(data.lead.companyName, marginX, y);
  y += 10;

  // Resultado geral
  addSectionTitle("Resultado geral");
  addText(`${data.scoreGeneral}/100 — ${data.classification}`, {
    size: 14,
    bold: true,
    color: BRAND,
  });
  addText(data.classificationSummary);

  // Pilares
  addSectionTitle("Resultado por pilar");
  for (const pillar of data.pillars) {
    ensureSpace(15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...INK);
    doc.text(pillar.label, marginX, y);
    doc.setTextColor(...bandColor(pillar.score));
    doc.text(`${pillar.score}/100`, marginX + contentWidth, y, { align: "right" });
    y += 3.5;
    doc.setFillColor(...BORDER);
    doc.rect(marginX, y, contentWidth, 2, "F");
    doc.setFillColor(...bandColor(pillar.score));
    doc.rect(marginX, y, contentWidth * (pillar.score / 100), 2, "F");
    y += 5;
    addText(pillar.description, { size: 9.5 });
  }

  // Prioridades
  addSectionTitle("Principais oportunidades");
  data.priorities.forEach((priority) => {
    addText(`${priority.rank}. ${priority.title}`, { bold: true, color: INK, size: 10.5 });
    addText(priority.description, { size: 9.5 });
  });

  // Recomendações
  addSectionTitle("O que recomendamos mudar primeiro");
  data.recommendations.forEach((rec, i) => {
    addText(`${i + 1}. ${rec}`, { size: 10, color: INK });
  });

  // Análise do Instagram
  if (data.instagramAnalysis) {
    addSectionTitle("Análise do print do Instagram");
    addText(data.instagramAnalysis.summary, { bold: true, color: INK });
    if (data.instagramAnalysis.strengths.length > 0) {
      addText("Pontos fortes", { bold: true, size: 9.5, color: GREEN });
      data.instagramAnalysis.strengths.forEach((s) => addText(`• ${s}`, { size: 9.5 }));
    }
    if (data.instagramAnalysis.improvements.length > 0) {
      addText("Pontos de melhoria", { bold: true, size: 9.5, color: AMBER });
      data.instagramAnalysis.improvements.forEach((s) => addText(`• ${s}`, { size: 9.5 }));
    }
    if (data.instagramAnalysis.actionPlan.length > 0) {
      addText("Plano de ação imediato", { bold: true, size: 9.5, color: BRAND });
      data.instagramAnalysis.actionPlan.forEach((s, i) =>
        addText(`${i + 1}. ${s}`, { size: 9.5, color: INK })
      );
    }
  }

  // Respostas do questionário
  addSectionTitle("Respostas do questionário");
  const { lead } = data;
  const rows: [string, string][] = [
    ["Nome do responsável", lead.responsibleName],
    ["Segmento", lead.segment],
    ["Cidade/região", lead.city],
    ["Instagram", lead.instagram || "—"],
    ["Site", lead.website || "—"],
    ["WhatsApp", lead.whatsappBusiness],
    ["Funcionários", lead.employeeCount],
    ["Estágio da empresa", lead.companyStage],
    ["Canais utilizados", parseJsonArray(lead.channels).join(", ") || "—"],
    ["Responsável pelo marketing", lead.marketingResponsible],
    ["Frequência de publicação", lead.postFrequency],
    ["Investimento em anúncios", lead.adsInvestment],
    ["Objetivos", parseJsonArray(lead.objectives).join(", ") || "—"],
    ["Desafios", parseJsonArray(lead.challenges).join(", ") || "—"],
  ];
  rows.forEach(([label, value]) => {
    addText(`${label}: ${value}`, { size: 9.5 });
  });

  addText(
    `Autoavaliação (1-5): Profissionalismo ${lead.selfProfessionalism} · Clareza ${lead.selfClarity} · Diferenciação ${lead.selfDifferentiation} · Conversão em vendas ${lead.selfSalesConversion} · Estratégia ${lead.selfStrategy}`,
    { size: 9.5 }
  );

  const generatedAt = new Date().toLocaleDateString("pt-BR");
  const fileName = `diagnostico-${lead.companyName.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}.pdf`;

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...INK_SOFT);
    doc.text(
      `Gerado em ${generatedAt} — leaderatende.vercel.app`,
      marginX,
      pageHeight - 10
    );
  }

  doc.save(fileName);
}

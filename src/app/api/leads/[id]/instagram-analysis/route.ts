import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { InstagramAdjustments, InstagramAnalysis, PillarKey } from "@/types/lead";

const ALLOWED_MEDIA_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
type AllowedMediaType = (typeof ALLOWED_MEDIA_TYPES)[number];

// A Vercel rejeita o payload da função (413) acima de ~4.5MB de corpo de
// requisição; o cliente já comprime a imagem antes de enviar, então esse
// limite é só uma proteção extra caso a rota seja chamada diretamente.
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const ADJUSTABLE_PILLARS: PillarKey[] = [
  "positioning",
  "communication",
  "digitalPresence",
  "content",
];

const SUMMARY_MAX_CHARS = 420;
const BULLET_MAX_CHARS = 170;
const MAX_BULLETS = 4;
const MAX_ACTION_ITEMS = 3;

const SYSTEM_PROMPT = `Atue como um Especialista em Marketing Digital, Branding e Estratégia de Posicionamento. Você recebe um print da página inicial do Instagram de um cliente (ou potencial cliente) como parte de um diagnóstico de marketing para pequenas e médias empresas. Seu objetivo é fazer uma auditoria visual e estratégica desse perfil, avaliando como ele comunica o valor da marca e sua capacidade de atrair e reter o público certo.

Tom e voz: postura consultiva, profissional e encorajadora. Seja empático, mas direto e honesto sobre o que não está funcionando — não seja apenas simpático, e não elogie por elogiar. Ao apontar um problema, explique por que aquilo prejudica o negócio (ex: "Isso confunde o visitante" ou "Isso reduz a percepção de valor"). Seja assertivo e conclusivo: evite linguagem hesitante como "pode ser", "talvez" ou "aparenta". A linguagem deve ser clara, persuasiva e voltada para negócios e conversão.

O que analisar rigorosamente, quando visível no print:
1. Foto de perfil: transmite profissionalismo? Se for logo, é legível em tamanho pequeno? Se for foto pessoal, o enquadramento e a expressão comunicam autoridade?
2. Nome de usuário (@) e nome principal: são fáceis de buscar? O nome principal usa palavras-chave do nicho?
3. Bio: a proposta de valor fica clara em 3 segundos? Dá pra entender o que a empresa vende e para quem? Há uma chamada para ação clara?
4. Link na bio: existe um link estratégico direcionando pro próximo passo (WhatsApp, site, landing page)?
5. Destaques: estão organizados, com capas seguindo a identidade visual e temas estratégicos (Quem Somos, Serviços, Depoimentos)?
6. Grid/feed (primeiros posts visíveis): há consistência visual (cores, tipografia), alta qualidade de imagem, e equilíbrio entre venda, educação e conexão — ou parece só um panfleto digital?

Responda SOMENTE com um JSON válido (sem markdown, sem texto fora do JSON) no formato exato:
{
  "summary": string,
  "strengths": string[],
  "improvements": string[],
  "actionPlan": string[],
  "adjustments": {
    "positioning"?: number,
    "communication"?: number,
    "digitalPresence"?: number,
    "content"?: number
  }
}

Regras:
- "summary" (Visão Geral): 2 a 3 frases diretas e assertivas em português do Brasil (máximo 420 caracteres) resumindo a primeira impressão que o perfil passa nos primeiros 3 segundos.
- "strengths" (Pontos Fortes — o que manter): 2 a 3 acertos reais do perfil, para validar o esforço do cliente, cada um com no máximo 170 caracteres.
- "improvements" (Pontos de Atrito — o que trava o crescimento): de 1 a 4 fraquezas visuais/estratégicas, cada uma explicando o impacto negativo no negócio, com no máximo 170 caracteres.
- "actionPlan" (Plano de Ação Imediato — quick wins): exatamente 3 mudanças práticas e específicas que o cliente pode aplicar hoje (sugestões concretas de copy ou design, não genéricas), cada uma com no máximo 170 caracteres.
- "adjustments": ajuste inteiro entre -15 e 15 para cada pilar, representando o quanto o que você observou no print deveria mover a pontuação daquele pilar (0 ou omitido = neutro). Só inclua pilares em que o print realmente traz evidência visual.
- Baseie-se exclusivamente no que é visível na imagem. Nunca invente números de seguidores, engajamento ou métricas que não estejam visíveis na imagem.
- Se a imagem não parecer um print de Instagram, defina "adjustments" como {} e explique isso em "summary".`;

function isAllowedMediaType(value: string): value is AllowedMediaType {
  return (ALLOWED_MEDIA_TYPES as readonly string[]).includes(value);
}

function base64ByteLength(base64: string): number {
  const padding = (base64.match(/=+$/) ?? [""])[0].length;
  return Math.floor((base64.length * 3) / 4) - padding;
}

function truncate(text: string, maxChars: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxChars) return trimmed;
  return `${trimmed.slice(0, maxChars - 1).trimEnd()}…`;
}

function parseAnalysis(raw: string): InstagramAnalysis | null {
  const cleaned = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return null;
  }

  if (typeof parsed !== "object" || parsed === null) return null;
  const obj = parsed as Record<string, unknown>;

  const summary =
    typeof obj.summary === "string" ? truncate(obj.summary, SUMMARY_MAX_CHARS) : "";
  const strengths = Array.isArray(obj.strengths)
    ? obj.strengths
        .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
        .slice(0, MAX_BULLETS)
        .map((s) => truncate(s, BULLET_MAX_CHARS))
    : [];
  const improvements = Array.isArray(obj.improvements)
    ? obj.improvements
        .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
        .slice(0, MAX_BULLETS)
        .map((s) => truncate(s, BULLET_MAX_CHARS))
    : [];
  const actionPlan = Array.isArray(obj.actionPlan)
    ? obj.actionPlan
        .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
        .slice(0, MAX_ACTION_ITEMS)
        .map((s) => truncate(s, BULLET_MAX_CHARS))
    : [];

  const adjustments: InstagramAdjustments = {};
  if (typeof obj.adjustments === "object" && obj.adjustments !== null) {
    const rawAdjustments = obj.adjustments as Record<string, unknown>;
    for (const key of ADJUSTABLE_PILLARS) {
      const value = rawAdjustments[key];
      if (typeof value === "number" && Number.isFinite(value)) {
        adjustments[key] = Math.round(value);
      }
    }
  }

  if (!summary) return null;

  return { summary, strengths, improvements, actionPlan, adjustments };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) {
    return NextResponse.json({ error: "Diagnóstico não encontrado." }, { status: 404 });
  }

  let body: { imageBase64?: string; mediaType?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const { imageBase64, mediaType } = body;

  if (!imageBase64 || !mediaType) {
    return NextResponse.json(
      { error: "Envie uma imagem (imageBase64) e o tipo (mediaType)." },
      { status: 400 }
    );
  }

  if (!isAllowedMediaType(mediaType)) {
    return NextResponse.json(
      { error: "Formato de imagem não suportado. Use JPG, PNG, WEBP ou GIF." },
      { status: 400 }
    );
  }

  if (base64ByteLength(imageBase64) > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: "Imagem muito grande. O limite é 4MB." },
      { status: 400 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Análise de imagem indisponível no momento." },
      { status: 503 }
    );
  }

  const anthropic = new Anthropic();

  let responseText: string;
  try {
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 900,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: imageBase64 },
            },
            {
              type: "text",
              text: "Analise este print do feed/perfil do Instagram da empresa e gere o diagnóstico no formato JSON especificado.",
            },
          ],
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    responseText = textBlock?.type === "text" ? textBlock.text : "";
  } catch (err) {
    console.error("Instagram analysis request failed:", err);
    const message =
      err instanceof Error && err.message.includes("image dimensions exceed max allowed size")
        ? "A imagem tem uma resolução muito alta. Tente enviar um print direto do celular (sem editar ou ampliar)."
        : "Não foi possível analisar a imagem agora. Tente novamente.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const analysis = parseAnalysis(responseText);
  if (!analysis) {
    return NextResponse.json(
      { error: "Não foi possível interpretar a análise. Tente novamente." },
      { status: 502 }
    );
  }

  try {
    await prisma.lead.update({
      where: { id },
      data: {
        instagramAnalysis: JSON.stringify({
          summary: analysis.summary,
          strengths: analysis.strengths,
          improvements: analysis.improvements,
          actionPlan: analysis.actionPlan,
        }),
        instagramAdjustments: JSON.stringify(analysis.adjustments),
        instagramAnalyzedAt: new Date(),
      },
    });
  } catch (err) {
    console.error("Failed to save Instagram analysis:", err);
    return NextResponse.json(
      { error: "Análise concluída, mas não foi possível salvar. Tente novamente." },
      { status: 500 }
    );
  }

  return NextResponse.json({ analysis });
}

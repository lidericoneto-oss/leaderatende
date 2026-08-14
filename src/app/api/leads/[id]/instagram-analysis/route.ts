import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { InstagramAdjustments, InstagramAnalysis, PillarKey } from "@/types/lead";

const ALLOWED_MEDIA_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
type AllowedMediaType = (typeof ALLOWED_MEDIA_TYPES)[number];

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const ADJUSTABLE_PILLARS: PillarKey[] = [
  "positioning",
  "communication",
  "digitalPresence",
  "content",
];

const SYSTEM_PROMPT = `Você é um especialista em marketing digital que analisa prints de feed/perfil do Instagram como parte de um diagnóstico de marketing para pequenas e médias empresas.

Responda SOMENTE com um JSON válido (sem markdown, sem texto fora do JSON) no formato exato:
{
  "summary": string,
  "strengths": string[],
  "improvements": string[],
  "adjustments": {
    "positioning"?: number,
    "communication"?: number,
    "digitalPresence"?: number,
    "content"?: number
  }
}

Regras:
- "summary": 1-2 frases em português do Brasil resumindo a impressão geral do perfil.
- "strengths": de 1 a 4 pontos fortes observados visualmente (bullets curtos).
- "improvements": de 1 a 4 pontos de melhoria observados visualmente (bullets curtos).
- "adjustments": ajuste inteiro entre -15 e 15 para cada pilar, representando o quanto o que você observou no print deveria mover a pontuação daquele pilar (0 ou omitido = neutro). Só inclua pilares em que o print realmente traz evidência visual.
- Baseie-se exclusivamente no que é visível na imagem (identidade visual, grade de posts, qualidade e consistência do conteúdo, clareza da bio/comunicação, profissionalismo). Nunca invente números de seguidores, engajamento ou métricas que não estejam visíveis na imagem.
- Se a imagem não parecer um print de Instagram, defina "adjustments" como {} e explique isso em "summary".`;

function isAllowedMediaType(value: string): value is AllowedMediaType {
  return (ALLOWED_MEDIA_TYPES as readonly string[]).includes(value);
}

function base64ByteLength(base64: string): number {
  const padding = (base64.match(/=+$/) ?? [""])[0].length;
  return Math.floor((base64.length * 3) / 4) - padding;
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

  const summary = typeof obj.summary === "string" ? obj.summary : "";
  const strengths = Array.isArray(obj.strengths)
    ? obj.strengths.filter((s): s is string => typeof s === "string")
    : [];
  const improvements = Array.isArray(obj.improvements)
    ? obj.improvements.filter((s): s is string => typeof s === "string")
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

  return { summary, strengths, improvements, adjustments };
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
      { error: "Imagem muito grande. O limite é 5MB." },
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
      model: "claude-sonnet-5",
      max_tokens: 1024,
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

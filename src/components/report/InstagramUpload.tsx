"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { InstagramAnalysis } from "@/types/lead";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_BYTES = 15 * 1024 * 1024;
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.85;

// Redimensiona e recomprime como JPEG antes de enviar: prints de celular
// (sobretudo iPhone) costumam vir grandes o bastante para estourar o
// limite de payload das funções da Vercel (~4.5MB) depois de virar base64.
function compressImage(file: File): Promise<{ base64: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      URL.revokeObjectURL(objectUrl);

      if (!ctx) {
        reject(new Error("Canvas não suportado."));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
      resolve({ base64: dataUrl.split(",")[1] ?? "", mediaType: "image/jpeg" });
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Não foi possível processar a imagem."));
    };
    img.src = objectUrl;
  });
}

interface Props {
  leadId: string;
  initialAnalysis: InstagramAnalysis | null;
  whatsappHref: string;
}

export function InstagramUpload({ leadId, initialAnalysis, whatsappHref }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<InstagramAnalysis | null>(initialAnalysis);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Formato não suportado. Use JPG, PNG, WEBP ou GIF.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError("Imagem muito grande. O limite é 15MB.");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setLoading(true);

    try {
      const { base64: imageBase64, mediaType } = await compressImage(file);

      if (imageBase64.length > 4 * 1024 * 1024) {
        setError(
          "Não foi possível reduzir a imagem o suficiente para enviar. Tente um print menos detalhado."
        );
        return;
      }

      const res = await fetch(`/api/leads/${leadId}/instagram-analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, mediaType }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível analisar a imagem.");
        return;
      }

      setAnalysis(data.analysis);
      router.refresh();
    } catch {
      setError("Não foi possível analisar a imagem. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-16">
      <h2 className="text-lg font-semibold text-ink">
        Análise do seu print do Instagram
      </h2>
      <p className="mt-2 max-w-xl text-sm text-ink-soft">
        Envie um print do seu feed ou perfil do Instagram e receba uma análise
        visual complementar ao diagnóstico.
      </p>

      {analysis && !loading ? (
        <div className="mt-5 rounded-2xl border-2 border-brand/40 bg-brand-light p-6 sm:p-7">
          <p className="text-xs font-semibold tracking-wide text-brand uppercase">
            Análise do seu Instagram
          </p>
          <p className="mt-2 text-base font-semibold text-ink">{analysis.summary}</p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {analysis.strengths.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-estruturado uppercase">
                  Pontos fortes
                </p>
                <ul className="mt-1.5 space-y-1">
                  {analysis.strengths.map((s) => (
                    <li key={s} className="text-sm text-ink-soft">
                      • {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.improvements.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-melhorar uppercase">
                  Pontos de melhoria
                </p>
                <ul className="mt-1.5 space-y-1">
                  {analysis.improvements.map((s) => (
                    <li key={s} className="text-sm text-ink-soft">
                      • {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {analysis.actionPlan.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-semibold text-brand uppercase">
                Plano de ação imediato
              </p>
              <ol className="mt-2 space-y-2">
                {analysis.actionPlan.map((item, i) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-lg bg-surface p-3"
                  >
                    <span className="text-sm font-bold text-brand">
                      {i + 1}
                    </span>
                    <span className="text-sm text-ink">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand/90"
          >
            Falar com um especialista
          </a>
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-border bg-surface p-5">
          <div className="flex flex-col items-start gap-4 sm:flex-row">
            {preview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Prévia do print enviado"
                className="h-32 w-32 shrink-0 rounded-lg border border-border object-cover"
              />
            )}

            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                onChange={handleFileChange}
                disabled={loading}
                className="hidden"
                id="instagram-print-input"
              />
              <label
                htmlFor="instagram-print-input"
                className={`inline-flex cursor-pointer items-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand/90 ${
                  loading ? "pointer-events-none opacity-60" : ""
                }`}
              >
                {loading ? "Analisando..." : "Enviar print do Instagram"}
              </label>

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

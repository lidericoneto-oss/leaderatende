"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { InstagramAnalysis } from "@/types/lead";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_BYTES = 5 * 1024 * 1024;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

interface Props {
  leadId: string;
  initialAnalysis: InstagramAnalysis | null;
}

export function InstagramUpload({ leadId, initialAnalysis }: Props) {
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
      setError("Imagem muito grande. O limite é 5MB.");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setLoading(true);

    try {
      const imageBase64 = await fileToBase64(file);
      const res = await fetch(`/api/leads/${leadId}/instagram-analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, mediaType: file.type }),
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
              className={`inline-flex cursor-pointer items-center rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand ${
                loading ? "pointer-events-none opacity-60" : ""
              }`}
            >
              {loading
                ? "Analisando..."
                : analysis
                  ? "Enviar outro print"
                  : "Enviar print do Instagram"}
            </label>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            {analysis && !loading && (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-ink">{analysis.summary}</p>

                {analysis.strengths.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-estruturado uppercase">
                      Pontos fortes
                    </p>
                    <ul className="mt-1 space-y-1">
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
                    <ul className="mt-1 space-y-1">
                      {analysis.improvements.map((s) => (
                        <li key={s} className="text-sm text-ink-soft">
                          • {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

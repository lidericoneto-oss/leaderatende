"use client";

import { useState } from "react";
import { generateReportPdf, type ReportPdfData } from "@/lib/pdfReport";

interface Props {
  data: ReportPdfData;
}

export function DownloadPdfButton({ data }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await generateReportPdf(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="w-full rounded-lg border border-border px-7 py-3 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand disabled:opacity-60 sm:w-auto"
    >
      {loading ? "Gerando PDF..." : "Baixar relatório em PDF"}
    </button>
  );
}

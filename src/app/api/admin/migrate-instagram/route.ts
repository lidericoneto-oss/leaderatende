import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Rota temporária: aplica manualmente as colunas da migração
// 20260813190800_add_instagram_analysis em produção (DATABASE_URL é uma
// variável "Sensitive" na Vercel e não pode ser lida no dashboard). Remover
// esta rota assim que a migração for confirmada.
export async function POST(request: NextRequest) {
  const token = request.headers.get("x-migration-token");
  if (!token || token !== process.env.MIGRATION_TOKEN) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  await prisma.$executeRawUnsafe(`
    ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "instagramAnalysis" TEXT,
    ADD COLUMN IF NOT EXISTS "instagramAdjustments" TEXT,
    ADD COLUMN IF NOT EXISTS "instagramAnalyzedAt" TIMESTAMP(3);
  `);

  const rows = await prisma.$queryRawUnsafe<{ column_name: string }[]>(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name IN
      ('instagramAnalysis', 'instagramAdjustments', 'instagramAnalyzedAt');
  `);

  return NextResponse.json({ ok: true, columns: rows.map((r) => r.column_name) });
}

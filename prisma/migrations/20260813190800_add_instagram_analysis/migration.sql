-- AlterTable
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "instagramAnalysis" TEXT,
ADD COLUMN IF NOT EXISTS "instagramAdjustments" TEXT,
ADD COLUMN IF NOT EXISTS "instagramAnalyzedAt" TIMESTAMP(3);

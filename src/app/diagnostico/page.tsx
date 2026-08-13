"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProgressBar } from "@/components/ProgressBar";
import { ProcessingScreen } from "@/components/ProcessingScreen";
import { STEP_TITLES, TOTAL_STEPS } from "@/lib/quiz-data";
import { isValidEmail, isValidPhone } from "@/lib/validation";
import type { QuizData } from "@/types/lead";
import { Step1Company } from "./_steps/Step1Company";
import { Step2Digital } from "./_steps/Step2Digital";
import { Step3Objectives } from "./_steps/Step3Objectives";
import { Step4Challenges } from "./_steps/Step4Challenges";
import { Step5SelfAssessment } from "./_steps/Step5SelfAssessment";
import { Step6Contact } from "./_steps/Step6Contact";

const DRAFT_KEY = "leadatende_quiz_draft_v1";

const INITIAL_DATA: QuizData = {
  companyName: "",
  responsibleName: "",
  segment: "",
  city: "",
  website: "",
  instagram: "",
  facebook: "",
  whatsappBusiness: "",
  employeeCount: "",
  companyStage: "",
  channels: [],
  marketingResponsible: "",
  postFrequency: "",
  adsInvestment: "",
  objectives: [],
  successDefinition: "",
  challenges: [],
  selfProfessionalism: 0,
  selfClarity: 0,
  selfDifferentiation: 0,
  selfSalesConversion: 0,
  selfStrategy: 0,
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  consent: false,
};

function validateStep(step: number, data: QuizData): boolean {
  switch (step) {
    case 0:
      return !!(
        data.companyName.trim() &&
        data.responsibleName.trim() &&
        data.segment.trim() &&
        data.city.trim() &&
        data.whatsappBusiness.trim() &&
        data.employeeCount &&
        data.companyStage
      );
    case 1:
      return !!(
        data.channels.length > 0 &&
        data.marketingResponsible &&
        data.postFrequency &&
        data.adsInvestment
      );
    case 2:
      return data.objectives.length > 0;
    case 3:
      return data.challenges.length > 0;
    case 4:
      return !!(
        data.selfProfessionalism &&
        data.selfClarity &&
        data.selfDifferentiation &&
        data.selfSalesConversion &&
        data.selfStrategy
      );
    case 5:
      return !!(
        data.contactName.trim() &&
        isValidEmail(data.contactEmail) &&
        isValidPhone(data.contactPhone) &&
        data.consent
      );
    default:
      return false;
  }
}

export default function DiagnosticoPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<QuizData>(INITIAL_DATA);
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [leadId, setLeadId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // localStorage só existe no client; ler aqui (em vez de no lazy initializer do
    // useState) evita divergência entre o HTML renderizado no servidor e o do client.
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setData({ ...INITIAL_DATA, ...JSON.parse(raw) });
      } catch {
        // draft corrompido, ignora
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    }
  }, [data, hydrated]);

  function update(patch: Partial<QuizData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  async function handleNext() {
    if (!validateStep(step, data)) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);

    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) {
        setSubmitError(body.error || "Não foi possível enviar suas respostas.");
        setSubmitting(false);
        return;
      }
      setLeadId(body.id);
      localStorage.removeItem(DRAFT_KEY);
      setProcessing(true);
    } catch {
      setSubmitError(
        "Não foi possível enviar suas respostas. Verifique sua conexão e tente novamente."
      );
      setSubmitting(false);
    }
  }

  function handleBack() {
    setShowErrors(false);
    setStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (processing && leadId) {
    return (
      <ProcessingScreen onComplete={() => router.push(`/relatorio/${leadId}`)} />
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-5 py-10 sm:py-16">
      <Link href="/" className="text-sm font-semibold text-brand">
        LeaderAtende
      </Link>

      <div className="mt-8">
        <ProgressBar
          currentStep={step + 1}
          totalSteps={TOTAL_STEPS}
          stepTitle={STEP_TITLES[step]}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-7">
        {step === 0 && <Step1Company data={data} update={update} />}
        {step === 1 && <Step2Digital data={data} update={update} />}
        {step === 2 && <Step3Objectives data={data} update={update} />}
        {step === 3 && <Step4Challenges data={data} update={update} />}
        {step === 4 && <Step5SelfAssessment data={data} update={update} />}
        {step === 5 && (
          <Step6Contact data={data} update={update} showErrors={showErrors} />
        )}
      </div>

      {showErrors && (
        <p className="mt-4 text-sm text-critico">
          Preencha os campos obrigatórios antes de avançar.
        </p>
      )}
      {submitError && (
        <p className="mt-4 text-sm text-critico">{submitError}</p>
      )}

      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 0 || submitting}
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink-soft transition hover:text-ink disabled:opacity-0"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={submitting}
          className="rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand/90 disabled:opacity-60"
        >
          {submitting
            ? "Enviando..."
            : step === TOTAL_STEPS - 1
              ? "Ver meu diagnóstico"
              : "Avançar"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, Loader2, RefreshCw, ShieldCheck } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { btnPrimary } from "@/components/ui/Field";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { createSymptomCheck, listSymptomHistory, listSymptomVocabulary, type ApiSymptom, type ApiSymptomCheck } from "@/lib/api";
import { formatDate } from "@/lib/dates";

type LoadState = { status: "loading" | "ready" | "error"; error: string | null };

export default function SymptomCheckerPage() {
  const [vocabulary, setVocabulary] = useState<ApiSymptom[]>([]);
  const [history, setHistory] = useState<ApiSymptomCheck[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("low");
  const [durationDays, setDurationDays] = useState(1);
  const [result, setResult] = useState<ApiSymptomCheck | null>(null);
  const [vocabularyState, setVocabularyState] = useState<LoadState>({ status: "loading", error: null });
  const [historyState, setHistoryState] = useState<LoadState>({ status: "loading", error: null });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setVocabularyState({ status: "loading", error: null });
    setHistoryState({ status: "loading", error: null });
    const [vocabularyResponse, historyResponse] = await Promise.allSettled([
      listSymptomVocabulary(),
      listSymptomHistory(),
    ]);
    if (vocabularyResponse.status === "fulfilled") {
      setVocabulary(vocabularyResponse.value.symptoms);
      setVocabularyState({ status: "ready", error: null });
    } else {
      setVocabulary([]);
      setVocabularyState({
        status: "error",
        error: vocabularyResponse.reason instanceof Error ? vocabularyResponse.reason.message : "Could not load symptoms.",
      });
    }
    if (historyResponse.status === "fulfilled") {
      setHistory(historyResponse.value.items);
      setHistoryState({ status: "ready", error: null });
    } else {
      setHistory([]);
      setHistoryState({
        status: "error",
        error: historyResponse.reason instanceof Error ? historyResponse.reason.message : "Could not load symptom history.",
      });
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadData(), 0);
    return () => window.clearTimeout(timeout);
  }, [loadData]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selected.length || selected.length > 15 || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    setResult(null);
    try {
      const response = await createSymptomCheck({ symptoms: selected, severity, durationDays });
      setResult(response.result);
      setHistory((previous) => [response.result, ...previous]);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not check these symptoms.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stagger className="mx-auto w-full max-w-[1000px] space-y-5">
      <StaggerItem>
        <PageHeader icon={<Activity size={22} />} title="Symptom checker" subtitle="Submit symptoms to the CareTwin service and review checks saved to your account." />
      </StaggerItem>

      <StaggerItem>
        <div className="flex gap-3 rounded-lg border border-[#d9eee3] bg-[#f0fbf5] px-4 py-3">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#15965d]" />
          <p className="text-[13px] leading-5 text-[#4f7c67]">This service provides general guidance, not a diagnosis. In an emergency, contact local emergency services.</p>
        </div>
      </StaggerItem>

      <StaggerItem>
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <form onSubmit={(event) => void submit(event)} className="space-y-5 rounded-xl border border-line bg-white p-5 sm:p-6">
            <div>
              <h2 className="text-[15px] font-bold text-ink">What are you experiencing?</h2>
              <p className="mt-1 text-[13px] text-mute">Select up to 15 symptoms from the CareTwin vocabulary.</p>
            </div>
            {vocabularyState.status === "loading" ? (
              <div className="ct-skeleton h-32 rounded-lg" />
            ) : vocabularyState.status === "error" ? (
              <div role="alert" className="rounded-lg bg-danger-soft p-3 text-sm text-danger">
                <p>{vocabularyState.error}</p>
                <button type="button" onClick={() => void loadData()} className="mt-2 font-semibold underline">Retry loading symptoms</button>
              </div>
            ) : vocabulary.length === 0 ? (
              <p className="rounded-lg bg-[#f8f9fc] p-4 text-sm text-mute">No symptom options are currently available from the backend.</p>
            ) : (
              <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto">
                {vocabulary.map((symptom) => {
                  const checked = selected.includes(symptom.id);
                  return (
                    <label key={symptom.id} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-[13px] ${checked ? "border-brand bg-brand-soft font-semibold text-brand" : "border-[#e5e9f0] text-body"}`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={!checked && selected.length >= 15}
                        onChange={() => setSelected((previous) => checked ? previous.filter((id) => id !== symptom.id) : [...previous, symptom.id])}
                        className="accent-[#0878b8]"
                      />
                      {symptom.label}
                    </label>
                  );
                })}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-[13px] font-semibold text-[#374151]">
                Severity
                <select value={severity} onChange={(event) => setSeverity(event.target.value as typeof severity)} className="mt-1.5 h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-sm font-normal text-ink">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
              <label className="text-[13px] font-semibold text-[#374151]">
                Duration (days)
                <input type="number" min={0} max={3650} value={durationDays} onChange={(event) => setDurationDays(Math.min(3650, Math.max(0, Number(event.target.value))))} className="mt-1.5 h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-sm font-normal text-ink" />
              </label>
            </div>
            {submitError && <p role="alert" className="text-sm text-danger">{submitError}</p>}
            <button type="submit" disabled={!selected.length || vocabularyState.status !== "ready" || submitting} className={`${btnPrimary} w-full justify-center disabled:opacity-50`}>
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? "Checking with CareTwin…" : "Check symptoms"}
            </button>
          </form>

          <section className="space-y-4 rounded-xl border border-line bg-white p-5 sm:p-6" aria-live="polite">
            <div>
              <h2 className="text-[15px] font-bold text-ink">CareTwin result</h2>
              <p className="mt-1 text-[13px] text-mute">Results appear after a successful backend check.</p>
            </div>
            {submitting ? (
              <div className="ct-skeleton h-32 rounded-lg" />
            ) : result ? (
              <div className="space-y-3 rounded-lg bg-[#f8f9fc] p-4">
                <p className="text-xs font-semibold text-mute">Urgency</p>
                <p className="text-lg font-bold capitalize text-ink">{result.urgency}</p>
                {result.recommendedSpecialty && (
                  <p className="text-sm text-body">Recommended specialty: <span className="font-semibold">{result.recommendedSpecialty}</span></p>
                )}
                <p className="text-xs text-mute">Saved {formatDate(result.createdAt)}</p>
              </div>
            ) : (
              <p className="rounded-lg bg-[#f8f9fc] p-5 text-sm text-mute">No symptom check result yet.</p>
            )}

            <div className="border-t border-line pt-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-ink">Recent checks</h3>
                <button type="button" onClick={() => void loadData()} aria-label="Refresh symptom history" className="rounded p-1 text-mute hover:bg-slate-100"><RefreshCw size={15} /></button>
              </div>
              {historyState.status === "loading" ? (
                <p className="mt-3 text-sm text-mute">Loading history…</p>
              ) : historyState.status === "error" ? (
                <p role="alert" className="mt-3 text-sm text-danger">{historyState.error}</p>
              ) : history.length === 0 ? (
                <p className="mt-3 text-sm text-mute">No symptom checks are saved yet.</p>
              ) : (
                <ul className="mt-3 divide-y divide-line">
                  {history.slice(0, 5).map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                      <span className="capitalize font-semibold text-ink">{item.urgency}</span>
                      <span className="text-xs text-mute">{formatDate(item.createdAt)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </StaggerItem>
    </Stagger>
  );
}

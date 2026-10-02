"use client";

import { useState } from "react";
import { Search, Plus, X, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { COMMON_SYMPTOMS } from "@/lib/analyze";

export default function SymptomInput({
  symptoms,
  setSymptoms,
  onAnalyze,
  loading,
}: {
  symptoms: string[];
  setSymptoms: (s: string[]) => void;
  onAnalyze: () => void;
  loading: boolean;
}) {
  const [input, setInput] = useState("");

  const addSymptom = (symptom: string) => {
    const value = symptom.trim();
    if (!value || symptoms.some((s) => s.toLowerCase() === value.toLowerCase())) return;
    setSymptoms([...symptoms, value]);
    setInput("");
  };

  return (
    <section className="rounded-xl border border-[#e3e7ef] bg-white p-5 sm:p-6">
      <h2 className="text-[15px] font-bold text-ink">What are you experiencing?</h2>
      <p className="mt-1 text-[13px] text-mute">Add one or more symptoms you are having right now.</p>

      <form
        className="relative mt-5"
        onSubmit={(e) => {
          e.preventDefault();
          addSymptom(input);
        }}
      >
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Type a symptom"
          placeholder="Type a symptom and press Enter"
          className="h-12 w-full rounded-lg border border-[#dfe4ec] bg-[#fafbfc] pl-10 pr-14 text-sm text-ink outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15"
        />
        <button type="submit" aria-label="Add symptom" className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md bg-brand text-white hover:bg-brand-dark">
          <Plus size={16} />
        </button>
      </form>

      <AnimatePresence initial={false}>
        {symptoms.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <p className="mt-5 text-xs font-semibold text-mute">Selected symptoms</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <AnimatePresence>
                {symptoms.map((symptom) => (
                  <motion.span
                    key={symptom}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1.5 rounded-full bg-[#eaf5fb] py-1.5 pl-3 pr-2 text-[13px] font-medium text-brand"
                  >
                    {symptom}
                    <button type="button" aria-label={`Remove ${symptom}`} onClick={() => setSymptoms(symptoms.filter((s) => s !== symptom))} className="rounded-full p-0.5 hover:bg-white">
                      <X size={13} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-6 text-xs font-semibold text-mute">Common symptoms</p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {COMMON_SYMPTOMS.map((symptom) => {
          const on = symptoms.some((s) => s.toLowerCase() === symptom.toLowerCase());
          return (
            <button
              key={symptom}
              type="button"
              aria-pressed={on}
              onClick={() => (on ? setSymptoms(symptoms.filter((s) => s.toLowerCase() !== symptom.toLowerCase())) : addSymptom(symptom))}
              className={`rounded-lg border px-3 py-2.5 text-left text-[13px] transition ${
                on ? "border-brand bg-brand-soft font-semibold text-brand" : "border-[#e5e9f0] text-body hover:border-brand hover:bg-[#f5fbfe]"
              }`}
            >
              {on ? "✓" : "+"} {symptom}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onAnalyze}
        disabled={symptoms.length === 0 || loading}
        className="mt-7 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand text-sm font-semibold text-white transition hover:bg-brand-dark active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? "Analyzing…" : "Analyze symptoms"}
      </button>
      {symptoms.length === 0 && <p className="mt-2 text-center text-xs text-mute">Add at least one symptom to continue.</p>}
    </section>
  );
}

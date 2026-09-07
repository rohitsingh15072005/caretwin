"use client";

import { useState } from "react";
import { Search, Plus, X } from "lucide-react";

const commonSymptoms = [
  "Headache",
  "Fever",
  "Cough",
  "Fatigue",
  "Nausea",
  "Sore throat",
];

export default function SymptomInput() {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const addSymptom = (symptom: string) => {
    const value = symptom.trim();

    if (!value || symptoms.includes(value)) return;

    setSymptoms([...symptoms, value]);
    setInput("");
  };

  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter((item) => item !== symptom));
  };

  return (
    <section className="rounded-xl border border-[#e3e7ef] bg-white p-6">

      <div>
        <h2 className="text-sm font-bold text-[#111827]">
          What are you experiencing?
        </h2>

        <p className="mt-1 text-[10px] text-[#8b95a7]">
          Add one or more symptoms that you are currently experiencing.
        </p>
      </div>

      {/* Search */}
      <div className="relative mt-5">

        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
        />

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addSymptom(input);
            }
          }}
          placeholder="Type a symptom..."
          className="h-11 w-full rounded-lg border border-[#dfe4ec] bg-[#fafbfc] pl-10 pr-12 text-xs text-[#111827] outline-none transition focus:border-[#0878b8]"
        />

        <button
          type="button"
          onClick={() => addSymptom(input)}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md bg-[#0878b8] text-white hover:bg-[#06699f]"
        >
          <Plus size={15} />
        </button>

      </div>

      {/* Selected Symptoms */}
      {symptoms.length > 0 && (
        <div className="mt-5">

          <p className="text-[9px] font-semibold uppercase tracking-wide text-[#8b95a7]">
            Selected Symptoms
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {symptoms.map((symptom) => (
              <div
                key={symptom}
                className="flex items-center gap-1.5 rounded-full bg-[#eaf5fb] px-3 py-1.5 text-[9px] font-medium text-[#0878b8]"
              >
                {symptom}

                <button
                  type="button"
                  onClick={() => removeSymptom(symptom)}
                  className="hover:text-[#075b89]"
                >
                  <X size={11} />
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Common Symptoms */}
      <div className="mt-6">

        <p className="text-[9px] font-semibold uppercase tracking-wide text-[#8b95a7]">
          Common Symptoms
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {commonSymptoms.map((symptom) => (
            <button
              key={symptom}
              type="button"
              onClick={() => addSymptom(symptom)}
              className="rounded-lg border border-[#e5e9f0] px-3 py-2.5 text-left text-[9px] text-[#4b5563] transition hover:border-[#0878b8] hover:bg-[#f5fbfe]"
            >
              + {symptom}
            </button>
          ))}
        </div>

      </div>

      {/* Analyze */}
      <button
        type="button"
        className="mt-7 flex h-10 w-full items-center justify-center rounded-lg bg-[#0878b8] text-xs font-semibold text-white transition hover:bg-[#06699f]"
      >
        Analyze Symptoms
      </button>

    </section>
  );
}
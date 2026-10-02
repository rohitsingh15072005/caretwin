"use client";

import { Brain, ShieldCheck, Stethoscope, PhoneCall, Clock, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { Analysis } from "@/lib/analyze";
import { SITE } from "@/lib/site";

const urgencyUI = {
  emergency: { label: "Seek emergency care now", bg: "bg-danger-soft", text: "text-danger", ring: "border-[#f3b5b5]" },
  soon: { label: "See a doctor soon", bg: "bg-[#fff6e5]", text: "text-[#b7791f]", ring: "border-[#f0dfc1]" },
  routine: { label: "Monitor and rest", bg: "bg-mint-soft", text: "text-[#15965d]", ring: "border-[#d9eee3]" },
};

export default function AnalysisPanel({ result, loading }: { result: Analysis | null; loading: boolean }) {
  return (
    <section className="rounded-xl border border-[#e3e7ef] bg-white p-5 sm:p-6" aria-live="polite">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eaf5fb] text-brand">
          <Brain size={19} />
        </div>
        <div>
          <h2 className="text-[15px] font-bold text-ink">AI analysis</h2>
          <p className="text-xs text-[#9ca3af]">{result ? "Based on the symptoms you entered" : "Your analysis will appear here"}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-6 space-y-3">
            <div className="ct-skeleton h-16 rounded-xl" />
            <div className="ct-skeleton h-4 w-3/4 rounded" />
            <div className="ct-skeleton h-4 w-full rounded" />
            <div className="ct-skeleton h-4 w-2/3 rounded" />
          </motion.div>
        ) : result ? (
          <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5 space-y-5">
            <div className={`rounded-xl border p-4 ${urgencyUI[result.urgency].bg} ${urgencyUI[result.urgency].ring}`}>
              <p className={`flex items-center gap-2 text-sm font-bold ${urgencyUI[result.urgency].text}`}>
                <Clock size={16} /> {urgencyUI[result.urgency].label}
              </p>
              <p className="mt-1.5 text-[13px] leading-5 text-body">{result.summary}</p>
              {result.urgency === "emergency" && (
                <a href={`tel:${SITE.emergencyNumber}`} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-danger px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#cf3a3f]">
                  <PhoneCall size={16} /> Call {SITE.emergencyNumber}
                </a>
              )}
            </div>

            <div>
              <h3 className="text-xs font-semibold text-mute">Possible causes</h3>
              <ul className="mt-2 space-y-2">
                {result.possible.map((p, i) => (
                  <motion.li key={p.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }} className="rounded-lg bg-[#f8f9fc] p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-ink">{p.name}</p>
                      <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-brand">{p.likelihood}</span>
                    </div>
                    <p className="mt-1 text-[13px] leading-5 text-mute">{p.note}</p>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 rounded-lg bg-[#f5f7fb] p-3">
              <Stethoscope size={17} className="mt-0.5 shrink-0 text-brand" />
              <div>
                <p className="text-[13px] font-semibold text-[#374151]">Suggested specialist</p>
                <p className="text-[13px] text-mute">{result.specialty}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-mute">What you can do</h3>
              <ul className="mt-2 space-y-2">
                {result.advice.map((a) => (
                  <li key={a} className="flex gap-2.5 text-[13px] leading-5 text-body">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#15965d]" /> {a}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs leading-5 text-mute">This is a demo analysis that runs on your device and is not a diagnosis.</p>
          </motion.div>
        ) : (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mt-6 rounded-xl bg-[#f8f9fc] p-6 text-center">
              <Brain size={30} className="mx-auto text-[#c7cfdd]" />
              <p className="mt-3 text-sm font-semibold text-[#4b5563]">Ready to analyze</p>
              <p className="mt-1 text-[13px] leading-5 text-[#9ca3af]">Add your symptoms and select Analyze symptoms to get personalized guidance.</p>
            </div>
            <div className="mt-5 flex gap-3 rounded-lg bg-[#f0fbf5] p-3">
              <ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#15965d]" />
              <div>
                <p className="text-[13px] font-semibold text-[#176344]">Your data stays on this device</p>
                <p className="mt-0.5 text-xs leading-5 text-[#5d806f]">Nothing you enter here is sent to a server in this version.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

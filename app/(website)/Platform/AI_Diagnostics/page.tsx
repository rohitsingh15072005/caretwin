import Link from "next/link";
import { ClipboardCheck, History, Stethoscope, PhoneCall, Check, X } from "lucide-react";
import PageHero from "@/components/website/PageHero";
import CtaBand from "@/components/website/CtaBand";
import { Reveal } from "@/components/ui/Motion";

export const metadata = { title: "AI Diagnostics" };

const steps = [
  { icon: ClipboardCheck, title: "Describe how you feel", text: "Pick from common symptoms or type your own. Add as many as you like." },
  { icon: History, title: "We check your history", text: "Allergies, conditions and recent records are taken into account." },
  { icon: Stethoscope, title: "Get clear guidance", text: "See possible causes, how urgent it may be and which specialist to consider." },
  { icon: PhoneCall, title: "Escalate when needed", text: "Warning signs such as chest pain trigger an immediate prompt to call emergency services." },
];

const can = ["Explain what common symptoms often mean", "Suggest how urgently to seek care", "Point to a suitable specialist", "Flag warning signs that need emergency help"];
const cannot = ["Diagnose a condition", "Prescribe or change medication", "Replace a doctor's examination", "Handle emergencies on its own"];

export default function AiDiagnosticsPage() {
  return (
    <>
      <PageHero title="AI diagnostics, built for clarity" subtitle="Understand your symptoms in plain language and know what to do next. Always as guidance, never as a replacement for a clinician." />

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <Reveal>
          <h2 className="text-center text-3xl font-bold text-slate-900">How it works</h2>
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700"><s.icon size={22} /></span>
                <p className="mt-1 text-xs font-semibold text-slate-400">Step {i + 1}</p>
                <h3 className="mt-2 text-lg font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{s.text}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section className="bg-[#F5F7FF] px-5 py-16 sm:px-8 sm:py-20">
        <Reveal className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-7">
            <h3 className="text-xl font-bold text-slate-900">What it can do</h3>
            <ul className="mt-4 space-y-3">
              {can.map((c) => (
                <li key={c} className="flex gap-3 text-slate-600"><Check size={20} className="mt-0.5 shrink-0 text-green-600" />{c}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-7">
            <h3 className="text-xl font-bold text-slate-900">What it cannot do</h3>
            <ul className="mt-4 space-y-3">
              {cannot.map((c) => (
                <li key={c} className="flex gap-3 text-slate-600"><X size={20} className="mt-0.5 shrink-0 text-red-500" />{c}</li>
              ))}
            </ul>
          </div>
        </Reveal>
        <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-slate-500">
          If you think you are having a medical emergency, call your local emergency number straight away. In India that is 112.
        </p>
        <div className="mt-8 text-center">
          <Link href="/signup" className="inline-block rounded-xl bg-cyan-700 px-8 py-3.5 font-semibold text-white transition hover:bg-cyan-800">Try the symptom checker</Link>
        </div>
      </section>
      <div className="pt-16"><CtaBand /></div>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, FileText, MessageCircle, Users, QrCode, ClipboardList, LineChart } from "lucide-react";
import { Reveal } from "@/components/ui/Motion";

export default function Features() {
  return (
    <section className="bg-[#F5F7FF] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-5xl">Precision intelligence features</h2>
          <p className="mt-5 text-lg text-slate-500 sm:text-xl">Every feature is designed with clinical accuracy and real empathy for the people using it.</p>
        </Reveal>

        <Reveal>
          <div className="grid gap-6 md:grid-cols-12">
            <article className="flex flex-col justify-between gap-8 rounded-3xl bg-white p-7 shadow-sm sm:p-8 md:col-span-8 md:flex-row md:items-center">
              <div className="max-w-sm">
                <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700"><ShieldCheck size={26} /></span>
                <h3 className="mt-6 text-2xl font-bold text-slate-800 sm:text-3xl">AI Symptom Checker</h3>
                <p className="mt-4 leading-8 text-slate-500">Spot patterns before they become problems. Symptoms are checked against your own history and general medical knowledge.</p>
                <Link href="/Platform/AI_Diagnostics" className="mt-6 inline-block font-semibold text-cyan-600 hover:underline">Learn how it works</Link>
              </div>
              <Image src="/images/Features_image.png" alt="AI Symptom Checker preview" width={1443} height={1090} sizes="(min-width: 768px) 360px, 100vw" className="w-full rounded-2xl md:w-[340px] lg:w-[360px]" />
            </article>

            <article className="rounded-3xl bg-[#005D95] p-7 text-white sm:p-8 md:col-span-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20"><FileText size={26} /></span>
              <h3 className="mt-6 text-2xl font-bold sm:text-3xl">Medical record management</h3>
              <p className="mt-4 leading-8 text-cyan-100">One hub for your whole history, filtered by the past 1, 3, 4, 6 or 12 months and shown as a timeline.</p>
              <p className="mt-10 font-semibold text-cyan-200">Private by design</p>
            </article>

            <article className="rounded-3xl bg-white p-7 shadow-sm sm:p-8 md:col-span-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 text-green-700"><MessageCircle size={26} /></span>
              <h3 className="mt-6 text-2xl font-bold text-slate-800 sm:text-3xl">AI health assistant</h3>
              <p className="mt-4 leading-8 text-slate-500">A 24/7 partner for wellness guidance, lab-result explanations and preventive advice.</p>
            </article>

            <article className="rounded-3xl bg-[#E9EEFF] p-7 sm:p-10 md:col-span-8">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-cyan-700"><LineChart size={26} /></span>
              <h3 className="mt-6 text-2xl font-bold text-cyan-700 sm:text-3xl">Predictive modeling</h3>
              <p className="mt-4 max-w-2xl leading-8 text-slate-600">Preview the impact of lifestyle changes on your Health Twin before making them in real life.</p>
            </article>

            {[
              { icon: Users, title: "Family records", text: "Add parents, partners and children. Switch between members in one tap.", tone: "bg-orange-100 text-orange-700" },
              { icon: QrCode, title: "Emergency QR card", text: "Blood group, allergies and contacts on a card responders can scan.", tone: "bg-red-100 text-red-700" },
              { icon: ClipboardList, title: "Period summaries", text: "Get a plain-language summary of the last 4 or 6 months of reports.", tone: "bg-indigo-100 text-indigo-700" },
            ].map((f) => (
              <article key={f.title} className="rounded-3xl bg-white p-7 shadow-sm sm:p-8 md:col-span-4">
                <span className={`flex h-14 w-14 items-center justify-center rounded-xl ${f.tone}`}><f.icon size={26} /></span>
                <h3 className="mt-6 text-2xl font-bold text-slate-800">{f.title}</h3>
                <p className="mt-3 leading-7 text-slate-500">{f.text}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

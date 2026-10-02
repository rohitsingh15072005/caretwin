"use client";

import { useMemo, useState } from "react";
import { Search, Rocket, ShieldCheck, Leaf, ClipboardPlus } from "lucide-react";

import FaqList from "@/components/shared/FaqList";
import ContactSection from "@/components/shared/ContactSection";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { FAQS, TOPICS, type Faq } from "@/lib/faqs";
import { useCareData } from "@/lib/useCareData";

const topicMeta = {
  "Getting started": { icon: Rocket, desc: "Learn the basics of setting up your CareTwin profile.", bg: "bg-blue-100", fg: "text-blue-600" },
  "Account & security": { icon: ShieldCheck, desc: "Privacy settings, your data and the emergency QR code.", bg: "bg-indigo-100", fg: "text-indigo-600" },
  "AI tools": { icon: Leaf, desc: "How the symptom checker and assistant work.", bg: "bg-green-100", fg: "text-green-600" },
  "Health records": { icon: ClipboardPlus, desc: "Uploading, summarising and organising records.", bg: "bg-red-100", fg: "text-red-600" },
} as const;

export default function SupportPage() {
  const { self, account } = useCareData();
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState<Faq["topic"] | null>(null);

  const items = useMemo(() => {
    const q = search.trim().toLowerCase();
    return FAQS.filter((f) => (!topic || f.topic === topic) && (!q || `${f.q} ${f.a}`.toLowerCase().includes(q)));
  }, [search, topic]);

  return (
    <Stagger className="mx-auto w-full max-w-[1000px] space-y-8">
      <StaggerItem>
        <section className="rounded-2xl bg-[#E9EDFF] px-5 py-9 text-center sm:px-10 sm:py-12">
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">How can we help you today?</h1>
          <p className="mt-3 text-base text-body">Search our answers or browse a topic.</p>
          <div className="relative mx-auto mt-6 max-w-xl">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search help articles"
              placeholder="Search for answers or keywords..."
              className="h-13 w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-12 pr-5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </div>
        </section>
      </StaggerItem>

      <StaggerItem>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOPICS.map((t) => {
            const m = topicMeta[t];
            const on = topic === t;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={on}
                onClick={() => setTopic(on ? null : t)}
                className={`rounded-xl border p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${on ? "border-brand bg-brand-soft" : "border-line bg-white"}`}
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${m.bg} ${m.fg}`}>
                  <m.icon size={22} />
                </span>
                <h2 className="mt-4 text-base font-bold text-ink">{t}</h2>
                <p className="mt-1.5 text-[13px] leading-5 text-body">{m.desc}</p>
              </button>
            );
          })}
        </div>
      </StaggerItem>

      <StaggerItem>
        <h2 className="mb-4 text-xl font-bold text-ink">{topic ?? "Frequently asked questions"}</h2>
        <FaqList items={items} />
      </StaggerItem>

      <StaggerItem>
        <h2 className="mb-5 text-xl font-bold text-ink">Contact us</h2>
        <ContactSection defaults={{ name: self.name, email: account.email }} />
      </StaggerItem>
    </Stagger>
  );
}

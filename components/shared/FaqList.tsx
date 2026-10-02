"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { Faq } from "@/lib/faqs";

export default function FaqList({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<string | null>(null);

  if (items.length === 0)
    return <p className="rounded-xl border border-dashed border-[#cfd7e6] bg-white px-6 py-10 text-center text-sm text-mute">No answers match your search. Try different words or contact us below.</p>;

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
      {items.map((f) => {
        const on = open === f.q;
        return (
          <li key={f.q}>
            <h3>
              <button
                type="button"
                aria-expanded={on}
                onClick={() => setOpen(on ? null : f.q)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold text-ink transition hover:bg-[#fafbff]"
              >
                {f.q}
                <ChevronDown size={18} className={`shrink-0 text-mute transition-transform duration-200 ${on ? "rotate-180 text-brand" : ""}`} />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
                  <p className="max-w-prose px-5 pb-5 text-sm leading-6 text-body">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}

"use client";

import { motion } from "framer-motion";
import { useCareData, firstName } from "@/lib/useCareData";
import { relativeDays } from "@/lib/dates";

export default function WelcomeBanner() {
  const { self, records, now, hydrated } = useCareData();
  const followUps = records.filter((r) => r.followUp).length;
  const latest = [...records].sort((a, b) => b.date.localeCompare(a.date))[0];

  return (
    <section className="relative overflow-hidden rounded-2xl bg-navy px-6 py-7 text-white sm:px-8 sm:py-8">
      <div className="relative z-10 max-w-2xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-navy-2 px-3 py-1.5">
          <span className="ct-live h-2 w-2 rounded-full bg-mint" />
          <span className="text-xs font-semibold text-mint">All systems active</span>
        </div>

        <h1 className="text-[26px] font-bold leading-[1.15] tracking-tight sm:text-3xl">
          Hello, {firstName(self.name)}. {followUps > 0 ? `${followUps} follow-up${followUps > 1 ? "s" : ""} need your attention.` : "Your health summary is up to date."}
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-[#b9c4d8]">
          {hydrated && latest
            ? `Your latest record, "${latest.title}", was added ${relativeDays(latest.date, now).toLowerCase()}. Review it or ask the AI to explain it.`
            : "Upload a report to see it summarised here."}
        </p>
      </div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border-[35px] border-navy-2"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -right-5 h-56 w-56 rounded-full border-[25px] border-[#17233b]"
      />
    </section>
  );
}

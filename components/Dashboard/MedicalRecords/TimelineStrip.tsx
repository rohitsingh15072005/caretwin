"use client";

import { motion } from "framer-motion";
import type { MedicalRecord } from "@/lib/types";
import { inPeriod, lastMonthKeys, monthKey, monthLabel, shortMonth, type Period } from "@/lib/dates";

/** 12-month activity bar. Months inside the selected period are highlighted. */
export default function TimelineStrip({
  records,
  period,
  now,
}: {
  records: MedicalRecord[];
  period: Period;
  now: number;
}) {
  const keys = lastMonthKeys(now, 12);
  const counts = new Map<string, number>();
  records.forEach((r) => counts.set(monthKey(r.date), (counts.get(monthKey(r.date)) ?? 0) + 1));
  const max = Math.max(1, ...keys.map((k) => counts.get(k) ?? 0));

  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <p className="text-[13px] font-semibold text-ink">Activity over the last 12 months</p>
      <div className="mt-3 flex h-24 items-end gap-1.5 sm:gap-2" role="img" aria-label="Records per month for the last 12 months">
        {keys.map((k, i) => {
          const c = counts.get(k) ?? 0;
          const mid = `${k}-15`;
          const on = period.id === "all" || inPeriod(mid, period, now) || inPeriod(`${k}-01`, period, now);
          return (
            <div key={k} className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5" title={`${monthLabel(k)}: ${c} record${c === 1 ? "" : "s"}`}>
              <span className="text-[11px] font-semibold text-mute">{c || ""}</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: c ? `${(c / max) * 100}%` : 4 }}
                transition={{ duration: 0.5, delay: i * 0.03, ease: "easeOut" }}
                className={`w-full rounded-t-md transition-colors ${
                  c === 0 ? "bg-[#e9edf5]" : on ? "bg-brand" : "bg-[#c6d9e6]"
                }`}
                style={{ minHeight: 4 }}
              />
              <span className={`text-[11px] ${on ? "font-semibold text-ink" : "text-[#9aa3b3]"}`}>{shortMonth(k)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

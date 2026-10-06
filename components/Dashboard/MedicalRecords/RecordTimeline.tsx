"use client";

import { motion } from "framer-motion";
import type { MedicalRecord, Member } from "@/lib/types";
import { formatDate, monthKey, monthLabel } from "@/lib/dates";
import Avatar from "@/components/ui/Avatar";

export default function RecordTimeline({
  records,
  memberById,
  showMember,
  onView,
}: {
  records: MedicalRecord[];
  memberById: Map<string, Member>;
  showMember: boolean;
  onView: (r: MedicalRecord) => void;
}) {
  const groups = new Map<string, MedicalRecord[]>();
  records.forEach((r) => {
    const k = monthKey(r.date);
    groups.set(k, [...(groups.get(k) ?? []), r]);
  });

  return (
    <ol className="relative ml-3 border-l-2 border-[#d5ddec] pb-2 sm:ml-5">
      {[...groups.entries()].map(([key, items], gi) => (
        <li key={key} className="mb-7 pl-6 sm:pl-8">
          <span className="absolute -left-[9px] mt-1 h-4 w-4 rounded-full border-[3px] border-white bg-brand ring-2 ring-brand/30" />
          <h3 className="text-sm font-bold text-ink">
            {monthLabel(key)}
            <span className="ml-2 text-xs font-medium text-mute">
              {items.length} record{items.length > 1 ? "s" : ""}
            </span>
          </h3>
          <ul className="mt-3 space-y-2.5">
            {items.map((r, i) => {
              const m = memberById.get(r.memberId);
              return (
                <motion.li
                  key={r.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: gi * 0.06 + i * 0.05, duration: 0.3 }}
                >
                  <button
                    type="button"
                    onClick={() => onView(r)}
                    className="flex w-full items-center gap-3 rounded-xl border border-[#e1e5ee] bg-white p-3.5 text-left transition hover:border-brand/50 hover:shadow-sm"
                  >
                    <div className="w-14 shrink-0 text-center">
                      <p className="text-lg font-bold leading-none text-ink">{formatDate(r.date).split(" ")[0]}</p>
                      <p className="mt-0.5 text-xs text-mute">{formatDate(r.date).split(" ")[1]}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{r.title}</p>
                      <p className="truncate text-xs text-mute">
                        {r.type} · {r.doctor || "Doctor not added"}
                      </p>
                    </div>
                    {showMember && m && <Avatar name={m.name} color={m.color} size={28} />}
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </li>
      ))}
    </ol>
  );
}

"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { useCareData } from "@/lib/useCareData";
import { relativeDays } from "@/lib/dates";

export default function RecentActivity() {
  const { records, memberById, now, hydrated } = useCareData();
  const recent = [...records].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-ink">Recent activity</h2>
        <Link href="/dashboard/medical-records" className="text-[13px] font-semibold text-brand hover:text-brand-dark">
          View all
        </Link>
      </div>

      {!hydrated ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="ct-skeleton h-12 rounded-lg" />
          ))}
        </div>
      ) : recent.length === 0 ? (
        <p className="py-6 text-center text-sm text-mute">No records yet. Add your first report.</p>
      ) : (
        <ul className="divide-y divide-[#f0f2f6]">
          {recent.map((r) => (
            <li key={r.id} className="flex items-center gap-3 py-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <FileText size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{r.title}</p>
                <p className="truncate text-xs text-mute">
                  {memberById.get(r.memberId)?.name} · {r.type}
                </p>
              </div>
              <span className="shrink-0 text-xs text-mute">{relativeDays(r.date, now)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { useCareData } from "@/lib/useCareData";

export default function FamilySnapshot() {
  const { members, records, setActiveId } = useCareData();

  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-ink">Family</h2>
        <Link href="/dashboard/family" className="text-[13px] font-semibold text-brand hover:text-brand-dark">
          Manage
        </Link>
      </div>
      <ul className="space-y-1">
        {members.map((m) => (
          <li key={m.id}>
            <Link
              href="/dashboard/medical-records"
              onClick={() => setActiveId(m.id)}
              className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-slate-50"
            >
              <Avatar name={m.name} color={m.color} size={36} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink">{m.name}</span>
                <span className="block text-xs text-mute">{m.relation}</span>
              </span>
              <span className="text-xs font-medium text-body">
                {(() => { const n = records.filter((r) => r.memberId === m.id).length; return `${n} record${n === 1 ? "" : "s"}`; })()}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/dashboard/family?add=1"
        className="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#bfc8dc] py-2.5 text-[13px] font-semibold text-brand transition hover:border-brand hover:bg-brand-soft"
      >
        <Plus size={15} />
        Add family member
      </Link>
    </section>
  );
}

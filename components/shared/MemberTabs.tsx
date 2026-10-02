"use client";

import { Users } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { ALL_ID, useCareData } from "@/lib/useCareData";
import { SELF_ID } from "@/lib/data";

/** Quick family-member filter (same state as the switcher in the header). */
export default function MemberTabs({ includeAll = true }: { includeAll?: boolean }) {
  const { members, activeId, setActiveId } = useCareData();
  const items = includeAll ? [{ id: ALL_ID, name: "Everyone", color: "" }, ...members] : members;

  return (
    <div role="tablist" aria-label="Family member" className="flex gap-2 overflow-x-auto pb-1">
      {items.map((m) => {
        const on = activeId === m.id || (!includeAll && activeId === ALL_ID && m.id === SELF_ID);
        return (
          <button
            key={m.id}
            role="tab"
            aria-selected={on}
            type="button"
            onClick={() => setActiveId(m.id)}
            className={`flex shrink-0 items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-sm font-semibold transition ${
              on
                ? "border-brand bg-brand text-white shadow-sm"
                : "border-[#dfe3ea] bg-white text-body hover:border-brand/50"
            }`}
          >
            {m.id === ALL_ID ? (
              <span className={`flex h-6 w-6 items-center justify-center rounded-full ${on ? "bg-white/20" : "bg-brand-soft text-brand"}`}>
                <Users size={13} />
              </span>
            ) : (
              <Avatar name={m.name} color={m.color} size={24} />
            )}
            {m.name.split(" ")[0]}
          </button>
        );
      })}
    </div>
  );
}

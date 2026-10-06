"use client";

import Avatar from "@/components/ui/Avatar";
import { useCareData } from "@/lib/useCareData";

/** Single-account records are shown without suggesting unsupported family switching. */
export default function MemberTabs() {
  const { members, activeId, setActiveId, profileState, familyState } = useCareData();

  if (profileState.status === "loading" || familyState.status === "loading") {
    return <div className="ct-skeleton h-10 w-36 rounded-full" aria-label="Loading profile" />;
  }

  if (profileState.status === "error") {
    return <p role="alert" className="text-sm text-danger">{profileState.error}</p>;
  }

  return (
    <div>
      <div role="tablist" aria-label="Choose whose records to view" className="flex flex-wrap gap-2">
        {members.map((member) => {
          const selected = activeId === member.id;
          return (
            <button
              key={member.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveId(member.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-sm font-semibold transition ${
                selected
                  ? "border-brand bg-brand text-white"
                  : "border-line bg-white text-body hover:border-brand"
              }`}
            >
              <Avatar name={member.name} color={member.color} size={24} />
              {member.isSelf ? "My records" : member.name}
            </button>
          );
        })}
      </div>
      {familyState.status === "error" && (
        <p className="mt-2 text-xs text-mute">Family profiles could not be loaded: {familyState.error}</p>
      )}
    </div>
  );
}

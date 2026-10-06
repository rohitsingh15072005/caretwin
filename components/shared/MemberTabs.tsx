"use client";

import Avatar from "@/components/ui/Avatar";
import { useCareData } from "@/lib/useCareData";

/** Single-account records are shown without suggesting unsupported family switching. */
export default function MemberTabs() {
  const { self, profileState } = useCareData();

  if (profileState.status === "loading") {
    return <div className="ct-skeleton h-10 w-36 rounded-full" aria-label="Loading profile" />;
  }

  if (profileState.status === "error") {
    return <p role="alert" className="text-sm text-danger">{profileState.error}</p>;
  }

  return (
    <div className="flex">
      <span className="flex shrink-0 items-center gap-2 rounded-full border border-brand bg-brand py-1.5 pl-1.5 pr-3.5 text-sm font-semibold text-white">
        <Avatar name={self.name} color={self.color} size={24} />
        My records
      </span>
    </div>
  );
}

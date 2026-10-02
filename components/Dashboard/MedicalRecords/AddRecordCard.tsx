"use client";

import { Plus } from "lucide-react";

export default function AddRecordCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[250px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#bfc8dc] bg-transparent px-5 transition hover:border-brand hover:bg-white"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e9edff] text-brand">
        <Plus size={20} />
      </div>
      <p className="mt-3 text-sm font-semibold text-[#374151]">Add record</p>
      <p className="mt-1 text-center text-xs leading-5 text-[#8b95a7]">
        Upload a report for yourself
        <br />
        or any family member
      </p>
    </button>
  );
}

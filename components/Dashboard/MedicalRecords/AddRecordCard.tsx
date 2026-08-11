"use client";

import { Plus } from "lucide-react";

export default function AddRecordCard() {
  return (
    <button
      type="button"
      className="flex min-h-[170px] flex-col items-center justify-center rounded-xl border border-dashed border-[#bfc8dc] bg-transparent px-5 transition hover:border-[#0878b8] hover:bg-white"
    >

      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e9edff] text-[#0878b8]">
        <Plus size={18} />
      </div>

      <p className="mt-3 text-[10px] font-semibold text-[#374151]">
        Add Record
      </p>

      <p className="mt-1 text-center text-[8px] leading-[13px] text-[#8b95a7]">
        Drag and drop health files
        <br />
        or click to browse
      </p>

    </button>
  );
}
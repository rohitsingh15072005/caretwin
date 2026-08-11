"use client";

import { Filter, UploadCloud } from "lucide-react";

export default function MedicalRecordsHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

      {/* Title */}
      <div>
        <h1 className="text-[25px] font-bold tracking-[-0.5px] text-[#111827]">
          Medical Records
        </h1>

        <p className="mt-1 text-[11px] text-[#6b7280]">
          Manage and analyze your health history with AI-powered insights.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">

        <button
          type="button"
          className="flex h-9 items-center gap-2 rounded-lg border border-[#dfe3ea] bg-white px-4 text-[10px] font-semibold text-[#374151] transition hover:bg-[#f8fafc]"
        >
          <Filter size={13} />
          Filters
        </button>

        <button
          type="button"
          className="flex h-9 items-center gap-2 rounded-lg bg-[#0878b8] px-4 text-[10px] font-semibold text-white transition hover:bg-[#06699f]"
        >
          <UploadCloud size={14} />
          Upload New Report
        </button>

      </div>

    </div>
  );
}
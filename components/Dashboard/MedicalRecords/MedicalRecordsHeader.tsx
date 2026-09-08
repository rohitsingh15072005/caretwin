"use client";

import { Filter, UploadCloud } from "lucide-react";

interface MedicalRecordsHeaderProps {
  onUploadClick?: () => void;
  onFilterToggle?: () => void;
  isFilterActive?: boolean;
}

export default function MedicalRecordsHeader({
  onUploadClick,
  onFilterToggle,
  isFilterActive = false,
}: MedicalRecordsHeaderProps) {
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
          onClick={onFilterToggle}
          className={`flex h-9 items-center gap-2 rounded-lg border px-4 text-[10px] font-semibold transition ${
            isFilterActive
              ? "bg-cyan-50 border-cyan-500 text-cyan-700"
              : "border-[#dfe3ea] bg-white text-[#374151] hover:bg-[#f8fafc]"
          }`}
        >
          <Filter size={13} />
          Filters
        </button>

        <button
          type="button"
          onClick={onUploadClick}
          className="flex h-9 items-center gap-2 rounded-lg bg-[#0878b8] px-4 text-[10px] font-semibold text-white transition hover:bg-[#06699f] active:scale-95 shadow-sm"
        >
          <UploadCloud size={14} />
          Upload New Report
        </button>

      </div>

    </div>
  );
}
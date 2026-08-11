"use client";

import Link from "next/link";
import { FileUp, ArrowRight } from "lucide-react";

export default function UploadReport() {
  return (
    <Link
      href="/dashboard/medical-records"
      className="group block rounded-xl border border-[#e5e7eb] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Icon */}
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#eef7fc] text-[#0878b8]">
        <FileUp size={19} strokeWidth={1.8} />
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-[#111827]">
        Upload Report
      </h3>

      {/* Description */}
      <p className="mt-1 max-w-[230px] text-[10px] leading-[16px] text-[#6b7280]">
        Import new lab results or radiology scans for AI processing.
      </p>

      {/* Arrow */}
      <div className="mt-4 flex items-center gap-1 text-[10px] font-semibold text-[#0878b8]">
        <span>Upload</span>

        <ArrowRight
          size={13}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}
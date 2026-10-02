"use client";

import Link from "next/link";
import { FileUp, ArrowRight } from "lucide-react";

export default function UploadReport() {
  return (
    <Link
      href="/dashboard/medical-records?add=1"
      className="group block rounded-xl border border-line bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#eef7fc] text-brand">
        <FileUp size={19} strokeWidth={1.8} />
      </div>
      <h3 className="text-[15px] font-semibold text-ink">Upload Report</h3>
      <p className="mt-1 text-[13px] leading-5 text-mute">
        Import lab results or scans for any family member.
      </p>
      <div className="mt-4 flex items-center gap-1 text-[13px] font-semibold text-brand">
        <span>Upload</span>
        <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

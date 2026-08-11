"use client";

import {
  CalendarDays,
  UserRound,
  MoreVertical,
  Eye,
  Download,
  Trash2,
  FileText,
} from "lucide-react";

interface MedicalRecordCardProps {
  type: string;
  title: string;
  description: string;
  date: string;
  doctor: string;
  analyzed?: boolean;
  analysis?: string;
}

export default function MedicalRecordCard({
  type,
  title,
  description,
  date,
  doctor,
  analyzed = false,
  analysis,
}: MedicalRecordCardProps) {
  return (
    <article className="flex min-h-[242px] flex-col overflow-hidden rounded-xl border border-[#e1e5ee] bg-white">

      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-[#edf0f5] bg-[#fafbff] px-4 py-3">

        <span className="rounded-full bg-[#e8f2f8] px-2.5 py-1 text-[8px] font-semibold text-[#0878b8]">
          {type}
        </span>

        <button
          type="button"
          className="text-[#8b95a7] hover:text-[#111827]"
        >
          <MoreVertical size={16} />
        </button>

      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">

        <h3 className="text-[12px] font-semibold text-[#273044]">
          {title}
        </h3>

        <p className="mt-1 text-[9px] leading-[14px] text-[#6b7280]">
          {description}
        </p>

        {/* Information */}
        <div className="mt-3 space-y-2">

          <div className="flex items-center gap-2 text-[9px] text-[#6b7280]">
            <CalendarDays size={13} />
            {date}
          </div>

          <div className="flex items-center gap-2 text-[9px] text-[#6b7280]">
            <UserRound size={13} />
            {doctor}
          </div>

        </div>

        {/* AI Analysis */}
        {analyzed && analysis && (
          <div className="mt-3 rounded-lg bg-[#eafbf1] p-3">

            <p className="text-[8px] font-bold text-[#15965d]">
              AI Insight
            </p>

            <p className="mt-1 text-[9px] italic leading-[14px] text-[#317354]">
              "{analysis}"
            </p>

          </div>
        )}

        {/* Actions */}
        <div className="mt-auto flex gap-2 pt-4">

          <button
            type="button"
            className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-[#dfe3ea] text-[9px] font-semibold text-[#374151] transition hover:bg-[#f8fafc]"
          >
            <Eye size={12} />
            View
          </button>

          <button
            type="button"
            className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-[#dfe3ea] text-[9px] font-semibold text-[#374151] transition hover:bg-[#f8fafc]"
          >
            <Download size={12} />
            Get PDF
          </button>

          {analyzed && (
            <button
              type="button"
              className="flex h-8 w-9 items-center justify-center rounded-md border border-[#f3b5b5] text-[#e55b5b] transition hover:bg-[#fff4f4]"
            >
              <Trash2 size={13} />
            </button>
          )}

        </div>

      </div>

    </article>
  );
}
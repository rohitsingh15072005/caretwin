"use client";

import { useState } from "react";
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
  id?: number;
  type: string;
  title: string;
  description: string;
  date: string;
  doctor: string;
  analyzed?: boolean;
  analysis?: string;
  onView?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
}

export default function MedicalRecordCard({
  id,
  type,
  title,
  description,
  date,
  doctor,
  analyzed = false,
  analysis,
  onView,
  onDownload,
  onDelete,
}: MedicalRecordCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <article className="flex min-h-[242px] flex-col overflow-hidden rounded-xl border border-[#e1e5ee] bg-white relative">

      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-[#edf0f5] bg-[#fafbff] px-4 py-3">

        <span className="rounded-full bg-[#e8f2f8] px-2.5 py-1 text-[8px] font-semibold text-[#0878b8]">
          {type}
        </span>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[#8b95a7] hover:text-[#111827] p-1 rounded transition"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-6 z-20 w-32 rounded-lg border border-slate-100 bg-white p-1 shadow-lg text-xs">
              {onView && (
                <button
                  onClick={() => { setMenuOpen(false); onView(); }}
                  className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-slate-700 hover:bg-slate-50 rounded"
                >
                  <Eye size={12} /> View
                </button>
              )}
              {onDownload && (
                <button
                  onClick={() => { setMenuOpen(false); onDownload(); }}
                  className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-slate-700 hover:bg-slate-50 rounded"
                >
                  <Download size={12} /> Download
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => { setMenuOpen(false); onDelete(); }}
                  className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={12} /> Delete
                </button>
              )}
            </div>
          )}
        </div>

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
            onClick={onView}
            className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-[#dfe3ea] text-[10px] font-semibold text-[#374151] transition hover:bg-[#f8fafc] active:scale-95"
          >
            <Eye size={12} />
            View
          </button>

          <button
            type="button"
            onClick={onDownload}
            className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-[#dfe3ea] text-[10px] font-semibold text-[#374151] transition hover:bg-[#f8fafc] active:scale-95"
          >
            <Download size={12} />
            Get PDF
          </button>

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              title="Delete record"
              className="flex h-8 w-9 items-center justify-center rounded-md border border-[#f3b5b5] text-[#e55b5b] transition hover:bg-[#fff4f4] active:scale-95"
            >
              <Trash2 size={13} />
            </button>
          )}

        </div>

      </div>

    </article>
  );
}
"use client";

import { CalendarDays, UserRound, Eye, Download, Trash2, Paperclip, Pencil } from "lucide-react";
import type { MedicalRecord, Member } from "@/lib/types";
import { formatDate } from "@/lib/dates";
import Avatar from "@/components/ui/Avatar";

interface Props {
  record: MedicalRecord;
  member?: Member;
  showMember: boolean;
  onView: () => void;
  onEdit: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

export default function MedicalRecordCard({ record, member, showMember, onView, onEdit, onDownload, onDelete }: Props) {
  return (
    <article className="flex h-full min-h-[250px] flex-col overflow-hidden rounded-xl border border-[#e1e5ee] bg-white transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between gap-2 border-b border-[#edf0f5] bg-[#fafbff] px-4 py-3">
        <span className="rounded-full bg-[#e8f2f8] px-2.5 py-1 text-xs font-semibold text-brand">{record.type}</span>
        <div className="flex items-center gap-2">
          {showMember && member && (
            <span title={member.name}>
              <Avatar name={member.name} color={member.color} size={24} />
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[15px] font-semibold text-[#273044]">{record.title}</h3>
        <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-mute">{record.description}</p>

        <div className="mt-3 space-y-1.5 text-[13px] text-mute">
          <div className="flex items-center gap-2">
            <CalendarDays size={14} /> {formatDate(record.date)}
          </div>
          <div className="flex items-center gap-2">
            <UserRound size={14} /> {record.doctor || "Doctor not added"}
          </div>
          {(record.hasFile || record.fileName) && (
            <div className="flex items-center gap-2">
              <Paperclip size={14} /> <span className="truncate">{record.fileName ?? "File attached"}</span>
            </div>
          )}
        </div>

        <div className="mt-auto flex gap-2 pt-4">
          <button type="button" onClick={onView} className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md border border-[#dfe3ea] text-[13px] font-semibold text-[#374151] transition hover:bg-[#f8fafc]">
            <Eye size={14} /> View
          </button>
          <button type="button" onClick={onDownload} className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md border border-[#dfe3ea] text-[13px] font-semibold text-[#374151] transition hover:bg-[#f8fafc]">
            <Download size={14} /> {record.hasFile ? "Download file" : "Download summary"}
          </button>
          <button type="button" onClick={onEdit} aria-label={`Edit ${record.title}`} className="flex h-9 w-10 items-center justify-center rounded-md border border-[#dfe3ea] text-body transition hover:bg-slate-50">
            <Pencil size={15} />
          </button>
          <button type="button" onClick={onDelete} aria-label={`Delete ${record.title}`} className="flex h-9 w-10 items-center justify-center rounded-md border border-[#f3b5b5] text-danger transition hover:bg-[#fff4f4]">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}

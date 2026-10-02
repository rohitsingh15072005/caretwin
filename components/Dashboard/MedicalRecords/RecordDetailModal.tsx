"use client";

import Modal from "@/components/ui/Modal";
import { btnGhost } from "@/components/ui/Field";
import type { MedicalRecord, Member } from "@/lib/types";
import { formatDate } from "@/lib/dates";
import { Download } from "lucide-react";

const flagStyle = {
  normal: "bg-[#e5faef] text-[#15965d]",
  watch: "bg-[#fff6e5] text-[#b7791f]",
  abnormal: "bg-danger-soft text-danger",
};
const flagLabel = { normal: "Normal", watch: "Watch", abnormal: "Abnormal" };

export default function RecordDetailModal({
  record,
  member,
  onClose,
  onDownload,
}: {
  record: MedicalRecord | null;
  member?: Member;
  onClose: () => void;
  onDownload: (r: MedicalRecord) => void;
}) {
  return (
    <Modal
      open={!!record}
      onClose={onClose}
      title={record?.title ?? ""}
      description={record ? `${record.type} · ${formatDate(record.date)}` : undefined}
      footer={
        record && (
          <>
            <button type="button" className={btnGhost} onClick={() => onDownload(record)}>
              <Download size={15} /> Download summary
            </button>
            <button type="button" className={btnGhost} onClick={onClose}>
              Close
            </button>
          </>
        )
      }
    >
      {record && (
        <div className="space-y-5 text-sm">
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-xs font-semibold text-mute">Patient</dt>
              <dd className="mt-0.5 font-semibold text-ink">{member?.name ?? "Unknown"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-mute">Doctor</dt>
              <dd className="mt-0.5 font-semibold text-ink">{record.doctor || "Not added"}</dd>
            </div>
          </dl>

          <div>
            <p className="text-xs font-semibold text-mute">Notes</p>
            <p className="mt-1 leading-6 text-body">{record.description}</p>
          </div>

          {record.metrics && record.metrics.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-mute">Key results</p>
              <ul className="mt-2 divide-y divide-[#f0f2f6] rounded-lg border border-line">
                {record.metrics.map((m) => (
                  <li key={m.label} className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                    <span className="text-body">{m.label}</span>
                    <span className="flex items-center gap-2">
                      <span className="font-semibold text-ink">{m.value}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${flagStyle[m.flag]}`}>{flagLabel[m.flag]}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {record.analysis && (
            <div className="rounded-lg bg-mint-soft p-3.5">
              <p className="text-xs font-bold text-[#15965d]">AI insight</p>
              <p className="mt-1 leading-6 text-[#317354]">{record.analysis}</p>
            </div>
          )}

          {record.fileName && <p className="text-xs text-mute">Attached file: {record.fileName}</p>}
        </div>
      )}
    </Modal>
  );
}

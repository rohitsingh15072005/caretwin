"use client";

import Modal from "@/components/ui/Modal";
import { btnGhost } from "@/components/ui/Field";
import type { MedicalRecord, Member } from "@/lib/types";
import { formatDate } from "@/lib/dates";
import { Download, Pencil } from "lucide-react";

export default function RecordDetailModal({
  record,
  member,
  onClose,
  onDownload,
  onEdit,
}: {
  record: MedicalRecord | null;
  member?: Member;
  onClose: () => void;
  onDownload: (r: MedicalRecord) => void;
  onEdit: () => void;
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
            <button type="button" className={btnGhost} onClick={onEdit}>
              <Pencil size={15} /> Edit record
            </button>
            <button type="button" className={btnGhost} onClick={() => onDownload(record)}>
              <Download size={15} /> {record.hasFile ? "Download attached file" : "Download summary"}
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
              <dd className="mt-0.5 font-semibold text-ink">{member?.name || "You"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-mute">Doctor</dt>
              <dd className="mt-0.5 font-semibold text-ink">{record.doctor || "Not added"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-mute">Hospital or facility</dt>
              <dd className="mt-0.5 font-semibold text-ink">{record.hospital || "Not added"}</dd>
            </div>
          </dl>

          <div>
            <p className="text-xs font-semibold text-mute">Notes</p>
            <p className="mt-1 leading-6 text-body">{record.description}</p>
          </div>

          {(record.hasFile || record.fileName) && <p className="text-xs text-mute">Attached file: {record.fileName ?? "File attached"}</p>}
        </div>
      )}
    </Modal>
  );
}

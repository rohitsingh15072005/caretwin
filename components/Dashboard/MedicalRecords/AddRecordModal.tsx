"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { SelectInput, TextArea, TextInput, btnGhost, btnPrimary } from "@/components/ui/Field";
import { RECORD_TYPES } from "@/lib/data";
import type { MedicalRecord, RecordType } from "@/lib/types";

export default function AddRecordModal({
  open,
  onClose,
  memberId,
  today,
  record,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  memberId: string;
  today: string;
  record: MedicalRecord | null;
  onSave: (r: MedicalRecord) => Promise<void>;
}) {
  return (
    <Modal open={open} onClose={onClose} size="lg" title={record ? "Edit medical record" : "Add a medical record"} description="Record details are saved to your CareTwin account.">
      {open && <Form key={record?.id ?? "new"} memberId={memberId} today={today} record={record} onSave={onSave} onClose={onClose} />}
    </Modal>
  );
}

function Form({
  memberId,
  today,
  record,
  onSave,
  onClose,
}: {
  memberId: string;
  today: string;
  record: MedicalRecord | null;
  onSave: (r: MedicalRecord) => Promise<void>;
  onClose: () => void;
}) {
  const [type, setType] = useState<RecordType>(record?.type ?? "Laboratory");
  const [title, setTitle] = useState(record?.title ?? "");
  const [date, setDate] = useState(record?.date ?? today);
  const [doctor, setDoctor] = useState(record?.doctor ?? "");
  const [hospital, setHospital] = useState(record?.hospital ?? "");
  const [description, setDescription] = useState(record?.description ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setError("Enter a title for this record.");
      return;
    }
    if (!date) {
      setError("Choose the date of the report.");
      return;
    }
    if (date > today) {
      setError("The date cannot be in the future.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave({
        id: record?.id ?? "",
        memberId: record?.memberId ?? memberId,
        type,
        title: title.trim(),
        description: description.trim(),
        date,
        doctor: doctor.trim(),
        hospital: hospital.trim() || undefined,
      });
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The record could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={(event) => void submit(event)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectInput label="Type" value={type} onChange={(event) => setType(event.target.value as RecordType)} options={RECORD_TYPES} />
        <TextInput label="Report date" type="date" max={today} value={date} onChange={(event) => setDate(event.target.value)} />
      </div>
      <TextInput label="Title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Thyroid profile" />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Doctor or clinic" value={doctor} onChange={(event) => setDoctor(event.target.value)} />
        <TextInput label="Hospital or facility" value={hospital} onChange={(event) => setHospital(event.target.value)} />
      </div>
      <TextArea label="Notes" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Add notes from this report..." />
      <p className="text-xs text-mute">File uploads, AI analysis, and follow-up tracking are not available through the current records API.</p>
      {error && <p role="alert" className="text-sm font-medium text-danger">{error}</p>}
      <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
        <button type="button" className={btnGhost} onClick={onClose}>Cancel</button>
        <button type="submit" disabled={saving} className={`${btnPrimary} disabled:opacity-50`}>
          {saving ? "Saving…" : record ? "Save changes" : "Save record"}
        </button>
      </div>
    </form>
  );
}

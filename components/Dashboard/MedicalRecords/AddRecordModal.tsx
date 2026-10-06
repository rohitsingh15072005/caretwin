"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { SelectInput, TextArea, TextInput, btnGhost, btnPrimary } from "@/components/ui/Field";
import { RECORD_TYPES } from "@/lib/data";
import type { MedicalRecord, Member, RecordType } from "@/lib/types";

export default function AddRecordModal({
  open,
  onClose,
  memberId,
  today,
  record,
  members,
  onSave,
  onUploadFile,
  requireAttachment = false,
  onComplete,
}: {
  open: boolean;
  onClose: () => void;
  memberId: string;
  today: string;
  record: MedicalRecord | null;
  members: Member[];
  onSave: (r: MedicalRecord) => Promise<MedicalRecord>;
  onUploadFile: (id: string, file: File) => Promise<void>;
  requireAttachment?: boolean;
  onComplete?: () => void;
}) {
  const title = requireAttachment
    ? "Upload a medical document"
    : record
      ? "Edit medical record"
      : "Add a medical record";
  return (
    <Modal open={open} onClose={onClose} size="lg" title={title} description="Add record details and attach a PDF, JPEG, or PNG (maximum 10 MB). Extracted text may appear after upload; no medical interpretation is generated.">
      {open && <Form key={record?.id ?? "new"} memberId={memberId} members={members} today={today} record={record} onSave={onSave} onUploadFile={onUploadFile} requireAttachment={requireAttachment} onComplete={onComplete} onClose={onClose} />}
    </Modal>
  );
}

function Form({
  memberId,
  members,
  today,
  record,
  onSave,
  onUploadFile,
  requireAttachment,
  onComplete,
  onClose,
}: {
  memberId: string;
  members: Member[];
  today: string;
  record: MedicalRecord | null;
  onSave: (r: MedicalRecord) => Promise<MedicalRecord>;
  onUploadFile: (id: string, file: File) => Promise<void>;
  requireAttachment: boolean;
  onComplete?: () => void;
  onClose: () => void;
}) {
  const [type, setType] = useState<RecordType>(record?.type ?? "Laboratory");
  const [recordMemberId, setRecordMemberId] = useState(record?.memberId ?? memberId);
  const [title, setTitle] = useState(record?.title ?? "");
  const [date, setDate] = useState(record?.date ?? today);
  const [doctor, setDoctor] = useState(record?.doctor ?? "");
  const [hospital, setHospital] = useState(record?.hospital ?? "");
  const [description, setDescription] = useState(record?.description ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [savedRecord, setSavedRecord] = useState<MedicalRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
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
    if (requireAttachment && !file && !savedRecord?.hasFile) {
      setError("Choose a PDF, JPEG, or PNG file to upload.");
      return;
    }
    if (file) {
      const extension = file.name.split(".").pop()?.toLowerCase();
      const allowed = ["pdf", "jpg", "jpeg", "png"];
      if (!extension || !allowed.includes(extension)) {
        setError("Choose a PDF, JPEG, or PNG file.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Choose a file no larger than 10 MB.");
        return;
      }
      const allowedMimeTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (file.type && !allowedMimeTypes.includes(file.type)) {
        setError("Choose a PDF, JPEG, or PNG file.");
        return;
      }
    }

    setSaving(true);
    setError(null);
    setProgress("Saving record details…");
    try {
      const saved = await onSave({
        id: savedRecord?.id ?? record?.id ?? "",
        memberId: recordMemberId,
        type,
        title: title.trim(),
        description: description.trim(),
        date,
        doctor: doctor.trim(),
        hospital: hospital.trim() || undefined,
      });
      setSavedRecord(saved);
      if (file) {
        setProgress("Uploading attachment…");
        try {
          await onUploadFile(saved.id, file);
        } catch (cause) {
          setProgress(null);
          setError(
            `Record details were saved, but the attachment was not uploaded. Select the same file and retry; the saved record will be reused. ${
              cause instanceof Error ? cause.message : "Please try again."
            }`,
          );
          return;
        }
      }
      setProgress(file ? "Document saved and uploaded." : "Record saved.");
      onComplete?.();
      onClose();
    } catch (cause) {
      setProgress(null);
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
      <SelectInput
        label="Record belongs to"
        value={recordMemberId}
        onChange={(event) => setRecordMemberId(event.target.value)}
        options={members.map((member) => ({
          value: member.id,
          label: member.isSelf ? `You${member.name ? ` (${member.name})` : ""}` : `${member.name} (${member.relation})`,
        }))}
      />
      <TextInput label="Title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Thyroid profile" />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Doctor or clinic" value={doctor} onChange={(event) => setDoctor(event.target.value)} />
        <TextInput label="Hospital or facility" value={hospital} onChange={(event) => setHospital(event.target.value)} />
      </div>
      <TextArea label="Notes" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Add notes from this report..." />
      {record?.hasFile ? (
        <p className="text-xs text-mute">Current attachment{record.fileName ? `: ${record.fileName}` : ""}. Choose another file to replace it or queue OCR again.</p>
      ) : null}
      <label className="block text-[13px] font-semibold text-[#374151]">
        {requireAttachment ? "Choose a medical document or image" : record?.hasFile ? "Replace or re-upload attachment (optional)" : "Attach a file (optional)"}
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setError(null);
          }}
          className="mt-1.5 block w-full rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 text-sm font-normal"
        />
        <span className="mt-1 block text-xs font-normal text-mute">PDF, JPEG, or PNG; maximum 10 MB.</span>
      </label>
      <p className="text-xs text-mute">OCR extracts text only; it does not interpret medical meaning. AI analysis and follow-up tracking are not available.</p>
      {progress && <p role="status" aria-live="polite" className="text-sm font-medium text-brand">{progress}</p>}
      {error && <p role="alert" className="text-sm font-medium text-danger">{error}</p>}
      <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
        <button type="button" className={btnGhost} onClick={onClose} disabled={saving}>Cancel</button>
        <button type="submit" disabled={saving} className={`${btnPrimary} disabled:opacity-50`}>
          {saving ? progress ?? "Saving…" : requireAttachment ? "Save and upload" : record ? "Save changes" : "Save record"}
        </button>
      </div>
    </form>
  );
}

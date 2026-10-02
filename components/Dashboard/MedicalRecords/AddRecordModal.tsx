"use client";

import { useState } from "react";
import { UploadCloud, Paperclip, X } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { SelectInput, TextArea, TextInput, btnGhost, btnPrimary } from "@/components/ui/Field";
import { RECORD_TYPES } from "@/lib/data";
import type { MedicalRecord, Member, RecordType } from "@/lib/types";
import { newId } from "@/lib/useCareData";

const MAX_MB = 10;

export default function AddRecordModal({
  open,
  onClose,
  members,
  defaultMemberId,
  today,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  members: Member[];
  defaultMemberId: string;
  today: string;
  onSave: (r: MedicalRecord) => void;
}) {
  return (
    <Modal open={open} onClose={onClose} size="lg" title="Add a medical record" description="Choose who the record belongs to, then add the details.">
      {/* Form remounts on every open, so fields always start clean. */}
      {open && <Form members={members} defaultMemberId={defaultMemberId} today={today} onSave={onSave} onClose={onClose} />}
    </Modal>
  );
}

function Form({
  members,
  defaultMemberId,
  today,
  onSave,
  onClose,
}: {
  members: Member[];
  defaultMemberId: string;
  today: string;
  onSave: (r: MedicalRecord) => void;
  onClose: () => void;
}) {
  const [memberId, setMemberId] = useState(members.some((m) => m.id === defaultMemberId) ? defaultMemberId : members[0].id);
  const [type, setType] = useState<RecordType>("Laboratory");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(today);
  const [doctor, setDoctor] = useState("");
  const [description, setDescription] = useState("");
  const [followUp, setFollowUp] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; date?: string; file?: string }>({});

  const pickFile = (f: File | undefined) => {
    if (!f) return;
    if (f.size > MAX_MB * 1024 * 1024) {
      setErrors((e) => ({ ...e, file: `File is larger than ${MAX_MB} MB.` }));
      return;
    }
    setErrors((e) => ({ ...e, file: undefined }));
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " "));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!title.trim()) next.title = "Enter a title for this record.";
    if (!date) next.date = "Choose the date of the report.";
    else if (date > today) next.date = "The date cannot be in the future.";
    setErrors(next);
    if (Object.keys(next).length) return;

    onSave({
      id: newId("r"),
      memberId,
      type,
      title: title.trim(),
      description: description.trim() || "No notes added.",
      date,
      doctor: doctor.trim(),
      followUp,
      fileName: file?.name,
    });
    onClose();
  };

  return (
    <form id="add-record-form" onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectInput
          label="Record for"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          options={members.map((m) => ({ value: m.id, label: `${m.name} (${m.relation})` }))}
        />
        <SelectInput label="Type" value={type} onChange={(e) => setType(e.target.value as RecordType)} options={RECORD_TYPES} />
      </div>

      <TextInput label="Title" value={title} error={errors.title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Thyroid profile" />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Report date" type="date" max={today} value={date} error={errors.date} onChange={(e) => setDate(e.target.value)} />
        <TextInput label="Doctor or clinic" value={doctor} onChange={(e) => setDoctor(e.target.value)} placeholder="Dr. Anjali Mehta" />
      </div>

      <TextArea label="Notes" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Reason for the test, key results, doctor's advice..." />

      {/* File drop zone */}
      <div>
        <p className="mb-1.5 text-[13px] font-semibold text-[#374151]">Report file (optional)</p>
        {file ? (
          <div className="flex items-center gap-3 rounded-lg border border-[#d9eee3] bg-mint-soft px-3.5 py-3">
            <Paperclip size={16} className="text-[#15965d]" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#176344]">{file.name}</span>
            <button type="button" aria-label="Remove file" onClick={() => setFile(null)} className="text-[#15965d] hover:text-ink">
              <X size={16} />
            </button>
          </div>
        ) : (
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              pickFile(e.dataTransfer.files?.[0]);
            }}
            className={`flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed px-4 py-6 text-center transition ${
              drag ? "border-brand bg-brand-soft" : "border-[#cfd7e6] hover:border-brand hover:bg-[#fafcff]"
            }`}
          >
            <UploadCloud size={22} className="text-brand" />
            <span className="mt-2 text-sm font-semibold text-ink">Drop a file here or browse</span>
            <span className="mt-0.5 text-xs text-mute">PDF, JPG or PNG up to {MAX_MB} MB</span>
            <input type="file" accept=".pdf,image/png,image/jpeg" className="sr-only" onChange={(e) => pickFile(e.target.files?.[0])} />
          </label>
        )}
        {errors.file && <p className="mt-1.5 text-xs font-medium text-danger">{errors.file}</p>}
        <p className="mt-1.5 text-xs text-mute">The file name is saved with the record. File storage arrives with the cloud backend.</p>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-ink">
        <input type="checkbox" checked={followUp} onChange={(e) => setFollowUp(e.target.checked)} className="h-4 w-4 accent-[#0878b8]" />
        Needs a follow-up
      </label>

      {/* Footer actions live in the form so Enter submits */}
      <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
        <button type="button" className={btnGhost} onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className={btnPrimary}>
          Save record
        </button>
      </div>
    </form>
  );
}

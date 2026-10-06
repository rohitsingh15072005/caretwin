"use client";

import { FileText, UploadCloud } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { btnPrimary } from "@/components/ui/Field";

export default function MedicalRecordsHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <PageHeader
      icon={<FileText size={22} />}
      title="Medical Records"
      subtitle="View and manage medical records fetched from your CareTwin account."
      actions={
        <button type="button" onClick={onAdd} className={btnPrimary}>
          <UploadCloud size={16} />
          Add record
        </button>
      }
    />
  );
}

"use client";

import { FileText, FolderOpen, Clock3, Layers3 } from "lucide-react";
import { CountUp } from "@/components/ui/Motion";
import type { MedicalRecord } from "@/lib/types";
import { relativeDays } from "@/lib/dates";

export default function RecordStats({ records, now }: { records: MedicalRecord[]; now: number }) {
  const latest = [...records].sort((a, b) => b.date.localeCompare(a.date))[0];

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <StatCard icon={<FileText size={18} />} label="Total records" number={records.length} tone="blue" />
      <StatCard icon={<FolderOpen size={18} />} label="Records with files" number={records.filter((r) => r.fileName).length} tone="green" />
      <StatCard icon={<Clock3 size={18} />} label="Last update" text={latest ? relativeDays(latest.date, now) : "No records"} tone="gray" />
      <StatCard icon={<Layers3 size={18} />} label="Categories" number={new Set(records.map((record) => record.type)).size} tone="red" />
    </div>
  );
}

const tones = {
  blue: "bg-[#eaf5fb] text-brand",
  green: "bg-[#e5faef] text-[#15965d]",
  gray: "bg-[#f0f2f2] text-mute",
  red: "bg-danger-soft text-danger",
};

function StatCard({
  icon,
  label,
  number,
  text,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  number?: number;
  text?: string;
  tone: keyof typeof tones;
}) {
  return (
    <div className="flex min-h-[76px] items-center gap-3 rounded-xl border border-[#edf0f4] bg-white px-4">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}>{icon}</div>
      <div>
        <p className="text-xs font-semibold text-[#8b95a7]">{label}</p>
        <p className="mt-0.5 text-xl font-bold leading-none text-[#273044]">
          {number !== undefined ? <CountUp to={number} /> : text}
        </p>
      </div>
    </div>
  );
}

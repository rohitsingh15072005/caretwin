"use client";

import { FileText, Activity, Pill, Brain, ChevronRight } from "lucide-react";
import { useCareData } from "@/lib/useCareData";

const prompts = [
  "Understand medical reports",
  "Explain health terms",
  "Discuss symptoms",
  "Review health trends",
  "Explain medications",
];

export default function AIChatSidebar({ onPick }: { onPick: (q: string) => void }) {
  const { scopedRecords, members, activeId, prefs } = useCareData();
  const member = members.find((m) => m.id === activeId);
  const meds = member ? member.medications.length : members.reduce((n, m) => n + m.medications.length, 0);

  return (
    <aside className="space-y-4">
      <div className="rounded-xl border border-[#e2e6ee] bg-white p-5">
        <h3 className="text-sm font-bold text-[#273044]">Health context</h3>
        <p className="mt-1 text-[13px] leading-5 text-[#8b95a7]">
          {prefs.shareWithAI
            ? `CareTwin AI is using ${member ? `${member.name.split(" ")[0]}'s` : "your family's"} information for personalised answers.`
            : "Sharing with the AI is off. Turn it on in Settings for personalised answers."}
        </p>
        <div className="mt-4 space-y-2">
          <ContextItem icon={<FileText size={15} />} title="Medical records" value={`${scopedRecords.length} documents`} />
          <ContextItem icon={<Activity size={15} />} title="Follow-ups" value={`${scopedRecords.filter((r) => r.followUp).length} open`} />
          <ContextItem icon={<Pill size={15} />} title="Medications" value={`${meds} active`} />
        </div>
      </div>

      <div className="rounded-xl border border-[#e2e6ee] bg-white p-5">
        <div className="flex items-center gap-2">
          <Brain size={16} className="text-brand" />
          <h3 className="text-sm font-bold text-[#273044]">What I can help with</h3>
        </div>
        <div className="mt-4 space-y-2">
          {prompts.map((item) => (
            <button key={item} type="button" onClick={() => onPick(item)} className="flex w-full items-center justify-between rounded-lg bg-[#f7f9fc] px-3 py-2.5 text-left transition hover:bg-brand-soft">
              <span className="text-[13px] text-[#5d6675]">{item}</span>
              <ChevronRight size={14} className="text-[#a0a8b5]" />
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[#f0dfc1] bg-[#fffaf0] p-4">
        <p className="text-[13px] font-bold text-[#946b24]">Important</p>
        <p className="mt-1 text-xs leading-5 text-[#7a6535]">
          AI responses are informational and should not replace diagnosis or treatment from a healthcare professional.
        </p>
      </div>
    </aside>
  );
}

function ContextItem({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-[#f7f9fc] p-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-brand">{icon}</div>
      <div>
        <p className="text-[13px] font-semibold text-[#374151]">{title}</p>
        <p className="text-xs text-[#9aa3b3]">{value}</p>
      </div>
    </div>
  );
}

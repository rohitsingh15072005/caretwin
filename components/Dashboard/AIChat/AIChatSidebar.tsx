"use client";

import { Activity, Brain, ChevronRight, FileText } from "lucide-react";
import { useCareData } from "@/lib/useCareData";

const prompts = [
  "Understand medical reports",
  "Explain health terms",
  "Discuss symptoms",
  "Review health information",
];

export default function AIChatSidebar({ onPick }: { onPick: (q: string) => void }) {
  const { records, recordsState, notifications, notificationsState } = useCareData();
  const unread = notifications.filter((notification) => !notification.isRead).length;

  return (
    <aside className="space-y-4">
      <div className="rounded-xl border border-[#e2e6ee] bg-white p-5">
        <h3 className="text-sm font-bold text-[#273044]">Available account data</h3>
        <p className="mt-1 text-[13px] leading-5 text-[#8b95a7]">
          Messages are sent to the CareTwin chat service, but your medical records are not automatically included in the conversation.
        </p>
        <div className="mt-4 space-y-2">
          <ContextItem
            icon={<FileText size={15} />}
            title="Medical records"
            value={recordsState.status === "loading" ? "Loading…" : recordsState.status === "error" ? "Unavailable" : `${records.length} records`}
          />
          <ContextItem
            icon={<Activity size={15} />}
            title="Unread notifications"
            value={notificationsState.status === "loading" ? "Loading…" : notificationsState.status === "error" ? "Unavailable" : `${unread}`}
          />
        </div>
      </div>

      <div className="rounded-xl border border-[#e2e6ee] bg-white p-5">
        <div className="flex items-center gap-2">
          <Brain size={16} className="text-brand" />
          <h3 className="text-sm font-bold text-[#273044]">Suggested topics</h3>
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

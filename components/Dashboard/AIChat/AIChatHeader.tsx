"use client";

import { Brain, ShieldCheck } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

export default function AIChatHeader() {
  return (
    <PageHeader
      icon={<Brain size={22} />}
      title="CareTwin AI"
      subtitle="Your personal AI health assistant."
      actions={
        <div className="flex items-center gap-2 rounded-full bg-mint-soft px-3.5 py-2">
          <ShieldCheck size={15} className="text-[#15965d]" />
          <span className="text-xs font-semibold text-[#16734d]">Secure health chat</span>
        </div>
      }
    />
  );
}

"use client";

import { Brain, ShieldCheck } from "lucide-react";

export default function AIChatHeader() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf5fb] text-[#0878b8]">
          <Brain size={20} />
        </div>

        <div>
          <h1 className="text-[25px] font-bold tracking-[-0.5px] text-[#111827]">
            CareTwin AI
          </h1>

          <p className="mt-1 text-[11px] text-[#6b7280]">
            Your personal AI health assistant.
          </p>
        </div>

      </div>

      <div className="flex items-center gap-2 rounded-full bg-[#eafbf1] px-3 py-2">

        <ShieldCheck
          size={14}
          className="text-[#15965d]"
        />

        <span className="text-[9px] font-semibold text-[#16734d]">
          Secure Health Chat
        </span>

      </div>

    </div>
  );
}
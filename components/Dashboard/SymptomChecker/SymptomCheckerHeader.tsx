"use client";

import { Activity } from "lucide-react";

export default function SymptomCheckerHeader() {
  return (
    <div>
      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e6f6ef] text-[#15965d]">
          <Activity size={20} />
        </div>

        <div>
          <h1 className="text-[25px] font-bold tracking-[-0.5px] text-[#111827]">
            AI Symptom Checker
          </h1>

          <p className="mt-1 text-[11px] text-[#6b7280]">
            Describe your symptoms and get AI-powered guidance based on your
            health history.
          </p>
        </div>

      </div>

      <div className="mt-5 rounded-lg border border-[#d9eee3] bg-[#f0fbf5] px-4 py-3">
        <p className="text-[10px] font-semibold text-[#16734d]">
          AI Health Assistant
        </p>

        <p className="mt-1 text-[9px] leading-[14px] text-[#4f7c67]">
          This tool provides health guidance and is not a replacement for
          professional medical advice.
        </p>
      </div>
    </div>
  );
}
"use client";

import { Brain, ShieldCheck, Stethoscope } from "lucide-react";

export default function AnalysisPanel() {
  return (
    <section className="rounded-xl border border-[#e3e7ef] bg-white p-6">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eaf5fb] text-[#0878b8]">
          <Brain size={19} />
        </div>

        <div>
          <h2 className="text-sm font-bold text-[#111827]">
            AI Analysis
          </h2>

          <p className="text-[9px] text-[#9ca3af]">
            Your analysis will appear here
          </p>
        </div>

      </div>

      <div className="mt-6 rounded-xl bg-[#f8f9fc] p-5 text-center">

        <Brain
          size={30}
          className="mx-auto text-[#c7cfdd]"
        />

        <p className="mt-3 text-[11px] font-semibold text-[#4b5563]">
          Ready to analyze
        </p>

        <p className="mt-1 text-[9px] leading-[14px] text-[#9ca3af]">
          Add your symptoms and click Analyze Symptoms to receive
          personalized health guidance.
        </p>

      </div>

      <div className="mt-5 space-y-3">

        <div className="flex gap-3 rounded-lg bg-[#f0fbf5] p-3">
          <ShieldCheck
            size={16}
            className="mt-0.5 shrink-0 text-[#15965d]"
          />

          <div>
            <p className="text-[9px] font-semibold text-[#176344]">
              Your data stays protected
            </p>

            <p className="mt-1 text-[8px] leading-[13px] text-[#5d806f]">
              Your health information is handled securely within CareTwin.
            </p>
          </div>
        </div>

        <div className="flex gap-3 rounded-lg bg-[#f5f7fb] p-3">
          <Stethoscope
            size={16}
            className="mt-0.5 shrink-0 text-[#0878b8]"
          />

          <div>
            <p className="text-[9px] font-semibold text-[#374151]">
              Need professional care?
            </p>

            <p className="mt-1 text-[8px] leading-[13px] text-[#8b95a7]">
              CareTwin can help you understand which medical specialty may
              be appropriate.
            </p>
          </div>
        </div>

      </div>

    </section>
  );
}
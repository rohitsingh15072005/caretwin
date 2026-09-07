"use client";

import {
  FileText,
  Activity,
  Pill,
  Brain,
  ChevronRight,
} from "lucide-react";

export default function AIChatSidebar() {
  return (
    <aside className="space-y-4">

      {/* Context */}
      <div className="rounded-xl border border-[#e2e6ee] bg-white p-5">

        <h3 className="text-[11px] font-bold text-[#273044]">
          Health Context
        </h3>

        <p className="mt-1 text-[8px] leading-3.25 text-[#8b95a7]">
          CareTwin AI can use your health information to provide more
          personalized guidance.
        </p>


        <div className="mt-4 space-y-2">

          <ContextItem
            icon={<FileText size={14} />}
            title="Medical Records"
            value="24 documents"
          />

          <ContextItem
            icon={<Activity size={14} />}
            title="Recent Activity"
            value="4 updates"
          />

          <ContextItem
            icon={<Pill size={14} />}
            title="Medications"
            value="3 active"
          />

        </div>

      </div>


      {/* Capabilities */}
      <div className="rounded-xl border border-[#e2e6ee] bg-white p-5">

        <div className="flex items-center gap-2">

          <Brain
            size={16}
            className="text-[#0878b8]"
          />

          <h3 className="text-[11px] font-bold text-[#273044]">
            What I can help with
          </h3>

        </div>

        <div className="mt-4 space-y-2">

          {[
            "Understand medical reports",
            "Explain health terms",
            "Discuss symptoms",
            "Review health trends",
            "Explain medications",
          ].map((item) => (

            <div
              key={item}
              className="flex items-center justify-between rounded-lg bg-[#f7f9fc] px-3 py-2"
            >
              <span className="text-[8px] text-[#5d6675]">
                {item}
              </span>

              <ChevronRight
                size={12}
                className="text-[#a0a8b5]"
              />

            </div>

          ))}

        </div>

      </div>


      {/* Safety */}
      <div className="rounded-xl border border-[#f0dfc1] bg-[#fffaf0] p-4">

        <p className="text-[9px] font-bold text-[#946b24]">
          Important
        </p>

        <p className="mt-1 text-[8px] leading-3.25 text-[#967d52]">
          AI responses are informational and should not replace diagnosis or
          treatment from a healthcare professional.
        </p>

      </div>

    </aside>
  );
}


function ContextItem({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-[#f7f9fc] p-3">

      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#0878b8]">
        {icon}
      </div>

      <div>
        <p className="text-[8px] font-semibold text-[#374151]">
          {title}
        </p>

        <p className="text-[8px] text-[#9aa3b3]">
          {value}
        </p>
      </div>

    </div>
  );
}
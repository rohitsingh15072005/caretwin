"use client";

import {
  FileText,
  Brain,
  Clock3,
  BellRing,
} from "lucide-react";

export default function RecordStats() {
  return (
    <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">

      <StatCard
        icon={<FileText size={17} />}
        label="Total Documents"
        value="24"
        iconStyle="blue"
      />

      <StatCard
        icon={<Brain size={17} />}
        label="AI Analyzed"
        value="18"
        iconStyle="green"
      />

      <StatCard
        icon={<Clock3 size={17} />}
        label="Last Update"
        value="2 Days Ago"
        iconStyle="gray"
      />

      <StatCard
        icon={<BellRing size={17} />}
        label="Follow-ups"
        value="3"
        iconStyle="red"
      />

    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  iconStyle,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconStyle: "blue" | "green" | "gray" | "red";
}) {
  const styles = {
    blue: "bg-[#eaf5fb] text-[#0878b8]",
    green: "bg-[#e5faef] text-[#15965d]",
    gray: "bg-[#f0f2f2] text-[#6b7280]",
    red: "bg-[#fff0f0] text-[#e55b5b]",
  };

  return (
    <div className="flex min-h-[68px] items-center gap-3 rounded-xl border border-[#edf0f4] bg-white px-4">

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${styles[iconStyle]}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-[8px] font-semibold text-[#8b95a7]">
          {label}
        </p>

        <p className="mt-0.5 text-lg font-bold leading-none text-[#273044]">
          {value}
        </p>
      </div>

    </div>
  );
}
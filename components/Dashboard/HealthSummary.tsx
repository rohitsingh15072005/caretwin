"use client";

import { HeartPulse, Droplets, Moon, Footprints } from "lucide-react";
import HealthChart from "./HealthChart";

export default function HealthSummary() {
  return (
    <section className="h-fit rounded-xl border border-line bg-white p-5">
      <div className="mb-5">
        <h2 className="text-[15px] font-bold text-ink">Health Summary</h2>
        <p className="mt-1 text-[13px] text-mute">Latest vitals · connect a wearable to replace this sample data</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard icon={<HeartPulse size={16} />} label="Heart rate" value="72 bpm" status="Normal" />
        <MetricCard icon={<Droplets size={16} />} label="Glucose" value="94 mg/dL" status="Normal" />
        <MetricCard icon={<Moon size={16} />} label="Sleep" value="8.2 hrs" status="Good" />
        <MetricCard icon={<Footprints size={16} />} label="Activity" value="4,210 steps" status="Today" />
      </div>

      <HealthChart />
    </section>
  );
}

function MetricCard({
  icon,
  label,
  value,
  status,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  status: string;
}) {
  return (
    <div className="rounded-lg border border-[#edf0f5] p-3.5 transition hover:border-[#dbe5ee] hover:shadow-sm">
      <div className="flex items-center gap-2 text-[#8b95a7]">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-2 text-base font-bold text-ink">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-[#0d9f62]">{status}</p>
    </div>
  );
}

"use client";

import {
  HeartPulse,
  Droplets,
  Moon,
  Footprints,
  TrendingUp,
} from "lucide-react";

export default function HealthSummary() {
  return (
    <section className="rounded-xl border border-[#e5e7eb] bg-white p-5">
      
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#111827]">
            Health Summary
          </h2>

          <p className="mt-1 text-[10px] text-[#9ca3af]">
            Your latest health metrics
          </p>
        </div>

        <button className="flex items-center gap-1 text-[10px] font-semibold text-[#0878b8] transition hover:text-[#06699f]">
          View Trends
          <TrendingUp size={12} />
        </button>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

        {/* Heart Rate */}
        <MetricCard
          icon={<HeartPulse size={16} />}
          label="Heart Rate"
          value="72 bpm"
          status="Normal"
        />

        {/* Glucose */}
        <MetricCard
          icon={<Droplets size={16} />}
          label="Glucose"
          value="94 mg/dL"
          status="Normal"
        />

        {/* Sleep */}
        <MetricCard
          icon={<Moon size={16} />}
          label="Sleep Quality"
          value="8.2 hrs"
          status="Good"
        />

        {/* Activity */}
        <MetricCard
          icon={<Footprints size={16} />}
          label="Activity"
          value="4,210 steps"
          status="Today"
        />

      </div>

      {/* Chart Placeholder */}
      <div className="mt-5 flex h-[180px] items-center justify-center rounded-xl bg-[#f8f9fc]">
        <div className="text-center">

          <TrendingUp
            size={26}
            className="mx-auto text-[#cbd5e1]"
          />

          <p className="mt-2 text-[10px] text-[#9ca3af]">
            Vital trends chart will appear here
          </p>

          <p className="mt-1 text-[9px] text-[#cbd5e1]">
            Data will be displayed after 24 hours of syncing.
          </p>

        </div>
      </div>

    </section>
  );
}


/* ================================================= */
/* Metric Card */
/* ================================================= */

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
    <div className="rounded-lg border border-[#edf0f5] p-3 transition hover:border-[#dbe5ee] hover:shadow-sm">

      {/* Label */}
      <div className="flex items-center gap-2 text-[#9ca3af]">
        {icon}

        <span className="text-[9px]">
          {label}
        </span>
      </div>

      {/* Value */}
      <p className="mt-2 text-sm font-bold text-[#111827]">
        {value}
      </p>

      {/* Status */}
      <p className="mt-1 text-[9px] font-medium text-[#0d9f62]">
        {status}
      </p>

    </div>
  );
}
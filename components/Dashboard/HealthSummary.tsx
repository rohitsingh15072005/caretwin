"use client";

import { Activity } from "lucide-react";

export default function HealthSummary() {
  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand">
          <Activity size={19} />
        </span>
        <div>
          <h2 className="text-[15px] font-bold text-ink">Health vitals</h2>
          <p className="mt-1 text-[13px] text-mute">Wearable data is not connected.</p>
        </div>
      </div>
      <p className="mt-4 rounded-lg bg-[#f8f9fc] px-4 py-5 text-sm leading-6 text-mute">
        CareTwin does not currently have a connected source for heart rate, glucose, sleep, or activity readings. No sample measurements are shown.
      </p>
    </section>
  );
}

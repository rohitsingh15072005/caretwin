"use client";

import { useEffect, useState } from "react";
import { getHealthTimeline, getFamilyMembers, Measurement } from "@/lib/api";
import { Activity, AlertTriangle } from "lucide-react";

export default function HealthChart() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>("BP_SYS");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTimeline() {
      try {
        setLoading(true);
        const members = await getFamilyMembers();
        const selfId = members[0]?.id || 1;
        const data = await getHealthTimeline(selfId);
        setMeasurements(data);
      } catch (err) {
        console.error("Failed to load health timeline:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTimeline();
  }, []);

  const filtered = measurements.filter((m) => m.metric_type === selectedMetric);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Activity className="text-cyan-600" size={20} />
            Longitudinal Health Timeline
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Chronological trend detection across multiple doctor visits
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
          {[
            { key: "BP_SYS", label: "Systolic BP" },
            { key: "BP_DIA", label: "Diastolic BP" },
            { key: "FASTING_GLUCOSE", label: "Fasting Sugar" },
            { key: "HBA1C", label: "HbA1c" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedMetric(tab.key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                selectedMetric === tab.key
                  ? "bg-white text-cyan-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center text-xs text-slate-400">
          Loading Health Timeline...
        </div>
      ) : filtered.length === 0 ? (
        <div className="h-48 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-xl p-6">
          <Activity size={32} className="mb-2 text-slate-300" />
          <p className="text-xs font-medium">No recorded readings for this metric yet.</p>
          <p className="text-[10px] text-slate-400 mt-1">Upload a prescription or lab report to extract data!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Custom SVG Line Chart */}
          <div className="relative h-44 w-full bg-slate-50 rounded-xl p-4 flex items-end justify-between gap-4 border border-slate-100">
            {filtered.map((item, idx) => {
              const maxVal = Math.max(...filtered.map((f) => f.value_numeric), 160);
              const heightPercent = Math.min(Math.max((item.value_numeric / maxVal) * 100, 20), 90);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition bg-slate-800 text-white text-[10px] py-1 px-2 rounded shadow whitespace-nowrap z-10">
                    {item.value_numeric} {item.unit} ({new Date(item.recorded_date).toLocaleDateString()})
                  </div>

                  {/* Bar Visualizer */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[36px] rounded-t-md transition-all duration-300 ${
                      item.value_numeric >= 140
                        ? "bg-red-500"
                        : item.value_numeric >= 130
                        ? "bg-amber-500"
                        : "bg-cyan-500"
                    }`}
                  />

                  {/* Label */}
                  <span className="mt-2 text-[10px] font-semibold text-slate-600">
                    {item.value_numeric} {item.unit}
                  </span>
                  <span className="text-[9px] text-slate-400">
                    {new Date(item.recorded_date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Trend Warning if 3 consecutive increases */}
          {filtered.length >= 3 &&
            filtered[filtered.length - 1].value_numeric > filtered[filtered.length - 2].value_numeric &&
            filtered[filtered.length - 2].value_numeric > filtered[filtered.length - 3].value_numeric && (
              <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
                <AlertTriangle size={18} className="text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold">CareTwin Trend Alert: </span>
                  {selectedMetric === "BP_SYS" ? "Systolic Blood Pressure" : "Blood Sugar"} has increased consistently across your last 3 recorded visits.
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SAMPLE_VITALS } from "@/lib/data";

type Key = keyof typeof SAMPLE_VITALS;

const W = 600;
const H = 200;
const PAD = { l: 36, r: 12, t: 16, b: 28 };

export default function HealthChart() {
  const [key, setKey] = useState<Key>("heart");
  const series = SAMPLE_VITALS[key];
  const vals = series.values as readonly number[];

  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;
  const lo = min - span * 0.3;
  const hi = max + span * 0.3;

  const x = (i: number) => PAD.l + (i * (W - PAD.l - PAD.r)) / (vals.length - 1);
  const y = (v: number) => PAD.t + ((hi - v) / (hi - lo)) * (H - PAD.t - PAD.b);

  const line = vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(vals.length - 1)} ${H - PAD.b} L${x(0)} ${H - PAD.b} Z`;

  return (
    <div className="mt-5 rounded-xl bg-[#f8f9fc] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div role="tablist" aria-label="Vital to chart" className="flex gap-1 rounded-lg bg-white p-1">
          {(Object.keys(SAMPLE_VITALS) as Key[]).map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={key === k}
              type="button"
              onClick={() => setKey(k)}
              className={`relative rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                key === k ? "text-white" : "text-mute hover:text-ink"
              }`}
            >
              {key === k && (
                <motion.span layoutId="chart-tab" className="absolute inset-0 rounded-md bg-brand" />
              )}
              <span className="relative">{k === "heart" ? "Heart rate" : k === "glucose" ? "Glucose" : "Sleep"}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-mute">
          {series.label} ({series.unit}) · sample data
        </p>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${series.label} over six months`}>
        {[0, 0.5, 1].map((t) => {
          const gy = PAD.t + t * (H - PAD.t - PAD.b);
          const label = (hi - t * (hi - lo)).toFixed(key === "sleep" ? 1 : 0);
          return (
            <g key={t}>
              <line x1={PAD.l} x2={W - PAD.r} y1={gy} y2={gy} stroke="#e5e9f2" strokeDasharray="3 4" />
              <text x={PAD.l - 8} y={gy + 4} textAnchor="end" fontSize="11" fill="#8b95a7">
                {label}
              </text>
            </g>
          );
        })}

        <motion.path
          key={`a-${key}`}
          d={area}
          fill="#0878b8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        />
        <motion.path
          key={`l-${key}`}
          d={line}
          fill="none"
          stroke="#0878b8"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
        {vals.map((v, i) => (
          <g key={`${key}-${i}`}>
            <motion.circle
              cx={x(i)}
              cy={y(v)}
              r="4.5"
              fill="#fff"
              stroke="#0878b8"
              strokeWidth="2.5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15 * i + 0.2 }}
              style={{ transformOrigin: `${x(i)}px ${y(v)}px` }}
            />
            <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#8b95a7">
              {series.months[i]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

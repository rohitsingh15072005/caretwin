"use client";

import { motion } from "framer-motion";
import { PERIOD_OPTIONS, type Period, type PeriodId } from "@/lib/dates";
import { inputCls } from "@/components/ui/Field";

export default function PeriodPicker({
  value,
  onChange,
  idPrefix,
}: {
  value: Period;
  onChange: (p: Period) => void;
  idPrefix: string;
}) {
  return (
    <div>
      <div role="radiogroup" aria-label="Time period" className="flex flex-wrap gap-1.5 rounded-xl bg-white p-1.5 ring-1 ring-[#e3e7ef]">
        {PERIOD_OPTIONS.map((o) => {
          const on = value.id === o.id;
          return (
            <button
              key={o.id}
              role="radio"
              aria-checked={on}
              type="button"
              onClick={() => onChange({ ...value, id: o.id as PeriodId })}
              className={`relative rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                on ? "text-white" : "text-body hover:text-ink"
              }`}
            >
              {on && (
                <motion.span
                  layoutId={`period-${idPrefix}`}
                  className="absolute inset-0 rounded-lg bg-brand"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">{o.label}</span>
            </button>
          );
        })}
      </div>

      {value.id === "custom" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 grid max-w-md grid-cols-2 gap-3 overflow-hidden"
        >
          <label className="text-xs font-semibold text-mute">
            From
            <input
              type="date"
              value={value.from ?? ""}
              max={value.to || undefined}
              onChange={(e) => onChange({ ...value, from: e.target.value })}
              className={`${inputCls} mt-1`}
            />
          </label>
          <label className="text-xs font-semibold text-mute">
            To
            <input
              type="date"
              value={value.to ?? ""}
              min={value.from || undefined}
              onChange={(e) => onChange({ ...value, to: e.target.value })}
              className={`${inputCls} mt-1`}
            />
          </label>
        </motion.div>
      )}
    </div>
  );
}

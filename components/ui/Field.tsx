"use client";

import { useId, useState } from "react";
import { X } from "lucide-react";

export const inputCls =
  "w-full rounded-lg border border-[#dfe4ec] bg-[#fafbfc] px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-[#9aa3b3] focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15 disabled:opacity-60";

export function Field({
  label,
  hint,
  error,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  error?: string;
  children: (id: string) => React.ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-[#374151]">
        {label}
      </label>
      {children(id)}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-mute">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextInput({
  label,
  hint,
  error,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
}) {
  return (
    <Field label={label} hint={hint} error={error} className={className}>
      {(id) => <input id={id} className={inputCls} aria-invalid={!!error} {...props} />}
    </Field>
  );
}

export function SelectInput({
  label,
  options,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: string[] | { value: string; label: string }[];
}) {
  return (
    <Field label={label} className={className}>
      {(id) => (
        <select id={id} className={inputCls} {...props}>
          {options.map((o) => {
            const v = typeof o === "string" ? o : o.value;
            const l = typeof o === "string" ? o : o.label;
            return (
              <option key={v} value={v}>
                {l}
              </option>
            );
          })}
        </select>
      )}
    </Field>
  );
}

export function TextArea({
  label,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <Field label={label} className={className}>
      {(id) => <textarea id={id} rows={3} className={`${inputCls} resize-none`} {...props} />}
    </Field>
  );
}

/** Chip input: type and press Enter (or comma) to add. */
export function TagInput({
  label,
  values,
  onChange,
  placeholder,
  className,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  className?: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const v = draft.trim().replace(/,$/, "");
    if (v && !values.includes(v)) onChange([...values, v]);
    setDraft("");
  };

  return (
    <Field label={label} hint="Press Enter to add" className={className}>
      {(id) => (
        <div className="rounded-lg border border-[#dfe4ec] bg-[#fafbfc] p-2 transition focus-within:border-brand focus-within:bg-white focus-within:ring-2 focus-within:ring-brand/15">
          <div className="flex flex-wrap gap-1.5">
            {values.map((v) => (
              <span
                key={v}
                className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand"
              >
                {v}
                <button
                  type="button"
                  aria-label={`Remove ${v}`}
                  onClick={() => onChange(values.filter((x) => x !== v))}
                  className="rounded-full hover:text-brand-dark"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            <input
              id={id}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  add();
                } else if (e.key === "Backspace" && !draft && values.length) {
                  onChange(values.slice(0, -1));
                }
              }}
              onBlur={add}
              placeholder={values.length ? "" : placeholder}
              className="min-w-[8rem] flex-1 bg-transparent px-1.5 py-1 text-sm text-ink outline-none placeholder:text-[#9aa3b3]"
            />
          </div>
        </div>
      )}
    </Field>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-semibold text-ink">{label}</p>
        {description && <p className="mt-0.5 text-[13px] text-mute">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-brand" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark active:scale-[0.98] disabled:opacity-60";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-[#dfe3ea] bg-white px-4 py-2.5 text-sm font-semibold text-[#374151] transition hover:bg-[#f8fafc] active:scale-[0.98]";
export const btnDanger =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-danger px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#cf3a3f] active:scale-[0.98]";

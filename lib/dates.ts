export type PeriodId = "1m" | "3m" | "4m" | "6m" | "12m" | "all" | "custom";

export interface Period {
  id: PeriodId;
  from?: string; // custom range, ISO
  to?: string;
}

export const PERIOD_OPTIONS: { id: PeriodId; label: string; months?: number }[] = [
  { id: "1m", label: "1 month", months: 1 },
  { id: "3m", label: "3 months", months: 3 },
  { id: "4m", label: "4 months", months: 4 },
  { id: "6m", label: "6 months", months: 6 },
  { id: "12m", label: "1 year", months: 12 },
  { id: "all", label: "All time" },
  { id: "custom", label: "Custom" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** ISO yyyy-mm-dd -> "24 Sep 2026" (locale independent, so SSR and browser agree). */
export function formatDate(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return `${MONTHS_LONG[m - 1]} ${y}`;
}

export function shortMonth(key: string) {
  const [, m] = key.split("-").map(Number);
  return MONTHS[m - 1];
}

export const monthKey = (iso: string) => iso.slice(0, 7);

function monthsAgoISO(now: number, months: number) {
  const d = new Date(now);
  d.setMonth(d.getMonth() - months);
  return toISO(d);
}

/** Resolve a period into inclusive [from, to] ISO bounds (empty string = open). */
export function periodBounds(period: Period, now: number): { from: string; to: string } {
  if (period.id === "all") return { from: "", to: "" };
  if (period.id === "custom") return { from: period.from ?? "", to: period.to ?? "" };
  const months = PERIOD_OPTIONS.find((p) => p.id === period.id)?.months ?? 6;
  return { from: monthsAgoISO(now, months), to: toISO(new Date(now)) };
}

export function inPeriod(iso: string, period: Period, now: number) {
  const { from, to } = periodBounds(period, now);
  if (from && iso < from) return false;
  if (to && iso > to) return false;
  return true;
}

export function periodLabel(period: Period, now: number) {
  if (period.id === "all") return "All time";
  const { from, to } = periodBounds(period, now);
  if (period.id === "custom") {
    if (from && to) return `${formatDate(from)} to ${formatDate(to)}`;
    if (from) return `Since ${formatDate(from)}`;
    if (to) return `Until ${formatDate(to)}`;
    return "All time";
  }
  return `${formatDate(from)} to ${formatDate(to)}`;
}

export function daysSince(iso: string, now: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const then = Date.UTC(y, m - 1, d);
  const today = new Date(now);
  const t = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.max(0, Math.round((t - then) / 86400000));
}

export function relativeDays(iso: string, now: number) {
  const n = daysSince(iso, now);
  if (n === 0) return "Today";
  if (n === 1) return "Yesterday";
  if (n < 30) return `${n} days ago`;
  const mo = Math.round(n / 30);
  return mo === 1 ? "1 month ago" : `${mo} months ago`;
}

export function ageFromDob(dob: string, now: number) {
  if (!dob) return null;
  const [y, m, d] = dob.split("-").map(Number);
  if (!y) return null;
  const t = new Date(now);
  let age = t.getFullYear() - y;
  if (t.getMonth() + 1 < m || (t.getMonth() + 1 === m && t.getDate() < d)) age -= 1;
  return age >= 0 ? age : null;
}

/** Last N month keys (yyyy-mm), oldest first. */
export function lastMonthKeys(now: number, count: number) {
  const out: string[] = [];
  const d = new Date(now);
  d.setDate(1);
  for (let i = count - 1; i >= 0; i--) {
    const x = new Date(d.getFullYear(), d.getMonth() - i, 1);
    out.push(`${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}`);
  }
  return out;
}

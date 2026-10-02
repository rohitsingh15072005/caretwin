import type { MedicalRecord, Member, Metric, RecordType } from "./types";
import { formatDate, monthKey } from "./dates";

export interface FlaggedMetric extends Metric {
  recordTitle: string;
  date: string;
  memberName: string;
}

export interface ReportSummary {
  total: number;
  analyzed: number;
  byType: { type: RecordType; count: number }[];
  flagged: FlaggedMetric[];
  followUps: MedicalRecord[];
  doctors: string[];
  headline: string;
  paragraphs: string[];
  text: string;
}

/**
 * Builds a plain-language summary from the records in a period.
 * This runs entirely in the browser from the data you stored.
 * Swap `buildSummary` for an API call when the AI backend is ready.
 */
export function buildSummary(
  records: MedicalRecord[],
  members: Member[],
  scopeLabel: string,
  rangeLabel: string,
): ReportSummary {
  const nameOf = (id: string) => members.find((m) => m.id === id)?.name ?? "Unknown";
  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));

  const typeCount = new Map<RecordType, number>();
  sorted.forEach((r) => typeCount.set(r.type, (typeCount.get(r.type) ?? 0) + 1));
  const byType = [...typeCount.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  const flagged: FlaggedMetric[] = [];
  sorted.forEach((r) =>
    r.metrics?.forEach((m) => {
      if (m.flag !== "normal")
        flagged.push({ ...m, recordTitle: r.title, date: r.date, memberName: nameOf(r.memberId) });
    }),
  );

  const followUps = sorted.filter((r) => r.followUp);
  const analyzed = sorted.filter((r) => r.analysis).length;
  const doctors = [...new Set(sorted.map((r) => r.doctor).filter(Boolean))];
  const total = sorted.length;

  if (total === 0) {
    const headline = "No records in this period";
    return {
      total, analyzed, byType, flagged, followUps, doctors, headline,
      paragraphs: ["There are no records for the selected family member and period. Try a longer period or add a record."],
      text: `${headline}\n${scopeLabel} | ${rangeLabel}`,
    };
  }

  const months = new Set(sorted.map((r) => monthKey(r.date))).size;
  const headline =
    flagged.length === 0
      ? "Everything in this period looks stable"
      : `${flagged.length} result${flagged.length > 1 ? "s" : ""} need attention`;

  const paragraphs: string[] = [];
  paragraphs.push(
    `${scopeLabel} had ${total} record${total > 1 ? "s" : ""} across ${months} month${months > 1 ? "s" : ""} (${rangeLabel}), mostly ${byType
      .slice(0, 2)
      .map((t) => `${t.type.toLowerCase()} (${t.count})`)
      .join(" and ")}. ${analyzed} of them include an AI review.`,
  );

  if (flagged.length) {
    const top = flagged
      .slice(0, 3)
      .map((f) => `${f.label} ${f.value} (${f.date ? formatDate(f.date) : ""})`)
      .join("; ");
    paragraphs.push(
      `Results outside the normal range: ${top}${flagged.length > 3 ? `, and ${flagged.length - 3} more` : ""}. These are worth discussing at the next appointment.`,
    );
  } else {
    paragraphs.push("No results were flagged as outside the normal range.");
  }

  if (followUps.length) {
    paragraphs.push(
      `${followUps.length} record${followUps.length > 1 ? "s" : ""} ${followUps.length > 1 ? "are" : "is"} marked for follow-up: ${followUps
        .map((f) => f.title)
        .join(", ")}.`,
    );
  }

  const text = [
    `CareTwin health summary`,
    `${scopeLabel} | ${rangeLabel}`,
    ``,
    headline,
    ``,
    ...paragraphs,
    ``,
    `Records included:`,
    ...sorted.map(
      (r) => `- ${formatDate(r.date)} | ${r.type} | ${r.title} | ${nameOf(r.memberId)} | ${r.doctor}`,
    ),
    ``,
    `This summary is generated from your stored records and is not medical advice.`,
  ].join("\n");

  return { total, analyzed, byType, flagged, followUps, doctors, headline, paragraphs, text };
}

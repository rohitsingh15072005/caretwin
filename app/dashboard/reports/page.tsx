"use client";

import { useMemo, useState } from "react";
import { Download, Printer, ClipboardList } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import MemberTabs from "@/components/shared/MemberTabs";
import PeriodPicker from "@/components/shared/PeriodPicker";
import { btnGhost } from "@/components/ui/Field";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { useCareData } from "@/lib/useCareData";
import { formatDate, inPeriod, periodLabel, type Period } from "@/lib/dates";
import { downloadText, slug } from "@/lib/download";

export default function ReportsPage() {
  const { hydrated, now, self, scopedRecords, recordsState, refreshRecords } = useCareData();
  const [period, setPeriod] = useState<Period>({ id: "6m" });
  const inRange = useMemo(
    () => scopedRecords.filter((record) => inPeriod(record.date, period, now)).sort((a, b) => b.date.localeCompare(a.date)),
    [scopedRecords, period, now],
  );
  const byType = useMemo(() => {
    const counts = new Map<string, number>();
    inRange.forEach((record) => counts.set(record.type, (counts.get(record.type) ?? 0) + 1));
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [inRange]);
  const range = periodLabel(period, now);

  const exportReport = () => {
    const lines = [
      `Medical record summary for ${self.name || "your account"}`,
      range,
      `${inRange.length} records`,
      "",
      ...inRange.map((record) => [
        `${formatDate(record.date)} | ${record.type} | ${record.title}`,
        record.doctor ? `Doctor: ${record.doctor}` : "",
        record.hospital ? `Hospital: ${record.hospital}` : "",
        record.description,
      ].filter(Boolean).join("\n")),
    ];
    downloadText(`records-${slug(self.name || "account")}.txt`, lines.join("\n\n"));
  };

  return (
    <Stagger className="mx-auto w-full max-w-[1000px] space-y-5">
      <StaggerItem>
        <PageHeader icon={<ClipboardList size={22} />} title="Record summary" subtitle="A local overview of records fetched from your CareTwin account. No AI analysis or medical interpretation is generated here." />
      </StaggerItem>

      <StaggerItem>
        <section className="space-y-4 rounded-xl border border-line bg-white p-5">
          <div>
            <p className="mb-2 text-[13px] font-semibold text-[#374151]">Account</p>
            <MemberTabs />
          </div>
          <div>
            <p className="mb-2 text-[13px] font-semibold text-[#374151]">Period</p>
            <PeriodPicker idPrefix="reports" value={period} onChange={setPeriod} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <p className="text-[13px] text-mute" aria-live="polite">
              {recordsState.status === "ready" ? `${inRange.length} record${inRange.length === 1 ? "" : "s"} in ${range}` : ""}
            </p>
            <div className="flex gap-2">
              <button type="button" className={btnGhost} onClick={() => window.print()} disabled={!inRange.length}><Printer size={16} /> Print</button>
              <button type="button" className={btnGhost} onClick={exportReport} disabled={!inRange.length}><Download size={16} /> Download .txt</button>
            </div>
          </div>
        </section>
      </StaggerItem>

      <StaggerItem>
        {recordsState.status === "loading" || !hydrated ? (
          <div className="ct-skeleton h-48 rounded-xl" />
        ) : recordsState.status === "error" ? (
          <div role="alert" className="rounded-xl border border-[#f3b5b5] bg-white p-5 text-sm text-danger">
            <p>{recordsState.error}</p>
            <button type="button" onClick={() => void refreshRecords()} className="mt-2 font-semibold underline">Retry</button>
          </div>
        ) : inRange.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#cfd7e6] bg-white px-6 py-12 text-center">
            <ClipboardList size={32} className="mx-auto text-[#c3cbda]" />
            <p className="mt-3 text-sm font-semibold text-ink">No records in this period</p>
            <p className="mx-auto mt-1 max-w-sm text-[13px] text-mute">Add a record or choose a different time range.</p>
          </div>
        ) : (
          <section className="space-y-4 rounded-xl border border-line bg-white p-5 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-[#f8f9fc] p-4">
                <p className="text-xs font-semibold text-mute">Records in range</p>
                <p className="mt-1 text-2xl font-bold text-ink">{inRange.length}</p>
              </div>
              <div className="rounded-lg bg-[#f8f9fc] p-4">
                <p className="text-xs font-semibold text-mute">Record categories</p>
                <p className="mt-1 text-2xl font-bold text-ink">{byType.length}</p>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold text-ink">By category</h2>
              <ul className="mt-2 divide-y divide-line">
                {byType.map(([type, count]) => (
                  <li key={type} className="flex justify-between py-2 text-sm">
                    <span className="text-body">{type}</span><span className="font-semibold text-ink">{count}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-bold text-ink">Records</h2>
              <ol className="mt-2 divide-y divide-line">
                {inRange.map((record) => (
                  <li key={record.id} className="py-3">
                    <p className="text-sm font-semibold text-ink">{record.title}</p>
                    <p className="mt-0.5 text-xs text-mute">{record.type} · {formatDate(record.date)}{record.doctor ? ` · ${record.doctor}` : ""}</p>
                    {record.description && <p className="mt-1 text-[13px] leading-5 text-body">{record.description}</p>}
                  </li>
                ))}
              </ol>
            </div>
            <p className="border-t border-line pt-4 text-xs leading-5 text-mute">This page organizes fetched record metadata only. It does not analyze test results or provide medical advice.</p>
          </section>
        )}
      </StaggerItem>
    </Stagger>
  );
}

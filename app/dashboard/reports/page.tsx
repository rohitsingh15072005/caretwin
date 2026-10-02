"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ClipboardList, Sparkles, Printer, Copy, Download, BellRing, CheckCircle2, Loader2, TriangleAlert } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import MemberTabs from "@/components/shared/MemberTabs";
import PeriodPicker from "@/components/shared/PeriodPicker";
import { btnGhost, btnPrimary } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { Stagger, StaggerItem, CountUp } from "@/components/ui/Motion";
import { ALL_ID, useCareData } from "@/lib/useCareData";
import { formatDate, inPeriod, periodLabel, type Period } from "@/lib/dates";
import { buildSummary, type ReportSummary } from "@/lib/summary";
import { downloadText, slug } from "@/lib/download";

const STEPS = ["Collecting records", "Reading key results", "Writing your summary"];

const flagStyle = {
  normal: "bg-[#e5faef] text-[#15965d]",
  watch: "bg-[#fff6e5] text-[#b7791f]",
  abnormal: "bg-danger-soft text-danger",
};

export default function ReportsPage() {
  const toast = useToast();
  const { hydrated, now, members, memberById, scopedRecords, activeId } = useCareData();
  const [period, setPeriod] = useState<Period>({ id: "6m" });
  const [step, setStep] = useState(-1); // -1 idle, 0..2 working, 3 done
  const [result, setResult] = useState<{ summary: ReportSummary; scope: string; range: string; ids: string[] } | null>(null);

  const inRange = useMemo(
    () => scopedRecords.filter((r) => inPeriod(r.date, period, now)),
    [scopedRecords, period, now],
  );
  const scope = activeId === ALL_ID ? "Your family" : (memberById.get(activeId)?.name ?? "");
  const range = periodLabel(period, now);

  const generate = () => {
    setResult(null);
    setStep(0);
    const snapshot = inRange;
    const run = (i: number) => {
      if (i < STEPS.length) {
        setStep(i);
        setTimeout(() => run(i + 1), 650);
      } else {
        setResult({ summary: buildSummary(snapshot, members, scope, range), scope, range, ids: snapshot.map((r) => r.id) });
        setStep(3);
      }
    };
    run(0);
  };

  const working = step >= 0 && step < 3;
  const s = result?.summary;
  const stale = result && result.ids.join() !== inRange.map((r) => r.id).join();

  return (
    <Stagger className="mx-auto w-full max-w-[1000px] space-y-5">
      <StaggerItem>
        <PageHeader
          icon={<ClipboardList size={22} />}
          title="Report Summary"
          subtitle="Pick who and how far back to look. CareTwin condenses those records into one readable summary."
        />
      </StaggerItem>

      <StaggerItem>
        <section className="no-print space-y-4 rounded-xl border border-line bg-white p-5">
          <div>
            <p className="mb-2 text-[13px] font-semibold text-[#374151]">Family member</p>
            <MemberTabs />
          </div>
          <div>
            <p className="mb-2 text-[13px] font-semibold text-[#374151]">Period</p>
            <PeriodPicker idPrefix="reports" value={period} onChange={setPeriod} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <p className="text-[13px] text-mute" aria-live="polite">
              {hydrated ? `${inRange.length} record${inRange.length === 1 ? "" : "s"} in ${range}` : ""}
            </p>
            <button type="button" className={btnPrimary} disabled={working || !hydrated} onClick={generate}>
              {working ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {working ? "Summarising…" : result ? "Update summary" : "Summarise reports"}
            </button>
          </div>
        </section>
      </StaggerItem>

      <AnimatePresence mode="wait">
        {working && (
          <motion.section key="working" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-xl border border-line bg-white p-6">
            <ul className="space-y-3">
              {STEPS.map((label, i) => (
                <li key={label} className="flex items-center gap-3 text-sm">
                  {i < step ? (
                    <CheckCircle2 size={18} className="text-[#15965d]" />
                  ) : i === step ? (
                    <Loader2 size={18} className="animate-spin text-brand" />
                  ) : (
                    <span className="h-[18px] w-[18px] rounded-full border-2 border-[#d9dfeb]" />
                  )}
                  <span className={i <= step ? "font-semibold text-ink" : "text-mute"}>{label}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-2">
              <div className="ct-skeleton h-4 w-3/4 rounded" />
              <div className="ct-skeleton h-4 w-full rounded" />
              <div className="ct-skeleton h-4 w-2/3 rounded" />
            </div>
          </motion.section>
        )}

        {!working && s && result && (
          <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {stale && (
              <div className="no-print flex items-center gap-2 rounded-lg border border-[#f0dfc1] bg-[#fffaf0] px-4 py-3 text-[13px] text-[#7a5c1f]">
                <TriangleAlert size={16} /> Your selection changed. Choose Update summary to refresh this report.
              </div>
            )}

            <div className="no-print flex flex-wrap gap-2">
              <button type="button" className={btnGhost} onClick={() => window.print()}>
                <Printer size={16} /> Print or save as PDF
              </button>
              <button
                type="button"
                className={btnGhost}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(s.text);
                    toast("Summary copied");
                  } catch {
                    toast("Copy is blocked by the browser", "error");
                  }
                }}
              >
                <Copy size={16} /> Copy text
              </button>
              <button type="button" className={btnGhost} onClick={() => downloadText(`summary-${slug(result.scope)}.txt`, s.text)}>
                <Download size={16} /> Download .txt
              </button>
            </div>

            <article id="print-area" className="space-y-6 rounded-2xl border border-line bg-white p-6 sm:p-8">
              <header className="border-b border-line pb-5">
                <p className="text-[13px] font-semibold text-brand">
                  {result.scope} · {result.range}
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink">{s.headline}</h2>
              </header>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["Records", s.total],
                  ["AI reviewed", s.analyzed],
                  ["Need attention", s.flagged.length],
                  ["Follow-ups", s.followUps.length],
                ].map(([label, n]) => (
                  <div key={label as string} className="rounded-xl bg-[#f8f9fc] px-4 py-3">
                    <p className="text-xs font-semibold text-mute">{label}</p>
                    <p className="mt-0.5 text-2xl font-bold text-ink">
                      <CountUp to={n as number} />
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {s.paragraphs.map((p, i) => (
                  <p key={i} className="max-w-prose text-[15px] leading-7 text-body">
                    {p}
                  </p>
                ))}
              </div>

              {s.byType.length > 0 && (
                <section>
                  <h3 className="text-sm font-bold text-ink">By category</h3>
                  <ul className="mt-3 space-y-2.5">
                    {s.byType.map((t) => (
                      <li key={t.type} className="flex items-center gap-3 text-[13px]">
                        <span className="w-28 shrink-0 text-body">{t.type}</span>
                        <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#eef1f7]">
                          <motion.span
                            className="block h-full rounded-full bg-brand"
                            initial={{ width: 0 }}
                            animate={{ width: `${(t.count / s.byType[0].count) * 100}%` }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                          />
                        </span>
                        <span className="w-6 text-right font-semibold text-ink">{t.count}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {s.flagged.length > 0 && (
                <section>
                  <h3 className="text-sm font-bold text-ink">Results to discuss with a doctor</h3>
                  <ul className="mt-3 divide-y divide-[#f0f2f6] rounded-lg border border-line">
                    {s.flagged.map((f, i) => (
                      <li key={i} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                        <span>
                          <span className="font-semibold text-ink">{f.label}</span>
                          <span className="block text-xs text-mute">
                            {f.memberName} · {f.recordTitle} · {formatDate(f.date)}
                          </span>
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="font-semibold text-ink">{f.value}</span>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${flagStyle[f.flag]}`}>{f.flag === "watch" ? "Watch" : "Abnormal"}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {s.followUps.length > 0 && (
                <section>
                  <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
                    <BellRing size={15} className="text-danger" /> Open follow-ups
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {s.followUps.map((r) => (
                      <li key={r.id} className="rounded-lg bg-danger-soft px-4 py-3 text-sm">
                        <span className="font-semibold text-ink">{r.title}</span>
                        <span className="block text-xs text-mute">
                          {memberById.get(r.memberId)?.name} · {formatDate(r.date)} · {r.doctor}
                        </span>
                        {r.analysis && <span className="mt-1 block text-[13px] text-body">{r.analysis}</span>}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {s.total > 0 && (
                <section>
                  <h3 className="text-sm font-bold text-ink">Timeline</h3>
                  <ol className="mt-3 space-y-2 border-l-2 border-[#d5ddec] pl-5">
                    {[...inRange.filter((r) => result.ids.includes(r.id))]
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .map((r) => (
                        <li key={r.id} className="relative text-sm">
                          <span className="absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full bg-brand" />
                          <span className="font-semibold text-ink">{r.title}</span>
                          <span className="text-mute">
                            {" "}
                            · {r.type} · {formatDate(r.date)}
                          </span>
                        </li>
                      ))}
                  </ol>
                </section>
              )}

              <p className="border-t border-line pt-4 text-xs leading-5 text-mute">
                Generated on this device from the records you added. It is a convenience summary, not medical advice. Please review results with a qualified clinician.
              </p>
            </article>
          </motion.div>
        )}

        {!working && !s && hydrated && (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="no-print rounded-xl border border-dashed border-[#cfd7e6] bg-white px-6 py-12 text-center">
            <ClipboardList size={32} className="mx-auto text-[#c3cbda]" />
            <p className="mt-3 text-sm font-semibold text-ink">Your summary will appear here</p>
            <p className="mx-auto mt-1 max-w-sm text-[13px] text-mute">Choose a family member and a period such as the past 4 or 6 months, then select Summarise reports.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Stagger>
  );
}

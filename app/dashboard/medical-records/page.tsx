"use client";

import { Suspense, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, Rows3, Search, FileSearch } from "lucide-react";

import MedicalRecordsHeader from "@/components/Dashboard/MedicalRecords/MedicalRecordsHeader";
import RecordStats from "@/components/Dashboard/MedicalRecords/RecordStats";
import MedicalRecordCard from "@/components/Dashboard/MedicalRecords/MedicalRecordCard";
import AddRecordCard from "@/components/Dashboard/MedicalRecords/AddRecordCard";
import AddRecordModal from "@/components/Dashboard/MedicalRecords/AddRecordModal";
import RecordDetailModal from "@/components/Dashboard/MedicalRecords/RecordDetailModal";
import RecordTimeline from "@/components/Dashboard/MedicalRecords/RecordTimeline";
import TimelineStrip from "@/components/Dashboard/MedicalRecords/TimelineStrip";
import MemberTabs from "@/components/shared/MemberTabs";
import PeriodPicker from "@/components/shared/PeriodPicker";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { useToast } from "@/components/ui/Toast";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { inputCls, btnPrimary } from "@/components/ui/Field";
import { RECORD_TYPE_TO_API, RECORD_TYPES } from "@/lib/data";
import { useCareData } from "@/lib/useCareData";
import { formatDate, inPeriod, periodLabel, toISO, type Period } from "@/lib/dates";
import { downloadText, slug } from "@/lib/download";
import type { MedicalRecord } from "@/lib/types";

export default function MedicalRecordsPage() {
  return (
    <Suspense fallback={<div className="ct-skeleton mx-auto h-64 max-w-[1200px] rounded-2xl" />}>
      <RecordsView />
    </Suspense>
  );
}

function RecordsView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const toast = useToast();
  const {
    hydrated,
    now,
    self,
    memberById,
    scopedRecords,
    activeId,
    recordsState,
    refreshRecords,
    createRecord,
    updateRecord,
    deleteRecord,
  } = useCareData();

  // Search text and the add dialog live in the URL, so header search and "Add record" links work from anywhere.
  const query = params.get("q") ?? "";
  const addOpen = params.get("add") === "1";

  const setParam = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const [period, setPeriod] = useState<Period>({ id: "6m" });
  const [type, setType] = useState("All");
  const [view, setView] = useState<"grid" | "timeline">("grid");
  const [detail, setDetail] = useState<MedicalRecord | null>(null);
  const [toDelete, setToDelete] = useState<MedicalRecord | null>(null);
  const [editing, setEditing] = useState<MedicalRecord | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scopedRecords
      .filter((r) => inPeriod(r.date, period, now))
      .filter((r) => type === "All" || r.type === type)
      .filter(
        (r) =>
          !q ||
          `${r.title} ${r.description} ${r.doctor} ${r.type} ${memberById.get(r.memberId)?.name ?? ""}`
            .toLowerCase()
            .includes(q),
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [scopedRecords, period, type, query, now, memberById]);

  const download = (r: MedicalRecord) => {
    const m = memberById.get(r.memberId);
    const lines = [
      r.title,
      `${r.type} | ${formatDate(r.date)}`,
      `Patient: ${m?.name || "You"}`,
      `Doctor: ${r.doctor || "Not added"}`,
      `Hospital: ${r.hospital || "Not added"}`,
      "",
      r.description,
    ];
    downloadText(`${slug(r.title)}.txt`, lines.join("\n"));
    toast("Summary downloaded");
  };

  const showMember = false;
  const today = toISO(new Date(now));
  const scopeName = memberById.get(activeId)?.name || "you";

  const saveRecord = async (record: MedicalRecord) => {
    const input = {
      title: record.title,
      recordType: RECORD_TYPE_TO_API[record.type],
      description: record.description || null,
      doctorName: record.doctor || null,
      hospitalName: record.hospital || null,
      recordDate: record.date,
    };
    if (record.id) {
      await updateRecord(record.id, input);
      toast("Record updated");
    } else {
      await createRecord({
        title: input.title,
        recordType: input.recordType,
        description: record.description || undefined,
        doctorName: record.doctor || undefined,
        hospitalName: record.hospital || undefined,
        recordDate: record.date,
      });
      toast("Record added");
    }
  };

  return (
    <Stagger className="mx-auto w-full max-w-[1200px] space-y-5">
      <StaggerItem>
        <MedicalRecordsHeader onAdd={() => setParam({ add: "1" })} />
      </StaggerItem>

      <StaggerItem>
        <MemberTabs />
      </StaggerItem>

      <StaggerItem>
        {recordsState.status === "ready" && <RecordStats records={scopedRecords} now={now} />}
        {recordsState.status === "loading" && <div className="ct-skeleton h-20 rounded-xl" />}
      </StaggerItem>

      {recordsState.status === "error" && (
        <StaggerItem>
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#f3b5b5] bg-white px-4 py-3 text-sm text-danger">
            <span>{recordsState.error}</span>
            <button type="button" onClick={() => void refreshRecords()} className="font-semibold underline">Retry</button>
          </div>
        </StaggerItem>
      )}

      {/* Time limiter */}
      <StaggerItem>
        <section className="space-y-3" aria-label="Time range">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-[15px] font-bold text-ink">Show records from the past</h2>
              <p className="text-[13px] text-mute">
                {hydrated ? periodLabel(period, now) : ""}
              </p>
            </div>
          </div>
          <PeriodPicker idPrefix="records" value={period} onChange={setPeriod} />
          <TimelineStrip records={scopedRecords} period={period} now={now} />
        </section>
      </StaggerItem>

      {/* Filters */}
      <StaggerItem>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setParam({ q: e.target.value || null })}
              aria-label="Search records"
              placeholder="Search by title, doctor or type"
              className={`${inputCls} pl-10`}
            />
          </div>
          <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Filter by type" className={`${inputCls} sm:w-48`}>
            <option>All</option>
            {RECORD_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <div role="group" aria-label="Layout" className="flex rounded-lg border border-[#dfe3ea] bg-white p-1">
            {([
              ["grid", "Cards", LayoutGrid],
              ["timeline", "Timeline", Rows3],
            ] as const).map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                aria-pressed={view === id}
                onClick={() => setView(id)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-semibold transition ${
                  view === id ? "bg-brand text-white" : "text-body hover:text-ink"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </StaggerItem>

      <StaggerItem>
        <p className="text-[13px] text-mute" aria-live="polite">
          {hydrated ? `${visible.length} record${visible.length === 1 ? "" : "s"} for ${scopeName}` : ""}
        </p>

        {!hydrated || recordsState.status === "loading" ? (
          <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="ct-skeleton h-60 rounded-xl" />
            ))}
          </div>
        ) : view === "timeline" ? (
          <div className="mt-4">
            {visible.length ? (
              <RecordTimeline records={visible} memberById={memberById} showMember={showMember} onView={setDetail} />
            ) : (
              <EmptyState onAdd={() => setParam({ add: "1" })} />
            )}
          </div>
        ) : (
          <section className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((r) => (
                <motion.div
                  key={r.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.25 }}
                >
                  <MedicalRecordCard
                    record={r}
                    member={memberById.get(r.memberId)}
                    showMember={showMember}
                    onView={() => setDetail(r)}
                    onEdit={() => setEditing(r)}
                    onDownload={() => download(r)}
                    onDelete={() => setToDelete(r)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            <AddRecordCard onClick={() => setParam({ add: "1" })} />
          </section>
        )}
        {hydrated && recordsState.status === "ready" && view === "grid" && visible.length === 0 && (
          <div className="mt-4">
            <EmptyState onAdd={() => setParam({ add: "1" })} />
          </div>
        )}
      </StaggerItem>

      <AddRecordModal
        open={addOpen || !!editing}
        onClose={() => {
          setEditing(null);
          setParam({ add: null });
        }}
        memberId={self.id}
        today={today}
        record={editing}
        onSave={saveRecord}
      />

      <RecordDetailModal record={detail} member={detail ? memberById.get(detail.memberId) : undefined} onClose={() => setDetail(null)} onDownload={download} onEdit={() => {
        if (detail) setEditing(detail);
        setDetail(null);
      }} />

      <ConfirmModal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete this record?"
        message={`"${toDelete?.title ?? ""}" will be deleted from your CareTwin account. This cannot be undone.`}
        onConfirm={() => {
          if (!toDelete) return;
          void deleteRecord(toDelete.id).then(() => {
            toast("Record deleted", "info");
            setToDelete(null);
          }).catch((error: unknown) => {
            toast(error instanceof Error ? error.message : "Record could not be deleted.", "error");
          });
        }}
      />
    </Stagger>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-xl border border-dashed border-[#cfd7e6] bg-white px-6 py-12 text-center">
      <FileSearch size={32} className="mx-auto text-[#c3cbda]" />
      <p className="mt-3 text-sm font-semibold text-ink">No records match these filters</p>
      <p className="mx-auto mt-1 max-w-sm text-[13px] text-mute">Try a longer period, clear the search, or add a new record.</p>
      <button type="button" onClick={onAdd} className={`${btnPrimary} mt-4`}>
        Add record
      </button>
    </div>
  );
}

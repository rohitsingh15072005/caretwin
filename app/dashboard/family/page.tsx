"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Users, Plus, Pencil, Trash2, FileText, QrCode, Droplet, AlertTriangle } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import Modal from "@/components/ui/Modal";
import Avatar from "@/components/ui/Avatar";
import MemberForm from "@/components/shared/MemberForm";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { useToast } from "@/components/ui/Toast";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { btnGhost, btnPrimary } from "@/components/ui/Field";
import { MEMBER_COLORS, SELF_ID } from "@/lib/data";
import { newId, useCareData } from "@/lib/useCareData";
import { ageFromDob, toISO } from "@/lib/dates";
import type { Member } from "@/lib/types";

const BLANK: Member = {
  id: "new",
  name: "",
  relation: "Other",
  dob: "",
  gender: "",
  bloodGroup: "",
  heightCm: "",
  weightKg: "",
  allergies: [],
  conditions: [],
  medications: [],
  primaryDoctor: "",
  insurance: "",
  organDonor: false,
  contacts: [],
  color: MEMBER_COLORS[3],
};

export default function FamilyPage() {
  return (
    <Suspense fallback={<div className="ct-skeleton mx-auto h-64 max-w-[1200px] rounded-2xl" />}>
      <FamilyView />
    </Suspense>
  );
}

function FamilyView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const toast = useToast();
  const { hydrated, now, members, setMembers, records, setRecords, setActiveId } = useCareData();

  const [editing, setEditing] = useState<Member | null>(null);
  const [toRemove, setToRemove] = useState<Member | null>(null);

  const blank = () => ({ ...BLANK, color: MEMBER_COLORS[members.length % MEMBER_COLORS.length] });
  const addOpen = params.get("add") === "1";
  const modalMember = editing ?? (addOpen ? blank() : null);

  const closeModal = () => {
    setEditing(null);
    if (addOpen) router.replace(pathname, { scroll: false });
  };

  const save = (m: Member) => {
    if (m.id === "new") {
      setMembers([...members, { ...m, id: newId("m") }]);
      toast(`${m.name} added to your family`);
    } else {
      setMembers(members.map((x) => (x.id === m.id ? m : x)));
      toast("Member updated");
    }
  };

  const linkBtn =
    "flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md border border-[#dfe3ea] text-[13px] font-semibold text-[#374151] transition hover:bg-[#f8fafc]";

  return (
    <Stagger className="mx-auto w-full max-w-[1200px] space-y-5">
      <StaggerItem>
        <PageHeader
          icon={<Users size={22} />}
          title="Family"
          subtitle="Keep records for everyone you care for. Switch between members from the top bar."
          actions={
            <button type="button" className={btnPrimary} onClick={() => setEditing(blank())}>
              <Plus size={16} /> Add member
            </button>
          }
        />
      </StaggerItem>

      <StaggerItem>
        {!hydrated ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="ct-skeleton h-64 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {members.map((m) => {
                const count = records.filter((r) => r.memberId === m.id).length;
                const age = ageFromDob(m.dob, now);
                return (
                  <motion.article
                    key={m.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    className="flex h-full flex-col rounded-xl border border-[#e1e5ee] bg-white p-5"
                  >
                    <div className="flex items-start gap-3.5">
                      <Avatar name={m.name} color={m.color} size={52} />
                      <div className="min-w-0 flex-1">
                        <h2 className="truncate text-base font-bold text-ink">{m.name}</h2>
                        <p className="text-[13px] text-mute">
                          {m.relation}
                          {age !== null && ` · ${age} yrs`}
                          {m.gender && ` · ${m.gender}`}
                        </p>
                      </div>
                      <button type="button" aria-label={`Edit ${m.name}`} onClick={() => setEditing(m)} className="rounded-lg p-2 text-mute transition hover:bg-slate-100 hover:text-ink">
                        <Pencil size={16} />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {m.bloodGroup && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-danger-soft px-2.5 py-1 text-xs font-semibold text-danger">
                          <Droplet size={12} /> {m.bloodGroup}
                        </span>
                      )}
                      {m.allergies.slice(0, 2).map((a) => (
                        <span key={a} className="inline-flex items-center gap-1 rounded-full bg-[#fff6e5] px-2.5 py-1 text-xs font-semibold text-[#b7791f]">
                          <AlertTriangle size={12} /> {a}
                        </span>
                      ))}
                      {m.conditions.slice(0, 2).map((c) => (
                        <span key={c} className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand">
                          {c}
                        </span>
                      ))}
                      {!m.bloodGroup && !m.allergies.length && !m.conditions.length && (
                        <span className="text-[13px] text-mute">No medical details yet</span>
                      )}
                    </div>

                    <p className="mt-4 text-[13px] text-mute">
                      <span className="font-bold text-ink">{count}</span> record{count === 1 ? "" : "s"}
                    </p>

                    <div className="mt-auto flex gap-2 pt-4">
                      <Link href="/dashboard/medical-records" onClick={() => setActiveId(m.id)} className={linkBtn}>
                        <FileText size={14} /> Records
                      </Link>
                      <Link href="/dashboard/emergency" onClick={() => setActiveId(m.id)} className={linkBtn}>
                        <QrCode size={14} /> QR card
                      </Link>
                      {m.id !== SELF_ID && (
                        <button type="button" aria-label={`Remove ${m.name}`} onClick={() => setToRemove(m)} className="flex h-9 w-10 items-center justify-center rounded-md border border-[#f3b5b5] text-danger transition hover:bg-[#fff4f4]">
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setEditing(blank())}
              className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#bfc8dc] px-5 transition hover:border-brand hover:bg-white"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e9edff] text-brand">
                <Plus size={20} />
              </span>
              <span className="mt-3 text-sm font-semibold text-[#374151]">Add family member</span>
              <span className="mt-1 text-xs text-[#8b95a7]">Parents, partner, children</span>
            </button>
          </div>
        )}
      </StaggerItem>

      <Modal
        open={!!modalMember}
        onClose={closeModal}
        size="lg"
        title={modalMember?.id === "new" ? "Add family member" : "Edit member"}
        description="These details also feed the emergency card."
      >
        {modalMember && <Editor key={modalMember.id} member={modalMember} today={toISO(new Date(now))} onSave={save} onClose={closeModal} />}
      </Modal>

      <ConfirmModal
        open={!!toRemove}
        onClose={() => setToRemove(null)}
        title={`Remove ${toRemove?.name ?? "member"}?`}
        message="Their profile and all of their medical records will be deleted from this device. This cannot be undone."
        confirmLabel="Remove member"
        onConfirm={() => {
          if (!toRemove) return;
          setMembers(members.filter((m) => m.id !== toRemove.id));
          setRecords(records.filter((r) => r.memberId !== toRemove.id));
          toast(`${toRemove.name} removed`, "info");
        }}
      />
    </Stagger>
  );
}

function Editor({ member, today, onSave, onClose }: { member: Member; today: string; onSave: (m: Member) => void; onClose: () => void }) {
  const [draft, setDraft] = useState(member);
  const [error, setError] = useState<string>();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.name.trim()) {
      setError("Enter the member's name.");
      return;
    }
    onSave({ ...draft, name: draft.name.trim(), contacts: draft.contacts.filter((c) => c.name || c.phone) });
    onClose();
  };

  return (
    <form onSubmit={submit}>
      <MemberForm value={draft} onChange={setDraft} errors={{ name: error }} lockRelation={member.id === SELF_ID} today={today} />
      <div className="mt-6 flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
        <button type="button" className={btnGhost} onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className={btnPrimary}>
          {member.id === "new" ? "Add member" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

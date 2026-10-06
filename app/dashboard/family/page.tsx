"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Avatar from "@/components/ui/Avatar";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { RELATIONS } from "@/lib/data";
import { btnDanger, btnGhost, btnPrimary, SelectInput, TextInput } from "@/components/ui/Field";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useCareData } from "@/lib/useCareData";
import { toISO } from "@/lib/dates";
import type { Member } from "@/lib/types";
import type { FamilyGender } from "@/lib/api";

const genderOptions = [
  { value: "", label: "Not provided" },
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

export default function FamilyPage() {
  const {
    members,
    familyState,
    refresh,
    createFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    activeId,
    setActiveId,
  } = useCareData();
  const toast = useToast();
  const [editing, setEditing] = useState<Member | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Member | null>(null);
  const otherMembers = members.filter((member) => !member.isSelf);
  const atMemberLimit = members.length >= 25;

  const saveMember = async (input: {
    name: string;
    relationship: string;
    dateOfBirth?: string | null;
    gender?: FamilyGender | null;
  }) => {
    if (editing) {
      await updateFamilyMember(editing.id, input);
      toast("Family member updated");
    } else {
      await createFamilyMember({
        name: input.name,
        relationship: input.relationship,
        dateOfBirth: input.dateOfBirth ?? undefined,
        gender: input.gender ?? undefined,
      });
      toast("Family member added");
    }
    setFormOpen(false);
    setEditing(null);
  };

  const removeMember = async (member: Member) => {
    try {
      await deleteFamilyMember(member.id);
      toast("Family member removed", "info");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Family member could not be removed.", "error");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1000px] space-y-5">
      <PageHeader
        icon={<Users size={22} />}
        title="Family profiles"
        subtitle="Manage family profiles and keep each person's medical records separate."
        actions={
          <button
            type="button"
            disabled={atMemberLimit || familyState.status !== "ready"}
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className={btnPrimary}
          >
            <Plus size={16} /> Add member
          </button>
        }
      />

      {familyState.status === "loading" ? (
        <div className="ct-skeleton h-40 rounded-xl" />
      ) : familyState.status === "error" ? (
        <section role="alert" className="rounded-xl border border-[#f3b5b5] bg-white p-5 text-sm text-danger">
          <p>{familyState.error}</p>
          <button type="button" onClick={() => void refresh()} className="mt-2 font-semibold underline">Retry</button>
        </section>
      ) : (
        <>
          {atMemberLimit && <p className="text-sm text-mute">The account limit is 25 family profiles, including you.</p>}
          {otherMembers.length === 0 ? (
            <section className="rounded-xl border border-dashed border-[#cfd7e6] bg-white px-6 py-12 text-center">
              <Users size={32} className="mx-auto text-[#c3cbda]" />
              <h2 className="mt-3 text-sm font-semibold text-ink">No family profiles yet</h2>
              <p className="mx-auto mt-1 max-w-md text-[13px] leading-5 text-mute">
                Add a family member to organize their records separately. Only details saved to CareTwin are shown here.
              </p>
              <Link href="/dashboard/profile" className="mt-4 inline-flex text-sm font-semibold text-brand hover:text-brand-dark">
                View your profile
              </Link>
            </section>
          ) : (
            <section className="grid gap-4 sm:grid-cols-2">
              {otherMembers.map((member) => (
                <article key={member.id} className="rounded-xl border border-line bg-white p-5">
                  <div className="flex items-start gap-3">
                    <Avatar name={member.name} color={member.color} size={44} />
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate font-semibold text-ink">{member.name}</h2>
                      <p className="text-sm text-mute">{member.relation}</p>
                      {(member.dob || member.gender) && (
                        <p className="mt-1 text-xs text-mute">
                          {[member.dob, member.gender?.replaceAll("_", " ")].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                    <Link
                      href="/dashboard/medical-records"
                      onClick={() => setActiveId(member.id)}
                      className={btnGhost}
                    >
                      View records
                    </Link>
                    <button
                      type="button"
                      className={btnGhost}
                      onClick={() => {
                        setEditing(member);
                        setFormOpen(true);
                      }}
                    >
                      <Pencil size={15} /> Edit
                    </button>
                    <button type="button" className={btnDanger} onClick={() => setDeleting(member)}>
                      <Trash2 size={15} /> Remove
                    </button>
                    {activeId === member.id && <span className="self-center text-xs font-semibold text-brand">Selected</span>}
                  </div>
                </article>
              ))}
            </section>
          )}
        </>
      )}

      <FamilyMemberModal
        open={formOpen}
        member={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSave={saveMember}
      />
      <ConfirmModal
        open={!!deleting}
        title="Remove family member?"
        message={`Remove ${deleting?.name ?? "this family member"}? Members with records must have those records reassigned before they can be removed.`}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) void removeMember(deleting);
        }}
      />
    </div>
  );
}

function FamilyMemberModal({
  open,
  member,
  onClose,
  onSave,
}: {
  open: boolean;
  member: Member | null;
  onClose: () => void;
  onSave: (input: {
    name: string;
    relationship: string;
    dateOfBirth?: string | null;
    gender?: FamilyGender | null;
  }) => Promise<void>;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={member ? "Edit family profile" : "Add a family member"}
      description="Only the details supported by the CareTwin family profile API are collected."
    >
      {open && (
        <FamilyForm key={member?.id ?? "new"} member={member} onClose={onClose} onSave={onSave} />
      )}
    </Modal>
  );
}

function FamilyForm({
  member,
  onClose,
  onSave,
}: {
  member: Member | null;
  onClose: () => void;
  onSave: (input: {
    name: string;
    relationship: string;
    dateOfBirth?: string | null;
    gender?: FamilyGender | null;
  }) => Promise<void>;
}) {
  const [name, setName] = useState(member?.name ?? "");
  const [relationship, setRelationship] = useState(member?.relation ?? RELATIONS.find((relation) => relation !== "Self") ?? "Other");
  const [dateOfBirth, setDateOfBirth] = useState(member?.dob ?? "");
  const [gender, setGender] = useState(member?.gender ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Enter a name.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave({
        name: name.trim(),
        relationship,
        dateOfBirth: member ? dateOfBirth || null : dateOfBirth || undefined,
        gender: (gender || null) as FamilyGender | null,
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The family profile could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={(event) => void submit(event)} className="space-y-4">
      <TextInput label="Name" value={name} onChange={(event) => setName(event.target.value)} autoFocus />
      <SelectInput
        label="Relationship"
        value={relationship}
        onChange={(event) => setRelationship(event.target.value)}
        options={RELATIONS.filter((relation) => relation !== "Self")}
      />
      <TextInput
        label="Date of birth"
        type="date"
        max={toISO(new Date())}
        value={dateOfBirth}
        onChange={(event) => setDateOfBirth(event.target.value)}
      />
      <SelectInput
        label="Gender"
        value={gender}
        onChange={(event) => setGender(event.target.value)}
        options={genderOptions}
      />
      {error && <p role="alert" className="text-sm font-medium text-danger">{error}</p>}
      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <button type="button" className={btnGhost} onClick={onClose} disabled={saving}>Cancel</button>
        <button type="submit" className={btnPrimary} disabled={saving}>
          {saving ? "Saving…" : member ? "Save changes" : "Add member"}
        </button>
      </div>
    </form>
  );
}

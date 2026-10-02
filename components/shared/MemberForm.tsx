"use client";

import { Plus, Trash2 } from "lucide-react";
import { SelectInput, TagInput, TextInput, Toggle, btnGhost } from "@/components/ui/Field";
import { BLOOD_GROUPS, RELATIONS } from "@/lib/data";
import type { Member } from "@/lib/types";

export interface MemberErrors {
  name?: string;
}

/** Controlled form shared by the Family dialog and the Profile page. */
export default function MemberForm({
  value,
  onChange,
  errors = {},
  lockRelation = false,
  today,
}: {
  value: Member;
  onChange: (m: Member) => void;
  errors?: MemberErrors;
  lockRelation?: boolean;
  today: string;
}) {
  const set = <K extends keyof Member>(k: K, v: Member[K]) => onChange({ ...value, [k]: v });

  return (
    <div className="space-y-8">
      <fieldset className="space-y-4">
        <legend className="mb-1 text-sm font-bold text-ink">Personal details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Full name" value={value.name} error={errors.name} onChange={(e) => set("name", e.target.value)} placeholder="Full name" />
          <SelectInput label="Relation" value={value.relation} disabled={lockRelation} onChange={(e) => set("relation", e.target.value)} options={RELATIONS} />
          <TextInput label="Date of birth" type="date" max={today} value={value.dob} onChange={(e) => set("dob", e.target.value)} />
          <SelectInput label="Gender" value={value.gender} onChange={(e) => set("gender", e.target.value)} options={["", "Male", "Female", "Other"]} />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-1 text-sm font-bold text-ink">Medical details</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <SelectInput label="Blood group" value={value.bloodGroup} onChange={(e) => set("bloodGroup", e.target.value)} options={["", ...BLOOD_GROUPS]} />
          <TextInput label="Height (cm)" inputMode="numeric" value={value.heightCm} onChange={(e) => set("heightCm", e.target.value.replace(/[^\d.]/g, ""))} />
          <TextInput label="Weight (kg)" inputMode="decimal" value={value.weightKg} onChange={(e) => set("weightKg", e.target.value.replace(/[^\d.]/g, ""))} />
        </div>
        <TagInput label="Allergies" values={value.allergies} onChange={(v) => set("allergies", v)} placeholder="e.g. Penicillin" />
        <TagInput label="Medical conditions" values={value.conditions} onChange={(v) => set("conditions", v)} placeholder="e.g. Asthma" />
        <TagInput label="Current medications" values={value.medications} onChange={(v) => set("medications", v)} placeholder="e.g. Metformin 500 mg" />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Primary doctor" value={value.primaryDoctor} onChange={(e) => set("primaryDoctor", e.target.value)} />
          <TextInput label="Insurance / policy no." value={value.insurance} onChange={(e) => set("insurance", e.target.value)} />
        </div>
        <Toggle checked={value.organDonor} onChange={(v) => set("organDonor", v)} label="Organ donor" description="Shown on the emergency card only if you choose to include it." />
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="mb-1 text-sm font-bold text-ink">Emergency contacts</legend>
        {value.contacts.map((c, i) => (
          <div key={i} className="grid grid-cols-[1fr_auto] gap-3 rounded-lg border border-line p-3 sm:grid-cols-[1fr_1fr_130px_auto] sm:items-end">
            <TextInput label="Name" value={c.name} onChange={(e) => set("contacts", value.contacts.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
            <TextInput label="Phone" type="tel" value={c.phone} onChange={(e) => set("contacts", value.contacts.map((x, j) => (j === i ? { ...x, phone: e.target.value } : x)))} className="col-start-1 sm:col-start-auto" />
            <TextInput label="Relation" value={c.relation} onChange={(e) => set("contacts", value.contacts.map((x, j) => (j === i ? { ...x, relation: e.target.value } : x)))} className="col-start-1 sm:col-start-auto" />
            <button
              type="button"
              aria-label={`Remove contact ${c.name || i + 1}`}
              onClick={() => set("contacts", value.contacts.filter((_, j) => j !== i))}
              className="row-start-1 col-start-2 flex h-10 w-10 items-center justify-center self-end rounded-lg border border-[#f3b5b5] text-danger transition hover:bg-[#fff4f4] sm:row-start-auto sm:col-start-auto"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {value.contacts.length < 4 && (
          <button type="button" className={btnGhost} onClick={() => set("contacts", [...value.contacts, { name: "", phone: "", relation: "" }])}>
            <Plus size={15} /> Add contact
          </button>
        )}
      </fieldset>
    </div>
  );
}

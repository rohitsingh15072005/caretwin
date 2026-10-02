import type { Member } from "./types";
import { ageFromDob } from "./dates";

export interface EmergencyFields {
  bloodGroup: boolean;
  allergies: boolean;
  conditions: boolean;
  medications: boolean;
  contacts: boolean;
  doctor: boolean;
  organDonor: boolean;
  age: boolean;
  insurance: boolean;
}

export const DEFAULT_FIELDS: EmergencyFields = {
  bloodGroup: true,
  allergies: true,
  conditions: true,
  medications: true,
  contacts: true,
  doctor: false,
  organDonor: false,
  age: true,
  insurance: false,
};

/** Compact payload kept short on purpose: smaller payload = simpler, easier-to-scan QR. */
export interface EmergencyPayload {
  v: 1;
  n: string;
  g?: number; // age
  b?: string;
  a?: string[];
  c?: string[];
  m?: string[];
  k?: { n: string; p: string; r: string }[];
  d?: string;
  o?: boolean;
  i?: string;
}

export function buildPayload(member: Member, f: EmergencyFields, now: number): EmergencyPayload {
  const p: EmergencyPayload = { v: 1, n: member.name };
  const age = ageFromDob(member.dob, now);
  if (f.age && age !== null) p.g = age;
  if (f.bloodGroup && member.bloodGroup) p.b = member.bloodGroup;
  if (f.allergies && member.allergies.length) p.a = member.allergies;
  if (f.conditions && member.conditions.length) p.c = member.conditions;
  if (f.medications && member.medications.length) p.m = member.medications;
  if (f.contacts && member.contacts.length)
    p.k = member.contacts
      .filter((c) => c.phone)
      .map((c) => ({ n: c.name, p: c.phone, r: c.relation }));
  if (f.doctor && member.primaryDoctor) p.d = member.primaryDoctor;
  if (f.organDonor) p.o = member.organDonor;
  if (f.insurance && member.insurance) p.i = member.insurance;
  return p;
}

function toBase64Url(str: string) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string) {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** The data lives in the URL hash, so it is never sent to any server. */
export function payloadToLink(p: EmergencyPayload, origin: string) {
  return `${origin}/emergency#d=${toBase64Url(JSON.stringify(p))}`;
}

export function parsePayloadFromHash(hash: string): EmergencyPayload | null {
  const m = hash.match(/[#&]d=([^&]+)/);
  if (!m) return null;
  try {
    const data = JSON.parse(fromBase64Url(m[1]));
    if (data && data.v === 1 && typeof data.n === "string") return data as EmergencyPayload;
  } catch {
    /* fall through */
  }
  return null;
}

/** Plain-text version: works in any QR scanner, even fully offline. */
export function payloadToText(p: EmergencyPayload) {
  const lines = [`EMERGENCY MEDICAL INFO`, `Name: ${p.n}${p.g !== undefined ? ` (${p.g} yrs)` : ""}`];
  if (p.b) lines.push(`Blood group: ${p.b}`);
  if (p.a?.length) lines.push(`ALLERGIES: ${p.a.join(", ")}`);
  if (p.c?.length) lines.push(`Conditions: ${p.c.join(", ")}`);
  if (p.m?.length) lines.push(`Medications: ${p.m.join(", ")}`);
  if (p.o !== undefined) lines.push(`Organ donor: ${p.o ? "Yes" : "No"}`);
  if (p.d) lines.push(`Doctor: ${p.d}`);
  if (p.i) lines.push(`Insurance: ${p.i}`);
  p.k?.forEach((c) => lines.push(`Contact: ${c.n} (${c.r}) ${c.p}`));
  return lines.join("\n");
}

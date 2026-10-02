"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, Mail, Trash2, QrCode, Check, Circle } from "lucide-react";

import Avatar from "@/components/ui/Avatar";
import MemberForm from "@/components/shared/MemberForm";
import { TextInput, btnGhost, btnPrimary } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { Stagger, StaggerItem, CountUp } from "@/components/ui/Motion";
import { useCareData } from "@/lib/useCareData";
import { resizeToDataUrl } from "@/lib/image";
import { ageFromDob, toISO } from "@/lib/dates";
import type { Account, Member } from "@/lib/types";

export default function ProfilePage() {
  const { hydrated, self, account } = useCareData();
  if (!hydrated) return <div className="ct-skeleton mx-auto h-96 max-w-[1000px] rounded-2xl" />;
  // Keyed by saved values so the form resets cleanly after a save.
  return <ProfileEditor key={JSON.stringify([self, account])} initialMember={self} initialAccount={account} />;
}

function checklist(m: Member, a: Account) {
  return [
    { label: "Date of birth", done: !!m.dob },
    { label: "Gender", done: !!m.gender },
    { label: "Blood group", done: !!m.bloodGroup },
    { label: "Height and weight", done: !!m.heightCm && !!m.weightKg },
    { label: "Allergies or conditions", done: m.allergies.length + m.conditions.length > 0 },
    { label: "Primary doctor", done: !!m.primaryDoctor },
    { label: "Emergency contact", done: m.contacts.some((c) => c.phone) },
    { label: "Phone number", done: !!a.phone },
  ];
}

function ProfileEditor({ initialMember, initialAccount }: { initialMember: Member; initialAccount: Account }) {
  const toast = useToast();
  const { now, members, setMembers, setAccount } = useCareData();
  const [member, setMember] = useState(initialMember);
  const [account, setLocalAccount] = useState(initialAccount);
  const [nameError, setNameError] = useState<string>();
  const [emailError, setEmailError] = useState<string>();
  const fileRef = useRef<HTMLInputElement>(null);

  const items = checklist(member, account);
  const done = items.filter((i) => i.done).length;
  const pct = Math.round((done / items.length) * 100);
  const age = ageFromDob(member.dob, now);
  const dirty = JSON.stringify([member, account]) !== JSON.stringify([initialMember, initialAccount]);

  const onPhoto = async (f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) return toast("Choose a PNG or JPG image", "error");
    if (f.size > 5 * 1024 * 1024) return toast("Image must be under 5 MB", "error");
    try {
      const avatar = await resizeToDataUrl(f);
      setLocalAccount((a) => ({ ...a, avatar }));
    } catch {
      toast("Could not read that image", "error");
    }
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    let ok = true;
    if (!member.name.trim()) {
      setNameError("Enter your name.");
      ok = false;
    } else setNameError(undefined);
    if (!/^\S+@\S+\.\S+$/.test(account.email)) {
      setEmailError("Enter a valid email address.");
      ok = false;
    } else setEmailError(undefined);
    if (!ok) return;

    setMembers(
      members.map((m) =>
        m.id === member.id
          ? { ...member, name: member.name.trim(), contacts: member.contacts.filter((c) => c.name || c.phone) }
          : m,
      ),
    );
    setAccount(account);
    toast("Profile saved");
  };

  const r = 34;
  const circ = 2 * Math.PI * r;

  return (
    <Stagger className="mx-auto w-full max-w-[1000px]">
      <form onSubmit={save} className="space-y-5">
        <StaggerItem>
          <section className="relative overflow-hidden rounded-2xl bg-navy p-6 text-white sm:p-8">
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border-[30px] border-navy-2" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative shrink-0 self-start">
                <div className="rounded-full p-1 ring-4 ring-mint">
                  <Avatar name={member.name || "?"} color={member.color} src={account.avatar} size={96} />
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  aria-label="Change profile photo"
                  className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-mint text-mint-deep shadow-lg transition hover:scale-105"
                >
                  <Camera size={16} />
                </button>
                <input ref={fileRef} type="file" accept="image/png,image/jpeg" className="sr-only" onChange={(e) => onPhoto(e.target.files?.[0])} />
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">{member.name || "Your profile"}</h1>
                <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#b9c4d8]">
                  {age !== null && <span>{age} years</span>}
                  {member.bloodGroup && <span>Blood group {member.bloodGroup}</span>}
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={13} />
                    {account.email}
                  </span>
                </p>
                {account.avatar && (
                  <button type="button" onClick={() => setLocalAccount({ ...account, avatar: "" })} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#b9c4d8] hover:text-white">
                    <Trash2 size={13} /> Remove photo
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
                <svg width="80" height="80" viewBox="0 0 80 80" role="img" aria-label={`Profile ${pct}% complete`}>
                  <circle cx="40" cy="40" r={r} fill="none" stroke="#1b2943" strokeWidth="8" />
                  <motion.circle
                    cx="40"
                    cy="40"
                    r={r}
                    fill="none"
                    stroke="#66f49b"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    initial={{ strokeDashoffset: circ }}
                    animate={{ strokeDashoffset: circ * (1 - pct / 100) }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    transform="rotate(-90 40 40)"
                  />
                  <text x="40" y="45" textAnchor="middle" fontSize="17" fontWeight="700" fill="#fff">
                    {pct}%
                  </text>
                </svg>
                <div className="text-sm">
                  <p className="font-semibold">Profile strength</p>
                  <p className="text-xs text-[#b9c4d8]">
                    <CountUp to={done} /> of {items.length} done
                  </p>
                </div>
              </div>
            </div>
          </section>
        </StaggerItem>

        <StaggerItem>
          <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
            <div className="space-y-5">
              <section className="rounded-xl border border-line bg-white p-5 sm:p-6">
                <h2 className="mb-4 text-sm font-bold text-ink">Account</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextInput label="Email address" type="email" value={account.email} error={emailError} onChange={(e) => setLocalAccount({ ...account, email: e.target.value })} />
                  <TextInput label="Phone number" type="tel" value={account.phone} onChange={(e) => setLocalAccount({ ...account, phone: e.target.value })} placeholder="+91 ..." />
                </div>
              </section>

              <section className="rounded-xl border border-line bg-white p-5 sm:p-6">
                <MemberForm value={member} onChange={setMember} errors={{ name: nameError }} lockRelation today={toISO(new Date(now))} />
              </section>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
              <section className="rounded-xl border border-line bg-white p-5">
                <h2 className="text-sm font-bold text-ink">Complete your profile</h2>
                <ul className="mt-3 space-y-2">
                  {items.map((i) => (
                    <li key={i.label} className="flex items-center gap-2.5 text-[13px]">
                      {i.done ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mint text-mint-deep">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      ) : (
                        <Circle size={20} className="text-[#cfd7e6]" />
                      )}
                      <span className={i.done ? "text-mute line-through" : "font-medium text-ink"}>{i.label}</span>
                    </li>
                  ))}
                </ul>
              </section>
              <Link href="/dashboard/emergency" className="flex items-center gap-3 rounded-xl bg-danger-soft p-4 text-sm font-semibold text-danger transition hover:shadow-md">
                <QrCode size={20} /> Create your emergency QR card
              </Link>
            </aside>
          </div>
        </StaggerItem>

        <div className="sticky bottom-3 z-10 flex items-center justify-between gap-3 rounded-xl border border-line bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
          <p className="text-[13px] text-mute" aria-live="polite">
            {dirty ? "You have unsaved changes." : "All changes saved."}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!dirty}
              className={`${btnGhost} disabled:opacity-50`}
              onClick={() => {
                setMember(initialMember);
                setLocalAccount(initialAccount);
              }}
            >
              Reset
            </button>
            <button type="submit" disabled={!dirty} className={btnPrimary}>
              Save changes
            </button>
          </div>
        </div>
      </form>
    </Stagger>
  );
}

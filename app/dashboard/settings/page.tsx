"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Lock, ShieldCheck, Bell, Download, Trash2, Monitor, Smartphone } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { TextInput, Toggle, btnGhost, btnPrimary } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { clearAllCareTwinData } from "@/lib/store";
import { downloadText } from "@/lib/download";
import { useCareData } from "@/lib/useCareData";
import type { Prefs } from "@/lib/types";

const TABS = [
  { id: "Account", icon: User },
  { id: "Security", icon: Lock },
  { id: "Health Data & Privacy", icon: ShieldCheck },
  { id: "Notifications", icon: Bell },
] as const;
type Tab = (typeof TABS)[number]["id"];

export default function SettingsPage() {
  const toast = useToast();
  const { hydrated, self, account, prefs, setPrefs, members, records } = useCareData();
  const [tab, setTab] = useState<Tab>("Account");
  const [confirmErase, setConfirmErase] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwErr, setPwErr] = useState<Partial<typeof pw>>({});

  const toggle = (k: keyof Prefs) => (v: boolean) => {
    setPrefs({ ...prefs, [k]: v });
    toast("Preference saved");
  };

  const changePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Partial<typeof pw> = {};
    if (!pw.current) err.current = "Enter your current password.";
    if (pw.next.length < 8) err.next = "Use at least 8 characters.";
    if (pw.confirm !== pw.next) err.confirm = "Passwords do not match.";
    setPwErr(err);
    if (Object.keys(err).length) return;
    setPw({ current: "", next: "", confirm: "" });
    toast("Password updated (demo: not stored)", "info");
  };

  const exportData = () => {
    downloadText("caretwin-export.json", JSON.stringify({ exportedAt: new Date().toISOString(), members, records, prefs }, null, 2));
    toast("Data exported");
  };

  return (
    <Stagger className="mx-auto w-full max-w-[1000px] space-y-5">
      <StaggerItem>
        <PageHeader icon={<User size={22} />} title="Settings" subtitle="Manage your account, security and privacy." />
      </StaggerItem>

      <StaggerItem>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
          <div role="tablist" aria-label="Settings sections" aria-orientation="vertical" className="flex gap-1 overflow-x-auto lg:flex-col">
            {TABS.map(({ id, icon: Icon }) => (
              <button
                key={id}
                role="tab"
                aria-selected={tab === id}
                type="button"
                onClick={() => setTab(id)}
                className={`relative flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-4 py-3 text-left text-sm transition-colors ${
                  tab === id ? "font-semibold text-brand" : "text-body hover:bg-white"
                }`}
              >
                {tab === id && <motion.span layoutId="settings-tab" className="absolute inset-0 rounded-xl bg-[#DCE8FA]" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <Icon size={17} className="relative" />
                <span className="relative">{id}</span>
              </button>
            ))}
          </div>

          <motion.div key={tab} role="tabpanel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
            <div className="border-b border-line p-5 sm:p-6">
              <h2 className="text-xl font-bold text-ink">{tab}</h2>
            </div>

            <div className="p-5 sm:p-6">
              {tab === "Account" && (
                <div className="space-y-5">
                  <dl className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs font-semibold text-mute">Name</dt>
                      <dd className="mt-1 font-semibold text-ink">{hydrated ? self.name : "…"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-mute">Email</dt>
                      <dd className="mt-1 break-all font-semibold text-ink">{hydrated ? account.email : "…"}</dd>
                    </div>
                  </dl>
                  <p className="text-sm text-body">Your name, photo, contact and health details are edited in one place.</p>
                  <Link href="/dashboard/profile" className={btnPrimary}>
                    Edit profile
                  </Link>
                </div>
              )}

              {tab === "Security" && (
                <div className="space-y-8">
                  <form onSubmit={changePassword} className="max-w-md space-y-4" noValidate>
                    <TextInput label="Current password" type="password" autoComplete="current-password" value={pw.current} error={pwErr.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
                    <TextInput label="New password" type="password" autoComplete="new-password" value={pw.next} error={pwErr.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
                    <TextInput label="Confirm new password" type="password" autoComplete="new-password" value={pw.confirm} error={pwErr.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
                    <button type="submit" className={btnPrimary}>Update password</button>
                  </form>

                  <div className="divide-y divide-line border-t border-line">
                    <Toggle checked={prefs.twoFactor} onChange={toggle("twoFactor")} label="Two-step verification" description="Ask for a code when signing in on a new device." />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-ink">Signed-in devices</h3>
                    <ul className="mt-3 space-y-2">
                      {[
                        { icon: Monitor, name: "This browser", note: "Active now" },
                        { icon: Smartphone, name: "Phone", note: "Last active 2 days ago (sample)" },
                      ].map((d) => (
                        <li key={d.name} className="flex items-center gap-3 rounded-lg bg-[#f8f9fc] px-4 py-3 text-sm">
                          <d.icon size={18} className="text-brand" />
                          <span className="font-semibold text-ink">{d.name}</span>
                          <span className="text-mute">{d.note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {tab === "Health Data & Privacy" && (
                <div className="space-y-6">
                  <div className="divide-y divide-line">
                    <Toggle checked={prefs.shareWithAI} onChange={toggle("shareWithAI")} label="Use my records in AI answers" description="Lets the assistant read your records to personalise replies." />
                    <Toggle checked={prefs.analytics} onChange={toggle("analytics")} label="Share anonymous usage data" description="Helps us improve CareTwin. Never includes health details." />
                  </div>

                  <div className="rounded-xl bg-[#f8f9fc] p-4">
                    <p className="text-sm font-bold text-ink">Your data</p>
                    <p className="mt-1 text-[13px] leading-5 text-mute">
                      {hydrated ? `${members.length} people and ${records.length} records are stored on this device.` : ""} Export a copy, or erase everything.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="button" className={btnGhost} onClick={exportData}>
                        <Download size={16} /> Export my data
                      </button>
                      <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-[#f3b5b5] bg-white px-4 py-2.5 text-sm font-semibold text-danger transition hover:bg-[#fff4f4]" onClick={() => setConfirmErase(true)}>
                        <Trash2 size={16} /> Erase all data
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {tab === "Notifications" && (
                <div className="divide-y divide-line">
                  <Toggle checked={prefs.notifyFollowUps} onChange={toggle("notifyFollowUps")} label="Follow-up reminders" description="Remind me about records marked for follow-up." />
                  <Toggle checked={prefs.notifyReports} onChange={toggle("notifyReports")} label="Report summaries" description="Tell me when a periodic summary is ready." />
                  <Toggle checked={prefs.notifyProduct} onChange={toggle("notifyProduct")} label="Product updates" description="New features and tips." />
                  <Toggle checked={prefs.notifyEmail} onChange={toggle("notifyEmail")} label="Send notifications by email" />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </StaggerItem>

      <ConfirmModal
        open={confirmErase}
        onClose={() => setConfirmErase(false)}
        title="Erase all data?"
        message="This removes every member, record and preference stored on this device and returns the app to its starting state. This cannot be undone."
        confirmLabel="Erase everything"
        onConfirm={() => {
          clearAllCareTwinData();
          window.location.href = "/dashboard";
        }}
      />
    </Stagger>
  );
}

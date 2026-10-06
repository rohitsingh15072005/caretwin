"use client";

import Link from "next/link";
import { Bell, Download, Lock, ShieldCheck, Smartphone, User } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { btnGhost, btnPrimary } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { downloadText } from "@/lib/download";
import { useCareData } from "@/lib/useCareData";

export default function SettingsPage() {
  const toast = useToast();
  const {
    self,
    account,
    records,
    profileState,
    recordsState,
    notificationsState,
    notifications,
    markAllNotificationsRead,
  } = useCareData();
  const canExport = profileState.status === "ready" && recordsState.status === "ready";

  const exportData = () => {
    downloadText(
      "caretwin-export.json",
      JSON.stringify(
        { exportedAt: new Date().toISOString(), profile: self, email: account.email, records },
        null,
        2,
      ),
    );
    toast("Account data exported");
  };

  const readAll = async () => {
    try {
      await markAllNotificationsRead();
      toast("Notifications marked as read");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Could not update notifications.", "error");
    }
  };

  return (
    <Stagger className="mx-auto w-full max-w-[1000px] space-y-5">
      <StaggerItem>
        <PageHeader icon={<User size={22} />} title="Settings" subtitle="Manage the account information and data currently available from CareTwin." />
      </StaggerItem>

      <StaggerItem>
        <section className="rounded-xl border border-line bg-white p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <User size={18} className="text-brand" />
            <h2 className="text-sm font-bold text-ink">Account</h2>
          </div>
          {profileState.status === "loading" ? (
            <p className="mt-4 text-sm text-mute">Loading account…</p>
          ) : profileState.status === "error" ? (
            <p role="alert" className="mt-4 text-sm text-danger">{profileState.error}</p>
          ) : (
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><dt className="text-xs font-semibold text-mute">Name</dt><dd className="mt-1 font-semibold text-ink">{self.name || "Not provided"}</dd></div>
              <div><dt className="text-xs font-semibold text-mute">Email</dt><dd className="mt-1 break-all font-semibold text-ink">{account.email}</dd></div>
            </dl>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/dashboard/profile" className={btnPrimary}>Edit profile</Link>
            <button type="button" className={btnGhost} disabled={!canExport} onClick={exportData}>
              <Download size={16} /> Export loaded data
            </button>
          </div>
        </section>
      </StaggerItem>

      <StaggerItem>
        <section className="rounded-xl border border-line bg-white p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-brand" />
            <h2 className="text-sm font-bold text-ink">Notifications</h2>
          </div>
          {notificationsState.status === "loading" ? (
            <p className="mt-4 text-sm text-mute">Loading notifications…</p>
          ) : notificationsState.status === "error" ? (
            <p role="alert" className="mt-4 text-sm text-danger">{notificationsState.error}</p>
          ) : notifications.length === 0 ? (
            <p className="mt-4 text-sm text-mute">No notifications are available.</p>
          ) : (
            <>
              <p className="mt-4 text-sm text-body">{notifications.filter((item) => !item.isRead).length} unread of {notifications.length} loaded notifications.</p>
              <button type="button" className={`${btnGhost} mt-3`} disabled={!notifications.some((item) => !item.isRead)} onClick={() => void readAll()}>
                Mark all as read
              </button>
            </>
          )}
        </section>
      </StaggerItem>

      <StaggerItem>
        <section className="rounded-xl border border-[#f0dfc1] bg-[#fffaf0] p-5 sm:p-6">
          <h2 className="text-sm font-bold text-[#7a5c1f]">Unavailable settings</h2>
          <p className="mt-2 text-sm leading-6 text-[#7a6535]">
            Password changes, two-step verification, device management, AI-sharing and analytics preferences, notification preferences, and account-wide data deletion are not supported by the connected API. They are not stored locally or shown as editable controls.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-[#7a6535]">
            <span className="inline-flex items-center gap-1.5"><Lock size={14} /> Security controls unavailable</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} /> Privacy preferences unavailable</span>
            <span className="inline-flex items-center gap-1.5"><Smartphone size={14} /> Device management unavailable</span>
          </div>
        </section>
      </StaggerItem>
    </Stagger>
  );
}

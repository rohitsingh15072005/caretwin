"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bell, LogOut, Menu, Search, Settings, User } from "lucide-react";

import Avatar from "@/components/ui/Avatar";
import Popover from "@/components/ui/Popover";
import { useToast } from "@/components/ui/Toast";
import { logout } from "@/lib/api";
import { useCareData } from "@/lib/useCareData";
import { relativeDays } from "@/lib/dates";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const toast = useToast();
  const [q, setQ] = useState("");
  const {
    self,
    account,
    notifications,
    notificationsState,
    refresh,
    markNotificationRead,
    markAllNotificationsRead,
  } = useCareData();
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    router.push(`/dashboard/medical-records${term ? `?q=${encodeURIComponent(term)}` : ""}`);
  };

  const signOut = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Could not sign out.", "error");
    }
  };

  return (
    <header className="flex h-[72px] min-w-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-6 md:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="shrink-0 rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
        >
          <Menu size={22} />
        </button>

        <form onSubmit={onSearch} role="search" className="relative min-w-0 flex-1 md:max-w-[440px]">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search health records"
            placeholder="Search health records..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm placeholder:text-gray-500 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/15"
          />
        </form>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <Popover
          widthClass="w-80"
          button={({ toggle, open }) => (
            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
              className="relative rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
            >
              <Bell size={21} />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-danger" />
              )}
            </button>
          )}
        >
          {(close) => (
            <div>
              <div className="flex items-center justify-between gap-2 px-3 pb-1 pt-2">
                <p className="text-sm font-bold text-ink">Notifications</p>
                {notifications.some((item) => !item.isRead) && notificationsState.status === "ready" && (
                  <button
                    type="button"
                    onClick={() => void markAllNotificationsRead().catch((error: unknown) => toast(error instanceof Error ? error.message : "Could not update notifications.", "error"))}
                    className="text-xs font-semibold text-brand hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              {notificationsState.status === "loading" ? (
                <p className="px-3 py-4 text-sm text-mute">Loading notifications…</p>
              ) : notificationsState.status === "error" ? (
                <div className="px-3 py-4 text-sm text-danger">
                  <p>{notificationsState.error}</p>
                  <button type="button" onClick={() => void refresh()} className="mt-2 font-semibold underline">
                    Retry
                  </button>
                </div>
              ) : notifications.length === 0 ? (
                <p className="px-3 py-4 text-sm text-mute">No notifications yet.</p>
              ) : (
                notifications.map((notification) => (
                  <button
                    type="button"
                    key={notification.id}
                    onClick={() => {
                      if (!notification.isRead) {
                        void markNotificationRead(notification.id).catch((error: unknown) => toast(error instanceof Error ? error.message : "Could not update notification.", "error"));
                      }
                      close();
                    }}
                    className={`block w-full rounded-lg px-3 py-2.5 text-left hover:bg-slate-50 ${notification.isRead ? "" : "bg-brand-soft/50"}`}
                  >
                    <p className="text-sm font-semibold text-ink">{notification.title}</p>
                    <p className="mt-0.5 text-xs leading-5 text-mute">{notification.message}</p>
                    <p className="mt-1 text-[11px] text-mute">{relativeDays(notification.createdAt, Date.now())}</p>
                  </button>
                ))
              )}
            </div>
          )}
        </Popover>

        <Popover
          widthClass="w-56"
          button={({ toggle, open }) => (
            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-label="Account menu"
              className="flex items-center gap-3 rounded-xl p-1 transition hover:bg-slate-50"
            >
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold leading-tight text-slate-800">{self.name || "My account"}</p>
                <p className="text-xs text-slate-500">Patient</p>
              </div>
              <Avatar name={self.name} color={self.color} src={account.avatar} size={40} />
            </button>
          )}
        >
          {(close) => (
            <div className="text-sm">
              <div className="border-b border-line px-3 pb-2 pt-1">
                <p className="truncate font-semibold text-ink">{self.name || "My account"}</p>
                <p className="truncate text-xs text-mute">{account.email}</p>
              </div>
              {[
                { href: "/dashboard/profile", label: "My profile", icon: User },
                { href: "/dashboard/settings", label: "Settings", icon: Settings },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-body hover:bg-slate-50"
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => void signOut()}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-danger hover:bg-danger-soft"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          )}
        </Popover>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bell, ChevronDown, LogOut, Menu, Search, Settings, User, Users, Check } from "lucide-react";

import Avatar from "@/components/ui/Avatar";
import Popover from "@/components/ui/Popover";
import { ALL_ID, useCareData } from "@/lib/useCareData";
import { relativeDays } from "@/lib/dates";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const { members, activeId, setActiveId, self, account, records, now, memberById } = useCareData();

  const active = members.find((m) => m.id === activeId);

  const notifications = records
    .filter((r) => r.followUp)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    router.push(`/dashboard/medical-records${term ? `?q=${encodeURIComponent(term)}` : ""}`);
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
        {/* Family member switcher */}
        <Popover
          widthClass="w-64"
          button={({ toggle, open }) => (
            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-label="Switch family member"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1.5 pl-2 pr-2.5 text-sm transition hover:bg-slate-50"
            >
              {active ? (
                <Avatar name={active.name} color={active.color} size={26} />
              ) : (
                <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-brand-soft text-brand">
                  <Users size={14} />
                </span>
              )}
              <span className="hidden max-w-[110px] truncate font-semibold text-ink sm:block">
                {active ? active.name.split(" ")[0] : "Everyone"}
              </span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
          )}
        >
          {(close) => (
            <div>
              <p className="px-3 pb-1 pt-2 text-xs font-semibold text-mute">Viewing records for</p>
              {[{ id: ALL_ID, name: "Everyone", color: "", relation: `${members.length} people` }, ...members].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setActiveId(m.id);
                    close();
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50"
                >
                  {m.id === ALL_ID ? (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-brand">
                      <Users size={15} />
                    </span>
                  ) : (
                    <Avatar name={m.name} color={m.color} size={32} />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-ink">{m.name}</span>
                    <span className="block text-xs text-mute">{m.relation}</span>
                  </span>
                  {activeId === m.id && <Check size={16} className="text-brand" />}
                </button>
              ))}
              <Link
                href="/dashboard/family"
                onClick={close}
                className="mt-1 block rounded-lg border-t border-line px-3 py-2.5 text-sm font-semibold text-brand hover:bg-slate-50"
              >
                Manage family
              </Link>
            </div>
          )}
        </Popover>

        {/* Notifications */}
        <Popover
          widthClass="w-80"
          button={({ toggle, open }) => (
            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-label={`Notifications${notifications.length ? `, ${notifications.length} follow-ups` : ""}`}
              className="relative rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
            >
              <Bell size={21} />
              {notifications.length > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-danger" />
              )}
            </button>
          )}
        >
          {(close) => (
            <div>
              <p className="px-3 pb-1 pt-2 text-sm font-bold text-ink">Follow-ups</p>
              {notifications.length === 0 ? (
                <p className="px-3 py-4 text-sm text-mute">You are all caught up.</p>
              ) : (
                notifications.map((r) => (
                  <Link
                    key={r.id}
                    href="/dashboard/medical-records"
                    onClick={() => {
                      setActiveId(r.memberId);
                      close();
                    }}
                    className="block rounded-lg px-3 py-2.5 hover:bg-slate-50"
                  >
                    <p className="text-sm font-semibold text-ink">{r.title}</p>
                    <p className="mt-0.5 text-xs text-mute">
                      {memberById.get(r.memberId)?.name} · {relativeDays(r.date, now)}
                    </p>
                  </Link>
                ))
              )}
            </div>
          )}
        </Popover>

        {/* User menu */}
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
                <p className="text-sm font-semibold leading-tight text-slate-800">{self.name}</p>
                <p className="text-xs text-slate-500">Patient</p>
              </div>
              <Avatar name={self.name} color={self.color} src={account.avatar} size={40} />
            </button>
          )}
        >
          {(close) => (
            <div className="text-sm">
              <div className="border-b border-line px-3 pb-2 pt-1">
                <p className="truncate font-semibold text-ink">{self.name}</p>
                <p className="truncate text-xs text-mute">{account.email}</p>
              </div>
              {[
                { href: "/dashboard/profile", label: "My profile", icon: User },
                { href: "/dashboard/settings", label: "Settings", icon: Settings },
              ].map((i) => (
                <Link
                  key={i.href}
                  href={i.href}
                  onClick={close}
                  className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-body hover:bg-slate-50"
                >
                  <i.icon size={16} />
                  {i.label}
                </Link>
              ))}
              <Link
                href="/login"
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-danger hover:bg-danger-soft"
              >
                <LogOut size={16} />
                Sign out
              </Link>
            </div>
          )}
        </Popover>
      </div>
    </header>
  );
}

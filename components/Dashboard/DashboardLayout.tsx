"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Activity,
  MessageCircle,
  Settings,
  HelpCircle,
  Plus,
  Search,
  Bell,
  User,
  ChevronDown,
} from "lucide-react";

import DashboardFooter from "./DashboardFooter";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Medical Records",
      href: "/dashboard/medical-records",
      icon: FileText,
    },
    {
      name: "AI Symptom Checker",
      href: "/dashboard/symptom-checker",
      icon: Activity,
    },
    {
      name: "AI Chat",
      href: "/dashboard/ai-chat",
      icon: MessageCircle,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f6ff]">

      {/* ================= SIDEBAR ================= */}
      <aside className="fixed left-0 top-0 z-50 flex h-screen w-[230px] shrink-0 flex-col border-r border-[#e5e7eb] bg-white">

        {/* Logo */}
        <div className="flex h-[72px] shrink-0 items-center gap-3 border-b border-[#edf0f5] px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0878b8] text-white">
            <span className="text-lg font-bold">C</span>
          </div>

          <div>
            <h1 className="text-[15px] font-bold text-[#111827]">
              CareTwin
            </h1>

            <p className="text-[8px] font-semibold tracking-widest text-[#8b95a7]">
              PERSONAL HEALTH
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">

          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition ${
                    active
                      ? "bg-[#66f49b] font-semibold text-[#0b5940]"
                      : "text-[#4b5563] hover:bg-[#f3f4f6]"
                  }`}
                >
                  <Icon size={16} strokeWidth={1.8} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Bottom Navigation */}
          <div className="mt-10 space-y-2">

            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-[#4b5563] hover:bg-gray-100"
            >
              <Settings size={16} />
              Settings
            </Link>

            <Link
              href="/dashboard/support"
              className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-[#4b5563] hover:bg-gray-100"
            >
              <HelpCircle size={16} />
              Support
            </Link>

          </div>
        </nav>

        {/* New Analysis */}
        <div className="shrink-0 px-4 pb-5">
          <Link
            href="/dashboard/symptom-checker"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0878b8] py-2.5 text-sm font-semibold text-white transition hover:bg-[#06699f]"
          >
            <Plus size={16} />
            New Analysis
          </Link>
        </div>

      </aside>


      {/* ================= MAIN AREA ================= */}
      <div className="ml-[230px] flex h-screen min-w-0 flex-1 flex-col">

        {/* ================= HEADER ================= */}
        <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-[#e5e7eb] bg-white px-8">

          {/* Search */}
          <div className="relative w-[310px]">

            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
            />

            <input
              type="text"
              placeholder="Search health records"
              className="h-9 w-full rounded-lg border border-[#e5e7eb] bg-[#fafafa] pl-9 pr-4 text-xs outline-none focus:border-[#0878b8]"
            />

          </div>

          {/* Right */}
          <div className="flex items-center gap-5">

            <button className="relative text-[#6b7280] hover:text-[#111827]">
              <Bell size={18} />

              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="h-7 w-px bg-[#e5e7eb]" />

            <button className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dff7ed] text-[#0878b8]">
                <User size={16} />
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold text-[#111827]">
                  Sarah Jenkins
                </p>

                <p className="text-[10px] text-[#9ca3af]">
                  Patient ID: CT-2048
                </p>
              </div>

              <ChevronDown size={14} className="text-gray-400" />

            </button>

          </div>

        </header>


        {/* ================= SCROLLABLE CONTENT ================= */}
        <main className="flex-1 overflow-y-auto px-8 py-7">

          {children}

        </main>


        {/* ================= FOOTER ================= */}
        <DashboardFooter />

      </div>

    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
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
  LogOut,
} from "lucide-react";

import DashboardFooter from "./DashboardFooter";
import { getCurrentUser, logout } from "@/lib/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<{ id: number; full_name: string; email: string } | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error("Failed to load user profile:", err);
      }
    }
    loadUser();
  }, []);

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
      name: "AI Consultation",
      href: "/dashboard/ai-chat",
      icon: MessageCircle,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
    {
      name: "Help & Support",
      href: "/dashboard/support",
      icon: HelpCircle,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">

      {/* ================= SIDEBAR ================= */}
      <aside className="fixed left-0 top-0 z-30 flex h-screen w-[230px] flex-col justify-between border-r border-[#e5e7eb] bg-white px-5 py-6">

        {/* Top */}
        <div>

          {/* Logo */}
          <div className="mb-8 flex items-center gap-2.5 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0878b8] text-white">
              <Activity size={18} />
            </div>

            <div>
              <h1 className="text-sm font-bold text-[#111827]">
                CareTwin AI
              </h1>

              <p className="text-[10px] text-[#6b7280]">
                Healthcare Platform
              </p>
            </div>
          </div>


          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition ${
                    isActive
                      ? "bg-[#eef7fc] text-[#0878b8]"
                      : "text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]"
                  }`}
                >
                  <Icon size={16} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

        </div>


        {/* Bottom Box */}
        <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-3 text-center">
          <p className="text-[11px] font-semibold text-[#111827]">
            Need Doctor Access?
          </p>

          <p className="mt-0.5 text-[9px] text-[#6b7280]">
            Generate a temporary share code for your physician.
          </p>

          <Link
            href="/dashboard/medical-records"
            className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0878b8] py-2 text-[10px] font-semibold text-white transition hover:bg-[#065d8f]"
          >
            <Plus size={12} />
            Share Records
          </Link>
        </div>

      </aside>


      {/* ================= RIGHT WRAPPER ================= */}
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

            {/* User Profile with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-50 transition"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dff7ed] text-[#0878b8]">
                  <User size={16} />
                </div>

                <div className="hidden text-left sm:block">
                  <p className="text-xs font-semibold text-[#111827]">
                    {currentUser?.full_name || "Patient"}
                  </p>

                  <p className="text-[10px] text-[#9ca3af]">
                    Patient ID: CT-{currentUser?.id ? 1000 + currentUser.id : "2048"}
                  </p>
                </div>

                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white p-2 shadow-xl border border-slate-100 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-800">{currentUser?.full_name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{currentUser?.email}</p>
                  </div>

                  <Link
                    href="/dashboard/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Settings size={14} />
                    Account Settings
                  </Link>

                  <button
                    onClick={() => logout()}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

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
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Activity,
  MessageCircle,
  Settings,
  HelpCircle,
  Plus,
  Menu,
  X,
} from "lucide-react";

import DashboardFooter from "./DashboardFooter";
import Header from "./Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-[#f5f6ff]">
      {/* ================= MOBILE OVERLAY ================= */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[280px] shrink-0 flex-col border-r border-[#e5e7eb] bg-white transition-transform duration-300 md:w-[230px] md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-[#edf0f5] px-6">
          <div className="flex items-center gap-3">
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

          {/* Mobile close button */}
          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden"
          >
            <X size={20} />
          </button>
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
                  onClick={closeSidebar}
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
              onClick={closeSidebar}
              className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-[#4b5563] hover:bg-gray-100"
            >
              <Settings size={16} />
              Settings
            </Link>

            <Link
              href="/dashboard/support"
              onClick={closeSidebar}
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
            onClick={closeSidebar}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0878b8] py-2.5 text-sm font-semibold text-white transition hover:bg-[#06699f]"
          >
            <Plus size={16} />
            New Analysis
          </Link>
        </div>
      </aside>

      {/* ================= MAIN AREA ================= */}
      <div className="ml-0 flex min-h-screen min-w-0 flex-1 flex-col md:ml-[230px]">
        {/* Header */}
        <div className="shrink-0">
          <Header onMenuClick={() => setSidebarOpen(true)} />
        </div>

        {/* Scrollable Content */}
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-7">
          {children}
        </main>

        {/* Footer */}
        <DashboardFooter />
      </div>
    </div>
  );
}
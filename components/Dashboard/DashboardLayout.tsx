"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Activity,
  MessageCircle,
  Settings,
  HelpCircle,
  Plus,
  X,
  Users,
  QrCode,
  ClipboardList,
} from "lucide-react";

import DashboardFooter from "./DashboardFooter";
import Header from "./Header";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Medical Records", href: "/dashboard/medical-records", icon: FileText },
  { name: "Report Summary", href: "/dashboard/reports", icon: ClipboardList },
  { name: "Family", href: "/dashboard/family", icon: Users },
  { name: "Emergency QR", href: "/dashboard/emergency", icon: QrCode },
  { name: "AI Symptom Checker", href: "/dashboard/symptom-checker", icon: Activity },
  { name: "AI Chat", href: "/dashboard/ai-chat", icon: MessageCircle },
];

const bottomItems = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Support", href: "/dashboard/support", icon: HelpCircle },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const close = () => setSidebarOpen(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  const NavLink = ({ item }: { item: (typeof navItems)[number] }) => {
    const Icon = item.icon;
    const active = isActive(item.href);
    return (
      <Link
        href={item.href}
        onClick={close}
        aria-current={active ? "page" : undefined}
        className={`relative flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors ${
          active ? "font-semibold text-mint-deep" : "text-body hover:bg-[#f3f4f6]"
        }`}
      >
        {active && (
          <motion.span
            layoutId="nav-pill"
            className="absolute inset-0 rounded-lg bg-mint"
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          />
        )}
        <Icon size={17} strokeWidth={1.8} className="relative" />
        <span className="relative">{item.name}</span>
      </Link>
    );
  };

  return (
    <div className="flex min-h-dvh bg-canvas">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.button
            type="button"
            aria-label="Close sidebar"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="no-print fixed inset-0 z-40 bg-black/30 md:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`no-print fixed left-0 top-0 z-50 flex h-dvh w-[280px] shrink-0 flex-col border-r border-line bg-white transition-transform duration-300 md:w-[240px] md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-[#edf0f5] px-6">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={close}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
              <span className="text-lg font-bold">C</span>
            </div>
            <div>
              <p className="text-[15px] font-bold leading-tight text-ink">CareTwin</p>
              <p className="text-[10px] font-semibold tracking-widest text-[#8b95a7]">PERSONAL HEALTH</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={close}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5" aria-label="Main">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
          <div className="mt-8 space-y-1 border-t border-[#edf0f5] pt-5">
            {bottomItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        </nav>

        <div className="shrink-0 px-4 pb-5">
          <Link
            href="/dashboard/medical-records?add=1"
            onClick={close}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark active:scale-[0.98]"
          >
            <Plus size={16} />
            Add Record
          </Link>
        </div>
      </aside>

      <div className="ml-0 flex min-h-dvh min-w-0 flex-1 flex-col md:ml-[240px]">
        <div className="no-print shrink-0">
          <Header onMenuClick={() => setSidebarOpen(true)} />
        </div>
        <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-7">
          {children}
        </main>
        <div className="no-print">
          <DashboardFooter />
        </div>
      </div>
    </div>
  );
}

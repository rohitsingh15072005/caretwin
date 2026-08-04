"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Stethoscope,
  MessageSquare,
  Settings,
  LifeBuoy,
  Plus,
  Shield,
} from "lucide-react";

const menuItems = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Medical Records",
    href: "/medical-records",
    icon: FileText,
  },
  {
    name: "AI Symptom Checker",
    href: "/symptom-checker",
    icon: Stethoscope,
  },
  {
    name: "AI Chat",
    href: "/ai-chat",
    icon: MessageSquare,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[#EEF2FF] border-r border-slate-200 flex flex-col justify-between">

      {/* Top */}
      <div>

        {/* Logo */}

        <div className="flex items-center gap-3 px-6 py-6">

          <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-white">
            <Shield size={20} />
          </div>

          <div>
            <h1 className="font-bold text-xl text-slate-800">
              CareTwin AI
            </h1>

            <p className="text-xs text-slate-500">
              Precision Health
            </p>
          </div>

        </div>

        {/* Navigation */}

        <nav className="px-4 mt-6 space-y-2">

          {menuItems.map((item) => {
            const Icon = item.icon;

            const active = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${
                  active
                    ? "bg-[#67F48B] text-slate-900 font-semibold"
                    : "hover:bg-white text-slate-600"
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}

        </nav>
      </div>

      {/* Bottom */}

      <div className="p-4">

        <button className="w-full bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 transition">
          <Plus size={18} />
          New Analysis
        </button>

        <div className="mt-6 space-y-2">

          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white text-slate-600"
          >
            <Settings size={18} />
            Settings
          </Link>

          <Link
            href="/support"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white text-slate-600"
          >
            <LifeBuoy size={18} />
            Support
          </Link>

        </div>

      </div>

    </aside>
  );
}
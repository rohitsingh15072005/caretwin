"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  LayoutDashboard,
  FileText,
  Stethoscope,
  MessageSquare,
  Settings,
  LifeBuoy,
  Plus,
  Shield,
  X,
  Menu,
} from "lucide-react";

const menuItems = [
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
    icon: Stethoscope,
  },
  {
    name: "AI Chat",
    href: "/dashboard/ai-chat",
    icon: MessageSquare,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  // Sidebar open/close state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      {/* ================================================= */}
      {/* OPEN SIDEBAR BUTTON */}
      {/* ================================================= */}

      {!sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
          className="
            fixed
            left-4
            top-4
            z-100
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-cyan-700
            text-white
            shadow-lg
            transition-all
            hover:bg-cyan-800
            hover:scale-105
          "
        >
          <Menu size={22} />
        </button>
      )}

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-64
          flex-col
          justify-between
          bg-[#EEF2FF]
          border-r
          border-slate-200
          shadow-sm
          transition-transform
          duration-300
          ease-in-out
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* ================================================= */}
        {/* TOP */}
        {/* ================================================= */}

        <div>

          {/* ================================================= */}
          {/* LOGO + CLOSE BUTTON */}
          {/* ================================================= */}

          <div className="flex items-center justify-between px-5 py-6">

            {/* Logo */}

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600 text-white">
                <Shield size={20} />
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  CareTwin AI
                </h1>

                <p className="text-xs text-slate-500">
                  Precision Health
                </p>
              </div>

            </div>

            {/* CLOSE BUTTON */}

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-slate-300
                bg-white
                text-slate-600
                shadow-sm
                transition
                hover:bg-slate-100
                hover:text-red-600
              "
            >
              <X size={20} strokeWidth={2.5} />
            </button>

          </div>

          {/* ================================================= */}
          {/* NAVIGATION */}
          {/* ================================================= */}

          <nav className="mt-6 space-y-2 px-4">

            {menuItems.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    transition-all
                    ${
                      active
                        ? "bg-[#67F48B] font-semibold text-slate-900"
                        : "text-slate-600 hover:bg-white"
                    }
                  `}
                >
                  <Icon size={18} />

                  <span>{item.name}</span>
                </Link>
              );
            })}

          </nav>

        </div>

        {/* ================================================= */}
        {/* BOTTOM */}
        {/* ================================================= */}

        <div className="p-4">

          {/* NEW ANALYSIS */}

          <Link
            href="/dashboard/symptom-checker"
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-cyan-700
              py-3
              font-semibold
              text-white
              transition
              hover:bg-cyan-800
            "
          >
            <Plus size={18} />

            New Analysis
          </Link>

          {/* SETTINGS + SUPPORT */}

          <div className="mt-6 space-y-2">

            <Link
              href="/dashboard/settings"
              className={`
                flex
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                transition
                ${
                  pathname.startsWith("/dashboard/settings")
                    ? "bg-[#67F48B] font-semibold text-slate-900"
                    : "text-slate-600 hover:bg-white"
                }
              `}
            >
              <Settings size={18} />

              Settings
            </Link>

            <Link
              href="/dashboard/support"
              className={`
                flex
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                transition
                ${
                  pathname.startsWith("/dashboard/support")
                    ? "bg-[#67F48B] font-semibold text-slate-900"
                    : "text-slate-600 hover:bg-white"
                }
              `}
            >
              <LifeBuoy size={18} />

              Support
            </Link>

          </div>

        </div>

      </aside>
    </>
  );
}
"use client";

import { Bell, Search, Menu } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex h-20 min-w-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 md:px-8">

      {/* Mobile Menu Button + Search */}
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">

        {/* Mobile Menu */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="shrink-0 rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
        >
          <Menu size={22} />
        </button>

        {/* Search Bar */}
        <div className="relative min-w-0 flex-1 md:max-w-[500px]">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 sm:left-4"
          />

          <input
            type="text"
            placeholder="Search health records..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 sm:py-3 sm:pl-12 sm:pr-4"
          />

        </div>
      </div>

      {/* Right Side */}
      <div className="ml-2 flex shrink-0 items-center gap-3 sm:ml-4 sm:gap-6">

        {/* Notification */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative shrink-0"
        >

          <Bell className="text-slate-600" size={22} />

          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500" />

        </button>

        {/* User */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Hide text on small screens */}
          <div className="hidden text-right sm:block">

            <h3 className="text-sm font-semibold text-slate-800">
              Rohit Singh
            </h3>

            <p className="text-xs text-slate-500">
              Patient
            </p>

          </div>

          <Image
            src="/images/profile.png"
            alt="Profile"
            width={42}
            height={42}
            className="h-9 w-9 rounded-full border-2 border-cyan-500 sm:h-[42px] sm:w-[42px]"
          />

        </div>

      </div>

    </header>
  );
}
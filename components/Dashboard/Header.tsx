"use client";

import { Bell, Search } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">

      {/* Search Bar */}

      <div className="relative w-[500px]">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search health records..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />

      </div>

      {/* Right Side */}

      <div className="flex items-center gap-6">

        {/* Notification */}

        <button className="relative">

          <Bell className="text-slate-600" size={22} />

          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500"></span>

        </button>

        {/* User */}

        <div className="flex items-center gap-3">

          <div className="text-right">

            <h3 className="font-semibold text-sm text-slate-800">
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
            className="rounded-full border-2 border-cyan-500"
          />

        </div>

      </div>

    </header>
  );
}
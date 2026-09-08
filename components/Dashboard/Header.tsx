"use client";

import { useEffect, useState } from "react";
import { Bell, Search, User } from "lucide-react";
import { getCurrentUser } from "@/lib/api";

export default function Header() {
  const [currentUser, setCurrentUser] = useState<{ id: number; full_name: string; email: string } | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error("Failed to load user header:", err);
      }
    }
    loadUser();
  }, []);

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
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
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
              {currentUser?.full_name || "Patient"}
            </h3>

            <p className="text-xs text-slate-500">
              CT-{currentUser?.id ? 1000 + currentUser.id : "2048"}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dff7ed] text-[#0878b8] border-2 border-cyan-500">
            <User size={20} />
          </div>
        </div>

      </div>

    </header>
  );
}
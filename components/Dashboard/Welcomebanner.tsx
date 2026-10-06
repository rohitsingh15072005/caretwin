"use client";

import { motion } from "framer-motion";
import { useCareData, firstName } from "@/lib/useCareData";

export default function WelcomeBanner() {
  const { dashboard, dashboardState, refresh, user } = useCareData();
  const latest = dashboard?.recentRecords[0];

  return (
    <section className="relative overflow-hidden rounded-2xl bg-navy px-6 py-7 text-white sm:px-8 sm:py-8">
      <div className="relative z-10 max-w-2xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-navy-2 px-3 py-1.5">
          <span className={`h-2 w-2 rounded-full ${dashboardState.status === "ready" ? "bg-mint" : "bg-amber-400"}`} />
          <span className="text-xs font-semibold text-mint">
            {dashboardState.status === "loading" ? "Loading your dashboard" : "Live account data"}
          </span>
        </div>

        <h1 className="text-[26px] font-bold leading-[1.15] tracking-tight sm:text-3xl">
          {user ? `Hello, ${firstName(dashboard?.greeting.firstName ?? [user.firstName, user.lastName].filter(Boolean).join(" "))}.` : "Your dashboard"}
          {dashboard && ` ${dashboard.counts.unreadNotifications} unread notification${dashboard.counts.unreadNotifications === 1 ? "" : "s"}.`}
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-[#b9c4d8]">
          {dashboardState.status === "loading"
            ? "Fetching your account summary from CareTwin."
            : dashboardState.status === "error"
              ? dashboardState.error
              : latest
                ? `Your latest record is "${latest.title}".`
                : "No medical records have been added to your account yet."}
        </p>
        {dashboardState.status === "error" && (
          <button type="button" onClick={() => void refresh()} className="mt-3 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20">
            Retry loading dashboard
          </button>
        )}
      </div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border-[35px] border-navy-2"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -right-5 h-56 w-56 rounded-full border-[25px] border-[#17233b]"
      />
    </section>
  );
}

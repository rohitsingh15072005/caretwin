"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, HeartPulse, Sparkles } from "lucide-react";

const bars = [38, 58, 44, 80, 62, 92];
const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section className="relative flex w-full items-center overflow-hidden bg-[#F8FBFF] py-16 sm:py-20 lg:min-h-[85vh]">
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full border-[48px] border-[#e9f1ff]" />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
              <Sparkles size={15} /> Precision health platform
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08, ease }} className="mt-7 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Your whole family&apos;s health, in one{" "}
              <span className="italic text-cyan-600">Health Twin</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18, ease }} className="mt-6 max-w-xl text-lg leading-8 text-slate-500 sm:text-xl sm:leading-9">
              Keep every report together, understand what changed over the last few months, and give responders what they need in one scan.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.28, ease }} className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-700 px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-cyan-800 active:scale-[0.98]">
                Join CareTwin <ArrowRight size={18} />
              </Link>
              <Link href="/Platform/Features" className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-8 py-4 font-semibold text-slate-800 transition hover:border-cyan-600 hover:text-cyan-600">
                Explore features
              </Link>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, delay: 0.2, ease }} className="relative pb-8">
            <div className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-400 text-white">
                  <HeartPulse size={26} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-400">Vital analysis</p>
                  <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">Optimal recovery</h2>
                </div>
              </div>

              <div className="mt-7 flex h-56 items-end justify-around rounded-2xl bg-[#EDF3FF] px-6 pb-5 sm:h-64 sm:px-10" role="img" aria-label="Health trend rising over six months">
                {bars.map((h, i) => (
                  <motion.div
                    key={i}
                    className="w-5 rounded-t bg-cyan-700 sm:w-6"
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.8, delay: 0.55 + i * 0.09, ease: "easeOut" }}
                  />
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[#F5F7FF] p-5">
                  <p className="font-medium text-slate-400">Stress level</p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">Low</p>
                </div>
                <div className="rounded-2xl bg-[#F5F7FF] p-5">
                  <p className="font-medium text-slate-400">AI forecast</p>
                  <p className="mt-1 text-2xl font-bold text-green-500 sm:text-3xl">+12% energy</p>
                </div>
              </div>
            </div>

            <div className="ct-float absolute -bottom-0 left-6 flex items-center gap-3 rounded-xl border border-cyan-300 bg-white px-5 py-3.5 shadow-xl">
              <BadgeCheck size={26} className="text-cyan-600" />
              <span className="font-semibold text-slate-700">Verified by CareTwin AI</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

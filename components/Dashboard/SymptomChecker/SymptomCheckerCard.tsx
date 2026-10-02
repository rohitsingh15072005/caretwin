"use client";

import Link from "next/link";
import { Activity, ArrowRight } from "lucide-react";

export default function SymptomCheckerCard() {
  return (
    <Link
      href="/dashboard/symptom-checker"
      className="group block rounded-xl bg-mint p-5 text-[#075333] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5be98f] hover:shadow-md"
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/50">
        <Activity size={19} strokeWidth={1.8} />
      </div>
      <h3 className="text-[15px] font-semibold">Symptom Checker</h3>
      <p className="mt-1 text-[13px] leading-5 text-[#256b49]">
        Check new symptoms against your medical history.
      </p>
      <div className="mt-4 flex items-center gap-1 text-[13px] font-semibold">
        <span>Check symptoms</span>
        <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

"use client";

import Link from "next/link";
import { Activity } from "lucide-react";

export default function SymptomCheckerCard() {
  return (
    <Link
      href="/dashboard/symptom-checker"
      className=" group  block rounded-xl bg-[#68f49c] p-5 text-[#075333] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5be98f] hover:shadow-md "
    >
      {/* Icon */}
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/50">
        <Activity size={19} strokeWidth={1.8} />
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold">
        Symptom Checker
      </h3>

      {/* Description */}
      <p className="mt-1 max-w-[230px] text-[10px] leading-[16px] text-[#256b49]">
        Check new symptoms against your existing medical history.
      </p>
    </Link>
  );
}
"use client";

import Link from "next/link";
import { QrCode, ArrowRight } from "lucide-react";

export default function EmergencyCard() {
  return (
    <Link
      href="/dashboard/emergency"
      className="group block rounded-xl bg-navy p-5 text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-danger text-white">
        <QrCode size={19} strokeWidth={1.8} />
      </div>
      <h3 className="text-[15px] font-semibold">Emergency QR</h3>
      <p className="mt-1 text-[13px] leading-5 text-[#b9c4d8]">
        Create a QR with your account name and age. Medical details are not available from your profile yet.
      </p>
      <div className="mt-4 flex items-center gap-1 text-[13px] font-semibold text-mint">
        <span>Create card</span>
        <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

"use client";

import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";

export default function AIChatCard() {
  return (
    <Link
      href="/dashboard/ai-chat"
      className="group block rounded-xl bg-brand p-5 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-md"
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
        <MessageCircle size={19} strokeWidth={1.8} />
      </div>
      <h3 className="text-[15px] font-semibold">Start AI Chat</h3>
      <p className="mt-1 text-[13px] leading-5 text-blue-100">
        Send a message to the connected CareTwin chat service.
      </p>
      <div className="mt-4 flex items-center gap-1 text-[13px] font-semibold">
        <span>Start chat</span>
        <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

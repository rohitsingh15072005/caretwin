"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function AIChatCard() {
  return (
    <Link
      href="/dashboard/ai-chat"
      className="group block rounded-xl bg-[#0878b8] p-5 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#06699f] hover:shadow-md"
    >
      {/* Icon */}
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
        <MessageCircle size={19} strokeWidth={1.8} />
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold">
        Start AI Chat
      </h3>

      {/* Description */}
      <p className="mt-1 max-w-[230px] text-[10px] leading-[16px] text-blue-100">
        Get instant insights about your health trends and medical records.
      </p>
      {/* Arrow */}
      <div className="mt-4 flex items-center gap-1 text-[10px] font-semibold text-[white]">
        <span>Start Chat</span>
      </div>
    </Link>
  );
}
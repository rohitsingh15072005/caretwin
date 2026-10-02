"use client";

import { Activity } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

export default function SymptomCheckerHeader() {
  return (
    <div className="space-y-4">
      <PageHeader
        icon={<Activity size={22} />}
        title="AI Symptom Checker"
        subtitle="Describe your symptoms and get guidance based on your health history."
      />
      <div className="rounded-lg border border-[#d9eee3] bg-[#f0fbf5] px-4 py-3">
        <p className="text-[13px] font-semibold text-[#16734d]">AI health assistant</p>
        <p className="mt-0.5 text-[13px] leading-5 text-[#4f7c67]">
          This tool provides general guidance and is not a replacement for professional medical advice. In an emergency, call your local emergency number.
        </p>
      </div>
    </div>
  );
}

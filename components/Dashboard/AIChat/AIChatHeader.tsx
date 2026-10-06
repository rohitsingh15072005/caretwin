"use client";

import { Brain } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

export default function AIChatHeader() {
  return (
    <PageHeader
      icon={<Brain size={22} />}
      title="CareTwin AI"
      subtitle="Chat with the CareTwin service using your account."
    />
  );
}

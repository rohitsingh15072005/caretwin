"use client";

import { useState } from "react";
import AIChatHeader from "@/components/Dashboard/AIChat/AIChatHeader";
import ChatWindow from "@/components/Dashboard/AIChat/ChatWindow";
import AIChatSidebar from "@/components/Dashboard/AIChat/AIChatSidebar";
import { Stagger, StaggerItem } from "@/components/ui/Motion";

export default function AIChatPage() {
  const [draft, setDraft] = useState("");

  return (
    <Stagger className="mx-auto w-full max-w-[1200px]">
      <StaggerItem>
        <AIChatHeader />
      </StaggerItem>
      <StaggerItem>
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
          <ChatWindow draft={draft} onDraftChange={setDraft} />
          <AIChatSidebar onPick={setDraft} />
        </div>
      </StaggerItem>
    </Stagger>
  );
}

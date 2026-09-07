"use client";

import AIChatHeader from "../../../components/Dashboard/AIChat/AIChatHeader";
import ChatWindow from "../../../components/Dashboard/AIChat/ChatWindow";
import AIChatSidebar from "../../../components/Dashboard/AIChat/AIChatSidebar";

export default function AIChatPage() {
  return (
    <div className="mx-auto w-full max-w-[1200px]">

      {/* Header */}
      <AIChatHeader />

      {/* Chat Area */}
      <div className="mt-5 grid min-h-[600px] grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">

        {/* Main Chat */}
        <ChatWindow />

        {/* Right Sidebar */}
        <AIChatSidebar />

      </div>

    </div>
  );
}
"use client";

import { useState } from "react";
import {
  Bot,
  Send,
  User,
  Sparkles,
} from "lucide-react";

interface Message {
  id: number;
  sender: "ai" | "user";
  text: string;
}

export default function ChatWindow() {

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text:
        "Hello Rohit! I'm CareTwin AI. I can help you understand your medical records, symptoms, medications, and general health information. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {

    const trimmed = input.trim();

    if (!trimmed) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    // Temporary frontend response
    setTimeout(() => {

      const aiMessage: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text:
          "I understand. Based on the information you've provided, I can help you explore this further. For a reliable assessment, please share more details such as when the symptoms started, their severity, and any relevant medical history.",
      };

      setMessages((prev) => [...prev, aiMessage]);

    }, 700);
  };

  return (
    <section className="flex min-h-[600px] flex-col overflow-hidden rounded-xl border border-[#e2e6ee] bg-white">

      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-[#edf0f4] px-5 py-4">

        <div className="flex items-center gap-3">

          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#e6f6ef] text-[#15965d]">

            <Bot size={18} />

            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#42d982]" />

          </div>

          <div>
            <p className="text-[11px] font-bold text-[#273044]">
              CareTwin AI Assistant
            </p>

            <p className="text-[8px] text-[#42a875]">
              Online
            </p>
          </div>

        </div>

        <div className="flex items-center gap-1 text-[8px] text-[#8b95a7]">
          <Sparkles size={11} />
          AI Powered
        </div>

      </div>


      {/* Messages */}
      <div className="flex-1 space-y-5 overflow-y-auto bg-[#fafbfe] p-5">

        {messages.map((message) => {

          const isAI = message.sender === "ai";

          return (
            <div
              key={message.id}
              className={`flex gap-3 ${
                isAI ? "justify-start" : "justify-end"
              }`}
            >

              {isAI && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e6f6ef] text-[#15965d]">
                  <Bot size={14} />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-xl px-4 py-3 ${
                  isAI
                    ? "rounded-tl-sm bg-white text-[#4b5563] shadow-sm"
                    : "rounded-tr-sm bg-[#0878b8] text-white"
                }`}
              >
                <p className="text-[10px] leading-[16px]">
                  {message.text}
                </p>
              </div>

              {!isAI && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#dcecff] text-[#0878b8]">
                  <User size={14} />
                </div>
              )}

            </div>
          );

        })}

      </div>


      {/* Suggestions */}
      <div className="border-t border-[#edf0f4] bg-white px-5 pt-3">

        <p className="mb-2 text-[8px] font-semibold uppercase tracking-wide text-[#9aa3b3]">
          Suggested questions
        </p>

        <div className="flex gap-2 overflow-x-auto pb-3">

          {[
            "Explain my latest report",
            "What does my heart rate mean?",
            "Review my medications",
          ].map((question) => (

            <button
              key={question}
              type="button"
              onClick={() => setInput(question)}
              className="shrink-0 rounded-full border border-[#dfe4ec] px-3 py-1.5 text-[8px] text-[#5d6675] transition hover:border-[#0878b8] hover:bg-[#f4fbfe]"
            >
              {question}
            </button>

          ))}

        </div>

      </div>


      {/* Input */}
      <div className="border-t border-[#edf0f4] bg-white p-4">

        <div className="flex items-center gap-2 rounded-xl border border-[#dfe4ec] bg-[#fafbfc] p-1.5 focus-within:border-[#0878b8]">

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Ask CareTwin AI about your health..."
            className="h-9 flex-1 bg-transparent px-3 text-[10px] text-[#111827] outline-none placeholder:text-[#a0a8b5]"
          />

          <button
            type="button"
            onClick={sendMessage}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0878b8] text-white transition hover:bg-[#06699f]"
          >
            <Send size={14} />
          </button>

        </div>

        <p className="mt-2 text-center text-[8px] text-[#a0a8b5]">
          CareTwin AI can make mistakes. Always consult a qualified healthcare
          professional for medical decisions.
        </p>

      </div>

    </section>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, User, Sparkles } from "lucide-react";
import { firstName, useCareData } from "@/lib/useCareData";

interface Message {
  id: number;
  sender: "ai" | "user";
  text: string;
}

const SUGGESTIONS = ["Explain my latest report", "What does my heart rate mean?", "Review my medications"];

export default function ChatWindow({ draft, onDraftChange }: { draft: string; onDraftChange: (v: string) => void }) {
  const { self } = useCareData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const greeting = `Hello ${firstName(self.name)}! I'm CareTwin AI. I can help you understand your medical records, symptoms, medications, and general health information. How can I help you today?`;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  const send = () => {
    const text = draft.trim();
    if (!text || typing) return;
    setMessages((prev) => [...prev, { id: Date.now(), sender: "user", text }]);
    onDraftChange("");
    setTyping(true);
    // Placeholder reply; connect your AI API here.
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: "Thanks for sharing that. For a reliable answer I need a little more detail: when did this start, how severe is it, and is there anything that makes it better or worse? Once the AI service is connected I will also use your records to answer.",
        },
      ]);
      setTyping(false);
    }, 1100);
  };

  const all: Message[] = [{ id: 0, sender: "ai", text: greeting }, ...messages];

  return (
    <section className="flex h-[640px] max-h-[calc(100dvh-210px)] min-h-[480px] flex-col overflow-hidden rounded-xl border border-[#e2e6ee] bg-white">
      <div className="flex items-center justify-between border-b border-[#edf0f4] px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#e6f6ef] text-[#15965d]">
            <Bot size={19} />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#42d982]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#273044]">CareTwin AI Assistant</p>
            <p className="text-xs text-[#42a875]">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#8b95a7]">
          <Sparkles size={13} /> AI powered
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto bg-[#fafbfe] p-5" role="log" aria-live="polite" aria-label="Conversation">
        {all.map((m) => {
          const isAI = m.sender === "ai";
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-3 ${isAI ? "justify-start" : "justify-end"}`}
            >
              {isAI && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e6f6ef] text-[#15965d]">
                  <Bot size={15} />
                </div>
              )}
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[75%] ${isAI ? "rounded-tl-sm bg-white text-[#4b5563] shadow-sm" : "rounded-tr-sm bg-brand text-white"}`}>
                <p className="text-sm leading-6">{m.text}</p>
              </div>
              {!isAI && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#dcecff] text-brand">
                  <User size={15} />
                </div>
              )}
            </motion.div>
          );
        })}

        <AnimatePresence>
          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e6f6ef] text-[#15965d]">
                <Bot size={15} />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-white px-4 py-3.5 shadow-sm" aria-label="CareTwin AI is typing">
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} className="h-2 w-2 rounded-full bg-[#9db3c4]" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      <div className="border-t border-[#edf0f4] bg-white px-5 pt-3">
        <p className="mb-2 text-xs font-semibold text-[#9aa3b3]">Suggested questions</p>
        <div className="flex gap-2 overflow-x-auto pb-3">
          {SUGGESTIONS.map((q) => (
            <button key={q} type="button" onClick={() => onDraftChange(q)} className="shrink-0 rounded-full border border-[#dfe4ec] px-3.5 py-1.5 text-xs text-[#5d6675] transition hover:border-brand hover:bg-[#f4fbfe]">
              {q}
            </button>
          ))}
        </div>
      </div>

      <form
        className="border-t border-[#edf0f4] bg-white p-4"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <div className="flex items-center gap-2 rounded-xl border border-[#dfe4ec] bg-[#fafbfc] p-1.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
          <input
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            aria-label="Message CareTwin AI"
            placeholder="Ask CareTwin AI about your health..."
            className="h-10 flex-1 bg-transparent px-3 text-sm text-ink outline-none placeholder:text-[#a0a8b5]"
          />
          <button type="submit" disabled={!draft.trim() || typing} aria-label="Send message" className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-white transition hover:bg-brand-dark disabled:opacity-50">
            <Send size={16} />
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-[#a0a8b5]">CareTwin AI can make mistakes. Always consult a qualified healthcare professional for medical decisions.</p>
      </form>
    </section>
  );
}

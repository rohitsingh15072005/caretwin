"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, User, Sparkles } from "lucide-react";
import { createChat, getChat, listChats, sendChatMessage, type ApiChatMessage } from "@/lib/api";

const SUGGESTIONS = ["Explain my latest report", "What does this health term mean?", "Help me understand a symptom"];

export default function ChatWindow({ draft, onDraftChange }: { draft: string; onDraftChange: (v: string) => void }) {
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ApiChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emergency, setEmergency] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const loadLatestChat = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { items } = await listChats();
      const latest = items[0];
      if (latest) {
        const { chat } = await getChat(latest.id);
        setChatId(chat.id);
        setMessages(chat.messages);
      } else {
        setChatId(null);
        setMessages([]);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load your conversations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadLatestChat(), 0);
    return () => window.clearTimeout(timeout);
  }, [loadLatestChat]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing, loading, error]);

  const send = async () => {
    const text = draft.trim();
    if (!text || typing || loading) return;
    setError(null);
    setTyping(true);
    try {
      let activeChatId = chatId;
      if (!activeChatId) {
        const { chat } = await createChat(text.slice(0, 80));
        activeChatId = chat.id;
        setChatId(chat.id);
      }

      const result = await sendChatMessage(activeChatId, text);
      setMessages((previous) => [...previous, result.userMessage, result.assistantMessage]);
      setEmergency(result.emergency?.kind ?? null);
      onDraftChange("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Your message could not be sent.");
    } finally {
      setTyping(false);
    }
  };

  return (
    <section className="flex h-[640px] max-h-[calc(100dvh-210px)] min-h-[480px] flex-col overflow-hidden rounded-xl border border-[#e2e6ee] bg-white">
      <div className="flex items-center justify-between border-b border-[#edf0f4] px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#e6f6ef] text-[#15965d]">
            <Bot size={19} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#273044]">CareTwin AI Assistant</p>
            <p className="text-xs text-[#8b95a7]">{loading ? "Loading conversation…" : "Connected to CareTwin"}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#8b95a7]">
          <Sparkles size={13} /> AI assistant
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto bg-[#fafbfe] p-5" role="log" aria-live="polite" aria-label="Conversation">
        {loading ? (
          <div className="ct-skeleton h-16 rounded-xl" />
        ) : (
          <>
            {messages.length === 0 && (
              <div className="rounded-xl bg-white p-4 text-sm leading-6 text-[#4b5563] shadow-sm">
                Start a conversation with CareTwin AI. Responses are provided by the connected service.
              </div>
            )}
            {messages.map((message) => {
              const isAI = message.sender === "assistant";
              return (
                <motion.div
                  key={message.id}
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
                    <p className="whitespace-pre-wrap text-sm leading-6">{message.message}</p>
                  </div>
                  {!isAI && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#dcecff] text-brand">
                      <User size={15} />
                    </div>
                  )}
                </motion.div>
              );
            })}
            {error && (
              <div role="alert" className="rounded-lg border border-[#f3b5b5] bg-danger-soft px-4 py-3 text-sm text-danger">
                <p>{error}</p>
                {!chatId && (
                  <button type="button" onClick={() => void loadLatestChat()} className="mt-2 font-semibold underline">
                    Retry loading conversations
                  </button>
                )}
              </div>
            )}
            {emergency && (
              <p role="status" className="rounded-lg border border-[#f0dfc1] bg-[#fffaf0] px-4 py-3 text-sm text-[#7a5c1f]">
                The assistant invoked its {emergency} safety response. Review the assistant message above carefully.
              </p>
            )}
          </>
        )}

        <AnimatePresence>
          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e6f6ef] text-[#15965d]">
                <Bot size={15} />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-white px-4 py-3.5 shadow-sm" aria-label="CareTwin AI is responding">
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
          {SUGGESTIONS.map((question) => (
            <button key={question} type="button" onClick={() => onDraftChange(question)} className="shrink-0 rounded-full border border-[#dfe4ec] px-3.5 py-1.5 text-xs text-[#5d6675] transition hover:border-brand hover:bg-[#f4fbfe]">
              {question}
            </button>
          ))}
        </div>
      </div>

      <form
        className="border-t border-[#edf0f4] bg-white p-4"
        onSubmit={(event) => {
          event.preventDefault();
          void send();
        }}
      >
        <div className="flex items-center gap-2 rounded-xl border border-[#dfe4ec] bg-[#fafbfc] p-1.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
          <input
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            aria-label="Message CareTwin AI"
            placeholder="Ask CareTwin AI about your health..."
            maxLength={2000}
            className="h-10 flex-1 bg-transparent px-3 text-sm text-ink outline-none placeholder:text-[#a0a8b5]"
          />
          <button type="submit" disabled={!draft.trim() || typing || loading} aria-label="Send message" className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-white transition hover:bg-brand-dark disabled:opacity-50">
            <Send size={16} />
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-[#a0a8b5]">CareTwin AI can make mistakes. Always consult a qualified healthcare professional for medical decisions.</p>
      </form>
    </section>
  );
}

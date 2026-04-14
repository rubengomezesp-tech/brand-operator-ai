"use client";
import { useEffect, useRef, useState } from "react";
import { MessageBubble } from "./MessageBubble";
import { Composer } from "./Composer";
import type { ChatMessage, ChatAttachment } from "@/types/chat";
import { useHistory } from "@/lib/history";
import { Button } from "@/components/ui/Button";
import { RotateCcw, Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "Critique this reference and give me 3 image prompts I can run.",
  "Draft a launch campaign in refined + disciplined tone for a cashmere hoodie.",
  "Suggest 5 brand names for a minimalist fragrance line.",
  "Improve this product description — make it feel editorial.",
];

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const addToHistory = useHistory((s) => s.add);

  useEffect(() => {
    // auto-scroll to bottom on message change
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  async function onSend(text: string, attachments: ChatAttachment[]) {
    setError(null);
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      attachments,
      createdAt: Date.now(),
    };
    const pendingMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      createdAt: Date.now(),
      pending: true,
    };
    const next = [...messages, userMsg, pendingMsg];
    setMessages(next);
    setSending(true);

    try {
      const payload = next
        .filter((m) => !m.pending)
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
          attachments: m.attachments?.map((a) => ({
            kind: a.kind,
            name: a.name,
            mime: a.mime,
            dataUrl: a.dataUrl,
            text: a.text,
          })),
        }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Chat failed");

      const assistantMsg: ChatMessage = {
        id: pendingMsg.id,
        role: "assistant",
        content: data.text,
        createdAt: Date.now(),
      };
      const final = [...next.slice(0, -1), assistantMsg];
      setMessages(final);

      addToHistory({
        kind: "chat",
        title: text.slice(0, 80) || "Chat session",
        resultText: data.text,
        meta: { provider: data.provider, turns: final.length },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setMessages((prev) => prev.filter((m) => !m.pending));
    } finally {
      setSending(false);
    }
  }

  function reset() {
    setMessages([]);
    setError(null);
  }

  const empty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header strip */}
      <div className="flex items-center justify-between px-6 lg:px-10 py-3 border-b border-border">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-gold">
          <Sparkles className="h-3 w-3" /> Creative Agent · live
        </div>
        {!empty && (
          <Button size="sm" variant="ghost" onClick={reset} leading={<RotateCcw className="h-3.5 w-3.5" />}>
            New thread
          </Button>
        )}
      </div>

      {/* Scrollable message area */}
      <div ref={scrollerRef} className="flex-1 overflow-y-auto">
        <div className="max-w-[860px] w-full mx-auto px-6 lg:px-10 py-8">
          {empty ? (
            <div className="flex flex-col items-center text-center py-10">
              <div className="h-14 w-14 rounded-full gold-grad flex items-center justify-center mb-5">
                <span className="font-display text-[22px] text-bg leading-none">B</span>
              </div>
              <h2 className="font-display text-[32px] leading-tight">How can I direct for you today?</h2>
              <p className="text-[14px] text-fg-muted mt-2 max-w-md">
                Upload a reference, ask for copy, or get image prompts. I control the whole studio.
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-[560px]">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => onSend(s, [])}
                    className="text-left text-[13px] text-fg-soft px-4 py-3 rounded-[10px] border border-border bg-surface hover:border-gold/50 hover:bg-surface-2 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
            </div>
          )}
          {error && (
            <div className="mt-4 text-[13px] text-danger bg-danger/10 border border-danger/30 rounded-[8px] px-3 py-2">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="border-t border-border bg-bg">
        <div className="max-w-[860px] w-full mx-auto px-6 lg:px-10 py-4">
          <Composer onSend={onSend} disabled={sending} />
        </div>
      </div>
    </div>
  );
}

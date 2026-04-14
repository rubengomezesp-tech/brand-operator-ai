"use client";
import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { Paperclip, ArrowUp, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { readAttachment, formatBytes } from "@/lib/attachments";
import type { ChatAttachment } from "@/types/chat";

interface Props {
  onSend: (text: string, attachments: ChatAttachment[]) => void;
  disabled?: boolean;
}

export function Composer({ onSend, disabled }: Props) {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    setError(null);
    const next: ChatAttachment[] = [];
    for (const f of Array.from(files).slice(0, 6 - attachments.length)) {
      try {
        next.push(await readAttachment(f));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to attach");
      }
    }
    setAttachments((prev) => [...prev, ...next]);
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }

  function autoresize() {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 220) + "px";
  }

  function submit() {
    const trimmed = text.trim();
    if ((!trimmed && attachments.length === 0) || disabled) return;
    onSend(trimmed, attachments);
    setText("");
    setAttachments([]);
    if (taRef.current) taRef.current.style.height = "auto";
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  const canSend = (!!text.trim() || attachments.length > 0) && !disabled;

  return (
    <div className="w-full">
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {attachments.map((a) => (
            <div
              key={a.id}
              className="group relative flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-md border border-border bg-surface-2"
            >
              {a.kind === "image" && a.dataUrl ? (
                <Image
                  src={a.dataUrl}
                  alt={a.name}
                  width={40}
                  height={40}
                  unoptimized
                  className="h-10 w-10 rounded-[6px] object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-[6px] bg-surface-3 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-gold" />
                </div>
              )}
              <div className="flex flex-col leading-tight max-w-[160px]">
                <span className="text-[12px] truncate">{a.name}</span>
                <span className="text-[10px] text-fg-subtle uppercase tracking-[0.12em]">
                  {formatBytes(a.size)}
                  {a.kind === "file" && !a.text ? " · not parsed" : ""}
                </span>
              </div>
              <button
                onClick={() => removeAttachment(a.id)}
                className="h-5 w-5 rounded-full bg-surface-3 border border-border-strong flex items-center justify-center hover:bg-danger/20 hover:border-danger transition"
                aria-label="Remove"
                type="button"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mb-2 text-[12px] text-danger bg-danger/10 border border-danger/30 rounded-md px-3 py-1.5">
          {error}
        </div>
      )}

      <div
        className={cn(
          "flex items-end gap-2 p-2.5 rounded-xl border bg-surface-2 transition-colors",
          "border-border focus-within:border-gold/60 focus-within:bg-surface-3"
        )}
      >
        <input
          ref={fileInput}
          type="file"
          className="hidden"
          multiple
          accept="image/*,text/*,.md,.csv,.json,.xml,.yaml,.yml,.pdf,.log"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <button
          onClick={() => fileInput.current?.click()}
          disabled={disabled || attachments.length >= 6}
          type="button"
          className="h-9 w-9 shrink-0 rounded-md border border-border text-fg-muted hover:text-gold hover:border-gold/60 disabled:opacity-40 flex items-center justify-center transition-colors"
          aria-label="Attach"
          title="Attach images or text files"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        <textarea
          ref={taRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            autoresize();
          }}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder="Ask your creative agent anything — upload references to critique…"
          disabled={disabled}
          className="flex-1 bg-transparent resize-none text-[14.5px] leading-[1.55] py-2 px-1 outline-none placeholder:text-fg-subtle max-h-[220px]"
        />

        <button
          onClick={submit}
          disabled={!canSend}
          type="button"
          className={cn(
            "h-9 w-9 shrink-0 rounded-md flex items-center justify-center transition",
            canSend
              ? "gold-grad text-bg shadow-[0_6px_20px_-6px_rgba(201,168,99,0.5)] hover:brightness-110"
              : "bg-surface-3 text-fg-subtle cursor-not-allowed"
          )}
          aria-label="Send"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-2 text-[10.5px] text-fg-subtle uppercase tracking-[0.16em]">
        Enter to send · Shift+Enter for newline
      </div>
    </div>
  );
}

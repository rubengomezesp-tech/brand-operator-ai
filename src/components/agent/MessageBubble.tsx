"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chat";
import { LoadingDots } from "@/components/ui/Spinner";
import { FileText } from "lucide-react";
import { formatBytes } from "@/lib/attachments";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex w-full gap-3 animate-fade-up", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="h-8 w-8 shrink-0 rounded-full gold-grad flex items-center justify-center mt-0.5">
          <span className="font-display text-[13px] text-bg leading-none">B</span>
        </div>
      )}
      <div className={cn("max-w-[78%] flex flex-col gap-2", isUser ? "items-end" : "items-start")}>
        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className={cn("flex flex-wrap gap-2", isUser ? "justify-end" : "justify-start")}>
            {message.attachments.map((a) =>
              a.kind === "image" && a.dataUrl ? (
                <div key={a.id} className="relative rounded-[10px] overflow-hidden border border-border bg-surface-2">
                  <Image
                    src={a.dataUrl}
                    alt={a.name}
                    width={260}
                    height={260}
                    unoptimized
                    className="h-[140px] w-auto object-cover"
                  />
                </div>
              ) : (
                <div key={a.id} className="flex items-center gap-2.5 px-3 h-11 rounded-[10px] border border-border bg-surface-2 max-w-[260px]">
                  <FileText className="h-4 w-4 text-gold shrink-0" />
                  <div className="min-w-0 flex flex-col leading-tight">
                    <span className="text-[12.5px] truncate">{a.name}</span>
                    <span className="text-[10.5px] text-fg-subtle uppercase tracking-[0.12em]">
                      {formatBytes(a.size)}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Text */}
        {message.pending ? (
          <div className="px-4 h-10 flex items-center rounded-[14px] border border-border bg-surface-2">
            <LoadingDots />
          </div>
        ) : message.content ? (
          <div
            className={cn(
              "px-4 py-3 rounded-[14px] text-[14.5px] leading-[1.65] whitespace-pre-wrap",
              isUser
                ? "bg-fg text-bg"
                : "bg-surface-2 border border-border text-fg-soft"
            )}
          >
            {message.content}
          </div>
        ) : null}
      </div>
    </div>
  );
}

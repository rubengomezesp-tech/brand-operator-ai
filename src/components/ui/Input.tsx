"use client";
import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full bg-surface-2 border border-border text-fg " +
  "placeholder:text-fg-subtle rounded-[10px] px-3.5 transition-all " +
  "focus:outline-none focus:border-gold/60 focus:bg-surface-3 " +
  "focus:ring-2 focus:ring-gold/15";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} className={cn(fieldBase, "h-10 text-[14px]", className)} {...rest} />;
  }
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, rows = 4, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(fieldBase, "py-3 text-[14px] leading-relaxed resize-none", className)}
        {...rest}
      />
    );
  }
);

export function Label({ children, hint, htmlFor }: { children: ReactNode; hint?: string; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="flex items-center justify-between mb-2">
      <span className="text-[12px] uppercase tracking-[0.12em] text-fg-muted">{children}</span>
      {hint && <span className="text-[11px] text-fg-subtle">{hint}</span>}
    </label>
  );
}

export function Field({ children }: { children: ReactNode }) {
  return <div className="flex flex-col">{children}</div>;
}

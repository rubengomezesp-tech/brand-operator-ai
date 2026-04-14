"use client";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Chip({
  active,
  onClick,
  children,
  disabled,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full",
        "text-[13px] font-medium tracking-tight transition-all duration-200",
        "border select-none active:scale-[.97]",
        active
          ? "bg-gold text-bg border-gold shadow-[0_6px_24px_-8px_rgba(201,168,99,0.55)]"
          : "bg-surface-2 text-fg-soft border-border hover:border-border-strong hover:text-fg",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full transition-all",
          active ? "bg-bg" : "bg-fg-subtle group-hover:bg-gold"
        )}
      />
      {children}
    </button>
  );
}

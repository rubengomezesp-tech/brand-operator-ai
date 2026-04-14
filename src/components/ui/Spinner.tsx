import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-4 w-4 rounded-full border-2 border-fg-muted border-t-transparent animate-spin",
        className
      )}
    />
  );
}

export function LoadingDots() {
  return (
    <span className="inline-flex gap-1">
      <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse-dot" />
      <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse-dot" style={{ animationDelay: "0.2s" }} />
      <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse-dot" style={{ animationDelay: "0.4s" }} />
    </span>
  );
}

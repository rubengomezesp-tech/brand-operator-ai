import { Sparkles } from "lucide-react";

export function Topbar({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-10 glass border-b border-border">
      <div className="flex items-center justify-between h-[64px] px-6 lg:px-10">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-fg-subtle">
            <Sparkles className="h-3 w-3 text-gold" />
            Brand Operator · Studio
          </div>
          <h1 className="font-display text-[22px] leading-tight mt-0.5">{title}</h1>
          {subtitle && (
            <p className="text-[13px] text-fg-muted mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-3">{action}</div>
      </div>
    </header>
  );
}

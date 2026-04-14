"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ImageIcon,
  Megaphone,
  MessageSquare,
  Search,
  Library,
  Settings,
  Type,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
};

type NavGroup = { group: string; items: NavItem[] };

const nav: NavGroup[] = [
  {
    group: "Workspace",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/agent", label: "Creative Agent", icon: MessageSquare, badge: "AI" },
    ],
  },
  {
    group: "Generate",
    items: [
      { href: "/generate/image", label: "Product Imagery", icon: ImageIcon },
      { href: "/generate/campaign", label: "Campaigns", icon: Megaphone },
      { href: "/generate/copy", label: "Copywriting", icon: Type },
      { href: "/research", label: "Market Research", icon: Search },
    ],
  },
  {
    group: "Library",
    items: [
      { href: "/assets", label: "Assets", icon: Library },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex flex-col w-[260px] shrink-0 h-screen sticky top-0 border-r border-border bg-bg">
      <div className="px-6 py-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="h-8 w-8 rounded-md gold-grad flex items-center justify-center">
            <span className="font-display text-[18px] leading-none text-bg">B</span>
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[14px] font-medium tracking-tight">Brand Operator</span>
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-fg-muted mt-1">
              AI Studio
            </span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        {nav.map((section) => (
          <div key={section.group}>
            <div className="px-3 mb-2 text-[10.5px] uppercase tracking-[0.18em] text-fg-subtle">
              {section.group}
            </div>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "relative flex items-center gap-3 px-3 h-9 rounded-md text-[13.5px] transition-colors",
                        active
                          ? "bg-surface-2 text-fg"
                          : "text-fg-muted hover:bg-surface-2/60 hover:text-fg"
                      )}
                    >
                      {active && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full gold-grad" />
                      )}
                      <Icon className={cn("h-4 w-4 shrink-0", active && "text-gold")} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="px-1.5 h-4 text-[9.5px] tracking-[0.12em] uppercase rounded bg-gold/15 text-gold flex items-center">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="surface-raised p-4">
          <div className="text-[11px] uppercase tracking-[0.16em] text-gold mb-1.5">
            Plan · Studio
          </div>
          <div className="text-[13px] text-fg-soft leading-snug">
            Unlimited generations.
          </div>
        </div>
      </div>
    </aside>
  );
}

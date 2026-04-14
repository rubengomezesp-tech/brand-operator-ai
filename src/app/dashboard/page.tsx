import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";
import { Card, CardBody } from "@/components/ui/Card";
import {
  ArrowUpRight,
  ImageIcon,
  Megaphone,
  MessageSquare,
  Search,
  Type,
  type LucideIcon,
} from "lucide-react";

type Tile = {
  href: string;
  kicker: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  accent?: boolean;
};

const tiles: Tile[] = [
  {
    href: "/agent",
    kicker: "New",
    title: "Creative Agent",
    desc: "Chat with your AI director. Upload references, get prompts, campaigns, and brand direction — all in one thread.",
    icon: MessageSquare,
    accent: true,
  },
  {
    href: "/generate/image",
    kicker: "Generate",
    title: "Product Imagery",
    desc: "Editorial-grade product shots, lookbooks, and concepts from a single prompt.",
    icon: ImageIcon,
  },
  {
    href: "/generate/campaign",
    kicker: "Generate",
    title: "Campaigns",
    desc: "Multi-tone headlines, captions, and launch copy engineered for your brand.",
    icon: Megaphone,
  },
  {
    href: "/generate/copy",
    kicker: "Generate",
    title: "Copywriting",
    desc: "Taglines, hero lines, product stories, launch emails — written with taste.",
    icon: Type,
  },
  {
    href: "/research",
    kicker: "Intelligence",
    title: "Market Research",
    desc: "Sharp takes on competitors, positioning, and whitespace in your category.",
    icon: Search,
  },
];

export default function DashboardPage() {
  return (
    <>
      <Topbar title="Studio" subtitle="Your creative command center." />
      <div className="px-6 lg:px-10 py-8 max-w-[1400px] w-full mx-auto space-y-10">
        <section className="relative overflow-hidden surface-raised p-8 lg:p-10">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full gold-grad opacity-[0.08] blur-3xl" />
          <div className="relative max-w-2xl">
            <div className="text-[11px] uppercase tracking-[0.18em] text-gold mb-3">
              Operator · Studio
            </div>
            <h2 className="font-display text-[40px] lg:text-[52px] leading-[1.05]">
              Run your brand like a <span className="text-gold-grad">studio</span>,
              <br /> not a side-quest.
            </h2>
            <p className="text-[15px] text-fg-muted mt-4 max-w-xl">
              Imagery, campaigns, copy, research, and creative direction — unified under one AI brain.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                href="/agent"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-md gold-grad text-bg font-medium text-[14px] shadow-[0_10px_32px_-8px_rgba(201,168,99,0.5)] hover:brightness-110 transition"
              >
                Open Creative Agent <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/generate/image"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-surface-2 border border-border-strong text-[14px] hover:border-gold hover:text-gold transition"
              >
                Generate imagery
              </Link>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between mb-4">
            <h3 className="font-display text-[20px]">Modules</h3>
            <span className="text-[11px] uppercase tracking-[0.16em] text-fg-subtle">
              05 · tools
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tiles.map((t) => {
              const Icon = t.icon;
              return (
                <Link key={t.href} href={t.href} className="group">
                  <Card className="h-full transition-all duration-300 group-hover:border-gold/50 group-hover:-translate-y-0.5">
                    <CardBody className="flex gap-5">
                      <div
                        className={`h-12 w-12 rounded-md shrink-0 flex items-center justify-center border border-border ${
                          t.accent ? "gold-grad" : "bg-surface-2"
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${t.accent ? "text-bg" : "text-gold"}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10.5px] uppercase tracking-[0.16em] text-fg-subtle">
                            {t.kicker}
                          </span>
                          {t.accent && (
                            <span className="px-1.5 h-4 text-[9.5px] tracking-[0.12em] uppercase rounded bg-gold/15 text-gold flex items-center">
                              beta
                            </span>
                          )}
                        </div>
                        <h4 className="text-[16px] font-medium tracking-tight mt-0.5">
                          {t.title}
                        </h4>
                        <p className="text-[13.5px] text-fg-muted leading-relaxed mt-1.5">
                          {t.desc}
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-fg-subtle group-hover:text-gold -rotate-12 group-hover:rotate-0 transition-all" />
                    </CardBody>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

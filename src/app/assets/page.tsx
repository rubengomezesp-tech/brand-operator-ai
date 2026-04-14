"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useHistory, type HistoryKind } from "@/lib/history";
import { Topbar } from "@/components/layout/Topbar";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { formatDate } from "@/lib/utils";
import {
  Trash2,
  Library,
  ImageIcon,
  Megaphone,
  Type,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

const FILTERS: Array<{ id: "all" | HistoryKind; label: string }> = [
  { id: "all", label: "All" },
  { id: "image", label: "Imagery" },
  { id: "campaign", label: "Campaigns" },
  { id: "copy", label: "Copy" },
  { id: "chat", label: "Chat" },
];

const KIND_ICON: Record<HistoryKind, LucideIcon> = {
  image: ImageIcon,
  campaign: Megaphone,
  copy: Type,
  chat: MessageSquare,
};

export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = useHistory((s) => s.items);
  const remove = useHistory((s) => s.remove);
  const clear = useHistory((s) => s.clear);
  const [filter, setFilter] = useState<"all" | HistoryKind>("all");

  const filtered = filter === "all" ? items : items.filter((i) => i.kind === filter);
  const showItems = mounted ? filtered : [];

  return (
    <>
      <Topbar
        title="Assets"
        subtitle="Everything you've generated in this studio."
        action={
          mounted && items.length > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              leading={<Trash2 className="h-3.5 w-3.5" />}
            >
              Clear all
            </Button>
          ) : undefined
        }
      />
      <div className="px-6 lg:px-10 py-8 max-w-[1400px] w-full mx-auto space-y-6">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Chip key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
            </Chip>
          ))}
        </div>

        {!mounted ? (
          <Card>
            <CardBody className="py-16 text-center text-fg-muted text-[13px]">
              Loading library…
            </CardBody>
          </Card>
        ) : showItems.length === 0 ? (
          <Card>
            <CardBody className="py-16 flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full border border-border flex items-center justify-center mb-4">
                <Library className="h-5 w-5 text-gold" />
              </div>
              <div className="font-display text-[22px] mb-1">No assets yet</div>
              <div className="text-[13.5px] text-fg-muted max-w-sm mb-6">
                Your imagery, campaigns, copy, and chats land here automatically.
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <Link href="/generate/image">
                  <Button variant="secondary" size="sm">
                    Generate imagery
                  </Button>
                </Link>
                <Link href="/generate/campaign">
                  <Button variant="secondary" size="sm">
                    Draft a campaign
                  </Button>
                </Link>
                <Link href="/agent">
                  <Button size="sm">Open agent</Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {showItems.map((item) => {
              const Icon = KIND_ICON[item.kind];
              return (
                <Card key={item.id} className="group overflow-hidden">
                  {item.resultUrls && item.resultUrls[0] && (
                    <div className="relative aspect-square bg-surface-2 overflow-hidden">
                      <Image
                        src={item.resultUrls[0]}
                        alt={item.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                  )}
                  <CardBody className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.16em] text-gold">
                        <Icon className="h-3 w-3" /> {item.kind}
                      </span>
                      <span className="text-[10.5px] text-fg-subtle">
                        {formatDate(new Date(item.createdAt).toISOString())}
                      </span>
                    </div>
                    <div className="text-[14px] text-fg line-clamp-2 min-h-[2.6em]">
                      {item.title}
                    </div>
                    {item.resultText && (
                      <div className="text-[12.5px] text-fg-muted line-clamp-3">
                        {item.resultText}
                      </div>
                    )}
                    <div className="flex justify-end">
                      <button
                        onClick={() => remove(item.id)}
                        className="text-[11px] text-fg-subtle hover:text-danger transition"
                      >
                        Remove
                      </button>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

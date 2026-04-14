import { Topbar } from "@/components/layout/Topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { env } from "@/lib/env";
import { Check, X } from "lucide-react";

function Row({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <div className="text-[13.5px]">{label}</div>
        <div className="text-[11.5px] text-fg-subtle font-mono mt-0.5">{value}</div>
      </div>
      <span
        className={`flex items-center gap-1.5 px-2 h-6 rounded-full text-[11px] uppercase tracking-[0.12em] border ${
          ok
            ? "text-success border-success/30 bg-success/10"
            : "text-fg-muted border-border bg-surface-2"
        }`}
      >
        {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
        {ok ? "Connected" : "Not set"}
      </span>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <Topbar title="Settings" subtitle="Providers, keys, and environment." />
      <div className="px-6 lg:px-10 py-8 max-w-[900px] w-full mx-auto space-y-6">
        <Card>
          <CardHeader
            title="AI Providers"
            subtitle="Set in .env.local. The app auto-selects the best available."
          />
          <CardBody>
            <Row label="OpenAI · GPT-4o" value="OPENAI_API_KEY" ok={!!env.OPENAI_API_KEY} />
            <Row
              label="Anthropic · Claude 3.5 Sonnet"
              value="ANTHROPIC_API_KEY"
              ok={!!env.ANTHROPIC_API_KEY}
            />
            <Row
              label="Replicate · Flux 1.1 Pro"
              value="REPLICATE_API_TOKEN"
              ok={!!env.REPLICATE_API_TOKEN}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Defaults" subtitle="Active providers for this environment." />
          <CardBody className="space-y-2 text-[13px]">
            <div className="flex justify-between">
              <span className="text-fg-muted">Image</span>
              <code className="font-mono text-[12px]">{env.DEFAULT_IMAGE_PROVIDER}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">Text</span>
              <code className="font-mono text-[12px]">{env.DEFAULT_TEXT_PROVIDER}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">Chat</span>
              <code className="font-mono text-[12px]">{env.DEFAULT_CHAT_PROVIDER}</code>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="About" />
          <CardBody className="text-[13.5px] text-fg-muted leading-relaxed">
            Brand Operator AI — a premium AI studio. Imagery, campaigns, copy, research, and a creative
            agent unified under one aesthetic.
          </CardBody>
        </Card>
      </div>
    </>
  );
}

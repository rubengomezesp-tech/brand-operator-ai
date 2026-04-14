"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label, Field } from "@/components/ui/Input";
import { Card, CardBody } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { LoadingDots } from "@/components/ui/Spinner";
import { useHistory } from "@/lib/history";
import { ALL_TONES, type CampaignTone } from "@/types/campaign";
import { TONE_LABELS } from "@/prompts/campaign";
import { Megaphone, Sparkles, Copy, Check } from "lucide-react";

const CHANNELS = ["Web", "Instagram", "Email", "TikTok", "OOH", "Print", "PR"];

export function CampaignGenerator() {
  const [brand, setBrand] = useState("");
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [objective, setObjective] = useState("");
  const [extra, setExtra] = useState("");
  const [tones, setTones] = useState<CampaignTone[]>(["refined"]);
  const [channels, setChannels] = useState<string[]>(["Web", "Instagram", "Email"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const add = useHistory((s) => s.add);

  function toggleTone(t: CampaignTone) {
    setTones((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }
  function toggleChannel(c: string) {
    setChannels((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  async function onGenerate() {
    if (!brand.trim() || !product.trim() || tones.length === 0 || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/ai/campaign", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ brand, product, audience, objective, extra, tones, channels }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Generation failed");
      setResult(data.text);
      add({
        kind: "campaign",
        title: `${brand} — ${product}`.slice(0, 80),
        resultText: data.text,
        meta: { tones, channels, provider: data.provider },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function onCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const canSubmit = brand.trim() && product.trim() && tones.length > 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[480px_1fr] gap-6">
      <Card>
        <CardBody className="space-y-5">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-gold">
            <Sparkles className="h-3 w-3" /> Brief
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <Label>Brand</Label>
              <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Aurora" />
            </Field>
            <Field>
              <Label>Product / launch</Label>
              <Input value={product} onChange={(e) => setProduct(e.target.value)} placeholder="e.g. FW25 cashmere drop" />
            </Field>
          </div>

          <Field>
            <Label>Audience</Label>
            <Input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. design-literate urban women 28–40"
            />
          </Field>

          <Field>
            <Label>Objective</Label>
            <Input
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="e.g. drive awareness + waitlist signups"
            />
          </Field>

          <Field>
            <Label hint={`${tones.length} selected`}>Tone · multi-select</Label>
            <div className="flex flex-wrap gap-2">
              {ALL_TONES.map((t) => (
                <Chip key={t} active={tones.includes(t)} onClick={() => toggleTone(t)}>
                  {TONE_LABELS[t]}
                </Chip>
              ))}
            </div>
            {tones.length === 0 && (
              <div className="mt-2 text-[11.5px] text-danger">Pick at least one tone.</div>
            )}
          </Field>

          <Field>
            <Label>Channels</Label>
            <div className="flex flex-wrap gap-2">
              {CHANNELS.map((c) => (
                <Chip key={c} active={channels.includes(c)} onClick={() => toggleChannel(c)}>
                  {c}
                </Chip>
              ))}
            </div>
          </Field>

          <Field>
            <Label hint="optional">Extra context</Label>
            <Textarea
              rows={3}
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              placeholder="Anything the copy must reference — price point, materials, story…"
            />
          </Field>

          <Button
            onClick={onGenerate}
            loading={loading}
            disabled={!canSubmit}
            size="lg"
            className="w-full"
            leading={<Megaphone className="h-4 w-4" />}
          >
            {loading ? "Writing campaign…" : "Generate campaign"}
          </Button>

          {error && (
            <div className="text-[13px] text-danger bg-danger/10 border border-danger/30 rounded-[8px] px-3 py-2">
              {error}
            </div>
          )}
        </CardBody>
      </Card>

      <Card className="min-h-[520px]">
        <CardBody className="h-full">
          {!result && !loading && (
            <div className="h-full min-h-[480px] flex flex-col items-center justify-center text-center">
              <div className="h-14 w-14 rounded-full border border-border flex items-center justify-center mb-4">
                <Megaphone className="h-5 w-5 text-gold" />
              </div>
              <div className="font-display text-[22px] mb-1">Your campaign appears here</div>
              <div className="text-[13.5px] text-fg-muted max-w-sm">
                Fill the brief, select tones, and press generate.
              </div>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[480px] rounded-[10px] bg-surface-2 shimmer flex items-center justify-center">
              <div className="flex items-center gap-3 text-[13px] text-fg-muted">
                <LoadingDots /> Drafting copy…
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="animate-fade-up">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-wrap gap-1.5">
                  {tones.map((t) => (
                    <span
                      key={t}
                      className="px-2 h-6 rounded-full text-[11px] uppercase tracking-[0.12em] bg-gold/10 text-gold border border-gold/30 flex items-center"
                    >
                      {TONE_LABELS[t]}
                    </span>
                  ))}
                </div>
                <button
                  onClick={onCopy}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] text-[12px] border border-border-strong hover:border-gold hover:text-gold transition"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy all"}
                </button>
              </div>
              <article className="prose-campaign text-[14.5px] leading-[1.7] text-fg-soft whitespace-pre-wrap font-sans">
                {result}
              </article>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Textarea, Label, Field } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardBody } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { LoadingDots } from "@/components/ui/Spinner";
import { useHistory } from "@/lib/history";
import { Download, Wand2, Sparkles } from "lucide-react";

const ASPECTS = ["1:1", "3:4", "4:3", "16:9", "9:16"] as const;
type Aspect = (typeof ASPECTS)[number];

const PRESETS = [
  { id: "editorial", label: "Editorial" },
  { id: "studio", label: "Studio" },
  { id: "cinematic", label: "Cinematic" },
  { id: "lookbook", label: "Lookbook" },
  { id: "campaign", label: "Campaign" },
] as const;

const EXAMPLES = [
  "A cashmere hoodie, bone color, folded on warm stone, golden-hour light, editorial still life",
  "Minimalist leather sneaker on matte black pedestal, single soft shadow, museum spotlight",
  "Amber perfume bottle on silk, macro, soft window light, Vogue beauty still",
];

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [aspect, setAspect] = useState<Aspect>("1:1");
  const [preset, setPreset] = useState<string>("editorial");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ urls: string[]; finalPrompt: string; provider: string } | null>(null);

  const add = useHistory((s) => s.add);

  async function onGenerate() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/ai/image", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt, aspectRatio: aspect, preset }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Generation failed");
      setResult({ urls: data.urls, finalPrompt: data.finalPrompt, provider: data.provider });
      add({
        kind: "image",
        title: prompt.slice(0, 80),
        prompt,
        resultUrls: data.urls,
        meta: { aspect, preset, provider: data.provider },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
      {/* Form */}
      <Card>
        <CardBody className="space-y-5">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-gold">
            <Sparkles className="h-3 w-3" /> Configure
          </div>

          <Field>
            <Label hint={`${prompt.length}/2000`}>Prompt</Label>
            <Textarea
              rows={5}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the shot: subject, surface, light, mood…"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(ex)}
                  className="text-[11.5px] px-2 h-7 rounded-full border border-border text-fg-muted hover:border-gold/60 hover:text-gold transition"
                >
                  Example {i + 1}
                </button>
              ))}
            </div>
          </Field>

          <Field>
            <Label>Style preset</Label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <Chip key={p.id} active={preset === p.id} onClick={() => setPreset(p.id)}>
                  {p.label}
                </Chip>
              ))}
            </div>
          </Field>

          <Field>
            <Label>Aspect ratio</Label>
            <Select value={aspect} onChange={(e) => setAspect(e.target.value as Aspect)}>
              {ASPECTS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </Select>
          </Field>

          <Button
            onClick={onGenerate}
            loading={loading}
            disabled={!prompt.trim()}
            size="lg"
            className="w-full"
            leading={<Wand2 className="h-4 w-4" />}
          >
            {loading ? "Generating…" : "Generate imagery"}
          </Button>

          {error && (
            <div className="text-[13px] text-danger bg-danger/10 border border-danger/30 rounded-[8px] px-3 py-2">
              {error}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Preview */}
      <Card className="min-h-[520px]">
        <CardBody className="h-full">
          {!result && !loading && (
            <div className="h-full min-h-[480px] flex flex-col items-center justify-center text-center">
              <div className="h-14 w-14 rounded-full border border-border flex items-center justify-center mb-4">
                <Wand2 className="h-5 w-5 text-gold" />
              </div>
              <div className="font-display text-[22px] mb-1">Your imagery appears here</div>
              <div className="text-[13.5px] text-fg-muted max-w-sm">
                Write a prompt, pick a style preset, and press generate.
              </div>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[480px] rounded-[10px] bg-surface-2 shimmer flex items-center justify-center">
              <div className="flex items-center gap-3 text-[13px] text-fg-muted">
                <LoadingDots /> Rendering frame…
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4 animate-fade-up">
              <div className="grid grid-cols-1 gap-4">
                {result.urls.map((url) => (
                  <div key={url} className="relative rounded-[10px] overflow-hidden bg-surface-2 border border-border">
                    <Image
                      src={url}
                      alt="Generated"
                      width={1024}
                      height={1024}
                      unoptimized
                      className="w-full h-auto"
                    />
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      download
                      className="absolute top-3 right-3 glass flex items-center gap-1.5 px-2.5 h-8 rounded-[8px] text-[12px] border border-border-strong hover:border-gold hover:text-gold transition"
                    >
                      <Download className="h-3.5 w-3.5" /> Save
                    </a>
                  </div>
                ))}
              </div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-fg-subtle">
                Provider · {result.provider}
              </div>
              <div className="text-[12.5px] text-fg-muted leading-relaxed font-mono">
                {result.finalPrompt}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

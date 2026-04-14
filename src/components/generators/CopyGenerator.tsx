"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label, Field } from "@/components/ui/Input";
import { Card, CardBody } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { LoadingDots } from "@/components/ui/Spinner";
import { useHistory } from "@/lib/history";
import { COPY_TASK_LABELS, type CopyTask } from "@/prompts/copy";
import { Type, Copy, Check, Sparkles } from "lucide-react";

const TASKS = Object.keys(COPY_TASK_LABELS) as CopyTask[];

export function CopyGenerator() {
  const [task, setTask] = useState<CopyTask>("tagline");
  const [brand, setBrand] = useState("");
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const add = useHistory((s) => s.add);

  async function onGenerate() {
    if (!brand.trim() || !subject.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/ai/copy", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ task, brand, subject, tone, notes }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Generation failed");
      setResult(data.text);
      add({
        kind: "copy",
        title: `${COPY_TASK_LABELS[task]} · ${brand}`.slice(0, 80),
        resultText: data.text,
        meta: { task, provider: data.provider },
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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[460px_1fr] gap-6">
      <Card>
        <CardBody className="space-y-5">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-gold">
            <Sparkles className="h-3 w-3" /> Task
          </div>

          <Field>
            <Label>Copy task</Label>
            <div className="flex flex-wrap gap-2">
              {TASKS.map((t) => (
                <Chip key={t} active={task === t} onClick={() => setTask(t)}>
                  {COPY_TASK_LABELS[t]}
                </Chip>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <Label>Brand</Label>
              <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Aurora" />
            </Field>
            <Field>
              <Label>Tone</Label>
              <Input value={tone} onChange={(e) => setTone(e.target.value)} placeholder="refined, editorial" />
            </Field>
          </div>

          <Field>
            <Label>Subject / product</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What is this copy about?"
            />
          </Field>

          <Field>
            <Label hint="optional">Notes</Label>
            <Textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Key facts, materials, vibe, references…"
            />
          </Field>

          <Button
            onClick={onGenerate}
            loading={loading}
            disabled={!brand.trim() || !subject.trim()}
            size="lg"
            className="w-full"
            leading={<Type className="h-4 w-4" />}
          >
            {loading ? "Writing…" : "Generate copy"}
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
                <Type className="h-5 w-5 text-gold" />
              </div>
              <div className="font-display text-[22px] mb-1">Your copy appears here</div>
              <div className="text-[13.5px] text-fg-muted max-w-sm">
                Pick a task, fill the brief, and press generate.
              </div>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[480px] rounded-[10px] bg-surface-2 shimmer flex items-center justify-center">
              <div className="flex items-center gap-3 text-[13px] text-fg-muted">
                <LoadingDots /> Writing…
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="animate-fade-up">
              <div className="flex items-center justify-between mb-4">
                <span className="px-2 h-6 rounded-full text-[11px] uppercase tracking-[0.12em] bg-gold/10 text-gold border border-gold/30 flex items-center">
                  {COPY_TASK_LABELS[task]}
                </span>
                <button
                  onClick={onCopy}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] text-[12px] border border-border-strong hover:border-gold hover:text-gold transition"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <article className="text-[15px] leading-[1.75] text-fg-soft whitespace-pre-wrap font-sans">
                {result}
              </article>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

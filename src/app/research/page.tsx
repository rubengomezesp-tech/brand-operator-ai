"use client";
import { useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label, Field } from "@/components/ui/Input";
import { LoadingDots } from "@/components/ui/Spinner";
import { Search, Compass } from "lucide-react";

export default function Page() {
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  async function onRun() {
    if (!brand.trim() || !category.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // Reuse the copy endpoint with a research-shaped brief — keeps backend minimal.
      const res = await fetch("/api/ai/copy", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          task: "bio",
          brand,
          subject: `Market research brief for ${brand} in the ${category} category`,
          tone: "analytical, sharp, editorial",
          notes: `Give me a 1-page operator briefing:
1) Category snapshot
2) 4 competitors with one-line positioning each
3) Whitespace / unmet need
4) 3 positioning angles for ${brand}
5) Risks
Extra context: ${notes || "n/a"}

Use headings. Be specific, not generic.`,
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Research failed");
      setResult(data.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Topbar
        title="Market Research"
        subtitle="Category snapshots, competitor reads, and positioning angles."
      />
      <div className="px-6 lg:px-10 py-8 max-w-[1400px] w-full mx-auto grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
        <Card>
          <CardBody className="space-y-5">
            <Field>
              <Label>Brand</Label>
              <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Aurora" />
            </Field>
            <Field>
              <Label>Category</Label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. premium cashmere basics"
              />
            </Field>
            <Field>
              <Label hint="optional">Notes</Label>
              <Textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything specific you want me to focus on…"
              />
            </Field>
            <Button
              onClick={onRun}
              loading={loading}
              disabled={!brand.trim() || !category.trim()}
              size="lg"
              className="w-full"
              leading={<Search className="h-4 w-4" />}
            >
              {loading ? "Analyzing…" : "Run research"}
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
                  <Compass className="h-5 w-5 text-gold" />
                </div>
                <div className="font-display text-[22px] mb-1">Your briefing appears here</div>
                <div className="text-[13.5px] text-fg-muted max-w-sm">
                  Enter a brand and category to get a one-page operator briefing.
                </div>
              </div>
            )}
            {loading && (
              <div className="h-full min-h-[480px] rounded-[10px] bg-surface-2 shimmer flex items-center justify-center">
                <div className="flex items-center gap-3 text-[13px] text-fg-muted">
                  <LoadingDots /> Analyzing the category…
                </div>
              </div>
            )}
            {result && !loading && (
              <article className="text-[14.5px] leading-[1.7] text-fg-soft whitespace-pre-wrap animate-fade-up">
                {result}
              </article>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}

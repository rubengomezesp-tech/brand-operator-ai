import { NextResponse } from "next/server";
import { z } from "zod";
import { getTextProvider } from "@/services/ai/registry";
import { CAMPAIGN_SYSTEM, buildCampaignUserPrompt } from "@/prompts/campaign";
import { ALL_TONES, type CampaignTone } from "@/types/campaign";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const ToneSchema = z.enum([
  "refined", "bold", "minimalist", "editorial", "disciplined",
  "rebellious", "warm", "clinical", "poetic", "streetwise",
] as const);

const Body = z.object({
  brand: z.string().min(1).max(200),
  product: z.string().min(1).max(400),
  audience: z.string().max(300).optional(),
  tones: z.array(ToneSchema).min(1).max(6),
  objective: z.string().max(300).optional(),
  channels: z.array(z.string().max(40)).max(10).optional(),
  extra: z.string().max(2000).optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = Body.parse(json);
    // safety: filter tones to known set
    const tones = body.tones.filter((t): t is CampaignTone => ALL_TONES.includes(t));
    if (tones.length === 0) throw new Error("No valid tones provided");

    const provider = getTextProvider();
    const prompt = buildCampaignUserPrompt({
      brand: body.brand,
      product: body.product,
      audience: body.audience,
      tones,
      objective: body.objective,
      channels: body.channels,
      extra: body.extra,
    });
    const out = await provider.generate({
      system: CAMPAIGN_SYSTEM,
      prompt,
      maxTokens: 1500,
      temperature: 0.85,
    });
    return NextResponse.json({ ok: true, text: out.text, provider: out.provider });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[api/ai/campaign]", message);
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

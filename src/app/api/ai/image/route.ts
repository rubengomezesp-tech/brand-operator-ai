import { NextResponse } from "next/server";
import { z } from "zod";
import { getImageProvider } from "@/services/ai/registry";
import { enhanceImagePrompt, type ImageStylePreset } from "@/prompts/image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const Body = z.object({
  prompt: z.string().min(3).max(2000),
  aspectRatio: z.enum(["1:1", "3:4", "4:3", "16:9", "9:16"]).optional(),
  preset: z.string().optional(),
  seed: z.number().int().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = Body.parse(json);
    const provider = getImageProvider();
    const finalPrompt = enhanceImagePrompt(
      body.prompt,
      body.preset as ImageStylePreset | undefined
    );
    const out = await provider.generate({
      prompt: finalPrompt,
      aspectRatio: body.aspectRatio,
      seed: body.seed,
    });
    return NextResponse.json({
      ok: true,
      urls: out.urls,
      provider: out.provider,
      finalPrompt,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[api/ai/image]", message);
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

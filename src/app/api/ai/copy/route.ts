import { NextResponse } from "next/server";
import { z } from "zod";
import { getTextProvider } from "@/services/ai/registry";
import { COPY_SYSTEM, buildCopyPrompt, COPY_TASKS, type CopyTask } from "@/prompts/copy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const TaskSchema = z.enum(
  Object.keys(COPY_TASKS) as [CopyTask, ...CopyTask[]]
);

const Body = z.object({
  task: TaskSchema,
  brand: z.string().min(1).max(200),
  subject: z.string().min(1).max(400),
  tone: z.string().max(200).optional(),
  notes: z.string().max(1500).optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = Body.parse(json);
    const provider = getTextProvider();
    const prompt = buildCopyPrompt({
      task: body.task,
      brand: body.brand,
      subject: body.subject,
      tone: body.tone,
      notes: body.notes,
    });
    const out = await provider.generate({
      system: COPY_SYSTEM,
      prompt,
      maxTokens: 900,
      temperature: 0.8,
    });
    return NextResponse.json({ ok: true, text: out.text, provider: out.provider });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[api/ai/copy]", message);
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

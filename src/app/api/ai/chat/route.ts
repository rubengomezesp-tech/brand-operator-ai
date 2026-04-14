import { NextResponse } from "next/server";
import { z } from "zod";
import { getChatProvider } from "@/services/ai/registry";
import { CREATIVE_AGENT_SYSTEM } from "@/prompts/agent";
import type { ChatProviderMessage } from "@/services/ai/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const Attachment = z.object({
  kind: z.enum(["image", "file"]),
  name: z.string().max(200),
  mime: z.string().max(120),
  dataUrl: z.string().optional(),
  text: z.string().optional(),
});

const Msg = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(8000),
  attachments: z.array(Attachment).max(6).optional(),
});

const Body = z.object({
  messages: z.array(Msg).min(1).max(60),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = Body.parse(json);
    const provider = getChatProvider();

    const providerMessages: ChatProviderMessage[] = body.messages.map((m) => {
      const parts: Array<
        | { type: "text"; text: string }
        | { type: "image"; url: string }
      > = [];
      const textPieces: string[] = [];
      if (m.content) textPieces.push(m.content);

      for (const a of m.attachments ?? []) {
        if (a.kind === "image" && a.dataUrl) {
          parts.push({ type: "image", url: a.dataUrl });
        } else if (a.kind === "file" && a.text) {
          textPieces.push(
            `\n\n[Attached file: ${a.name}]\n---\n${a.text.slice(0, 12000)}\n---`
          );
        } else {
          textPieces.push(`\n\n[Attached: ${a.name} (${a.mime}) — not parsed]`);
        }
      }

      const joinedText = textPieces.join("").trim();
      if (joinedText) parts.unshift({ type: "text", text: joinedText });

      const hasImages = parts.some((p) => p.type === "image");
      return {
        role: m.role,
        content: hasImages ? parts : joinedText,
      };
    });

    const out = await provider.generate({
      messages: providerMessages,
      system: CREATIVE_AGENT_SYSTEM,
      maxTokens: 1400,
      temperature: 0.75,
    });
    return NextResponse.json({ ok: true, text: out.text, provider: out.provider });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[api/ai/chat]", message);
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

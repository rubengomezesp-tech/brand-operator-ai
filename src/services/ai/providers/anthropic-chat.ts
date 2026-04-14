import Anthropic from "@anthropic-ai/sdk";
import type { ChatProvider, ChatProviderMessage } from "../types";
import { env } from "@/lib/env";

const MODEL = "claude-3-5-sonnet-latest";

export const anthropicChatProvider: ChatProvider = {
  name: "anthropic",
  async generate({ messages, system, maxTokens, temperature }) {
    if (!env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is missing");
    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

    const mapped = messages
      .filter((m) => m.role !== "system")
      .map(mapMessage);

    const res = await client.messages.create({
      model: MODEL,
      max_tokens: maxTokens ?? 1500,
      temperature: temperature ?? 0.7,
      ...(system ? { system } : {}),
      messages: mapped,
    });
    const text = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");
    return { text, provider: "anthropic" };
  },
};

type AnyBlock = {
  type: "text" | "image";
  text?: string;
  source?: {
    type: "base64" | "url";
    media_type?: string;
    data?: string;
    url?: string;
  };
};

function mapMessage(m: ChatProviderMessage): Anthropic.MessageParam {
  const role = m.role === "assistant" ? "assistant" : "user";
  if (typeof m.content === "string") {
    return { role, content: m.content };
  }
  const blocks: AnyBlock[] = m.content.map((p) => {
    if (p.type === "text") return { type: "text", text: p.text };
    if (p.url.startsWith("data:")) {
      const match = /^data:(image\/(?:png|jpeg|jpg|gif|webp));base64,(.*)$/.exec(p.url);
      if (match) {
        const media = match[1] === "image/jpg" ? "image/jpeg" : match[1];
        return {
          type: "image",
          source: { type: "base64", media_type: media, data: match[2] },
        };
      }
      return { type: "text", text: "[unsupported inline image]" };
    }
    return { type: "image", source: { type: "url", url: p.url } };
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { role, content: blocks as any };
}

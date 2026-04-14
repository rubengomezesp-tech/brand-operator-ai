import OpenAI from "openai";
import type { TextProvider, ChatProvider, ChatProviderMessage } from "../types";
import type { TextGenInput, TextGenOutput } from "@/types";
import { env } from "@/lib/env";

const MODEL = "gpt-4o";

function getClient(): OpenAI {
  if (!env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is missing");
  return new OpenAI({ apiKey: env.OPENAI_API_KEY });
}

export const openaiTextProvider: TextProvider = {
  name: "openai",
  async generate(input: TextGenInput): Promise<TextGenOutput> {
    const res = await getClient().chat.completions.create({
      model: MODEL,
      max_tokens: input.maxTokens ?? 1500,
      temperature: input.temperature ?? 0.7,
      messages: [
        ...(input.system ? [{ role: "system" as const, content: input.system }] : []),
        { role: "user" as const, content: input.prompt },
      ],
    });
    const text = res.choices[0]?.message?.content ?? "";
    return { text, provider: "openai" };
  },
};

export const openaiChatProvider: ChatProvider = {
  name: "openai",
  async generate({ messages, system, maxTokens, temperature }) {
    const mapped = messages.map(mapToOpenAI);
    const res = await getClient().chat.completions.create({
      model: MODEL,
      max_tokens: maxTokens ?? 1500,
      temperature: temperature ?? 0.7,
      messages: [
        ...(system ? [{ role: "system" as const, content: system }] : []),
        ...mapped,
      ],
    });
    const text = res.choices[0]?.message?.content ?? "";
    return { text, provider: "openai" };
  },
};

function mapToOpenAI(
  m: ChatProviderMessage
): OpenAI.Chat.Completions.ChatCompletionMessageParam {
  // String content → plain text message
  if (typeof m.content === "string") {
    if (m.role === "assistant") return { role: "assistant", content: m.content };
    if (m.role === "system") return { role: "system", content: m.content };
    return { role: "user", content: m.content };
  }
  // Array content (multimodal)
  const userParts = m.content.map((p) => {
    if (p.type === "text") return { type: "text" as const, text: p.text };
    return { type: "image_url" as const, image_url: { url: p.url } };
  });
  // System/assistant can't accept multimodal arrays → collapse to text
  if (m.role !== "user") {
    const text = m.content
      .filter((p) => p.type === "text")
      .map((p) => (p as { text: string }).text)
      .join("\n");
    return m.role === "assistant"
      ? { role: "assistant", content: text }
      : { role: "system", content: text };
  }
  return { role: "user", content: userParts };
}

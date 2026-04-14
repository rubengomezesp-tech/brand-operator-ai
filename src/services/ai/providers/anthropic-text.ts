import Anthropic from "@anthropic-ai/sdk";
import type { TextProvider } from "../types";
import type { TextGenInput, TextGenOutput } from "@/types";
import { env } from "@/lib/env";

const MODEL = "claude-3-5-sonnet-latest";

export const anthropicTextProvider: TextProvider = {
  name: "anthropic",
  async generate(input: TextGenInput): Promise<TextGenOutput> {
    if (!env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is missing");
    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: input.maxTokens ?? 1500,
      temperature: input.temperature ?? 0.7,
      ...(input.system ? { system: input.system } : {}),
      messages: [{ role: "user", content: input.prompt }],
    });
    const text = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");
    return { text, provider: "anthropic" };
  },
};

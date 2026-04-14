import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  REPLICATE_API_TOKEN: z.string().optional(),
  DEFAULT_IMAGE_PROVIDER: z.enum(["replicate", "openai"]).default("replicate"),
  DEFAULT_TEXT_PROVIDER: z.enum(["openai", "anthropic"]).default("openai"),
  DEFAULT_CHAT_PROVIDER: z.enum(["openai", "anthropic"]).default("openai"),
});

export const env = schema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
  DEFAULT_IMAGE_PROVIDER: process.env.DEFAULT_IMAGE_PROVIDER,
  DEFAULT_TEXT_PROVIDER: process.env.DEFAULT_TEXT_PROVIDER,
  DEFAULT_CHAT_PROVIDER: process.env.DEFAULT_CHAT_PROVIDER,
});

export const hasOpenAI = Boolean(env.OPENAI_API_KEY);
export const hasAnthropic = Boolean(env.ANTHROPIC_API_KEY);
export const hasReplicate = Boolean(env.REPLICATE_API_TOKEN);

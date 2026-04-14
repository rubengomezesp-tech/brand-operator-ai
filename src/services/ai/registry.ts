import { env } from "@/lib/env";
import type { ImageProvider, TextProvider, ChatProvider } from "./types";
import { replicateImageProvider } from "./providers/replicate-image";
import { anthropicTextProvider } from "./providers/anthropic-text";
import { anthropicChatProvider } from "./providers/anthropic-chat";
import { openaiTextProvider, openaiChatProvider } from "./providers/openai";

export function getImageProvider(): ImageProvider {
  if (env.DEFAULT_IMAGE_PROVIDER === "replicate" && env.REPLICATE_API_TOKEN) {
    return replicateImageProvider;
  }
  if (env.REPLICATE_API_TOKEN) return replicateImageProvider;
  throw new Error(
    "No image provider configured. Set REPLICATE_API_TOKEN in .env.local."
  );
}

export function getTextProvider(): TextProvider {
  if (env.DEFAULT_TEXT_PROVIDER === "openai" && env.OPENAI_API_KEY) {
    return openaiTextProvider;
  }
  if (env.DEFAULT_TEXT_PROVIDER === "anthropic" && env.ANTHROPIC_API_KEY) {
    return anthropicTextProvider;
  }
  if (env.OPENAI_API_KEY) return openaiTextProvider;
  if (env.ANTHROPIC_API_KEY) return anthropicTextProvider;
  throw new Error(
    "No text provider configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY."
  );
}

export function getChatProvider(): ChatProvider {
  if (env.DEFAULT_CHAT_PROVIDER === "openai" && env.OPENAI_API_KEY) {
    return openaiChatProvider;
  }
  if (env.DEFAULT_CHAT_PROVIDER === "anthropic" && env.ANTHROPIC_API_KEY) {
    return anthropicChatProvider;
  }
  if (env.OPENAI_API_KEY) return openaiChatProvider;
  if (env.ANTHROPIC_API_KEY) return anthropicChatProvider;
  throw new Error(
    "No chat provider configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY."
  );
}

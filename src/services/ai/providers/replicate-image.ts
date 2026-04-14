import Replicate from "replicate";
import type { ImageProvider } from "../types";
import type { ImageGenInput, ImageGenOutput } from "@/types";
import { env } from "@/lib/env";

const MODEL = "black-forest-labs/flux-1.1-pro" as const;

export const replicateImageProvider: ImageProvider = {
  name: "replicate",
  async generate(input: ImageGenInput): Promise<ImageGenOutput> {
    if (!env.REPLICATE_API_TOKEN) {
      throw new Error("REPLICATE_API_TOKEN is missing");
    }
    const client = new Replicate({ auth: env.REPLICATE_API_TOKEN });
    const output = await client.run(MODEL, {
      input: {
        prompt: input.prompt,
        aspect_ratio: input.aspectRatio ?? "1:1",
        output_format: "webp",
        output_quality: 90,
        safety_tolerance: 2,
        ...(input.seed !== undefined ? { seed: input.seed } : {}),
      },
    });
    const urls = normalize(output);
    if (urls.length === 0) throw new Error("Replicate returned no images");
    return { urls, provider: "replicate" };
  },
};

function normalize(out: unknown): string[] {
  if (typeof out === "string") return [out];
  if (Array.isArray(out)) {
    const urls: string[] = [];
    for (const item of out) {
      if (typeof item === "string") urls.push(item);
      else if (item && typeof item === "object") {
        const url = extractUrl(item);
        if (url) urls.push(url);
      }
    }
    return urls;
  }
  if (out && typeof out === "object") {
    const url = extractUrl(out);
    if (url) return [url];
  }
  return [];
}

function extractUrl(obj: object): string | null {
  const maybe = obj as { url?: unknown };
  if (typeof maybe.url === "function") {
    try {
      const v = (maybe.url as () => unknown)();
      if (typeof v === "string") return v;
      if (v instanceof URL) return v.toString();
    } catch {
      return null;
    }
  }
  if (typeof maybe.url === "string") return maybe.url;
  return null;
}

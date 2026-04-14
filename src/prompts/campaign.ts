import type { CampaignTone } from "@/types/campaign";

export const TONE_LABELS: Record<CampaignTone, string> = {
  refined: "Refined",
  bold: "Bold",
  minimalist: "Minimalist",
  editorial: "Editorial",
  disciplined: "Disciplined",
  rebellious: "Rebellious",
  warm: "Warm",
  clinical: "Clinical",
  poetic: "Poetic",
  streetwise: "Streetwise",
};

export const TONE_DESCRIPTIONS: Record<CampaignTone, string> = {
  refined: "elevated, tasteful, understated luxury",
  bold: "declarative, high-contrast, unafraid",
  minimalist: "stripped to essentials, nothing wasted",
  editorial: "Vogue/AnOther-magazine cadence and authority",
  disciplined: "focused, serious, craft-forward",
  rebellious: "counter-culture energy, defiance without cliché",
  warm: "human, inviting, emotionally generous",
  clinical: "precise, technical, matter-of-fact",
  poetic: "lyrical, imagistic, rhythmic",
  streetwise: "sharp, contemporary, street-informed",
};

export const CAMPAIGN_SYSTEM = `You are a senior copy director crafting campaign-ready copy for a premium brand.
You write taglines, hero headlines, long-form captions, and launch announcements with editorial precision.
You do not hedge. You do not use generic marketing filler. You write like someone with taste.`;

export function buildCampaignUserPrompt(args: {
  brand: string;
  product: string;
  audience?: string;
  tones: CampaignTone[];
  objective?: string;
  channels?: string[];
  extra?: string;
}) {
  const toneLine =
    args.tones.length === 0
      ? "refined, editorial"
      : args.tones.map((t) => TONE_DESCRIPTIONS[t]).join("; ");

  const toneSignature =
    args.tones.length === 0
      ? "refined"
      : args.tones.join(", ");

  return `Brand: ${args.brand}
Product / launch: ${args.product}
Target audience: ${args.audience || "discerning, design-literate"}
Campaign objective: ${args.objective || "drive awareness and desire at launch"}
Channels: ${(args.channels ?? ["social", "web", "email"]).join(", ")}

TONE SIGNATURE: ${toneSignature}
TONE DIRECTION: ${toneLine} — the copy should feel luxury, high-end, disciplined and unmistakably on-brand.

${args.extra ? `Extra context from operator:\n${args.extra}\n` : ""}

Deliver, in this exact structure:

## Hero headline
One line. Under 9 words. Magnetic.

## Supporting line
One sentence. Extends the headline with tension or texture.

## Three alternate headlines
Bullet list. Each distinctly different in angle.

## Social caption (Instagram)
90–140 characters. Complete, publishable.

## Launch email subject + preview
Subject: …
Preview: …

## Long-form launch paragraph
2–4 sentences. The kind that gets pulled as a press quote.

Write in English. Do not add preambles, explanations, or meta-commentary. Only the deliverables.`;
}

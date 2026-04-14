export const COPY_TASKS = {
  tagline: "Write 5 distinct taglines. One line each. Under 8 words.",
  headline: "Write 5 hero headlines. One line each. Under 10 words. No hedging.",
  product_description: "Write a product description. 2 short paragraphs. Premium, tactile, sensory.",
  landing_hero: "Write a landing-page hero section: eyebrow, headline, sub-headline, primary CTA.",
  email: "Write a launch email: subject, preview text, 3 short paragraphs, CTA.",
  bio: "Write a brand bio / about section. Under 120 words. First-person plural.",
  social_caption: "Write 3 social captions for Instagram (each 90–140 characters, distinct angles).",
} as const;

export type CopyTask = keyof typeof COPY_TASKS;

export const COPY_TASK_LABELS: Record<CopyTask, string> = {
  tagline: "Tagline",
  headline: "Hero headline",
  product_description: "Product description",
  landing_hero: "Landing hero",
  email: "Launch email",
  bio: "Brand bio",
  social_caption: "Social caption",
};

export const COPY_SYSTEM = `You are a senior copywriter writing for a premium brand.
You have taste. You cut filler. You write lines that could live on a billboard, in a magazine, or on a luxury e-commerce page.
Never use hashtags unless explicitly asked. Never use emoji unless explicitly asked. Never hedge.`;

export function buildCopyPrompt(args: {
  task: CopyTask;
  brand: string;
  subject: string;
  tone?: string;
  notes?: string;
}) {
  return `Brand: ${args.brand}
Subject / product: ${args.subject}
${args.tone ? `Tone: ${args.tone}` : ""}
${args.notes ? `Notes: ${args.notes}` : ""}

Task: ${COPY_TASKS[args.task]}

Output only the copy. No preamble, no labels beyond what the task specifies.`;
}

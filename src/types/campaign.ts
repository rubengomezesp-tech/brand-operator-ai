export type CampaignTone =
  | "refined"
  | "bold"
  | "minimalist"
  | "editorial"
  | "disciplined"
  | "rebellious"
  | "warm"
  | "clinical"
  | "poetic"
  | "streetwise";

export const ALL_TONES: CampaignTone[] = [
  "refined",
  "bold",
  "minimalist",
  "editorial",
  "disciplined",
  "rebellious",
  "warm",
  "clinical",
  "poetic",
  "streetwise",
];

export interface CampaignInput {
  brand: string;
  product: string;
  audience?: string;
  tones: CampaignTone[];
  objective?: string;
  channels?: string[];
  extra?: string;
}

export interface CampaignOutput {
  text: string;
  provider: string;
  tones: CampaignTone[];
}

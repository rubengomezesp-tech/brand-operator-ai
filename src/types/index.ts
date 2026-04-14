export interface ImageGenInput {
  prompt: string;
  aspectRatio?: "1:1" | "3:4" | "4:3" | "16:9" | "9:16";
  seed?: number;
}

export interface ImageGenOutput {
  urls: string[];
  provider: string;
}

export interface TextGenInput {
  system?: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

export interface TextGenOutput {
  text: string;
  provider: string;
}

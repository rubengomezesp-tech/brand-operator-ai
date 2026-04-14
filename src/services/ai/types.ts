import type {
  ImageGenInput,
  ImageGenOutput,
  TextGenInput,
  TextGenOutput,
} from "@/types";

export interface ImageProvider {
  readonly name: string;
  generate(input: ImageGenInput): Promise<ImageGenOutput>;
}

export interface TextProvider {
  readonly name: string;
  generate(input: TextGenInput): Promise<TextGenOutput>;
}

/** Message shape accepted by chat providers — supports text + image URLs/data URLs. */
export interface ChatProviderMessage {
  role: "system" | "user" | "assistant";
  content:
    | string
    | Array<
        | { type: "text"; text: string }
        | { type: "image"; url: string }
      >;
}

export interface ChatGenInput {
  messages: ChatProviderMessage[];
  system?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface ChatGenOutput {
  text: string;
  provider: string;
}

export interface ChatProvider {
  readonly name: string;
  generate(input: ChatGenInput): Promise<ChatGenOutput>;
}

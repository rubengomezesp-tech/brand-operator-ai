export type ChatRole = "user" | "assistant" | "system";

export interface ChatAttachment {
  id: string;
  kind: "image" | "file";
  name: string;
  mime: string;
  size: number;
  /** data URL or remote URL; used to display and to send to provider */
  dataUrl?: string;
  /** extracted text for non-image files */
  text?: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  attachments?: ChatAttachment[];
  createdAt: number;
  pending?: boolean;
}

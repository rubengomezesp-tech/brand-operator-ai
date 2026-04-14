import type { ChatAttachment } from "@/types/chat";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4MB
const MAX_FILE_BYTES = 2 * 1024 * 1024;  // 2MB
const TEXT_EXT = /\.(txt|md|csv|json|xml|html|yaml|yml|log)$/i;

export async function readAttachment(file: File): Promise<ChatAttachment> {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  const mime = file.type || "application/octet-stream";
  const common = { id, name: file.name, mime, size: file.size };

  if (mime.startsWith("image/")) {
    if (file.size > MAX_IMAGE_BYTES) {
      throw new Error(`Image too large (max ${MAX_IMAGE_BYTES / 1024 / 1024}MB)`);
    }
    const dataUrl = await fileToDataUrl(file);
    return { ...common, kind: "image", dataUrl };
  }

  if (file.size > MAX_FILE_BYTES) {
    throw new Error(`File too large (max ${MAX_FILE_BYTES / 1024 / 1024}MB)`);
  }

  const isTextual = mime.startsWith("text/") || TEXT_EXT.test(file.name);
  if (isTextual) {
    const text = await file.text();
    return { ...common, kind: "file", text };
  }

  // PDFs / binaries — accepted but not parsed; filename is sent as context.
  return { ...common, kind: "file", text: undefined };
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Read failed"));
    reader.readAsDataURL(file);
  });
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

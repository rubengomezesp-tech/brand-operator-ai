"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type HistoryKind = "image" | "campaign" | "copy" | "chat";

export interface HistoryItem {
  id: string;
  kind: HistoryKind;
  title: string;
  prompt?: string;
  resultUrls?: string[];
  resultText?: string;
  meta?: Record<string, unknown>;
  createdAt: number;
}

interface HistoryState {
  items: HistoryItem[];
  add: (item: Omit<HistoryItem, "id" | "createdAt">) => HistoryItem;
  remove: (id: string) => void;
  clear: () => void;
  byKind: (kind: HistoryKind) => HistoryItem[];
}

export const useHistory = create<HistoryState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        const record: HistoryItem = {
          ...item,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
        };
        set((s) => ({ items: [record, ...s.items].slice(0, 200) }));
        return record;
      },
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
      byKind: (kind) => get().items.filter((i) => i.kind === kind),
    }),
    { name: "bo.history.v1" }
  )
);

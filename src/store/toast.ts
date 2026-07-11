"use client";

import { create } from "zustand";

export type ToastKind = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  kind: ToastKind;
  message: string;
};

type ToastState = {
  items: ToastItem[];
  push: (kind: ToastKind, message: string) => void;
  dismiss: (id: string) => void;
};

export const useToastStore = create<ToastState>((set) => ({
  items: [],
  push: (kind, message) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    set((s) => ({ items: [...s.items, { id, kind, message }].slice(-5) }));
    window.setTimeout(() => {
      set((s) => ({ items: s.items.filter((t) => t.id !== id) }));
    }, 4200);
  },
  dismiss: (id) => set((s) => ({ items: s.items.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (message: string) => useToastStore.getState().push("success", message),
  error: (message: string) => useToastStore.getState().push("error", message),
  info: (message: string) => useToastStore.getState().push("info", message),
};

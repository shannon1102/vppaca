"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, qty = 1) => {
        const items = [...get().items];
        const i = items.findIndex((x) => x.productId === item.productId);
        if (i >= 0) items[i] = { ...items[i], qty: items[i].qty + qty };
        else items.push({ ...item, qty });
        set({ items });
      },
      setQty: (productId, qty) => {
        if (qty <= 0) {
          set({ items: get().items.filter((x) => x.productId !== productId) });
          return;
        }
        set({
          items: get().items.map((x) =>
            x.productId === productId ? { ...x, qty } : x,
          ),
        });
      },
      remove: (productId) =>
        set({ items: get().items.filter((x) => x.productId !== productId) }),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
      count: () => get().items.reduce((s, i) => s + i.qty, 0),
    }),
    { name: "medistore-cart" },
  ),
);

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartLineKey } from "@/lib/pricing";
import type { CartItem } from "@/lib/types";

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (lineKey: string, qty: number) => void;
  remove: (lineKey: string) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
};

export function lineKey(item: Pick<CartItem, "productId" | "uomCode">) {
  return cartLineKey(item.productId, item.uomCode);
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, qty = 1) => {
        const key = lineKey(item);
        const items = [...get().items];
        const i = items.findIndex((x) => lineKey(x) === key);
        if (i >= 0) items[i] = { ...items[i], qty: items[i].qty + qty, price: item.price };
        else items.push({ ...item, qty });
        set({ items });
      },
      setQty: (key, qty) => {
        if (qty <= 0) {
          set({ items: get().items.filter((x) => lineKey(x) !== key) });
          return;
        }
        set({
          items: get().items.map((x) =>
            lineKey(x) === key ? { ...x, qty } : x,
          ),
        });
      },
      remove: (key) =>
        set({ items: get().items.filter((x) => lineKey(x) !== key) }),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
      count: () => get().items.reduce((s, i) => s + i.qty, 0),
    }),
    { name: "vppaca-cart" },
  ),
);

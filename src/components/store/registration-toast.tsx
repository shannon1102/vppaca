"use client";

import { useEffect, useState } from "react";
import {
  avatarColorsForName,
  nameInitials,
  randomVietnameseName,
} from "@/lib/random-vn-identity";

const INTERVAL_MS = 10_000;
const VISIBLE_MS = 4_500;

const PURCHASE_PRODUCTS = [
  "Giấy in A4 Double A 80gsm",
  "Giấy in A4 Excel 70gsm",
  "Giấy in A4 IK Plus 70gsm",
  "Giấy in A4 PaperOne 70gsm",
  "Giấy in A4 A-One 70gsm",
  "Bút bi Thiên Long TL-027 0.5mm",
  "Bìa còng 7cm A4",
  "Hộp mực HP 12A (Q2612A)",
  "Băng keo trong 4.8cm",
  "Kẹp giấy 32mm",
  "Bút dạ quang Stabilo",
  "Sổ tay bìa da A5",
] as const;

function pickProduct(): string {
  return PURCHASE_PRODUCTS[Math.floor(Math.random() * PURCHASE_PRODUCTS.length)]!;
}

function createToastData() {
  return {
    name: randomVietnameseName(),
    product: pickProduct(),
  };
}

export function RegistrationToast() {
  const [visible, setVisible] = useState(true);
  const [{ name, product }, setData] = useState(createToastData);

  useEffect(() => {
    let hideTimer = setTimeout(() => setVisible(false), VISIBLE_MS);

    const interval = setInterval(() => {
      setData(createToastData());
      setVisible(true);
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setVisible(false), VISIBLE_MS);
    }, INTERVAL_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  const avatar = avatarColorsForName(name);

  return (
    <div
      className="pointer-events-none fixed bottom-4 left-4 z-[90] w-[min(100%-2rem,22rem)] animate-[registration-toast-in_0.35s_ease-out]"
      aria-live="polite"
    >
      <div
        className="pointer-events-auto flex items-center gap-3 rounded-[var(--radius)] border border-slate-200 border-l-4 border-l-[var(--brand-primary)] bg-white px-3 py-3 text-sm shadow-lg"
        role="status"
      >
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-bold"
          style={{ backgroundColor: avatar.bg, color: avatar.text }}
          aria-hidden
        >
          {nameInitials(name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-3 text-[var(--brand-text)] leading-snug">
            <span className="font-semibold">Người dùng {name}</span>
            <span className="text-[var(--brand-muted)]"> đã mua sản phẩm </span>
            <span className="font-medium text-[var(--brand-primary)]">{product}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

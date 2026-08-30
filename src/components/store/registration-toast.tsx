"use client";

import { useCallback, useEffect, useState } from "react";
import {
  avatarColorsForName,
  nameInitials,
  randomMaskedPhone,
  randomVietnameseName,
} from "@/lib/random-vn-identity";

const INTERVAL_MS = 10_000;
const VISIBLE_MS = 4_500;

export function RegistrationToast() {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const show = useCallback(() => {
    setName(randomVietnameseName());
    setPhone(randomMaskedPhone());
    setVisible(true);
  }, []);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const scheduleHide = () => {
      hideTimer = setTimeout(() => setVisible(false), VISIBLE_MS);
    };

    show();
    scheduleHide();

    const interval = setInterval(() => {
      show();
      if (hideTimer) clearTimeout(hideTimer);
      scheduleHide();
    }, INTERVAL_MS);

    return () => {
      clearInterval(interval);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [show]);

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
          <p className="truncate font-semibold text-[var(--brand-text)]">
            {name} · {phone}
          </p>
          <p className="mt-0.5 text-[var(--brand-muted)]">... đã đăng ký khám miễn phí</p>
        </div>
      </div>
    </div>
  );
}

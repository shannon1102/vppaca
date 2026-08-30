"use client";

import { useCallback, useEffect, useState } from "react";
import { randomMaskedPhone, randomVietnameseName } from "@/lib/random-vn-identity";

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

  return (
    <div
      className="pointer-events-none fixed bottom-4 left-4 z-[90] w-[min(100%-2rem,20rem)] animate-[registration-toast-in_0.35s_ease-out]"
      aria-live="polite"
    >
      <div
        className="pointer-events-auto rounded-[var(--radius)] border border-slate-200 border-l-4 border-l-[var(--brand-primary)] bg-white px-4 py-3 text-sm shadow-lg"
        role="status"
      >
        <p className="font-semibold text-[var(--brand-text)]">{name}</p>
        <p className="mt-0.5 text-[var(--brand-muted)]">{phone}</p>
        <p className="mt-1 text-[var(--brand-primary)]">Đã đăng ký khám.</p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

export function CopyButton({ value }: { value: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-[var(--brand-text)] hover:bg-slate-200"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setOk(true);
        setTimeout(() => setOk(false), 1500);
      }}
    >
      {ok ? "Đã copy" : "Copy"}
    </button>
  );
}

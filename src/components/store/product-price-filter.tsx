"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  basePath: string;
};

export function ProductPriceFilter({ basePath }: Props) {
  const router = useRouter();
  const sp = useSearchParams();
  const [min, setMin] = useState(sp.get("minPrice") ?? "");
  const [max, setMax] = useState(sp.get("maxPrice") ?? "");

  function apply() {
    const params = new URLSearchParams(sp.toString());
    if (min.trim()) params.set("minPrice", min.trim());
    else params.delete("minPrice");
    if (max.trim()) params.set("maxPrice", max.trim());
    else params.delete("maxPrice");
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  }

  function clearPrice() {
    setMin("");
    setMax("");
    const params = new URLSearchParams(sp.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  }

  return (
    <div className="catalog-sidebar-panel mt-3 space-y-2 text-sm">
      <p className="catalog-sidebar-panel__title !mb-3">Khoảng giá</p>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="number"
          min={0}
          step={1000}
          placeholder="Từ"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          className="w-28 rounded-lg border border-slate-200 px-2 py-1.5"
        />
        <span className="text-[var(--brand-muted)]">—</span>
        <input
          type="number"
          min={0}
          step={1000}
          placeholder="Đến"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          className="w-28 rounded-lg border border-slate-200 px-2 py-1.5"
        />
        <Button type="button" variant="secondary" onClick={apply}>
          Áp dụng
        </Button>
        <button type="button" className="text-[var(--brand-primary)] underline" onClick={clearPrice}>
          Xóa
        </button>
      </div>
      <div className="flex flex-wrap gap-2 pt-1">
        {[
          { label: "Dưới 50k", min: "", max: "50000" },
          { label: "50k–100k", min: "50000", max: "100000" },
          { label: "Trên 100k", min: "100000", max: "" },
        ].map((chip) => (
          <button
            key={chip.label}
            type="button"
            className="rounded-full bg-slate-100 px-3 py-1 text-xs hover:bg-[var(--brand-sale)]/10"
            onClick={() => {
              setMin(chip.min);
              setMax(chip.max);
              const params = new URLSearchParams(sp.toString());
              if (chip.min) params.set("minPrice", chip.min);
              else params.delete("minPrice");
              if (chip.max) params.set("maxPrice", chip.max);
              else params.delete("maxPrice");
              const qs = params.toString();
              router.push(qs ? `${basePath}?${qs}` : basePath);
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}

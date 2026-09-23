"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const PRESET_RANGES = [
  { label: "Dưới 50.000đ", min: "", max: "50000" },
  { label: "50.000đ - 100.000đ", min: "50000", max: "100000" },
  { label: "100.000đ - 200.000đ", min: "100000", max: "200000" },
  { label: "200.000đ - 300.000đ", min: "200000", max: "300000" },
  { label: "Trên 300.000đ", min: "300000", max: "" },
] as const;

type Props = {
  basePath: string;
  variant?: "default" | "checkbox";
};

export function ProductPriceFilter({ basePath, variant = "default" }: Props) {
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

  function isPresetActive(min: string, max: string) {
    return (sp.get("minPrice") ?? "") === min && (sp.get("maxPrice") ?? "") === max;
  }

  function pushRange(min: string, max: string) {
    const params = new URLSearchParams(sp.toString());
    if (min) params.set("minPrice", min);
    else params.delete("minPrice");
    if (max) params.set("maxPrice", max);
    else params.delete("maxPrice");
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  }

  if (variant === "checkbox") {
    return (
      <div className="catalog-sidebar-panel">
        <p className="catalog-sidebar-panel__title !mb-3">Lọc giá</p>
        <ul className="space-y-0.5">
          {PRESET_RANGES.map((chip) => {
            const active = isPresetActive(chip.min, chip.max);
            return (
              <li key={chip.label}>
                <button
                  type="button"
                  className="catalog-filter-check w-full text-left"
                  onClick={() => pushRange(chip.min, chip.max)}
                >
                  <input type="checkbox" readOnly checked={active} tabIndex={-1} aria-hidden />
                  <span>{chip.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        {(sp.get("minPrice") || sp.get("maxPrice")) && (
          <button
            type="button"
            className="mt-2 text-xs font-semibold text-[var(--brand-primary)] underline"
            onClick={clearPrice}
          >
            Xóa lọc giá
          </button>
        )}
      </div>
    );
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
        {PRESET_RANGES.slice(0, 3).map((chip) => (
          <button
            key={chip.label}
            type="button"
            className="rounded-full bg-slate-100 px-3 py-1 text-xs hover:bg-[var(--brand-sale)]/10"
            onClick={() => {
              setMin(chip.min);
              setMax(chip.max);
              pushRange(chip.min, chip.max);
            }}
          >
            {chip.label.replace(".000đ", "k").replace(" - ", "–")}
          </button>
        ))}
      </div>
    </div>
  );
}

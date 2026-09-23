"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

type Props = {
  images: string[];
  name: string;
};

export function ProductImageGallery({ images, name }: Props) {
  const gallery = images.length ? images : ["/seed/product-01.svg"];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = gallery[Math.min(selectedIndex, gallery.length - 1)];

  return (
    <div className="space-y-3">
      <div className="pdp-gallery-main">
        <Image
          key={selected}
          src={selected}
          alt={name}
          fill
          className="object-contain p-3 md:p-5"
          priority={selectedIndex === 0}
          sizes="(max-width:768px) 100vw, (max-width:1599px) 50vw, 520px"
        />
      </div>
      {gallery.length > 1 ? (
        <div className="grid grid-cols-5 gap-2 md:grid-cols-6">
          {gallery.map((src, index) => {
            const active = index === selectedIndex;
            return (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`Xem ảnh ${index + 1} của ${name}`}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "relative aspect-square cursor-pointer overflow-hidden rounded-lg border bg-white transition",
                  active
                    ? "border-[var(--tl-header-navy)] ring-2 ring-[var(--tl-header-navy)] ring-offset-1"
                    : "border-slate-200 hover:border-[var(--tl-header-navy)]/60",
                )}
              >
                <Image src={src} alt="" fill className="object-contain p-1" sizes="120px" />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

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
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius)] border border-slate-200 bg-white">
        <Image
          key={selected}
          src={selected}
          alt={name}
          fill
          className="object-cover"
          priority={selectedIndex === 0}
          sizes="(max-width:768px) 100vw, 50vw"
        />
      </div>
      {gallery.length > 1 ? (
        <div className="grid grid-cols-4 gap-2">
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
                    ? "border-[var(--brand-primary)] ring-2 ring-[var(--brand-primary)] ring-offset-1"
                    : "border-slate-200 hover:border-[var(--brand-primary)]/60",
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Banner } from "@/lib/types";

export function HomeBannerCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const slides = banners.filter((b) => b.placement === "home_carousel");

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (!slides.length) return null;
  const current = slides[index] ?? slides[0];

  const isLogoSlide =
    current.image_url.includes("aca-logo") || current.image_url.includes("logo-hero");

  return (
    <div className="relative overflow-hidden rounded-xl bg-white shadow-sm">
      <Link href={current.link_url} className="block">
        <div
          className={`relative aspect-[21/7] w-full ${
            isLogoSlide
              ? "bg-gradient-to-r from-[#fafaf9] via-[#fff5eb] to-[#fff9e6]"
              : "bg-gradient-to-r from-[#EE4D2D]/10 to-[#F5C563]/20"
          }`}
        >
          <Image
            src={current.image_url}
            alt={current.title}
            fill
            className={isLogoSlide ? "object-contain p-6 md:p-10" : "object-cover object-center"}
            sizes="(min-width: 1270px) 1270px, 100vw"
            priority
            unoptimized={isLogoSlide && current.image_url.endsWith(".png")}
          />
        </div>
      </Link>
      {slides.length > 1 ? (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((b, i) => (
            <button
              key={b.id}
              type="button"
              aria-label={`Slide ${i + 1}`}
              className={`h-2 w-2 rounded-full ${i === index ? "bg-[var(--brand-sale)]" : "bg-white/80"}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

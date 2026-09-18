"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Banner } from "@/lib/types";

function BannerSlideImage({
  src,
  alt,
  useNativeImg,
}: {
  src: string;
  alt: string;
  useNativeImg: boolean;
}) {
  if (useNativeImg) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover object-center"
        decoding="async"
        fetchPriority="high"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover object-center"
      sizes="(min-width: 1270px) 1270px, 100vw"
      priority
    />
  );
}

function shouldUseNativeImg(url: string): boolean {
  return url.endsWith(".svg") || url.startsWith("/banners/");
}

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
  const nativeImg = shouldUseNativeImg(current.image_url);
  const isLogoSlide =
    current.image_url.includes("aca-logo") || current.image_url.includes("logo-hero");

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
      <Link href={current.link_url} className="block">
        <div
          className={`relative aspect-[21/7] w-full ${
            nativeImg || isLogoSlide
              ? "bg-[var(--brand-bg)]"
              : "bg-gradient-to-r from-[#ec2229]/10 to-[#eda909]/20"
          }`}
        >
          <BannerSlideImage
            src={current.image_url}
            alt={current.title}
            useNativeImg={nativeImg || (isLogoSlide && current.image_url.endsWith(".png"))}
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

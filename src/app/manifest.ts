import type { MetadataRoute } from "next";
import { repo } from "@/lib/data/repository";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await repo.getSettings();
  return {
    name: settings.shop_name,
    short_name: settings.shop_name.slice(0, 12),
    description:
      settings.tagline ||
      "Thiết bị Y tế Tâm Đức — thiết bị y tế chính hãng tại Hà Nội.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: settings.primary_color || "#0d9488",
    lang: "vi",
    icons: [
      {
        src: settings.favicon_url || "/brand/tam-duc-favicon.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}

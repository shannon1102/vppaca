import type { CSSProperties } from "react";
import type { SiteSettings } from "@/lib/types";
import { BRAND_COLORS } from "@/lib/brand-colors";

export function themeStyleFromSettings(s: SiteSettings): CSSProperties {
  return {
    ["--nc-primary" as string]: s.primary_color || BRAND_COLORS.primary,
    ["--brand-primary" as string]: s.primary_color || BRAND_COLORS.primary,
    ["--brand-primary-hover" as string]: BRAND_COLORS.primaryHover,
    ["--brand-gradient" as string]: BRAND_COLORS.gradient,
    ["--brand-secondary" as string]: s.secondary_color,
    ["--brand-accent" as string]: s.accent_color,
    ["--brand-bg" as string]: "#F9FAF5",
    ["--brand-surface" as string]: "#FFFFFF",
    ["--brand-text" as string]: "#0F172A",
    ["--brand-muted" as string]: "#64748B",
    ["--radius" as string]: "12px",
  };
}

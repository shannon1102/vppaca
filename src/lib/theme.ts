import type { CSSProperties } from "react";
import type { SiteSettings } from "@/lib/types";
import { BRAND_COLORS } from "@/lib/brand-colors";

export function themeStyleFromSettings(s: SiteSettings): CSSProperties {
  const primary = s.primary_color || BRAND_COLORS.primary;
  return {
    ["--nc-primary" as string]: primary,
    ["--brand-primary" as string]: primary,
    ["--brand-primary-hover" as string]: BRAND_COLORS.primaryHover,
    ["--brand-gradient" as string]: primary,
    ["--brand-secondary" as string]: s.secondary_color || BRAND_COLORS.secondary,
    ["--brand-accent" as string]: s.accent_color,
    ["--brand-bg" as string]: "#d3edff",
    ["--brand-surface" as string]: "#FFFFFF",
    ["--brand-text" as string]: "#0F172A",
    ["--brand-muted" as string]: "#64748B",
    ["--radius" as string]: "12px",
  };
}

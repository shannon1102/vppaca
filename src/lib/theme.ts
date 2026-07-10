import type { CSSProperties } from "react";
import type { SiteSettings } from "@/lib/types";

export function themeStyleFromSettings(s: SiteSettings): CSSProperties {
  return {
    ["--brand-primary" as string]: s.primary_color,
    ["--brand-primary-hover" as string]: s.primary_color,
    ["--brand-secondary" as string]: s.secondary_color,
    ["--brand-accent" as string]: s.accent_color,
    ["--brand-bg" as string]: "#F8FAFC",
    ["--brand-surface" as string]: "#FFFFFF",
    ["--brand-text" as string]: "#0F172A",
    ["--brand-muted" as string]: "#64748B",
    ["--radius" as string]: "12px",
  };
}

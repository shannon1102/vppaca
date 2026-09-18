/** Logo header/footer — gradient đỏ–vàng ACA */
export const ACA_LOGO_URL = "/brand/aca-logo-linear-gradient-red-yellow.png";

const LEGACY_LOGO_PATHS = new Set([
  "/brand/tam-duc-logo.png",
  "/brand/tam-duc-favicon.png",
  "/brand/aca-logo-horizontal.svg",
  "/brand/aca-logo-dark.svg",
  "/brand/aca-logo-hero.png",
  "/brand/aca-icon.svg",
  "",
]);

function shouldUseCanonicalLogo(raw: string): boolean {
  if (LEGACY_LOGO_PATHS.has(raw)) return true;
  if (raw.includes("tam-duc")) return true;
  if (raw.includes("aca-logo-horizontal")) return true;
  if (raw.includes("aca-logo-hero")) return true;
  if (raw.startsWith("/brand/") && raw.endsWith(".svg")) return true;
  return false;
}

/** Chuẩn hóa logo từ DB (seed cũ Tam Đức, SVG, path trống). */
export function resolveLogoUrl(logoUrl: string | null | undefined): string {
  const raw = (logoUrl ?? "").trim();
  if (!raw) return ACA_LOGO_URL;
  if (shouldUseCanonicalLogo(raw)) return ACA_LOGO_URL;
  if (raw.startsWith("/") || raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }
  return ACA_LOGO_URL;
}

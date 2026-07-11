import { TAM_DUC_BRAND } from "@/lib/brand-content";

/** Derive Messenger deep-link from Facebook page URL when possible. */
export function messengerUrl(facebookUrl?: string): string {
  if (!facebookUrl) return TAM_DUC_BRAND.social.messenger;
  try {
    const u = new URL(facebookUrl);
    const parts = u.pathname.split("/").filter(Boolean);
    const slug = parts[0];
    if (slug && !["messages", "watch", "reel", "p", "profile.php"].includes(slug)) {
      return `https://m.me/${slug}`;
    }
    if (slug === "p" && parts[1]) {
      return `https://m.me/${parts[1]}`;
    }
    if (slug === "profile.php") {
      const id = u.searchParams.get("id");
      if (id) return `https://m.me/${id}`;
    }
  } catch {
    /* ignore */
  }
  return TAM_DUC_BRAND.social.messenger;
}

export function socialLinks(settings: {
  zalo_url?: string;
  facebook_url?: string;
}) {
  const facebook = settings.facebook_url || TAM_DUC_BRAND.social.facebook;
  return {
    zalo: settings.zalo_url || TAM_DUC_BRAND.social.zalo,
    zaloSecondary: TAM_DUC_BRAND.social.zaloSecondary,
    facebook,
    messenger: messengerUrl(facebook),
  };
}

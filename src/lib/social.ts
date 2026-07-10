/** Derive Messenger deep-link from Facebook page URL when possible. */
export function messengerUrl(facebookUrl?: string): string {
  if (!facebookUrl) return "https://www.messenger.com/";
  try {
    const u = new URL(facebookUrl);
    const parts = u.pathname.split("/").filter(Boolean);
    const slug = parts[0];
    if (slug && !["messages", "watch", "reel"].includes(slug)) {
      return `https://m.me/${slug}`;
    }
  } catch {
    /* ignore */
  }
  return "https://www.messenger.com/";
}

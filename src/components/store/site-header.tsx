import { HeaderInteractive } from "@/components/store/header-interactive";
import type { Category, SiteSettings } from "@/lib/types";

export function SiteHeader({
  settings,
  categories,
}: {
  settings: SiteSettings;
  categories: Category[];
}) {
  return (
    <HeaderInteractive
      phone={settings.phone}
      categories={categories}
      shopName={settings.shop_name}
      tagline={settings.tagline}
      logoUrl={settings.logo_url}
    />
  );
}

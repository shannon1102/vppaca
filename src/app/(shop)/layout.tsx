import { RegistrationToast } from "@/components/store/registration-toast";
import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { SocialIcons } from "@/components/store/social-icons";
import { repo } from "@/lib/data/repository";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, categories] = await Promise.all([
    repo.getSettings(),
    repo.listCategories(),
  ]);
  return (
    <>
      <SiteHeader settings={settings} categories={categories} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
      <SocialIcons settings={settings} variant="float" />
      <RegistrationToast />
    </>
  );
}

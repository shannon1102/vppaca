import type { Metadata } from "next";
import { DM_Sans, Source_Sans_3 } from "next/font/google";
import { repo } from "@/lib/data/repository";
import { rootMetadata, siteUrl } from "@/lib/seo/metadata";
import { ToastHost } from "@/components/ui/toast-host";
import { themeStyleFromSettings } from "@/lib/theme";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await repo.getSettings();
  return rootMetadata(s);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await repo.getSettings();
  const base = siteUrl();
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: settings.shop_name,
      telephone: settings.phone,
      email: settings.email,
      address: settings.address,
      url: base,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: settings.shop_name,
      url: base,
      potentialAction: {
        "@type": "SearchAction",
        target: `${base}/san-pham?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <html lang="vi" className={`${dmSans.variable} ${sourceSans.variable} h-full`}>
      <body
        className="flex min-h-full flex-col antialiased"
        style={themeStyleFromSettings(settings)}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <ToastHost />
      </body>
    </html>
  );
}

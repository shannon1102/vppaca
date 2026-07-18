import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Source_Sans_3 } from "next/font/google";
import { repo } from "@/lib/data/repository";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";
import { rootMetadata } from "@/lib/seo/metadata";
import { ToastHost } from "@/components/ui/toast-host";
import { themeStyleFromSettings } from "@/lib/theme";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display-sans",
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin", "latin-ext", "vietnamese"],
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
  const jsonLd = [organizationJsonLd(settings), websiteJsonLd(settings)];

  return (
    <html lang="vi" className={`${plusJakarta.variable} ${sourceSans.variable} h-full`}>
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

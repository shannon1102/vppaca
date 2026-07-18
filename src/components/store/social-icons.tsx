import Image from "next/image";
import type { SiteSettings } from "@/lib/types";
import { socialLinks } from "@/lib/social";

type Variant = "footer" | "float";

const ICONS = {
  zalo: "/social-icon/zalo.png",
  facebook: "/social-icon/facebook.png",
  messenger: "/social-icon/messenger.png",
} as const;

function SocialIconImage({ src, size }: { src: string; size: number }) {
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className="h-full w-full object-contain"
      aria-hidden
    />
  );
}

export function SocialIcons({
  settings,
  variant = "footer",
}: {
  settings: SiteSettings;
  variant?: Variant;
}) {
  const links = socialLinks(settings);
  const items = [
    {
      key: "zalo" as const,
      label: "Zalo 0962 732 786",
      href: links.zalo,
    },
    {
      key: "facebook" as const,
      label: "Facebook Viện Trị Liệu Cổ Truyền Tâm Đức",
      href: links.facebook,
    },
    {
      key: "messenger" as const,
      label: "Messenger Viện Trị Liệu Cổ Truyền Tâm Đức",
      href: links.messenger,
    },
  ];

  const size = variant === "float" ? 56 : 44;

  if (variant === "float") {
    return (
      <div className="pointer-events-none fixed bottom-5 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
        {items.map((item) => (
          <a
            key={item.key}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            title={item.label}
            className="pointer-events-auto flex h-14 w-14 items-center justify-center overflow-hidden rounded-full shadow-lg transition hover:-translate-y-0.5 hover:scale-105 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <SocialIconImage src={ICONS[item.key]} size={size} />
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      {items.map((item) => (
        <a
          key={item.key}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          title={item.label}
          className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full transition hover:scale-105 hover:brightness-110"
        >
          <SocialIconImage src={ICONS[item.key]} size={size} />
        </a>
      ))}
    </div>
  );
}

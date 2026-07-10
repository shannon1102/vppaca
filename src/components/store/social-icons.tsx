import type { SiteSettings } from "@/lib/types";
import { messengerUrl } from "@/lib/social";

type Variant = "footer" | "float";

/** Official brand paths from Simple Icons (https://simpleicons.org) */
const SI = {
  facebook:
    "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z",
  messenger:
    "M12 0C5.24 0 0 4.952 0 11.64c0 3.499 1.434 6.521 3.769 8.61a.96.96 0 0 1 .323.683l.065 2.135a.96.96 0 0 0 1.347.85l2.381-1.053a.96.96 0 0 1 .641-.046A13 13 0 0 0 12 23.28c6.76 0 12-4.952 12-11.64S18.76 0 12 0m6.806 7.44c.522-.03.971.567.63 1.094l-4.178 6.457a.707.707 0 0 1-.977.208l-3.87-2.504a.44.44 0 0 0-.49.007l-4.363 3.01c-.637.438-1.415-.317-.995-.966l4.179-6.457a.706.706 0 0 1 .977-.21l3.87 2.505c.15.097.344.094.491-.007l4.362-3.008a.7.7 0 0 1 .364-.13",
  zalo: "M12.49 10.2722v-.4496h1.3467v6.3218h-.7704a.576.576 0 01-.5763-.5729l-.0006.0005a3.273 3.273 0 01-1.9372.6321c-1.8138 0-3.2844-1.4697-3.2844-3.2823 0-1.8125 1.4706-3.2822 3.2844-3.2822a3.273 3.273 0 011.9372.6321l.0006.0005zM6.9188 7.7896v.205c0 .3823-.051.6944-.2995 1.0605l-.03.0343c-.0542.0615-.1815.206-.2421.2843L2.024 14.8h4.8948v.7682a.5764.5764 0 01-.5767.5761H0v-.3622c0-.4436.1102-.6414.2495-.8476L4.8582 9.23H.1922V7.7896h6.7266zm8.5513 8.3548a.4805.4805 0 01-.4803-.4798v-7.875h1.4416v8.3548H15.47zM20.6934 9.6C22.52 9.6 24 11.0807 24 12.9044c0 1.8252-1.4801 3.306-3.3066 3.306-1.8264 0-3.3066-1.4808-3.3066-3.306 0-1.8237 1.4802-3.3044 3.3066-3.3044zm-10.1412 5.253c1.0675 0 1.9324-.8645 1.9324-1.9312 0-1.065-.865-1.9295-1.9324-1.9295s-1.9324.8644-1.9324 1.9295c0 1.0667.865 1.9312 1.9324 1.9312zm10.1412-.0033c1.0737 0 1.945-.8707 1.945-1.9453 0-1.073-.8713-1.9436-1.945-1.9436-1.0753 0-1.945.8706-1.945 1.9436 0 1.0746.8697 1.9453 1.945 1.9453z",
} as const;

function BrandIcon({
  path,
  sizeClass,
}: {
  path: string;
  sizeClass: string;
}) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClass} shrink-0`}
      aria-hidden
    >
      <path d={path} fill="currentColor" />
    </svg>
  );
}

export function SocialIcons({
  settings,
  variant = "footer",
}: {
  settings: SiteSettings;
  variant?: Variant;
}) {
  const items = [
    {
      key: "zalo",
      label: "Zalo",
      href: settings.zalo_url || "https://zalo.me",
      bg: "#0068FF",
      path: SI.zalo,
    },
    {
      key: "facebook",
      label: "Facebook",
      href: settings.facebook_url || "https://facebook.com",
      bg: "#1877F2",
      path: SI.facebook,
    },
    {
      key: "messenger",
      label: "Messenger",
      href: messengerUrl(settings.facebook_url),
      bg: "#0084FF",
      path: SI.messenger,
    },
  ];

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
            className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition hover:-translate-y-0.5 hover:scale-105 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            style={{ background: item.bg }}
          >
            {/* ~70% đường kính vòng ngoài (56px → ~40px) */}
            <BrandIcon path={item.path} sizeClass="h-10 w-10" />
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
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:scale-105 hover:brightness-110"
          style={{ background: item.bg }}
        >
          {/* ~70% (44px → ~31px) */}
          <BrandIcon path={item.path} sizeClass="h-8 w-8" />
        </a>
      ))}
    </div>
  );
}

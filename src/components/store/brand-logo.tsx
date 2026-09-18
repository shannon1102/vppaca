import Image from "next/image";
import { resolveLogoUrl } from "@/lib/brand-logo";

type BrandLogoProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ src, alt, width, height, className, priority }: BrandLogoProps) {
  const resolved = resolveLogoUrl(src);
  return (
    <Image
      src={resolved}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized={resolved.endsWith(".svg")}
    />
  );
}

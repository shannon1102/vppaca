import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";

export function HomeCategoryTrends({ categories }: { categories: Category[] }) {
  const roots = categories.filter((c) => !c.parent_id).slice(0, 8);
  if (!roots.length) return null;

  return (
    <section className="home-trends-band">
      <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:gap-6 md:p-5">
        <div className="shrink-0 md:max-w-[140px]">
          <p className="text-sm font-bold uppercase tracking-wide text-white/95">Xu hướng tìm kiếm</p>
          <Link
            href="/san-pham"
            className="mt-2 inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold text-white backdrop-blur hover:bg-white/25"
          >
            XEM NGAY
          </Link>
        </div>
        <div className="grid min-w-0 flex-1 grid-cols-4 gap-2 sm:grid-cols-8 md:gap-3">
          {roots.map((c) => (
            <Link
              key={c.id}
              href={`/danh-muc/${c.slug}`}
              className="flex flex-col items-center gap-1.5 text-center transition hover:opacity-90"
            >
              <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-white/30 bg-white md:h-14 md:w-14">
                {c.image_url ? (
                  <Image src={c.image_url} alt="" fill className="object-cover" sizes="56px" />
                ) : (
                  <span className="text-lg font-bold text-[var(--tl-header-navy)]">{c.name.charAt(0)}</span>
                )}
              </span>
              <span className="line-clamp-2 text-[10px] font-medium leading-tight text-white md:text-[11px]">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

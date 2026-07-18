import { ensureUniqueSlug } from "@/lib/format";
import { normalizeImageSrc } from "@/lib/media/helpers";
import type { Category } from "@/lib/types";

export function buildCategoryFromInput(
  input: {
    id?: string;
    name: string;
    description?: string;
    sort?: number;
    image_url?: string | null;
  },
  existing: Category[],
): Category {
  const id = input.id || `cat-${Date.now()}`;
  const existingCat = existing.find((c) => c.id === id);
  const imageRaw = input.image_url?.trim() ?? "";
  return {
    id,
    name: input.name,
    slug: ensureUniqueSlug({
      title: input.name,
      id,
      current: existingCat?.slug,
      taken: existing.filter((c) => c.id !== id).map((c) => c.slug),
    }),
    description: input.description ?? "",
    sort: Number(input.sort ?? 0),
    image_url: imageRaw ? normalizeImageSrc(imageRaw) : null,
  };
}

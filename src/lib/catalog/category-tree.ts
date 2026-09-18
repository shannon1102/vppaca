import type { Category } from "@/lib/types";

/** Product category IDs included when filtering by category slug (parent + descendants). */
export function categoryIdsForSlug(
  categories: Category[],
  slug: string,
): string[] | null {
  const root = categories.find((c) => c.slug === slug);
  if (!root) return null;
  const ids = new Set<string>([root.id]);
  let added = true;
  while (added) {
    added = false;
    for (const c of categories) {
      if (c.parent_id && ids.has(c.parent_id) && !ids.has(c.id)) {
        ids.add(c.id);
        added = true;
      }
    }
  }
  return [...ids];
}

export type CategoryNavGroup = {
  category: Category;
  children: Category[];
};

/** Top-level categories with nested children for mega-menu / mobile accordion. */
export function buildCategoryNav(categories: Category[]): CategoryNavGroup[] {
  const sorted = [...categories].sort((a, b) => a.sort - b.sort);
  const roots = sorted.filter((c) => !c.parent_id);
  return roots.map((category) => ({
    category,
    children: sorted.filter((c) => c.parent_id === category.id),
  }));
}

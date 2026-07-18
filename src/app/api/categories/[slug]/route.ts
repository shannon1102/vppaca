import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth-admin";
import { buildCategoryFromInput } from "@/lib/categories/build-category";
import { CACHE_TAGS } from "@/lib/data/cached-repo";
import { repo } from "@/lib/data/repository";
import type { Category } from "@/lib/types";

type RouteCtx = { params: Promise<{ slug: string }> };

/** GET /api/categories/[slug] — get category by slug */
export async function GET(_req: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  const categories = await repo.listCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ data: category });
}

/** PUT /api/categories/[slug] — update category (admin) */
export async function PUT(req: Request, ctx: RouteCtx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await ctx.params;
  const categories = await repo.listCategories();
  const existing = categories.find((c) => c.slug === slug);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = (await req.json()) as Partial<Category>;
  const name = body.name?.trim() || existing.name;
  const updated = buildCategoryFromInput(
    {
      id: existing.id,
      name,
      description: body.description ?? existing.description,
      sort: body.sort ?? existing.sort,
      image_url: body.image_url !== undefined ? body.image_url : existing.image_url,
    },
    categories,
  );

  await repo.upsertCategory(updated);
  revalidateTag(CACHE_TAGS.categories, "max");

  return NextResponse.json({ data: updated });
}

/** DELETE /api/categories/[slug] — delete category (admin) */
export async function DELETE(_req: Request, ctx: RouteCtx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await ctx.params;
  const categories = await repo.listCategories();
  const existing = categories.find((c) => c.slug === slug);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await repo.deleteCategory(existing.id);
  revalidateTag(CACHE_TAGS.categories, "max");

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth-admin";
import { buildCategoryFromInput } from "@/lib/categories/build-category";
import { CACHE_TAGS } from "@/lib/data/cached-repo";
import { repo } from "@/lib/data/repository";
import type { Category } from "@/lib/types";

/** GET /api/categories — list product categories */
export async function GET() {
  const categories = await repo.listCategories();
  return NextResponse.json(
    { data: categories },
    {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    },
  );
}

/** POST /api/categories — create category (admin) */
export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as Partial<Category>;
  if (!body.name?.trim()) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const existing = await repo.listCategories();
  const category = buildCategoryFromInput(
    {
      id: body.id,
      name: body.name.trim(),
      description: body.description,
      sort: body.sort,
      image_url: body.image_url,
    },
    existing,
  );

  await repo.upsertCategory(category);
  revalidateTag(CACHE_TAGS.categories, "max");

  return NextResponse.json({ data: category }, { status: 201 });
}

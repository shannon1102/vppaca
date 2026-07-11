import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth-admin";
import { repo } from "@/lib/data/repository";
import { ensureUniqueSlug } from "@/lib/format";
import type { HealthArticle } from "@/lib/types";

/** GET /api/articles — list health articles (published only by default) */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "1";
  if (all && !(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const articles = await repo.listArticles({ publishedOnly: !all });
  return NextResponse.json(
    { data: articles },
    {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    },
  );
}

/** POST /api/articles — create article (admin) */
export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as Partial<HealthArticle>;
  if (!body.title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  const now = new Date().toISOString();
  const id = body.id ?? `art-${Date.now()}`;
  const articles = await repo.listArticles();
  const article: HealthArticle = {
    id,
    title: body.title,
    slug: ensureUniqueSlug({
      title: body.title,
      id,
      taken: articles.filter((a) => a.id !== id).map((a) => a.slug),
    }),
    excerpt: body.excerpt ?? "",
    content: body.content ?? "",
    cover_image_url: body.cover_image_url ?? null,
    tags: (body.tags ?? []).slice(0, 5),
    is_published: body.is_published ?? false,
    seo_title: body.seo_title ?? "",
    seo_description: body.seo_description ?? "",
    created_at: body.created_at ?? now,
    updated_at: now,
  };
  await repo.upsertArticle(article);
  return NextResponse.json({ data: article }, { status: 201 });
}

import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth-admin";
import { repo } from "@/lib/data/repository";
import { resolveSlug } from "@/lib/format";
import type { HealthArticle } from "@/lib/types";

type RouteCtx = { params: Promise<{ slug: string }> };

/** GET /api/articles/[slug] — get article by slug */
export async function GET(_req: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  const article = await repo.getArticleBySlug(slug);
  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ data: article });
}

/** PUT /api/articles/[slug] — update article (admin) */
export async function PUT(req: Request, ctx: RouteCtx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await ctx.params;
  const existing = await repo.getArticleBySlug(slug, false);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const body = (await req.json()) as Partial<HealthArticle>;
  const updated: HealthArticle = {
    ...existing,
    ...body,
    id: existing.id,
    title: body.title ?? existing.title,
    slug: resolveSlug(body.slug ?? "", body.title ?? existing.title, existing.id),
    updated_at: new Date().toISOString(),
  };
  await repo.upsertArticle(updated);
  return NextResponse.json({ data: updated });
}

/** DELETE /api/articles/[slug] — delete article (admin) */
export async function DELETE(_req: Request, ctx: RouteCtx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await ctx.params;
  const existing = await repo.getArticleBySlug(slug, false);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await repo.deleteArticle(existing.id);
  return NextResponse.json({ ok: true });
}

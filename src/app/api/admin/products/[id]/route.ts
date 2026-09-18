import { NextResponse } from "next/server";
import { guardAdminApi } from "@/lib/admin-api-auth";
import {
  repo,
  vppGetProductCatalog,
  vppSaveProductUomsTiers,
} from "@/lib/data/repository";
import type { Product, ProductPriceTier, ProductUom } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: Request, ctx: Ctx) {
  const denied = await guardAdminApi(request);
  if (denied) return denied;
  const { id } = await ctx.params;
  const product = await repo.getProductById(id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const catalog = await vppGetProductCatalog(product);
  return NextResponse.json({ catalog });
}

export async function PATCH(request: Request, ctx: Ctx) {
  const denied = await guardAdminApi(request);
  if (denied) return denied;
  const { id } = await ctx.params;
  const body = (await request.json()) as Partial<Product> & {
    uoms?: ProductUom[];
    tiers?: ProductPriceTier[];
  };
  const existing = await repo.getProductById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { uoms, tiers, ...patch } = body;
  const saved = await repo.upsertProduct({ ...existing, ...patch, id });
  if (uoms || tiers) {
    await vppSaveProductUomsTiers(id, uoms ?? [], tiers ?? []);
  }
  return NextResponse.json({ product: saved });
}

export async function DELETE(request: Request, ctx: Ctx) {
  const denied = await guardAdminApi(request);
  if (denied) return denied;
  const { id } = await ctx.params;
  await repo.deleteProduct(id);
  return NextResponse.json({ ok: true });
}

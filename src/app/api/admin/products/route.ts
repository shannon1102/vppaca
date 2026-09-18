import { NextResponse } from "next/server";
import { guardAdminApi } from "@/lib/admin-api-auth";
import { repo, vppGetProductUoms, vppGetProductTiers, vppSaveProductUomsTiers } from "@/lib/data/repository";
import type { Product, ProductPriceTier, ProductUom } from "@/lib/types";

export async function GET(request: Request) {
  const denied = await guardAdminApi(request);
  if (denied) return denied;
  const products = await repo.listProducts();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const denied = await guardAdminApi(request);
  if (denied) return denied;
  const body = (await request.json()) as Product & {
    uoms?: ProductUom[];
    tiers?: ProductPriceTier[];
  };
  const { uoms, tiers, ...product } = body;
  const saved = await repo.upsertProduct(product);
  if (uoms?.length || tiers?.length) {
    await vppSaveProductUomsTiers(saved.id, uoms ?? [], tiers ?? []);
  }
  return NextResponse.json({ product: saved });
}

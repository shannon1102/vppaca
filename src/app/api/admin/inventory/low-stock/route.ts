import { NextResponse } from "next/server";
import { guardAdminApi } from "@/lib/admin-api-auth";
import { vppListLowStock } from "@/lib/data/repository";

export async function GET(request: Request) {
  const denied = await guardAdminApi(request);
  if (denied) return denied;
  const items = await vppListLowStock();
  return NextResponse.json({ items });
}

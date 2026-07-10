import { NextResponse } from "next/server";
import { isSupabaseConfigured, repo } from "@/lib/data/repository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await repo.getSettings();
    return NextResponse.json({
      ok: true,
      shop: settings.shop_name,
      dataSource: isSupabaseConfigured() ? "supabase" : "local",
      ts: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "unknown",
        ts: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

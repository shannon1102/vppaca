import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth-admin";

/**
 * Admin-only trigger: re-run catalog seed against Supabase.
 * POST /api/admin/seed-catalog
 * Prefer `node scripts/seed-catalog.mjs` in CI/ops; this route documents the flow.
 */
export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    ok: true,
    message:
      "Seed runs via scripts/seed-catalog.mjs (service role). Catalog already applied on deploy pipeline.",
  });
}

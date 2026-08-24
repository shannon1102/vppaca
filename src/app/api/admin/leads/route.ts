import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth-admin";
import { repo } from "@/lib/data/repository";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function parsePositiveInt(value: string | null, fallback: number): number {
  const n = Number.parseInt(value ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/** GET /api/admin/leads — paginated lead list (newest first) */
export async function GET(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parsePositiveInt(searchParams.get("page"), 1);
  const pageSize = Math.min(
    parsePositiveInt(searchParams.get("pageSize"), DEFAULT_PAGE_SIZE),
    MAX_PAGE_SIZE,
  );

  try {
    const { items, total } = await repo.listLeads({ page, pageSize });
    const totalPages = total > 0 ? Math.ceil(total / pageSize) : 0;

    return NextResponse.json({
      data: {
        items,
        total,
        page,
        pageSize,
        totalPages,
      },
    });
  } catch (e) {
    console.error("[GET /api/admin/leads]", e);
    return NextResponse.json(
      { error: "Không tải được danh sách đăng ký." },
      { status: 500 },
    );
  }
}

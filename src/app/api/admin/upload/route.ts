import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth-admin";
import { listMediaFiles, saveUploadedImage } from "@/lib/media/upload";

/** POST /api/admin/upload — upload image for rich text editor */
export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const media = await saveUploadedImage(file);
    return NextResponse.json({ data: media });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

/** GET /api/admin/upload — list uploaded media (admin) */
export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const files = await listMediaFiles();
  return NextResponse.json({ data: files });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { LEAD_FORM_DEFAULT_ID } from "@/lib/content/lead-form-embed";
import { repo } from "@/lib/data/repository";
import { clampText, FORM_LIMITS } from "@/lib/form-limits";
import type { ContactLead } from "@/lib/types";

const leadSchema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ tên.").max(FORM_LIMITS.name),
  phone: z
    .string()
    .trim()
    .min(8, "Số điện thoại không hợp lệ.")
    .max(FORM_LIMITS.phone),
  email: z
    .string()
    .trim()
    .max(FORM_LIMITS.email)
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .max(FORM_LIMITS.leadMessage)
    .optional()
    .or(z.literal("")),
  source: z.string().trim().max(120).optional(),
  form_id: z.string().trim().max(40).optional(),
  /** Honeypot — bots often fill hidden fields. */
  website: z.string().optional(),
});

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** POST /api/leads — public lead / registration form submission */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message;
      return NextResponse.json(
        { error: first || "Thông tin không hợp lệ." },
        { status: 400 },
      );
    }

    if (parsed.data.website?.trim()) {
      return NextResponse.json({ data: { id: "ok" } }, { status: 201 });
    }

    if (parsed.data.email && !isValidEmail(parsed.data.email)) {
      return NextResponse.json({ error: "Email không hợp lệ." }, { status: 400 });
    }

    const now = new Date().toISOString();
    const lead: ContactLead = {
      id: `lead-${Date.now()}`,
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || "",
      message: parsed.data.message || "",
      source: clampText(parsed.data.source || "website", 120),
      form_id: clampText(parsed.data.form_id || LEAD_FORM_DEFAULT_ID, 40),
      status: "new",
      created_at: now,
    };

    await repo.createLead(lead);
    return NextResponse.json({ data: { id: lead.id } }, { status: 201 });
  } catch (e) {
    console.error("[POST /api/leads]", e);
    return NextResponse.json(
      { error: "Không gửi được yêu cầu. Vui lòng thử lại sau." },
      { status: 500 },
    );
  }
}

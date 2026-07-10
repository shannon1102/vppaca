import { Resend } from "resend";
import { buildAdminOrderEmailHtml } from "@/lib/email/order-admin-template";
import type { Order, SiteSettings } from "@/lib/types";

export async function notifyAdminNewOrder(opts: {
  order: Order;
  settings: SiteSettings;
}): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY missing — skip admin notify");
    return { sent: false, reason: "missing_resend_api_key" };
  }

  const to =
    process.env.ADMIN_NOTIFY_EMAIL ||
    process.env.ADMIN_EMAIL ||
    opts.settings.email;
  if (!to) {
    return { sent: false, reason: "missing_admin_email" };
  }

  const from =
    process.env.EMAIL_FROM ||
    `${opts.settings.shop_name} <onboarding@resend.dev>`;

  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const adminUrl = `${site.replace(/\/$/, "")}/admin/orders`;
  const { subject, html, text } = buildAdminOrderEmailHtml({
    order: opts.order,
    settings: opts.settings,
    adminUrl,
  });

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject,
      html,
      text,
    });
    if (error) {
      console.error("[email] Resend error", error);
      return { sent: false, reason: error.message };
    }
    return { sent: true };
  } catch (e) {
    console.error("[email] send failed", e);
    return {
      sent: false,
      reason: e instanceof Error ? e.message : "send_failed",
    };
  }
}

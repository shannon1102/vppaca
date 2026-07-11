import { Resend } from "resend";
import { buildAdminOrderEmailHtml } from "@/lib/email/order-admin-template";
import { isGmailConfigured, sendViaGmail } from "@/lib/email/smtp";
import type { Order, SiteSettings } from "@/lib/types";

type NotifyResult = { sent: boolean; reason?: string; provider?: "gmail" | "resend" };

async function sendViaResend(input: {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
}): Promise<NotifyResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: false, reason: "missing_resend_api_key", provider: "resend" };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: input.from,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
    });
    if (error) {
      console.error("[email] Resend error", error);
      return { sent: false, reason: error.message, provider: "resend" };
    }
    return { sent: true, provider: "resend" };
  } catch (e) {
    console.error("[email] Resend send failed", e);
    return {
      sent: false,
      reason: e instanceof Error ? e.message : "resend_send_failed",
      provider: "resend",
    };
  }
}

export async function notifyAdminNewOrder(opts: {
  order: Order;
  settings: SiteSettings;
}): Promise<NotifyResult> {
  const to =
    process.env.ADMIN_NOTIFY_EMAIL ||
    process.env.ADMIN_EMAIL ||
    opts.settings.email;
  if (!to) {
    return { sent: false, reason: "missing_admin_email" };
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const adminUrl = `${site.replace(/\/$/, "")}/admin/orders`;
  const { subject, html, text } = buildAdminOrderEmailHtml({
    order: opts.order,
    settings: opts.settings,
    adminUrl,
  });

  if (isGmailConfigured()) {
    const from =
      process.env.EMAIL_FROM ||
      `${opts.settings.shop_name} <${process.env.GMAIL_USER}>`;
    const result = await sendViaGmail({ to, from, subject, html, text });
    return { ...result, provider: "gmail" };
  }

  const from =
    process.env.EMAIL_FROM ||
    `${opts.settings.shop_name} <onboarding@resend.dev>`;
  return sendViaResend({ to, from, subject, html, text });
}

import { Resend } from "resend";
import { buildAdminLeadEmailHtml } from "@/lib/email/lead-admin-template";
import { buildAdminOrderEmailHtml } from "@/lib/email/order-admin-template";
import { isGmailConfigured, sendViaGmail } from "@/lib/email/smtp";
import type { ContactLead, Order, SiteSettings } from "@/lib/types";

type NotifyResult = {
  sent: boolean;
  reason?: string;
  provider?: "gmail" | "resend";
};

function cleanEnv(value: string | undefined): string {
  return (value ?? "").trim().replace(/^["']|["']$/g, "");
}

function adminRecipient(settings: SiteSettings): string {
  return (
    cleanEnv(process.env.ADMIN_NOTIFY_EMAIL) ||
    cleanEnv(process.env.ADMIN_EMAIL) ||
    cleanEnv(settings.email)
  );
}

async function sendViaResend(input: {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
}): Promise<NotifyResult> {
  const apiKey = cleanEnv(process.env.RESEND_API_KEY);
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

async function deliverAdminEmail(opts: {
  settings: SiteSettings;
  subject: string;
  html: string;
  text: string;
  logContext: Record<string, string>;
}): Promise<NotifyResult> {
  const to = adminRecipient(opts.settings);
  if (!to) {
    console.warn("[email] missing recipient — skip admin notify");
    return { sent: false, reason: "missing_admin_email" };
  }

  if (isGmailConfigured()) {
    const from =
      cleanEnv(process.env.EMAIL_FROM) ||
      `${opts.settings.shop_name} <${cleanEnv(process.env.GMAIL_USER)}>`;
    const result = await sendViaGmail({
      to,
      from,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    });
    if (result.sent) {
      console.info("[email] sent via gmail", { to, ...opts.logContext });
    } else {
      console.error("[email] gmail failed", { to, ...opts.logContext, reason: result.reason });
    }
    return { ...result, provider: "gmail" };
  }

  const from =
    cleanEnv(process.env.EMAIL_FROM) ||
    `${opts.settings.shop_name} <onboarding@resend.dev>`;
  const result = await sendViaResend({
    to,
    from,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });
  if (result.sent) {
    console.info("[email] sent via resend", { to, ...opts.logContext });
  } else {
    console.error("[email] resend failed / skipped", {
      to,
      ...opts.logContext,
      reason: result.reason,
    });
  }
  return result;
}

export async function notifyAdminNewOrder(opts: {
  order: Order;
  settings: SiteSettings;
}): Promise<NotifyResult> {
  const site = cleanEnv(process.env.NEXT_PUBLIC_SITE_URL) || "http://localhost:3000";
  const adminUrl = `${site.replace(/\/$/, "")}/admin/orders`;
  const { subject, html, text } = buildAdminOrderEmailHtml({
    order: opts.order,
    settings: opts.settings,
    adminUrl,
  });

  return deliverAdminEmail({
    settings: opts.settings,
    subject,
    html,
    text,
    logContext: { order: opts.order.code },
  });
}

export async function notifyAdminRfq(opts: {
  rfqId: string;
  contactName: string;
  contactPhone: string;
  lineCount: number;
  settings: SiteSettings;
}): Promise<NotifyResult> {
  const subject = `[VPPACA] RFQ ${opts.rfqId}`;
  const html = `<p>Yêu cầu báo giá mới từ <strong>${opts.contactName}</strong> (${opts.contactPhone}).</p><p>${opts.lineCount} dòng hàng.</p>`;
  const text = `RFQ ${opts.rfqId} — ${opts.contactName} — ${opts.lineCount} lines`;
  return deliverAdminEmail({
    settings: opts.settings,
    subject,
    html,
    text,
    logContext: { rfq: opts.rfqId },
  });
}

export async function notifyAdminNewLead(opts: {
  lead: ContactLead;
  settings: SiteSettings;
}): Promise<NotifyResult> {
  const site = cleanEnv(process.env.NEXT_PUBLIC_SITE_URL) || "http://localhost:3000";
  const adminUrl = `${site.replace(/\/$/, "")}/admin/leads`;
  const { subject, html, text } = buildAdminLeadEmailHtml({
    lead: opts.lead,
    settings: opts.settings,
    adminUrl,
  });

  return deliverAdminEmail({
    settings: opts.settings,
    subject,
    html,
    text,
    logContext: { lead: opts.lead.id },
  });
}

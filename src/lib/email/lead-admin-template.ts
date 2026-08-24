import { BRAND_COLORS } from "@/lib/brand-colors";
import { LEAD_STATUS_LABELS } from "@/lib/lead-status";
import type { ContactLead, SiteSettings } from "@/lib/types";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildAdminLeadEmailHtml(opts: {
  lead: ContactLead;
  settings: SiteSettings;
  adminUrl: string;
}): { subject: string; html: string; text: string } {
  const { lead, settings, adminUrl } = opts;
  const primary = settings.primary_color || BRAND_COLORS.primary;
  const secondary = settings.secondary_color || BRAND_COLORS.secondary;
  const shop = escapeHtml(settings.shop_name);
  const when = new Date(lead.created_at).toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
  const statusLabel = LEAD_STATUS_LABELS[lead.status] ?? "Mới";

  const subject = `[${settings.shop_name}] Đăng ký tư vấn mới — ${lead.name}`;

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,${secondary},${primary});padding:28px 32px;color:#fff;">
              <p style="margin:0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.85;">Đăng ký tư vấn mới</p>
              <h1 style="margin:8px 0 0;font-size:24px;line-height:1.3;font-weight:700;">${shop}</h1>
              <p style="margin:10px 0 0;font-size:15px;opacity:0.95;">Có khách vừa đăng ký tư vấn trên website</p>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f8e9;border:1px solid #c8e6c9;border-radius:12px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0;font-size:12px;color:${primary};font-weight:600;text-transform:uppercase;letter-spacing:0.04em;">Mã đăng ký</p>
                    <p style="margin:6px 0 0;font-size:22px;font-weight:700;color:${secondary};letter-spacing:0.02em;">${escapeHtml(lead.id)}</p>
                    <p style="margin:8px 0 0;font-size:13px;color:#64748b;">${escapeHtml(when)} · Trạng thái: <strong style="color:#b45309;">${escapeHtml(statusLabel)}</strong></p>
                  </td>
                  <td style="padding:16px 20px;text-align:right;vertical-align:middle;">
                    <p style="margin:0;font-size:12px;color:#64748b;">Nguồn</p>
                    <p style="margin:6px 0 0;font-size:14px;font-weight:600;color:${primary};">${escapeHtml(lead.source || "website")}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 32px 8px;">
              <h2 style="margin:0 0 12px;font-size:15px;color:#0f172a;text-transform:uppercase;letter-spacing:0.04em;">Thông tin khách hàng</h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:10px 16px;background:#f8fafc;width:140px;font-size:13px;color:#64748b;">Họ tên</td>
                  <td style="padding:10px 16px;font-size:14px;font-weight:600;color:#0f172a;">${escapeHtml(lead.name)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;background:#f8fafc;font-size:13px;color:#64748b;">Điện thoại</td>
                  <td style="padding:10px 16px;font-size:14px;color:#0f172a;">
                    <a href="tel:${escapeHtml(lead.phone.replace(/\s/g, ""))}" style="color:${primary};text-decoration:none;font-weight:600;">${escapeHtml(lead.phone)}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;background:#f8fafc;font-size:13px;color:#64748b;">Email</td>
                  <td style="padding:10px 16px;font-size:14px;color:#0f172a;">${escapeHtml(lead.email || "—")}</td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;background:#f8fafc;font-size:13px;color:#64748b;">Form</td>
                  <td style="padding:10px 16px;font-size:14px;color:#0f172a;">${escapeHtml(lead.form_id || "tu-van")}</td>
                </tr>
                ${
                  lead.message
                    ? `<tr>
                  <td style="padding:10px 16px;background:#f8fafc;font-size:13px;color:#64748b;vertical-align:top;">Nội dung</td>
                  <td style="padding:10px 16px;font-size:14px;color:#0f172a;">${escapeHtml(lead.message)}</td>
                </tr>`
                    : ""
                }
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 32px 32px;" align="center">
              <a href="${escapeHtml(adminUrl)}"
                 style="display:inline-block;background:${primary};color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 28px;border-radius:999px;box-shadow:0 8px 20px rgba(46,125,50,0.25);">
                Mở quản lý đăng ký tư vấn
              </a>
              <p style="margin:16px 0 0;font-size:12px;color:#94a3b8;">Email tự động từ hệ thống ${shop}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `Đăng ký tư vấn mới — ${lead.name}`,
    `Mã: ${lead.id}`,
    `Thời gian: ${when}`,
    `Khách: ${lead.name} | ${lead.phone}`,
    `Email: ${lead.email || "—"}`,
    `Nguồn: ${lead.source || "website"}`,
    lead.message ? `Nội dung: ${lead.message}` : "",
    "",
    `Xem admin: ${adminUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html, text };
}

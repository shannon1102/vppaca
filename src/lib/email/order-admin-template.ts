import { formatVnd } from "@/lib/format";
import { BRAND_COLORS } from "@/lib/brand-colors";
import type { Order, SiteSettings } from "@/lib/types";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildAdminOrderEmailHtml(opts: {
  order: Order;
  settings: SiteSettings;
  adminUrl: string;
}): { subject: string; html: string; text: string } {
  const { order, settings, adminUrl } = opts;
  const primary = settings.primary_color || BRAND_COLORS.primary;
  const secondary = settings.secondary_color || BRAND_COLORS.secondary;
  const shop = escapeHtml(settings.shop_name);
  const when = new Date(order.created_at).toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
  });

  const rows = order.items
    .map(
      (i) => `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;">
          ${escapeHtml(i.name)}
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#64748b;text-align:center;">
          ${i.qty}
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;text-align:right;white-space:nowrap;">
          ${formatVnd(i.unit_price)}
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:600;color:${primary};text-align:right;white-space:nowrap;">
          ${formatVnd(i.unit_price * i.qty)}
        </td>
      </tr>`,
    )
    .join("");

  const subject = `[${settings.shop_name}] Đơn mới ${order.code} — ${formatVnd(order.total)}`;

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
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,${secondary},${primary});padding:28px 32px;color:#fff;">
              <p style="margin:0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.85;">Đơn hàng mới</p>
              <h1 style="margin:8px 0 0;font-size:24px;line-height:1.3;font-weight:700;">${shop}</h1>
              <p style="margin:10px 0 0;font-size:15px;opacity:0.95;">Có khách vừa đặt hàng trên website</p>
            </td>
          </tr>

          <!-- Order code badge -->
          <tr>
            <td style="padding:24px 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f8e9;border:1px solid #c8e6c9;border-radius:12px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0;font-size:12px;color:${primary};font-weight:600;text-transform:uppercase;letter-spacing:0.04em;">Mã đơn</p>
                    <p style="margin:6px 0 0;font-size:22px;font-weight:700;color:${secondary};letter-spacing:0.02em;">${escapeHtml(order.code)}</p>
                    <p style="margin:8px 0 0;font-size:13px;color:#64748b;">${escapeHtml(when)} · Trạng thái: <strong style="color:#b45309;">Chờ xác nhận</strong></p>
                  </td>
                  <td style="padding:16px 20px;text-align:right;vertical-align:middle;">
                    <p style="margin:0;font-size:12px;color:#64748b;">Tổng thanh toán</p>
                    <p style="margin:6px 0 0;font-size:22px;font-weight:700;color:${primary};">${formatVnd(order.total)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Customer -->
          <tr>
            <td style="padding:16px 32px 8px;">
              <h2 style="margin:0 0 12px;font-size:15px;color:#0f172a;text-transform:uppercase;letter-spacing:0.04em;">Thông tin khách hàng</h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:10px 16px;background:#f8fafc;width:140px;font-size:13px;color:#64748b;">Họ tên</td>
                  <td style="padding:10px 16px;font-size:14px;font-weight:600;color:#0f172a;">${escapeHtml(order.customer_name)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;background:#f8fafc;font-size:13px;color:#64748b;">Điện thoại</td>
                  <td style="padding:10px 16px;font-size:14px;color:#0f172a;">
                    <a href="tel:${escapeHtml(order.customer_phone.replace(/\s/g, ""))}" style="color:${primary};text-decoration:none;font-weight:600;">${escapeHtml(order.customer_phone)}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;background:#f8fafc;font-size:13px;color:#64748b;">Email</td>
                  <td style="padding:10px 16px;font-size:14px;color:#0f172a;">${escapeHtml(order.customer_email || "—")}</td>
                </tr>
                <tr>
                  <td style="padding:10px 16px;background:#f8fafc;font-size:13px;color:#64748b;vertical-align:top;">Địa chỉ</td>
                  <td style="padding:10px 16px;font-size:14px;color:#0f172a;">${escapeHtml(order.customer_address)}</td>
                </tr>
                ${
                  order.note
                    ? `<tr>
                  <td style="padding:10px 16px;background:#f8fafc;font-size:13px;color:#64748b;vertical-align:top;">Ghi chú</td>
                  <td style="padding:10px 16px;font-size:14px;color:#0f172a;">${escapeHtml(order.note)}</td>
                </tr>`
                    : ""
                }
              </table>
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td style="padding:20px 32px 8px;">
              <h2 style="margin:0 0 12px;font-size:15px;color:#0f172a;text-transform:uppercase;letter-spacing:0.04em;">Chi tiết sản phẩm</h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                <tr style="background:#f8fafc;">
                  <th align="left" style="padding:10px 16px;font-size:12px;color:#64748b;font-weight:600;">Sản phẩm</th>
                  <th align="center" style="padding:10px 16px;font-size:12px;color:#64748b;font-weight:600;">SL</th>
                  <th align="right" style="padding:10px 16px;font-size:12px;color:#64748b;font-weight:600;">Đơn giá</th>
                  <th align="right" style="padding:10px 16px;font-size:12px;color:#64748b;font-weight:600;">Thành tiền</th>
                </tr>
                ${rows}
                <tr>
                  <td colspan="3" style="padding:14px 16px;font-size:14px;font-weight:600;color:#0f172a;text-align:right;">Tổng cộng</td>
                  <td style="padding:14px 16px;font-size:16px;font-weight:700;color:${primary};text-align:right;">${formatVnd(order.total)}</td>
                </tr>
              </table>
              <p style="margin:12px 0 0;font-size:13px;color:#64748b;">
                Thanh toán: <strong>Chuyển khoản thủ công (QR)</strong> — vui lòng xác nhận khi nhận được tiền.
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:24px 32px 32px;" align="center">
              <a href="${escapeHtml(adminUrl)}"
                 style="display:inline-block;background:${primary};color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 28px;border-radius:999px;box-shadow:0 8px 20px rgba(46,125,50,0.25);">
                Mở quản lý đơn hàng
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
    `Đơn mới ${order.code} — ${formatVnd(order.total)}`,
    `Thời gian: ${when}`,
    `Khách: ${order.customer_name} | ${order.customer_phone}`,
    `Email: ${order.customer_email || "—"}`,
    `Địa chỉ: ${order.customer_address}`,
    order.note ? `Ghi chú: ${order.note}` : "",
    "",
    "Sản phẩm:",
    ...order.items.map(
      (i) => `- ${i.name} x${i.qty} = ${formatVnd(i.unit_price * i.qty)}`,
    ),
    "",
    `Xem admin: ${adminUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html, text };
}

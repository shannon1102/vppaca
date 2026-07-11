import { requireAdminPage } from "@/lib/require-admin";
import { buildAdminOrderEmailHtml } from "@/lib/email/order-admin-template";
import { repo } from "@/lib/data/repository";
import type { Order } from "@/lib/types";

/** Neutralize links so the preview iframe cannot navigate into /admin (causes nested shells). */
function previewSafeHtml(html: string): string {
  return html
    .replace(/<a\b([^>]*)>/gi, (_m, attrs: string) => {
      const cleaned = String(attrs)
        .replace(/\s*href\s*=\s*(["'])[\s\S]*?\1/gi, ' href="#"')
        .replace(/\s*target\s*=\s*(["'])[\s\S]*?\1/gi, "");
      return `<a${cleaned} onclick="return false;">`;
    })
    .replace(/<base\b[^>]*>/gi, "");
}

export default async function EmailPreviewPage() {
  await requireAdminPage();
  const settings = await repo.getSettings();
  const sample: Order = {
    id: "preview",
    code: "DHPREVIEW01",
    customer_name: "Nguyễn Văn A",
    customer_phone: "0901 234 567",
    customer_email: "khach@example.com",
    customer_address: "123 Nguyễn Trãi, TP Thanh Hóa",
    note: "Giao giờ hành chính",
    status: "pending",
    total: 1569000,
    created_at: new Date().toISOString(),
    items: [
      {
        id: "1",
        order_id: "preview",
        product_id: "p-01",
        name: "Máy đo huyết áp bắp tay tự động",
        qty: 1,
        unit_price: 990000,
      },
      {
        id: "2",
        order_id: "preview",
        product_id: "p-02",
        name: "Nhiệt kế hồng ngoại không tiếp xúc",
        qty: 2,
        unit_price: 289500,
      },
    ],
  };
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const { html, subject } = buildAdminOrderEmailHtml({
    order: sample,
    settings,
    adminUrl: `${site.replace(/\/$/, "")}/admin/orders`,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Preview email đơn hàng</h1>
      <p className="mt-2 text-sm text-[var(--brand-muted)]">Subject: {subject}</p>
      <p className="mt-1 text-xs text-[var(--brand-muted)]">
        Gửi thật khi khách đặt hàng: ưu tiên{" "}
        <code>GMAIL_USER</code> + <code>GMAIL_APP_PASSWORD</code>, không có thì dùng{" "}
        <code>RESEND_API_KEY</code>. Người nhận:{" "}
        <code>ADMIN_NOTIFY_EMAIL</code> hoặc <code>ADMIN_EMAIL</code>.
      </p>
      <iframe
        title="email-preview"
        srcDoc={previewSafeHtml(html)}
        sandbox="allow-same-origin"
        referrerPolicy="no-referrer"
        className="mt-6 h-[900px] w-full rounded-[var(--radius)] border border-slate-200 bg-white"
      />
    </div>
  );
}

import { saveSettingsAction } from "@/app/actions";
import {
  FormBusyBar,
  FormBusyFence,
  PendingSubmitButton,
} from "@/components/admin/form-pending";
import { Input } from "@/components/ui/input";
import { FORM_LIMITS } from "@/lib/form-limits";
import { requireAdminPage } from "@/lib/require-admin";
import { repo } from "@/lib/data/repository";

export default async function BrandingPage() {
  await requireAdminPage();
  const s = await repo.getSettings();

  return (
    <div>
      <h1 className="text-3xl font-bold">Branding + CK / QR</h1>
      <p className="mt-2 text-sm text-[var(--brand-muted)]">
        Đổi logo, màu, thông tin shop và QR chuyển khoản — dùng để nhân bản white-label.
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <form action={saveSettingsAction} className="space-y-3 rounded-[var(--radius)] border border-slate-200 bg-white p-6">
          <FormBusyBar />
          <FormBusyFence className="space-y-3">
            <h2 className="font-semibold">Thông tin & brand</h2>
            <Input
              name="shop_name"
              label="Tên shop"
              defaultValue={s.shop_name}
              required
              maxLength={FORM_LIMITS.shopName}
            />
            <Input
              name="tagline"
              label="Tagline"
              defaultValue={s.tagline}
              maxLength={FORM_LIMITS.tagline}
            />
            <Input
              name="phone"
              label="Hotline"
              defaultValue={s.phone}
              maxLength={FORM_LIMITS.phone}
            />
            <Input
              name="email"
              label="Email"
              defaultValue={s.email}
              maxLength={FORM_LIMITS.email}
            />
            <Input
              name="address"
              label="Địa chỉ"
              defaultValue={s.address}
              maxLength={FORM_LIMITS.address}
            />
            <Input
              name="logo_url"
              label="Logo URL"
              defaultValue={s.logo_url}
              maxLength={FORM_LIMITS.url}
            />
            <Input
              name="favicon_url"
              label="Favicon URL"
              defaultValue={s.favicon_url}
              maxLength={FORM_LIMITS.url}
            />
            <Input
              name="primary_color"
              label="Primary color"
              defaultValue={s.primary_color}
              maxLength={FORM_LIMITS.color}
            />
            <Input
              name="secondary_color"
              label="Secondary color"
              defaultValue={s.secondary_color}
              maxLength={FORM_LIMITS.color}
            />
            <Input
              name="accent_color"
              label="Accent color"
              defaultValue={s.accent_color}
              maxLength={FORM_LIMITS.color}
            />
            <Input
              name="facebook_url"
              label="Facebook URL"
              defaultValue={s.facebook_url}
              maxLength={FORM_LIMITS.url}
            />
            <Input
              name="zalo_url"
              label="Zalo URL"
              defaultValue={s.zalo_url}
              maxLength={FORM_LIMITS.url}
            />

            <h2 className="pt-4 font-semibold">Xuất hóa đơn VAT (người bán)</h2>
            <Input
              name="vat_seller_legal_name"
              label="Tên pháp lý (trên HĐ)"
              defaultValue={s.vat_seller_legal_name ?? s.shop_name}
              maxLength={200}
            />
            <Input
              name="vat_seller_tax_code"
              label="MST người bán"
              defaultValue={s.vat_seller_tax_code ?? ""}
              maxLength={32}
            />
            <Input
              name="vat_seller_address"
              label="Địa chỉ trên HĐ"
              defaultValue={s.vat_seller_address ?? s.address}
              maxLength={FORM_LIMITS.address}
            />
            <Input
              name="vat_default_rate"
              label="Thuế suất GTGT mặc định (%)"
              defaultValue={String(s.vat_default_rate ?? 8)}
              maxLength={4}
            />
            <Input
              name="vat_invoice_series"
              label="Ký hiệu mẫu HĐ (vd. 1C26TAA)"
              defaultValue={s.vat_invoice_series ?? "1C26TAA"}
              maxLength={24}
            />
            <Input
              name="vat_invoice_next_number"
              label="Số HĐ tiếp theo"
              defaultValue={String(s.vat_invoice_next_number ?? 1)}
              maxLength={8}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="vat_prices_include_tax"
                defaultChecked={s.vat_prices_include_tax ?? true}
                className="h-4 w-4"
              />
              Giá bán trên web đã bao gồm VAT (tách thuế khi in HĐ)
            </label>

            <h2 className="pt-4 font-semibold">Chuyển khoản + QR</h2>
            <Input
              name="bank_name"
              label="Ngân hàng"
              defaultValue={s.bank_name}
              maxLength={FORM_LIMITS.bankName}
            />
            <Input
              name="bank_bin"
              label="BIN VietQR (vd. 970436 VCB)"
              defaultValue={s.bank_bin ?? ""}
              maxLength={16}
            />
            <Input
              name="bank_account"
              label="Số TK"
              defaultValue={s.bank_account}
              maxLength={FORM_LIMITS.bankAccount}
            />
            <Input
              name="bank_holder"
              label="Chủ TK"
              defaultValue={s.bank_holder}
              maxLength={FORM_LIMITS.bankHolder}
            />
            <Input
              name="transfer_content_template"
              label="Nội dung CK (dùng {code})"
              defaultValue={s.transfer_content_template}
              maxLength={FORM_LIMITS.transferTemplate}
            />
            <Input
              name="qr_image_url"
              label="QR image URL"
              defaultValue={s.qr_image_url}
              maxLength={FORM_LIMITS.url}
            />
          </FormBusyFence>
          <PendingSubmitButton>Lưu branding</PendingSubmitButton>
        </form>

        <div className="rounded-[var(--radius)] border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Live preview màu</h2>
          <div className="mt-4 flex gap-3">
            <div
              className="h-16 flex-1 rounded-lg"
              style={{ background: s.primary_color }}
              title="primary"
            />
            <div
              className="h-16 flex-1 rounded-lg"
              style={{ background: s.secondary_color }}
              title="secondary"
            />
            <div
              className="h-16 flex-1 rounded-lg"
              style={{ background: s.accent_color }}
              title="accent"
            />
          </div>
          <p className="mt-4 text-sm text-[var(--brand-muted)]">
            Sau khi lưu, CSS variables trên storefront cập nhật theo settings — không cần sửa
            code để clone brand mới.
          </p>
        </div>
      </div>
    </div>
  );
}

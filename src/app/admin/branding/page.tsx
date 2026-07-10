import { saveSettingsAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requireAdminPage } from "@/lib/require-admin";
import { repo } from "@/lib/data/repository";

export default async function BrandingPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdminPage();
  const { saved } = await searchParams;
  const s = await repo.getSettings();

  return (
    <div>
      <h1 className="text-3xl font-bold">Branding + CK / QR</h1>
      <p className="mt-2 text-sm text-[var(--brand-muted)]">
        Đổi logo, màu, thông tin shop và QR chuyển khoản — dùng để nhân bản white-label.
      </p>
      {saved ? (
        <p className="mt-4 rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-800">
          Đã lưu. Reload storefront để xem màu/logo mới.
        </p>
      ) : null}

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <form action={saveSettingsAction} className="space-y-3 rounded-[var(--radius)] border border-slate-200 bg-white p-6">
          <h2 className="font-semibold">Thông tin & brand</h2>
          <Input name="shop_name" label="Tên shop" defaultValue={s.shop_name} required />
          <Input name="tagline" label="Tagline" defaultValue={s.tagline} />
          <Input name="phone" label="Hotline" defaultValue={s.phone} />
          <Input name="email" label="Email" defaultValue={s.email} />
          <Input name="address" label="Địa chỉ" defaultValue={s.address} />
          <Input name="logo_url" label="Logo URL" defaultValue={s.logo_url} />
          <Input name="favicon_url" label="Favicon URL" defaultValue={s.favicon_url} />
          <Input name="primary_color" label="Primary color" defaultValue={s.primary_color} />
          <Input
            name="secondary_color"
            label="Secondary color"
            defaultValue={s.secondary_color}
          />
          <Input name="accent_color" label="Accent color" defaultValue={s.accent_color} />
          <Input name="facebook_url" label="Facebook URL" defaultValue={s.facebook_url} />
          <Input name="zalo_url" label="Zalo URL" defaultValue={s.zalo_url} />

          <h2 className="pt-4 font-semibold">Chuyển khoản + QR</h2>
          <Input name="bank_name" label="Ngân hàng" defaultValue={s.bank_name} />
          <Input name="bank_account" label="Số TK" defaultValue={s.bank_account} />
          <Input name="bank_holder" label="Chủ TK" defaultValue={s.bank_holder} />
          <Input
            name="transfer_content_template"
            label="Nội dung CK (dùng {code})"
            defaultValue={s.transfer_content_template}
          />
          <Input name="qr_image_url" label="QR image URL" defaultValue={s.qr_image_url} />
          <Button type="submit">Lưu branding</Button>
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

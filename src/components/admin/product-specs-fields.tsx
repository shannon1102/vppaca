import { Input } from "@/components/ui/input";
import { FORM_LIMITS } from "@/lib/form-limits";
import { SPEC_FIELD_COUNT } from "@/lib/product-specs";

function toRows(specs: Record<string, string> | undefined): [string, string][] {
  const entries = Object.entries(specs ?? {});
  return Array.from({ length: SPEC_FIELD_COUNT }, (_, i) => entries[i] ?? ["", ""]);
}

export function ProductSpecsFields({ specs }: { specs?: Record<string, string> }) {
  const rows = toRows(specs);

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-[var(--brand-text)]">
        Thông số sản phẩm
      </legend>
      <p className="text-xs text-[var(--brand-muted)]">
        Tối đa {SPEC_FIELD_COUNT} dòng (tên trường + giá trị). Để trống nếu không dùng.
      </p>
      <div className="space-y-3 rounded-[var(--radius)] border border-slate-200 bg-slate-50/50 p-4">
        {rows.map(([key, value], index) => (
          <div key={index} className="grid gap-3 sm:grid-cols-2">
            <Input
              name={`spec_key_${index}`}
              label="Tên trường"
              defaultValue={key}
              placeholder="VD: Vô trùng"
              maxLength={FORM_LIMITS.specKey}
            />
            <Input
              name={`spec_value_${index}`}
              label="Giá trị"
              defaultValue={value}
              placeholder="VD: Có"
              maxLength={FORM_LIMITS.specValue}
            />
          </div>
        ))}
      </div>
    </fieldset>
  );
}

import { FORM_LIMITS, clampText } from "@/lib/form-limits";

export const SPEC_FIELD_COUNT = 4;

export function parseSpecsFromForm(formData: FormData): Record<string, string> {
  const specs: Record<string, string> = {};
  for (let i = 0; i < SPEC_FIELD_COUNT; i++) {
    const key = clampText(
      String(formData.get(`spec_key_${i}`) ?? "").trim(),
      FORM_LIMITS.specKey,
    );
    if (!key) continue;
    specs[key] = clampText(
      String(formData.get(`spec_value_${i}`) ?? "").trim(),
      FORM_LIMITS.specValue,
    );
  }
  return specs;
}

export const SPEC_FIELD_COUNT = 4;

export function parseSpecsFromForm(formData: FormData): Record<string, string> {
  const specs: Record<string, string> = {};
  for (let i = 0; i < SPEC_FIELD_COUNT; i++) {
    const key = String(formData.get(`spec_key_${i}`) ?? "").trim();
    if (!key) continue;
    specs[key] = String(formData.get(`spec_value_${i}`) ?? "").trim();
  }
  return specs;
}
